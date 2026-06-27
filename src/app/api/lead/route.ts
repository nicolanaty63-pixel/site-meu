import { NextResponse } from "next/server";
import { fail } from "@/lib/http";
import { leadSchema } from "@/lib/lead-schema";
import {
  sendLeadEmail,
  LeadConfigError,
  type LeadMeta,
} from "@/lib/lead-email";

// Leads are time-sensitive and must never be cached.
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Resend SDK needs Node, not the edge runtime.

// Enquiries are small; bound the parse so a giant body can't exhaust memory.
const MAX_BODY = 16 * 1024;
// Sub-2.5s from mount to submit is faster than any human filling 5 fields.
const MIN_FILL_MS = 2500;

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Same-origin filter (cheap CSRF/abuse defence) — mirrors api/reviews.
function sameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true; // genuine same-origin fetches may omit Origin
  try {
    const allowed = new Set([
      "nicollacontractors.co.uk",
      "www.nicollacontractors.co.uk",
      new URL(req.url).host, // covers *.vercel.app preview hosts
    ]);
    return allowed.has(new URL(origin).host);
  } catch {
    return false;
  }
}

const ok = (status = 200) =>
  NextResponse.json({ ok: true }, { status, headers: { "cache-control": "no-store" } });

// POST /api/lead — receive a contact/quote enquiry, validate, email the admin.
// (The edge middleware already rate-limits /api/* and blocks UA-less POSTs.)
export async function POST(req: Request) {
  // Cheap perimeter checks before any work.
  if ((req.headers.get("content-type") ?? "").split(";")[0]!.trim() !== "application/json") {
    return fail(415, "Unsupported media type.");
  }
  if (!sameOrigin(req)) return fail(403, "Forbidden.");

  const raw = await req.text();
  if (raw.length > MAX_BODY) return fail(413, "Payload too large.");

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return fail(400, "Invalid request.");
  }

  // Bot traps — respond exactly like success so bots learn nothing, but never
  // send. (Honeypot field filled, or the form was completed implausibly fast.)
  const honeypot = typeof body.company === "string" && body.company.trim() !== "";
  const elapsed = Number(body.elapsedMs);
  const tooFast = Number.isFinite(elapsed) && elapsed < MIN_FILL_MS;
  if (honeypot || tooFast) {
    console.warn(`[lead] spam dropped (${honeypot ? "honeypot" : "time-trap"})`);
    return ok();
  }

  // Authoritative validation — the client mirror is only for UX.
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        error: issue?.message ?? "Please check your details and try again.",
        field: issue?.path[0]?.toString(),
      },
      { status: 422, headers: { "cache-control": "no-store" } },
    );
  }

  const meta: LeadMeta = {
    source: (req.headers.get("x-lead-source") ?? "contact").slice(0, 40),
    ip: clientIp(req),
    receivedAt: new Date().toISOString(),
  };

  try {
    await sendLeadEmail(parsed.data, meta);
    return ok(201);
  } catch (err) {
    // Delivery failed — log a RECOVERABLE record (no secrets) so the lead is
    // never truly lost, then return an honest, generic message with fallbacks.
    const recoverable = {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      service: parsed.data.service,
      source: meta.source,
      at: meta.receivedAt,
    };
    if (err instanceof LeadConfigError) {
      console.error("[lead] NOT configured — recover from logs:", JSON.stringify(recoverable));
      return fail(
        503,
        "Our enquiry system is being set up. Please call or email us and we'll respond right away.",
      );
    }
    console.error("[lead] delivery failed — recover from logs:", JSON.stringify(recoverable));
    return fail(
      502,
      "We couldn't send your enquiry just now. Please call or email us and we'll respond right away.",
      err,
    );
  }
}

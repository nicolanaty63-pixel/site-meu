import { NextRequest, NextResponse } from "next/server";
import { site } from "@/lib/site";

// Lead capture endpoint shared by ContactForm and QuoteForm.
//
// Delivery is via the Resend HTTP API (no SDK). Required env:
//   RESEND_API_KEY   — from https://resend.com (free tier is plenty)
//   LEAD_TO_EMAIL    — inbox that receives leads (default: site email)
//   LEAD_FROM_EMAIL  — verified sender, e.g. leads@nicollacontractors.co.uk
//   RESEND_API_URL   — override for tests only (default: real Resend)
//
// Failure policy: NEVER fake success. If delivery fails the lead is logged
// server-side (recoverable from hosting logs) and the client gets an error so
// the UI can offer direct channels instead.

type LeadBody = {
  name?: string;
  phone?: string;
  email?: string;
  postcode?: string;
  service?: string;
  message?: string;
  consent?: boolean;
  source?: string;
  _hp?: string;
  _t?: number;
};

// Sub-3s from form render to submit is faster than any human filling 4+
// fields; treat as a bot. Keep generous to avoid false positives on autofill.
const MIN_FILL_MS = 3000;

// In-memory per-IP limiter — fine for a single-instance deployment; swap for
// a shared store if this ever runs serverless with high traffic.
const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) {
    for (const [k, v] of hits) if (now - (v.at(-1) ?? 0) > RATE_WINDOW_MS) hits.delete(k);
  }
  return recent.length > RATE_LIMIT;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^[\d\s()+-]{7,30}$/;

function clean(v: unknown, max: number): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

export async function POST(req: NextRequest) {
  let body: LeadBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests — please try again shortly." },
      { status: 429 }
    );
  }

  // Spam traps: respond exactly like a success so bots learn nothing.
  const tooFast =
    typeof body._t === "number" && Date.now() - body._t < MIN_FILL_MS;
  if (body._hp || tooFast) {
    console.warn(`[lead] spam dropped (${body._hp ? "honeypot" : "time-trap"}) ip=${ip}`);
    return NextResponse.json({ ok: true });
  }

  const name = clean(body.name, 100);
  const phone = clean(body.phone, 30);
  const email = clean(body.email, 200);
  const postcode = clean(body.postcode, 12);
  const service = clean(body.service, 100);
  const message = clean(body.message, 5000);

  if (!name || !service)
    return NextResponse.json(
      { ok: false, error: "Please fill in your name and the service you need." },
      { status: 422 }
    );
  if (!EMAIL_RE.test(email))
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 }
    );
  if (!PHONE_RE.test(phone))
    return NextResponse.json(
      { ok: false, error: "Please enter a valid phone number." },
      { status: 422 }
    );
  if (body.consent !== true)
    return NextResponse.json(
      { ok: false, error: "Please tick the consent box so we can respond to you." },
      { status: 422 }
    );

  const lead = {
    name,
    phone,
    email,
    postcode,
    service,
    message,
    consent: true,
    source: clean(body.source, 60) || "unknown",
    ip,
    receivedAt: new Date().toISOString(),
  };

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_TO_EMAIL || site.email;
  const from =
    process.env.LEAD_FROM_EMAIL || `Nicolla Website <leads@nicollacontractors.co.uk>`;
  const apiUrl = process.env.RESEND_API_URL || "https://api.resend.com/emails";

  if (!apiKey) {
    // Unconfigured: log the full lead so it is recoverable, fail honestly.
    console.error("[lead] RESEND_API_KEY not set — lead NOT emailed:", JSON.stringify(lead));
    return NextResponse.json(
      { ok: false, error: "Our enquiry system is temporarily unavailable." },
      { status: 503 }
    );
  }

  const text = [
    `New enquiry from the website (${lead.source})`,
    ``,
    `Name:     ${name}`,
    `Phone:    ${phone}`,
    `Email:    ${email}`,
    postcode ? `Postcode: ${postcode}` : null,
    `Service:  ${service}`,
    ``,
    `Project details:`,
    message || "(none provided)",
    ``,
    `—`,
    `Consent given: yes (${lead.receivedAt})`,
    `Page: ${lead.source} · IP: ${ip}`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: `New lead — ${service} — ${name}`,
        text,
      }),
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      console.error(
        `[lead] provider error ${res.status}: ${detail} — lead NOT emailed:`,
        JSON.stringify(lead)
      );
      return NextResponse.json(
        { ok: false, error: "We couldn't send your enquiry just now." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error(`[lead] provider unreachable: ${err} — lead NOT emailed:`, JSON.stringify(lead));
    return NextResponse.json(
      { ok: false, error: "We couldn't send your enquiry just now." },
      { status: 502 }
    );
  }

  console.log(`[lead] delivered: ${name} <${email}> · ${service} · ${lead.source}`);
  return NextResponse.json({ ok: true });
}

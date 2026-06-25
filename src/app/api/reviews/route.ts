import { NextResponse } from "next/server";
import { fail } from "@/lib/http";
import {
  addReview,
  checkRateLimit,
  isDuplicate,
  listReviews,
  validateReview,
  type ReviewInput,
} from "@/lib/reviews";

// Never cache — submissions and the feed must always be live.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function clientIp(req: Request): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

// Reviews are tiny; bound the parse so a giant body can't exhaust memory.
const MAX_BODY = 16 * 1024;

// Same-origin filter (cheap CSRF/abuse defence; this is a public, session-less
// endpoint, but it blocks trivial cross-site form spam).
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

// GET /api/reviews — newest-first feed (used as a fallback / for refreshes).
export async function GET() {
  try {
    const reviews = await listReviews(100);
    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    return fail(500, "Could not load reviews.", err);
  }
}

// POST /api/reviews — submit a review (validated + spam-protected).
export async function POST(req: Request) {
  // Enforce JSON content-type + same-origin before doing any work.
  if ((req.headers.get("content-type") ?? "").split(";")[0].trim() !== "application/json") {
    return fail(415, "Unsupported media type.");
  }
  if (!sameOrigin(req)) {
    return fail(403, "Forbidden.");
  }

  // Bounded read (defends against missing / forged Content-Length).
  const raw = await req.text();
  if (raw.length > MAX_BODY) {
    return fail(413, "Payload too large.");
  }

  let body: ReviewInput;
  try {
    body = JSON.parse(raw) as ReviewInput;
  } catch {
    return fail(400, "Invalid request.");
  }

  // 1. Validation + bot traps (cheap, no network) — so a user fixing a field
  //    error doesn't burn their rate-limit budget.
  const result = validateReview(body);
  if (!result.ok) {
    if (result.code === "bot") {
      // Don't tell bots why; generic rejection.
      return NextResponse.json(
        { ok: false, error: result.error },
        { status: 422 },
      );
    }
    return NextResponse.json(
      { ok: false, error: result.error, field: result.field },
      { status: 400 },
    );
  }

  const ip = clientIp(req);

  try {
    // 2. Rate limit per IP.
    const rl = await checkRateLimit(ip);
    if (!rl.ok) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "You've submitted a few reviews recently. Please try again later.",
          retryAfterSec: rl.retryAfterSec,
        },
        { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 3600) } },
      );
    }

    // 3. Duplicate prevention (same name + text within 24h).
    if (await isDuplicate(result.value.name, result.value.text)) {
      return NextResponse.json(
        {
          ok: false,
          error: "It looks like you've already submitted this review.",
        },
        { status: 409 },
      );
    }

    // 4. Store — becomes visible immediately, newest first.
    const review = await addReview(result.value);
    return NextResponse.json({ ok: true, review }, { status: 201 });
  } catch (err) {
    return fail(500, "Something went wrong. Please try again.", err);
  }
}

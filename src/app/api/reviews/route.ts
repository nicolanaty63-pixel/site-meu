import { NextResponse } from "next/server";
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

// GET /api/reviews — newest-first feed (used as a fallback / for refreshes).
export async function GET() {
  try {
    const reviews = await listReviews(100);
    return NextResponse.json({ ok: true, reviews });
  } catch (err) {
    console.error("[api/reviews] GET failed", err);
    return NextResponse.json(
      { ok: false, error: "Could not load reviews." },
      { status: 500 },
    );
  }
}

// POST /api/reviews — submit a review (validated + spam-protected).
export async function POST(req: Request) {
  let body: ReviewInput;
  try {
    body = (await req.json()) as ReviewInput;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 },
    );
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
    console.error("[api/reviews] POST failed", err);
    return NextResponse.json(
      { ok: false, error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}

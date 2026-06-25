import { NextRequest, NextResponse } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

/**
 * Edge middleware — Perimeter (Vector 3) + DDoS/bot mitigation (Vector 4).
 *
 * Vector 4: a two-tier per-IP edge limiter rejects abuse BEFORE the serverless
 * function or Upstash quota is touched (the in-route limiter in api/reviews
 * stays as the second wall). Fails open if Upstash creds are absent (dev).
 *
 * Vector 3: a per-request nonce CSP, shipped REPORT-ONLY (safe). Flip the
 * header name below to `Content-Security-Policy` to enforce once the console
 * is clean and the GA next/script tags carry the `x-nonce`.
 */

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

const burst = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "10 s"), prefix: "rl:burst", analytics: true })
  : null;
const writes = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "60 s"), prefix: "rl:write", analytics: true })
  : null;

function clientIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "0.0.0.0"
  );
}
function tooMany(resetMs: number) {
  const retry = Math.max(1, Math.ceil((resetMs - Date.now()) / 1000));
  return NextResponse.json(
    { ok: false, error: "Too many requests. Please slow down." },
    { status: 429, headers: { "retry-after": String(retry) } },
  );
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Vector 4: edge abuse filter for API routes (before compute) ──
  if (pathname.startsWith("/api/")) {
    if (request.method === "POST" && !request.headers.get("user-agent")) {
      return NextResponse.json({ ok: false, error: "Forbidden." }, { status: 403 });
    }
    if (burst) {
      const ip = clientIp(request);
      const b = await burst.limit(ip);
      if (!b.success) return tooMany(b.reset);
      if (request.method === "POST" && writes) {
        const w = await writes.limit(`${ip}:${pathname}`);
        if (!w.success) return tooMany(w.reset);
      }
    }
  }

  // ── Vector 3: nonce CSP (Report-Only) ──
  const nonce = Buffer.from(crypto.randomUUID()).toString("base64");
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https:`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' blob: data: https://www.googletagmanager.com https://www.google-analytics.com`,
    `font-src 'self'`,
    `connect-src 'self' https://www.googletagmanager.com https://www.google-analytics.com https://*.google-analytics.com`,
    `frame-ancestors 'none'`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `upgrade-insecure-requests`,
  ].join("; ");

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);
  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("Content-Security-Policy-Report-Only", csp);
  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|webp|svg|ico|txt|xml|webmanifest)$).*)",
      missing: [{ type: "header", key: "next-action" }],
    },
  ],
};

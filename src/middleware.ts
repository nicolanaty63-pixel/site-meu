import { NextRequest, NextResponse } from "next/server";

/**
 * Content-Security-Policy with a per-request nonce (Vector 3).
 *
 * Shipped in REPORT-ONLY mode: the browser logs would-be violations to the
 * console without blocking anything, so this is safe to deploy. Once the
 * console is clean (home/framer, consent-gated GA, review submit), rename the
 * header below `Content-Security-Policy-Report-Only` -> `Content-Security-Policy`
 * to enforce. (Vector 4 will extend this same file with edge rate-limiting.)
 *
 * Notes:
 * - `script-src` uses a nonce + `strict-dynamic`: only nonce'd scripts and the
 *   scripts THEY load run — defeats injected <script>. Thread the nonce into
 *   your own next/script tags (GA) via the `x-nonce` request header.
 * - `style-src 'unsafe-inline'` is required by framer-motion / next-image inline
 *   styles (low risk; script injection is the real threat and is locked down).
 */
export function middleware(request: NextRequest) {
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

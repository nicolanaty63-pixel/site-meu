import { withSentryConfig } from "@sentry/nextjs/config";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false, // remove the X-Powered-By: Next.js fingerprint

  // Static security headers on every route. (The CSP carries a per-request
  // nonce so it lives in middleware.ts, not here.)
  async headers() {
    const securityHeaders = [
      { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), browsing-topics=()" },
      { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
    ];
    return [{ source: "/:path*", headers: securityHeaders }];
  },

  images: {
    // AVIF first (smaller + crisper than WebP) with a WebP fallback, and
    // allow the higher re-encode quality used on showcase photography
    // (Next 15 requires non-default quality values to be allow-listed here).
    formats: ["image/avif", "image/webp"],
    qualities: [75, 90],
    // Allow licensed stock CDNs so you can use a hosted image URL directly in
    // lib/data.ts (e.g. an Unsplash/Pexels photo) without downloading it.
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  // Canonical host = non-www apex. Permanently redirect www → apex so there's a
  // single indexed version. (Vercel already forces HTTPS on all routes.)
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.nicollacontractors.co.uk" }],
        destination: "https://nicollacontractors.co.uk/:path*",
        permanent: true,
      },
      // The Flooring Installation service was retired and folded into the
      // remaining Laminate Flooring service. 301 the old indexed URL so any
      // backlinks / cached search results land on the closest live service
      // rather than a 404, preserving the link equity.
      {
        source: "/services/flooring-installation",
        destination: "/services/laminate-flooring",
        permanent: true,
      },
      // Home Refurbishment & Building was retired; Home Extensions is the
      // closest live service (and inherits its imagery). 301 preserves any
      // backlinks / indexed URLs.
      {
        source: "/services/home-refurbishment",
        destination: "/services/home-extensions",
        permanent: true,
      },
      // Legacy "/pages/*" URLs from a previous site iteration still surface in
      // Google's index. 301 them to the App Router equivalent so any old
      // backlinks / cached search results land on the correct page rather
      // than a 404 — Google then folds the old URL into the new one.
      {
        source: "/pages/projects",
        destination: "/projects",
        permanent: true,
      },
      {
        source: "/pages/:slug*",
        destination: "/:slug*",
        permanent: true,
      },
    ];
  },
};

// Source maps are uploaded to Sentry only when the build has all three
// build-time secrets. Without them (local builds, Vercel previews without the
// token) no source map is generated at all, so none can end up public.
const canUploadSourceMaps = Boolean(
  process.env.SENTRY_AUTH_TOKEN && process.env.SENTRY_ORG && process.env.SENTRY_PROJECT,
);

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,

  // Only print the upload logs in CI.
  silent: !process.env.CI,
  // Don't send Sentry usage statistics about our builds.
  telemetry: false,

  // Readable stack traces: upload the maps during the build, then delete them
  // from the output so no .map file is ever deployed.
  sourcemaps: {
    disable: !canUploadSourceMaps,
    deleteSourcemapsAfterUpload: true,
  },

  // Browser events go to our own origin and are forwarded to Sentry from
  // there: covered by the CSP's connect-src 'self' and not dropped by
  // ad-blockers. The route is excluded from the middleware matcher.
  tunnelRoute: "/monitoring",

  webpack: {
    // No Vercel cron monitors.
    automaticVercelMonitors: false,
    // Keep the browser bundle to what error reporting and tracing need: no
    // debug logging and none of the Session Replay code.
    treeshake: {
      removeDebugLogging: true,
      excludeReplayIframe: true,
      excludeReplayShadowDOM: true,
      excludeReplayCompressionWorker: true,
    },
  },
});

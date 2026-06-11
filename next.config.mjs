/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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

export default nextConfig;

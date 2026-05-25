/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
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
    ];
  },
};

export default nextConfig;

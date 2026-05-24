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
};

export default nextConfig;

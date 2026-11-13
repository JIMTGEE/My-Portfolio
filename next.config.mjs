/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Render's Docker runtime copies only what it needs from .next — the
  // standalone server bundle plus static assets (see Dockerfile).
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
    ],
  },
};

export default nextConfig;

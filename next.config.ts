import type { NextConfig } from "next";

// Part 1 is a fully static site (no DB, no server runtime) — see ADR-8.
// Output a static export to `out/` for Cloudflare Pages.
// Security headers live in `public/_headers` (Cloudflare Pages), since
// next.config `headers()` and middleware are not available in static export.
const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

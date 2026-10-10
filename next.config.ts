import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root so a stray lockfile higher up the disk isn't picked up.
  turbopack: { root: process.cwd() },
};

export default nextConfig;

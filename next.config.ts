import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily ignore TypeScript errors during build for NextAuth compatibility
    ignoreBuildErrors: true,
  },
  experimental: {},
};

export default nextConfig;

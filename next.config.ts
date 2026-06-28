import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Produce a self-contained server build (.next/standalone) for the Docker /
  // Cloud Run deployment. Harmless for `next start` and Firebase App Hosting.
  output: "standalone",
};

export default nextConfig;

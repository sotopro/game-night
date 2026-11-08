import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The VPS image runs the standalone server (Dockerfile, vps-start.mjs).
  output: "standalone",
};

export default nextConfig;

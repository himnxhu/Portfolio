import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheMaxMemorySize: 0,
  experimental: {
    preloadEntriesOnStart: false,
    webpackMemoryOptimizations: true,
  },
  productionBrowserSourceMaps: false,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/ANCI" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/ANCI/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;

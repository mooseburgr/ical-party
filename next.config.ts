import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // dafuq man https://github.com/vercel/next.js/issues/95400
    ignoreBuildErrors: true,
  },
};

export default nextConfig;

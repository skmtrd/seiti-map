/** import type { NextConfig } from "next"; */

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development",
});

const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: 1024 * 1024 * 1000, // 1GB
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wvrxoutiubnthnhqwsuv.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

module.exports = withPWA(nextConfig);

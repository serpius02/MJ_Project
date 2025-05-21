import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "**",
      },
      // 필요한 경우 다른 패턴도 추가
    ],
  },
  /* 기존 config options */
};

export default nextConfig;

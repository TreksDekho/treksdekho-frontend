import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/treksdekho-frontend",
  assetPrefix: "/treksdekho-frontend/",
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/v1/:path*',
        destination: 'http://localhost:3000/v1/:path*',
      },
    ];
  },
};

export default nextConfig;

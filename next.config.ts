import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  }, 
  typescript: {
    ignoreBuildErrors: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',               // rota que o front chama
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`, // URL real da API (runtime)
      },
    ];
  },
};

export default nextConfig;

import type { NextConfig } from "next";

// TODO : 개발환경에서만 테스트 용도로 사용하고 수정할 것
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // 구글 프로필 사진 
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com', // 구글 클라우드 스토리지
        port: '',
        pathname: '/**',
      },
    ],
  },
  
  //webpack 설정
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },

  turbopack: {
    root: __dirname,
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  async rewrites() {
    return [
      {
        source: "/proxy-api/:path*",
        destination: "http://localhost:8080/:path*",
      },
    ];
  },
};
export default nextConfig;

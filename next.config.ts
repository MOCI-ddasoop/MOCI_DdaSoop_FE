import type { NextConfig } from "next";

// TODO : 개발환경에서만 테스트 용도로 사용하고 수정할 것
const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
  },
};
export default nextConfig;

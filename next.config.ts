import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn con từ domain này
      },
      // Nếu bạn có dùng các domain ảnh khác (như api.dicebear.com lúc trước), bạn cũng thêm vào đây luôn:
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      }
    ],
  },
};

export default nextConfig;

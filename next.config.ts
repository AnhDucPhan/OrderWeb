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
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },

      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // Cho phép tất cả các đường dẫn từ domain này
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**', // Cho phép tất cả các đường dẫn từ host này
      },
    ],
    
  },
};

export default nextConfig;

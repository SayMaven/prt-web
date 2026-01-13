import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // 1. IZINKAN GAMBAR GITHUB
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  // 2. REDIRECT GAME (Agar link /game tetap jalan)
  async redirects() {
    return [
      {
        source: '/game',
        destination: 'https://game.saymaven.cloud/bangdream.html',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
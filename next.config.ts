import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. IZINKAN GAMBAR GITHUB & CLOUDINARY (Tetap sama)
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

  // 2. REDIRECT GAME (Tetap sama)
  async redirects() {
    return [
      {
        source: '/game',
        destination: 'https://game.saymaven.cloud/bangdream.html',
        permanent: true,
      },
    ];
  },

  // 3. HEADERS KHUSUS (Hanya untuk halaman Tools tertentu)
  async headers() {
    return [
      {
        // ⚠️ PENTING: Ganti path ini sesuai URL halaman background remover kamu.
        // Jangan pakai '/(.*)' karena itu akan memblokir gambar di seluruh web.
        // Contoh: Jika halaman tools ada di 'app/tools/bg-remover/page.tsx', tulis:
        source: '/tools/bg-remover', 
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ];
  },
};

export default nextConfig;
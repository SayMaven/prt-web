import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar"; // 👈 Kita panggil Navbar baru di sini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | SayMaven',
    default: 'SayMaven - Personal Portfolio & Tools',
  },
  description: "Portfolio Full Stack Developer dan kumpulan tools utilitas gratis.",
  themeColor: '#0f172a',
  openGraph: {
    title: 'SayMaven - Portfolio & Tools',
    description: 'Cek portfolio saya dan gunakan tools gratis seperti Password Generator di sini.',
    url: 'https://saymaven.cloud',
    siteName: 'SayMaven',
    locale: 'id_ID',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      {/* Set Background gelap (slate-950) agar sesuai tema */}
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-950 text-slate-200 antialiased`}>
        
        {/* --- NAVBAR BARU (RESPONSIF) --- */}
        {/* Tidak ada lagi kode header panjang di sini, semua ada di Navbar.tsx */}
        <Navbar />

        {/* --- KONTEN UTAMA --- */}
        {/* pt-20 ditambahkan supaya konten tidak tertutup Navbar yang posisinya Fixed */}
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 pt-24">
          {children}
        </main>

        {/* --- FOOTER --- */}
        <footer className="border-t border-white/5 bg-slate-900/50 py-8 mt-auto backdrop-blur-sm">
          <div className="max-w-5xl mx-auto px-4 text-center text-sm text-slate-400">
            <p>&copy; {new Date().getFullYear()} SayMaven. Dibangun dengan ❤️ for Maya</p>
          </div>
        </footer>

      </body>
    </html>
  );
}
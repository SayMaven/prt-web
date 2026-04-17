import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ChatWidget from "@/components/ChatWidget";
import VisitorCounter from "@/components/VisitorCounter";
import ThemeController from "@/components/ThemeController";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: '#0f172a',
};

export const metadata: Metadata = {
  title: {
    template: '%s | SayMaven',
    default: 'SayMaven - Personal Portfolio & Tools',
  },
  description: "Portfolio Full Stack Developer dan kumpulan tools utilitas gratis.",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
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
    <html lang="en" className="scroll-smooth dark">
      <body className={`${inter.className} min-h-screen flex flex-col antialiased relative`}
        style={{ backgroundColor: 'var(--page-bg)', color: 'var(--text-primary)' }}
      >

        <div className="fixed z-[100] top-5 right-20 md:top-auto md:right-auto md:bottom-7 md:left-14">
          <VisitorCounter />
        </div>

        <Navbar />

        <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 pt-24">
          {children}
        </main>
        <footer
          className="border-t py-8 mt-auto backdrop-blur-sm"
          style={{ background: 'var(--footer-bg)', borderColor: 'var(--footer-border)' }}
        >
          <div className="max-w-5xl mx-auto px-4 text-center text-sm" style={{ color: 'var(--text-muted)' }}>
            <p>&copy; {new Date().getFullYear()} SayMaven. Dibangun dengan ❤️ for Maya</p>
          </div>
        </footer>
        <div className="fixed bottom-6 right-24 z-[200]">
          <ThemeController />
        </div>

        <ChatWidget />

      </body>
    </html>
  );
}
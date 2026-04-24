import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maven Downloader | SayMaven",
  description: "Download video dari berbagai situs populer dengan berbagai fitur.",
};

export default function Page() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-10">
      
      {/* Header */}
      <section className="text-center mt-10 mb-12 relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 backdrop-blur-md border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Desktop Software</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Maven <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Downloader</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed mb-6" style={{ color: "var(--text-secondary)" }}>
          Download video &amp; audio dari berbagai situs populer dengan mudah dan cepat.
        </p>
        
        <div className="inline-flex items-center gap-2 px-4 py-2 border rounded-full text-xs sm:text-sm font-medium shadow-sm" style={{ background: "var(--page-bg-2)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}>
          <span style={{ color: "var(--accent)" }}>❤️</span>
          <span>Software ini aman dan source code-nya bisa dilihat di bawah</span>
        </div>
      </section>

      {/* Screenshot Preview */}
      <div className="animate-in zoom-in duration-700 delay-100 flex justify-center">
        <div className="relative group max-w-4xl w-full">
          <div className="absolute -inset-1 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000" style={{ background: "var(--accent)" }} />
          <div className="relative rounded-xl overflow-hidden border shadow-2xl" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <Image 
              src="https://res.cloudinary.com/ds4a54vuy/image/upload/v1768755128/Screenshot_2026-01-18_234130_louro7.png" 
              alt="Tampilan Aplikasi Maven Downloader"
              width={1200} 
              height={800}
              quality={90}
              priority
              className="w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>

      {/* Download Section */}
      <div className="max-w-3xl mx-auto mt-16 p-8 rounded-3xl text-center space-y-6 relative overflow-hidden group border shadow-xl backdrop-blur-md" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none opacity-40 group-hover:opacity-80 transition-all" style={{ background: "var(--accent-subtle)" }} />
        
        <div className="relative z-10 space-y-4">
          <h3 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>Ingin coba? Silahkan download di bawah</h3>
          <p style={{ color: "var(--text-secondary)" }}>
            Dapatkan fitur <strong style={{ color: "var(--text-primary)" }}>Unlimited Download</strong>, <strong style={{ color: "var(--text-primary)" }}>Playlist Support</strong>, <strong style={{ color: "var(--text-primary)" }}>4K/8K Quality</strong>, dan <strong style={{ color: "var(--text-primary)" }}>Multi-thread Aria2c</strong> penuh dengan versi Desktop.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              href="https://github.com/SayMaven/MavenDownloader/releases/download/MavenDownloader/MavenDownloader.exe"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl transition-all hover:scale-105 shadow-lg text-white"
              style={{ background: "var(--accent)", boxShadow: "0 4px 14px var(--accent-subtle)" }}
            >
              <span>💻</span> Download EXE
            </Link>
            
            <Link
              href="https://github.com/SayMaven/MavenDownloader"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 font-bold rounded-xl border transition-all hover:opacity-80"
              style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            >
              Lihat Source Code
            </Link>
          </div>
          
          <p className="text-xs mt-6" style={{ color: "var(--text-muted)" }}>
            *Aplikasi ini 100% gratis, open source, dan aman (tidak ada virus/malware).
          </p>
        </div>
      </div>

    </div>
  );
}
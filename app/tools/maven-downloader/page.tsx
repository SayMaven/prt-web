import Link from "next/link";
import Image from "next/image"; // Jangan lupa import ini
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Maven Downloader | SayMaven",
  description: "Download video dari berbagai situs populer dengan berbagai fitur.",
};

export default function Page() {
  return (
    <div className="space-y-12">
      
      {/* --- HEADER SECTION --- */}
      <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400 bg-clip-text text-transparent drop-shadow-sm">
          Maven Downloader
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed">
          Software Downloader. Download video & audio dari berbagai situs populer dengan mudah dan cepat.
        </p>

        {/* Badge Limitasi Server */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500/10 border border-pink-500/20 rounded-full text-pink-400 text-xs sm:text-sm font-medium">
          <span>❤️</span>
          <span>Software ini aman dan source code-nya bisa dilihat di bawah</span>
        </div>
      </div>

      {/* --- SCREENSHOT PREVIEW SECTION --- */}
      <div className="animate-in zoom-in duration-700 delay-100 flex justify-center px-4">
        <div className="relative group max-w-4xl w-full">
          {/* Efek Glow di belakang gambar */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          
          {/* Container Gambar */}
          <div className="relative rounded-xl overflow-hidden border border-slate-700/50 shadow-2xl bg-slate-900">
            {/* Ganti '/assets/mavdown-preview.png' dengan path gambarmu */}
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

      {/* --- PROMOSI VERSI DESKTOP --- */}
      <div className="max-w-3xl mx-auto mt-16 p-8 bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 rounded-3xl text-center space-y-6 relative overflow-hidden group">
        
        {/* Hiasan Background */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all"></div>
        
        <div className="relative z-10 space-y-4">
          <h3 className="text-2xl font-bold text-white">Ingin coba? Silahkan download di bawah</h3>
          <p className="text-slate-400">
            Dapatkan fitur <strong>Unlimited Download</strong>, <strong>Playlist Support</strong>, <strong>4K/8K Quality</strong>, dan <strong>Multi-thread Aria2c</strong> penuh dengan versi Desktop.
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-2">
            <Link
              href="https://github.com/SayMaven/MavenDownloader/releases/download/MavenDownloader/MavenDownloader.exe"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all hover:scale-105 shadow-lg group-hover:border-blue-500/50"
            >
              <span>💻</span> Download Maven Downloader (EXE)
            </Link>
            
            <Link
              href="https://github.com/SayMaven/MavenDownloader"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold rounded-xl border border-blue-500/30 transition-all"
            >
              Lihat Source Code
            </Link>
          </div>
          
          <p className="text-xs text-slate-500 mt-4">
            *Aplikasi ini 100% gratis, open source, dan aman (tidak ada virus/malware).
          </p>
        </div>
      </div>

    </div>
  );
}
"use client"; // 👈 Wajib, karena ada interaksi klik tombol

import { useState } from "react";
import Link from "next/link";
import Image from "next/image"; // Untuk logo PNG
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); // Status menu (Buka/Tutup)
  const pathname = usePathname();

  // Helper kecil untuk Link Menu
  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)} // Otomatis tutup menu pas link diklik
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
          isActive 
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20" 
            : "text-slate-300 hover:text-white hover:bg-white/5"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        
        {/* --- 1. LOGO AREA (Kiri) --- */}
        <Link href="/" className="flex items-center gap-2 group">
           {/* Logo PNG kamu */}
           <Image 
             src="/logo.png" 
             alt="SayMaven Logo" 
             width={32} 
             height={32} 
             className="object-contain w-8 h-8"
           />
           <span className="font-bold text-lg text-slate-200 tracking-tight group-hover:text-blue-500 transition-colors">
             SayMaven
           </span>
        </Link>

        {/* --- 2. MENU DESKTOP (Tengah - HILANG saat di HP) --- */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/portfolio" label="Portfolio" />
          <NavLink href="/tools" label="Tools" />
          <NavLink href="/gallery" label="Gallery" />
          
          {/* Tombol Game */}
          <a
            href="https://game.saymaven.cloud/bangdream.html"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 text-sm font-medium text-white bg-white/10 hover:bg-blue-600 rounded-full transition-all"
          >
            Game ↗
          </a>
        </nav>

        {/* --- 3. TOMBOL HAMBURGER (Kanan - MUNCUL cuma di HP) --- */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-slate-300 hover:text-white bg-white/5 rounded-lg transition-colors active:scale-95"
          aria-label="Toggle Menu"
        >
          {/* Logika Ikon: Kalau Buka tampilkan 'X', kalau Tutup tampilkan 'Garis 3' */}
          {isOpen ? (
            // Ikon X (Silang)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            // Ikon Garis 3 (Hamburger)
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>

      </div>

      {/* --- 4. MOBILE MENU DROPDOWN (Isi Menu HP) --- */}
      {isOpen && (
        <div className="md:hidden border-t border-white/5 bg-slate-900 px-4 py-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2">
          <NavLink href="/" label="Home" />
          <NavLink href="/portfolio" label="Portfolio" />
          <NavLink href="/tools" label="Tools" />
          <NavLink href="/gallery" label="Gallery" />
          <a
            href="https://game.saymaven.cloud/bangdream.html"
            target="_blank"
            className="mt-2 px-4 py-3 text-sm font-medium text-center text-white bg-blue-600 rounded-lg active:scale-95 transition-transform"
          >
            Main Game
          </a>
        </div>
      )}
    </header>
  );
}
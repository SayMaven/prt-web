"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const NavLink = ({ href, label }: { href: string; label: string }) => {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        onClick={() => setIsOpen(false)}
        className="px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200"
        style={
          isActive
            ? { background: "var(--accent)", color: "#fff", boxShadow: "0 0 16px var(--accent-glow)" }
            : { color: "var(--text-secondary)" }
        }
      >
        {label}
      </Link>
    );
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{ background: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
    >
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/logo.png" alt="SayMaven Logo" width={32} height={32} className="object-contain w-8 h-8" />
          <span
            className="font-bold text-lg tracking-tight transition-colors"
            style={{ color: "var(--text-primary)" }}
          >
            SayMaven
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink href="/" label="Home" />
          <NavLink href="/portfolio" label="Portfolio" />
          <NavLink href="/tools" label="Tools" />
          <NavLink href="/gallery" label="Gallery" />
          <a
            href="https://game.saymaven.cloud/bangdream.html"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-4 py-2 text-sm font-semibold rounded-full transition-all"
            style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}
          >
            Game ↗
          </a>
        </nav>

        {/* Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-lg transition-colors active:scale-95"
          style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden border-t px-4 py-6 flex flex-col gap-2 shadow-2xl animate-in slide-in-from-top-2"
          style={{ background: "var(--nav-bg)", borderColor: "var(--nav-border)" }}
        >
          <NavLink href="/" label="Home" />
          <NavLink href="/portfolio" label="Portfolio" />
          <NavLink href="/tools" label="Tools" />
          <NavLink href="/gallery" label="Gallery" />
          <a
            href="https://game.saymaven.cloud/bangdream.html"
            target="_blank"
            className="mt-2 px-4 py-3 text-sm font-bold text-center rounded-lg transition-all text-white active:scale-95"
            style={{ background: "var(--accent)" }}
          >
            Main Game
          </a>
        </div>
      )}
    </header>
  );
}
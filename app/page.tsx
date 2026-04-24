"use client";

import { useRef } from "react";
import { tools, projects } from "@/lib/data";
import Link from "next/link";
import HomeGalleryWidget from "@/components/HomeGalleryWidget";
import { motion, useInView, Variants } from "framer-motion";
import { ArrowRight, Code, Sparkles, Terminal, Github } from "lucide-react";

const skills = [
  "Figma", "FL Studio", "Blender", "Adobe CC", "Clip Studio Paint", "Python",
  "Next.js", "TypeScript", "JavaScript", "C++", "Rust", "Ruby", "FastAPI",
  "PostgreSQL", "Supabase", "React", "Redis", "SQLite", "TensorFlow",
  "AI Architecture", "Data Modeling", "CSS", "Japanese", "English", "Illustration"
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 70, damping: 15 } },
};

/** Inline style shorthand using CSS variables */
const cardStyle = {
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)",
  boxShadow: "var(--shadow)",
} as const;

export default function Home() {
  const bentoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bentoRef, { once: true, margin: "-100px" });

  return (
    <div className="relative min-h-screen py-10 overflow-hidden">

      {/* Decorative Orbs — subtle in both modes */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: "var(--accent-subtle)" }}
      />
      <div
        className="absolute bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[140px] pointer-events-none -z-10"
        style={{ background: "rgba(99,102,241,0.07)" }}
      />

      {/* ── HERO ── */}
      <section className="mt-8 mb-20 px-4 md:px-0 flex flex-col items-center text-center relative z-10">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 backdrop-blur-md border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Sparkles className="w-4 h-4" style={{ color: "var(--accent)" }} />
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Welcome to My Digital Space</span>
        </motion.div>

        {/* H1 */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight"
          style={{ color: "var(--text-primary)" }}
        >
          Sayang{" "}
          <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.35)]">Maya</span>
          <br className="hidden md:block" />
          <span className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.35)]">For Even Now</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl max-w-2xl leading-relaxed mx-auto px-4"
          style={{ color: "var(--text-secondary)" }}
        >
          Halo, Saya{" "}
          <b style={{ color: "var(--text-primary)" }}>Abil Ar Rasyid</b>. Seorang Fullstack Developer, Illustrator, Komposer, Teknisi dan Mahasiswa.{" "}
          Selamat datang di ruang digital tempat logika bertemu estetika. Terinsipirasi dari karakter Bang Dream! Series, Maya Yamato.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link
            href="/projects"
            className="group flex items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all"
            style={{ background: "var(--accent)", boxShadow: "0 0 20px var(--accent-glow)" }}
          >
            <span>Lihat Projects</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="https://github.com/saymaven"
            target="_blank"
            className="flex items-center gap-2 px-6 py-3 font-bold rounded-xl border transition-all"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
          >
            <Terminal className="w-4 h-4" />
            <span>GitHub Profile</span>
          </Link>
        </motion.div>
      </section>

      {/* ── SKILLS MARQUEE ── */}
      <div
        className="relative w-full overflow-hidden py-5 mb-20 flex z-10 border-y backdrop-blur-sm"
        style={{ background: "var(--marquee-bg)", borderColor: "var(--marquee-border)" }}
      >
        {/* Fade edges */}
        <div
          className="absolute inset-y-0 left-0 w-16 md:w-40 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to right, var(--marquee-fade), transparent)` }}
        />
        <div
          className="absolute inset-y-0 right-0 w-16 md:w-40 z-10 pointer-events-none"
          style={{ background: `linear-gradient(to left, var(--marquee-fade), transparent)` }}
        />

        <motion.div
          className="flex whitespace-nowrap gap-10 pl-10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 40 }}
        >
          {[...skills, ...skills].map((skill, index) => (
            <div key={index} className="flex items-center gap-3">
              <span className="text-xl" style={{ color: "var(--accent)" }}>✦</span>
              <span className="font-semibold text-sm md:text-base tracking-wide uppercase" style={{ color: "var(--text-secondary)" }}>
                {skill}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── BENTO GRID ── */}
      <motion.div
        ref={bentoRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)] max-w-6xl mx-auto px-4 pb-20 relative z-10"
      >

        {/* 1. ABOUT ME */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-2 p-8 rounded-3xl backdrop-blur-md flex flex-col justify-center relative overflow-hidden group transition-colors"
          style={cardStyle}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent-subtle)")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--card-border)")}
        >
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity"
            style={{ background: "var(--accent-subtle)" }}
          />
          <h2 className="font-bold text-2xl mb-4 flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
            Disaat Logika Bertemu Estetika
          </h2>
          <p className="leading-relaxed text-base md:text-lg" style={{ color: "var(--text-secondary)" }}>
            Sebagai seorang Illustrator dan Web Developer, saya tidak hanya menulis kode, tetapi juga merancang pengalaman digital yang visual dan interaktif.
            Website ini adalah garasi digital tempat saya menyimpan eksperimen dan tools harian.
          </p>
        </motion.div>

        {/* 2. GALLERY PREVIEW */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-1 h-64 md:h-auto rounded-3xl p-1 relative group transition-all overflow-hidden shrink-0 flex"
          style={cardStyle}
        >
          <div className="flex-1 w-full h-full relative rounded-2xl overflow-hidden [&>*]:h-full [&>*]:w-full">
            <HomeGalleryWidget />
          </div>
          <Link href="/gallery" className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-all duration-300" aria-label="Go to Gallery">
            <span className="text-white font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{ background: "var(--accent)" }}>
              View Gallery
            </span>
          </Link>
        </motion.div>

        {/* 3. GAME CARD */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-1 rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group"
          style={{ background: "linear-gradient(135deg,rgba(79,70,229,0.85),rgba(99,102,241,0.60))", border: "1px solid rgba(99,102,241,0.30)" }}
        >
          <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/ds4a54vuy/image/upload/v1768242971/head3_u2nbxk.jpg')] opacity-15 mix-blend-screen bg-cover bg-left group-hover:opacity-30 transition-opacity" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="relative z-10">
            <span className="inline-block px-2 py-1 bg-white/10 text-white/80 text-xs font-bold rounded-md uppercase tracking-wider mb-2 border border-white/10">Mini Game</span>
            <h3 className="text-xl font-bold text-white mt-1 drop-shadow-md">Ganso BanG Dream!</h3>
            <p className="text-sm text-white/70 mt-2 font-medium">Web Shooter Game Simulator.</p>
          </div>
          <a href="https://game.saymaven.cloud/bangdream.html" target="_blank" className="mt-6 text-white text-center py-3 rounded-xl text-sm font-bold z-10 shadow-lg transition-opacity hover:opacity-90" style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)" }}>
            Gas coba cuy
          </a>
        </motion.div>

        {/* 4. QUICK TOOLS */}
        <motion.div variants={itemVariants} className="md:col-span-2 rounded-3xl p-6 backdrop-blur-md" style={cardStyle}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Code className="w-5 h-5" style={{ color: "var(--accent)" }} />
              Quick Tools
            </h2>
            <Link href="/tools" className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: "var(--accent-text)" }}>
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {tools.slice(0, 4).map((tool) => (
              <Link
                key={tool.id}
                href={tool.link}
                className="relative p-5 flex flex-col justify-end min-h-[130px] rounded-2xl border transition-all group overflow-hidden"
                style={{ background: "var(--page-bg-2)", borderColor: "var(--card-border)" }}
              >
                {tool.image && (
                  <>
                    <div className="absolute inset-0 bg-cover bg-center opacity-50 group-hover:opacity-80 transition-all duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${tool.image})` }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pointer-events-none" />
                  </>
                )}
                <div className="relative z-10 flex flex-col gap-1.5">
                  <div className="flex justify-between items-start">
                    <div className="text-base font-bold text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
                      {tool.title}
                    </div>
                    {tool.status && (
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                        tool.status === 'Hot' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/20' :
                        tool.status === 'Ultimate' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20' :
                        tool.status === 'New' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/20' :
                        'bg-blue-500/20 text-blue-300 border border-blue-500/20'
                      }`}>
                        {tool.status}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-white/80 line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] font-medium">
                    {tool.description}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* 5. GITHUB ACTIVITY */}
        <motion.div variants={itemVariants} className="md:col-span-2 rounded-3xl p-6 backdrop-blur-md flex flex-col justify-center relative overflow-hidden group" style={cardStyle}>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full blur-[80px] -mr-10 -mt-10 pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: "var(--accent-subtle)" }} />

          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-xl flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
              <Github className="w-5 h-5" style={{ color: "var(--accent-text)" }} />
              GitHub Activity
            </h2>
            <Link href="https://github.com/saymaven" target="_blank" className="text-sm font-medium flex items-center gap-1 transition-colors hover:opacity-80" style={{ color: "var(--accent-text)" }}>
              View Profile <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="w-full flex-1 relative overflow-hidden rounded-xl flex items-center justify-center border" style={{ borderColor: "var(--card-border)", background: "var(--page-bg-2)" }}>
            <img
              src="https://github-readme-activity-graph.vercel.app/graph?username=saymaven&theme=react-dark&bg_color=transparent&hide_border=true&area=true&color=818cf8&line=6366f1&point=818cf8"
              alt="GitHub Activity"
              className="w-full max-w-[500px] h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity scale-105"
            />
            <a href="https://github.com/saymaven" target="_blank" className="absolute inset-0 z-10" aria-label="GitHub Stats" />
          </div>
        </motion.div>

        {/* 6. FEATURED PROJECT */}
        <motion.div
          variants={itemVariants}
          className="md:col-span-4 rounded-3xl p-8 flex flex-col justify-center relative overflow-hidden group"
          style={cardStyle}
        >
          <div className="absolute right-0 bottom-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none opacity-40 group-hover:opacity-80 transition-opacity" style={{ background: "rgba(236,72,153,0.15)" }} />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            {/* Left */}
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-pink-400 text-xs font-bold rounded-full uppercase tracking-widest mb-6 border border-pink-500/30 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.2)]">
                <span className="w-1.5 h-1.5 rounded-full bg-pink-400 animate-pulse" />
                Featured Project
              </span>
              <h3 className="text-4xl font-extrabold mb-4" style={{ color: "var(--text-primary)" }}>{projects[0].title}</h3>
              <p className="py-2 text-base md:text-lg mb-8 max-w-md leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {projects[0].description}
              </p>
              <div className="flex flex-wrap gap-2 mb-8">
                {projects[0].tech.map((tech) => (
                  <span key={tech} className="px-4 py-2 rounded-lg text-xs font-bold border transition-colors hover:border-pink-500/40" style={{ background: "var(--page-bg-2)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}>
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <Link href={projects[0].link} className="inline-flex group/btn items-center gap-2 px-6 py-3 text-white font-bold rounded-xl transition-all shadow-lg" style={{ background: "#ec4899" }}>
                  View Project <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
                <Link href={projects[0].github} target="_blank" className="p-3 rounded-xl border transition-colors" style={{ background: "var(--page-bg-2)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }}>
                  <Github className="w-5 h-5" />
                </Link>
              </div>
            </div>

            {/* Right — App Mockup */}
            <div className="hidden md:flex justify-end p-4">
              <div className="w-full max-w-md rounded-2xl overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.4)] transform group-hover:-translate-y-2 group-hover:rotate-1 transition-all duration-500 border" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                {/* Window chrome */}
                <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ background: "var(--page-bg-2)", borderColor: "var(--card-border)" }}>
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Maven_Downloader_GUI.exe</div>
                </div>
                {/* Content */}
                <div className="p-6">
                  <div className="flex gap-4 mb-6">
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shadow-inner">
                      <Terminal className="w-8 h-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="h-4 w-3/4 rounded-md mb-2" style={{ background: "var(--card-border)" }} />
                      <div className="h-3 w-1/2 rounded-md" style={{ background: "var(--card-border)" }} />
                    </div>
                  </div>
                  <div className="mb-2 flex justify-between text-xs font-mono" style={{ color: "var(--text-muted)" }}>
                    <span>Downloading dependencies...</span>
                    <span className="text-pink-400">75%</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "var(--card-border)" }}>
                    <div className="h-full bg-pink-500 w-3/4 rounded-full relative">
                      <div className="absolute top-0 right-0 bottom-0 w-10 bg-white/20 animate-pulse skew-x-[-20deg]" />
                    </div>
                  </div>
                  <div className="mt-6 p-3 rounded-lg font-mono text-[10px] text-emerald-400/90 leading-relaxed border" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                    &gt; Initializing aria2 daemon...<br />
                    &gt; Setting custom connections (x=16)<br />
                    <span style={{ color: "var(--text-muted)" }}>&gt; Waiting for stream metadata...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
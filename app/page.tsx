"use client";

import { useRef } from "react";
import { tools, projects } from "@/lib/data";
import Link from "next/link";
import HomeGalleryWidget from "@/components/HomeGalleryWidget";
import { motion, useInView, Variants } from "framer-motion";
import { ArrowRight, Code, Sparkles, Terminal } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 70, damping: 15 },
  },
};

export default function Home() {
  const bentoRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(bentoRef, { once: true, margin: "-100px" });

  return (
    <div className="relative min-h-screen py-10 overflow-hidden">
      
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[400px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* --- HERO SECTION --- */}
      <section className="mt-8 mb-20 px-4 md:px-0 flex flex-col items-center text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/50 mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium text-slate-300">Welcome to My Digital Space</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight"
        >
          Sayang <span className="text-emerald-400 drop-shadow-[0_0_15px_rgba(52,211,153,0.4)]">Maya</span> <br className="hidden md:block" />
          <span className="text-pink-400 drop-shadow-[0_0_15px_rgba(244,114,182,0.4)]">For Even Now</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl leading-relaxed mx-auto px-4"
        >
          Halo, Saya <b className="text-slate-200">Abil Ar Rasyid</b>. Seorang Fullstack Developer, Illustrator, Komposer, Teknisi dan Mahasiswa. 
          Selamat datang di ruang digital tempat logika bertemu estetika. Terinsipirasi dari karakter Bang Dream! Series, Maya Yamato.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-wrap justify-center gap-4"
        >
          <Link href="/portfolio" className="group flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(52,211,153,0.3)]">
            <span>Lihat Portfolio</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="https://github.com/saymaven" target="_blank" className="flex items-center gap-2 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all hover:shadow-lg">
            <Terminal className="w-4 h-4" />
            <span>GitHub Profile</span>
          </Link>
        </motion.div>
      </section>
      
      {/* --- BENTO GRID LAYOUT --- */}
      <motion.div 
        ref={bentoRef}
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)] max-w-6xl mx-auto px-4 pb-20 relative z-10"
      >
        
        {/* 1. ABOUT ME (Lebar: 2 kolom) */}
        <motion.div variants={itemVariants} className="md:col-span-2 p-8 bg-slate-900/60 rounded-3xl border border-slate-800 backdrop-blur-md flex flex-col justify-center relative overflow-hidden group hover:border-emerald-500/30 transition-colors">
          <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-colors"></div>
          <h2 className="font-bold text-2xl mb-4 text-white flex items-center gap-2">
            Disaat Logika Bertemu Estetika
          </h2>
          <p className="text-slate-400 leading-relaxed text-base md:text-lg">
            Sebagai seorang Illustrator dan Web Developer, saya tidak hanya menulis kode, tetapi juga merancang pengalaman digital yang visual dan interaktif. Website ini adalah garasi digital tempat saya menyimpan eksperimen dan tools harian.
          </p>
        </motion.div>
        
        {/* 2. GALLERY PREVIEW (Lebar: 1 kolom) */}
        <motion.div variants={itemVariants} className="md:col-span-1 h-64 md:h-auto bg-slate-900/60 rounded-3xl border border-slate-800 p-1 relative group hover:border-blue-500/50 transition-all overflow-hidden shrink-0 flex">
            {/* Widget Slideshow dipanggil di sini */}
            <div className="flex-1 w-full h-full relative rounded-2xl overflow-hidden [&>*]:h-full [&>*]:w-full">
              <HomeGalleryWidget />
            </div>
            
            {/* Link overlay full */}
            <Link href="/gallery" className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-sm transition-all duration-300" aria-label="Go to Gallery">
              <span className="bg-blue-500 text-white font-bold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">View Gallery</span>
            </Link>
        </motion.div>

        {/* 3. GAME CARD (Lebar: 1 kolom) */}
        <motion.div variants={itemVariants} className="md:col-span-1 bg-gradient-to-br from-indigo-900/80 to-slate-900/80 rounded-3xl border border-indigo-500/30 p-6 flex flex-col justify-between hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group hover:shadow-[0_10px_30px_-10px_rgba(99,102,241,0.3)]">
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/ds4a54vuy/image/upload/v1768242971/head3_u2nbxk.jpg')] opacity-20 mix-blend-screen bg-cover bg-left group-hover:opacity-30 transition-opacity"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
            
            <div className="relative z-10">
                <span className="inline-block px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs font-bold rounded-md uppercase tracking-wider mb-2 border border-indigo-500/20">Mini Game</span>
                <h3 className="text-xl font-bold text-white mt-1 drop-shadow-md">Ganso BanG Dream!</h3>
                <p className="text-sm text-indigo-100/70 mt-2 font-medium">Web Shooter Game Simulator.</p>
            </div>
            <a 
                href="https://game.saymaven.cloud/bangdream.html" 
                target="_blank"
                className="mt-6 bg-indigo-500 hover:bg-indigo-400 text-white text-center py-3 rounded-xl text-sm font-bold transition-colors z-10 shadow-lg"
            >
                Gas coba cuy
            </a>
        </motion.div>

        {/* 4. TOOLS LIST (Lebar: 2 kolom) */}
        <motion.div variants={itemVariants} className="md:col-span-2 bg-slate-900/60 rounded-3xl border border-slate-800 p-6 backdrop-blur-md">
           <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                <Code className="w-5 h-5 text-emerald-400" />
                Quick Tools
              </h2>
              <Link href="/tools" className="text-sm font-medium text-slate-400 hover:text-emerald-400 flex items-center gap-1 transition-colors">
                View All <ArrowRight className="w-4 h-4" />
              </Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Ambil 4 tools pertama */}
              {tools.slice(0, 4).map((tool) => (
                <Link 
                    key={tool.id} 
                    href={tool.link}
                    className="relative p-5 flex flex-col justify-end min-h-[130px] rounded-2xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 transition-all group overflow-hidden"
                >
                    {/* Background Image */}
                    {tool.image && (
                      <>
                        <div 
                          className="absolute inset-0 bg-cover bg-center opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110"
                          style={{ backgroundImage: `url(${tool.image})` }}
                        />
                        {/* Overlay Gradient (Bottom to Top for extreme clarity) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent pointer-events-none" />
                      </>
                    )}

                    <div className="relative z-10 flex flex-col gap-1.5">
                        <div className="flex justify-between items-start">
                          <div className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
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
                        <div className="text-xs text-slate-300 group-hover:text-white line-clamp-2 drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)] font-medium">
                          {tool.description}
                        </div>
                    </div>
                </Link>
              ))}
           </div>
        </motion.div>

        {/* 5. FEATURED PROJECT (Lebar: 2 kolom) - Mengambil dari projects array */}
        <motion.div variants={itemVariants} className="md:col-span-2 bg-gradient-to-br from-slate-900/80 to-slate-950/80 rounded-3xl border border-slate-800 p-8 flex flex-col justify-center relative overflow-hidden group">
             <div className="absolute right-0 bottom-0 w-64 h-64 bg-pink-500/10 rounded-full blur-[80px] group-hover:bg-pink-500/20 transition-colors duration-500"></div>
             
             <div className="relative z-10">
               <span className="inline-block px-2 py-1 bg-pink-500/20 text-pink-300 text-xs font-bold rounded-md uppercase tracking-wide mb-4 border border-pink-500/20">
                 Featured Project
               </span>
               <h3 className="text-3xl font-extrabold text-white mb-3">{projects[0].title}</h3>
               <p className="text-slate-400 text-base mb-8 max-w-md">
                 {projects[0].description}
               </p>
               <div className="flex flex-wrap gap-2 mb-6">
                   {projects[0].tech.map((tech) => (
                     <span key={tech} className="px-3 py-1.5 bg-slate-800/80 rounded-lg text-xs font-medium text-slate-300 border border-slate-700/50 shadow-sm">
                       {tech}
                     </span>
                   ))}
               </div>
               <div className="flex items-center gap-3">
                 <Link href={projects[0].link} className="text-sm font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 transition-colors">
                   View Project <ArrowRight className="w-4 h-4" />
                 </Link>
               </div>
             </div>
        </motion.div>

      </motion.div>
    </div>
  );
}
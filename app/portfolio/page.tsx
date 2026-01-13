import { Metadata } from "next";
import { projects } from "@/lib/data"; 
import Link from "next/link";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Daftar proyek terpilih dan case study coding.",
};

export default function PortfolioPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Halaman */}
      <section className="mt-4">
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Selected Works 📁
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Beberapa proyek yang pernah saya kerjakan, mulai dari eksperimen kecil, tools, hingga aplikasi web fullstack.
        </p>
      </section>

      {/* Grid Project */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="group relative bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 transition-all duration-300 hover:-translate-y-1 flex flex-col"
          >
            {/* Dekorasi Warna di Atas (Tetap pakai warna dari data, tapi lebih tipis elegan) */}
            <div className={`h-1 w-full ${project.color} opacity-80`} />

            <div className="p-6 flex flex-col h-full">
              {/* Judul Project */}
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                    {project.title}
                </h3>
                {/* Ikon Folder Hiasan */}
                <span className="text-slate-700 group-hover:text-blue-500/50 transition-colors text-2xl">
                    📂
                </span>
              </div>
              
              {/* Deskripsi */}
              <p className="text-slate-300 text-sm mb-6 leading-relaxed line-clamp-3">
                {project.description}
              </p>

              {/* Badges Tech Stack (Dark Style) */}
              <div className="flex flex-wrap gap-2 mb-8">
                {project.tech.map((t) => (
                  <span key={t} className="text-xs font-mono font-medium px-2 py-1 bg-slate-950 border border-slate-800 text-slate-300 rounded-md">
                    {t}
                  </span>
                ))}
              </div>

              {/* Tombol Action (Footer Card) */}
              <div className="mt-auto pt-4 border-t border-slate-800 flex items-center gap-4">
                <a 
                  href={project.link} 
                  target="_blank" 
                  className="flex items-center gap-2 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <span>Live Demo</span>
                  <span className="text-xs">↗</span>
                </a>
                
                {project.github && (
                    <a 
                    href={project.github} 
                    target="_blank" 
                    className="flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
                    >
                    <span>Source Code</span>
                    </a>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* Empty State jika belum ada project */}
      {projects.length === 0 && (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <p className="text-slate-500">Belum ada project yang ditambahkan.</p>
        </div>
      )}

    </div>
  );
}
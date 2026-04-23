import CivitaiExplorer from "@/components/tools/CivitaiExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CivitAI Explorer | SayMaven Tools",
  description: "Jelajahi ribuan model AI Stable Diffusion, LoRA, dan salin prompt trigger word dengan mudah.",
};

export default function CivitaiExplorerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 py-10 min-h-screen">
      
      {/* --- HEADER JUDUL & DESKRIPSI --- */}
      <section className="text-center mt-10 mb-12 relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 backdrop-blur-md border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>AI Model Explorer</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>CivitAI</span> Explorer
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Jelajahi model AI, filter berdasarkan Base Model (SDXL/Pony/Noob), dan salin Trigger Word.
        </p>
      </section>

      {/* Component Utama */}
      <CivitaiExplorer />
      
    </div>
  );
}
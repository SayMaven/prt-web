import CivitaiExplorer from "@/components/tools/CivitaiExplorer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "CivitAI Explorer | SayMaven Tools",
  description: "Jelajahi ribuan model AI Stable Diffusion, LoRA, dan salin prompt trigger word dengan mudah.",
};

export default function CivitaiExplorerPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen space-y-8">
      
      {/* --- HEADER JUDUL & DESKRIPSI (Dipindahkan kesini) --- */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white flex items-center justify-center gap-2">
           <span className="text-blue-400">CivitAI</span> Explorer
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Jelajahi model AI, filter berdasarkan Base Model (SDXL/Pony/Noob), dan salin Trigger Word.
        </p>
      </div>

      {/* Component Utama */}
      <CivitaiExplorer />
      
    </div>
  );
}
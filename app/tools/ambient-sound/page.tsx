import React from "react";
import AmbientSound from "@/components/tools/AmbientSound";
import { Metadata } from "next";
import { Waves } from "lucide-react";

export const metadata: Metadata = {
  title: "Ambient Sound Studio | Prt Web Tools",
  description: "Platform meracik suara relaksasi dan fokus. Ditenagai oleh audio berkualitas dari Moodist.",
};

export default function AmbientSoundPage() {
  return (
    <div className="min-h-screen relative w-full flex flex-col">
      {/* Aesthetic Smooth Background Blur */}
      {/* Kita menggunakan absolute positioning dengan z-[-1] agar selalu ada di belakang dan tidak terpotong kontainer */}
      <div className="fixed top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none z-[-1]"></div>

      <div className="max-w-6xl mx-auto w-full p-4 md:p-8 lg:px-12 flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-12 pb-16 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md" 
               style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <Waves size={16} style={{ color: "var(--accent)" }} />
            <span className="text-xs font-bold tracking-widest uppercase tool-title opacity-80">Acoustic Studio</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter tool-title drop-shadow-sm">
            Ambient <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-500">Sound</span>
          </h1>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto tool-body leading-relaxed opacity-80">
            Rancang ekosistem akustik pribadimu. Campurkan berbagai suara alam untuk meningkatkan fokus, meredakan stres, atau membantu tidur.
          </p>
        </div>

        {/* MAIN COMPONENT */}
        <div className="relative z-20 pb-20">
          <AmbientSound />
        </div>

      </div>
    </div>
  );
}

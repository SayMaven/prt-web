import React from "react";
import Base64Converter from "@/components/tools/Base64Converter";
import { Metadata } from "next";
import { Code } from "lucide-react";

export const metadata: Metadata = {
  title: "Base64 Encoder/Decoder | Prt Web Tools",
  description: "Alat pengembang untuk mengonversi teks atau gambar ke Base64, dan sebaliknya, secara instan di browser.",
};

export default function Base64Page() {
  return (
    <div className="min-h-screen relative w-full flex flex-col">
      {/* Aesthetic Smooth Background Blur */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/10 blur-[150px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none z-[-1]"></div>

      <div className="max-w-6xl mx-auto w-full p-4 md:p-8 lg:px-12 flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-12 pb-12 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md" 
               style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <Code size={16} className="text-emerald-500" />
            <span className="text-xs font-bold tracking-widest uppercase tool-title opacity-80">Dev Utility</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter tool-title drop-shadow-sm">
            Base64 <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-500">Encoder</span>
          </h1>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto tool-body leading-relaxed opacity-80">
            Alat super cepat untuk mengubah teks string atau file gambar menjadi string Base64, maupun sebaliknya. Semuanya diproses aman 100% secara lokal di browsermu.
          </p>
        </div>

        {/* MAIN COMPONENT */}
        <div className="relative z-20 pb-20">
          <Base64Converter />
        </div>
        
        <div className="mt-4 tool-card rounded-3xl p-6 md:p-10 space-y-4 border">
          <h2 className="text-2xl font-bold tool-title">Apa itu Base64?</h2>
          <p className="tool-body leading-relaxed">
              Base64 adalah skema encoding biner-ke-teks yang mewakili data biner dalam format string ASCII yang dapat dicetak. Biasanya ini sangat berguna dalam dunia pengembangan web untuk menyematkan data gambar secara langsung di file CSS/HTML tanpa perlu HTTP Request tambahan (menggunakan skema Data URI), atau untuk menyembunyikan string karakter mentah saat ditransmisikan.
          </p>
        </div>

      </div>
    </div>
  );
}

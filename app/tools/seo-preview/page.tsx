import React from "react";
import SeoPreview from "@/components/tools/SeoPreview";
import { Metadata } from "next";
import { Search } from "lucide-react";

export const metadata: Metadata = {
  title: "Meta Tag & SEO Preview | Prt Web Tools",
  description: "Generator Meta Tag dan Live Preview untuk sosial media seperti Google, Twitter, dan Discord.",
};

export default function SeoPreviewPage() {
  return (
    <div className="min-h-screen relative w-full flex flex-col">
      {/* Aesthetic Smooth Background Blur */}
      <div className="fixed top-[0%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[150px] pointer-events-none z-[-1]"></div>
      <div className="fixed bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-500/10 blur-[150px] pointer-events-none z-[-1]"></div>

      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 lg:px-12 flex-1 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        {/* HERO SECTION */}
        <div className="text-center space-y-6 pt-12 pb-12 relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm backdrop-blur-md" 
               style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
            <Search size={16} className="text-blue-500" />
            <span className="text-xs font-bold tracking-widest uppercase tool-title opacity-80">SEO Utility</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter tool-title drop-shadow-sm">
            Meta Tag <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-pink-500">Previewer</span>
          </h1>
          
          <p className="text-base md:text-lg max-w-2xl mx-auto tool-body leading-relaxed opacity-80">
            Ketik informasi situsmu, dan lihat secara <span className="font-bold text-[var(--text-primary)]">real-time</span> bagaimana wujudnya jika dibagikan ke Google Search, Twitter, dan Discord. Jangan lupa <span className="font-bold text-[var(--text-primary)]">copy</span> tag HTML-nya!
          </p>
        </div>

        {/* MAIN COMPONENT */}
        <div className="relative z-20 pb-20">
          <SeoPreview />
        </div>
        
      </div>
    </div>
  );
}

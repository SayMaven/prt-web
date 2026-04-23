import { Metadata } from "next";
import BpmAnalyzer from "@/components/tools/BpmAnalyzer";
import { Activity } from "lucide-react";

export const metadata: Metadata = {
  title: "Audio Analyzer",
  description: "Deteksi BPM, Key, Energy, dan detail akustik lagu lainnya.",
};

export default function BpmAnalyzerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      
      <section className="text-center mt-6 mb-12 relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Activity size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Audio Analysis</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          BPM & Audio <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Analyzer</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Temukan tempo (BPM), kunci nada (Key), hingga mood lagu (Energy, Danceability) secara otomatis hanya dengan drag & drop.
        </p>
      </section>

      <div className="flex-1 w-full max-w-5xl mx-auto">
        <BpmAnalyzer />
      </div>

    </div>
  );
}
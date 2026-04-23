import JsonFormatter from "@/components/tools/JsonFormatter";
import type { Metadata } from "next";
import { Braces } from "lucide-react";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description: "Validasi, rapikan (Pretty Print), atau perkecil (Minify) kode JSON secara instan.",
};

export default function JsonPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Braces size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Developer Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-words" style={{ color: "var(--text-primary)" }}>
          JSON <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Formatter</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Validasi, rapikan (Pretty Print), perkecil (Minify), dan bedah struktur data JSON Anda dalam hitungan detik dengan <b style={{ color: "var(--text-primary)" }}>Syntax Highlighting</b> instan.
        </p>
      </section>

      <div className="w-full">
        <JsonFormatter />
      </div>

    </div>
  );
}
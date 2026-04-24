import TypingTest from "@/components/tools/TypingTest";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speed Typing Test",
  description: "Uji kecepatan mengetikmu (WPM) dengan gaya Monkeytype.",
};

export default function TypingPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      
      <section className="text-center mt-6 mb-8 relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Typing Test</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Speed <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Typer</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Uji seberapa cepat Anda mengetik dengan tampilan minimalis bergaya Monkeytype.
        </p>
      </section>
      
      <div className="flex-1">
        <TypingTest />
      </div>
    </div>
  );
}
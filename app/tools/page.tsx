import { Metadata } from "next";
import ToolsGrid from "@/components/ToolsGrid";

export const metadata: Metadata = {
  title: "Tools Library",
  description: "Kumpulan alat utilitas digital gratis.",
};

export default function ToolsPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 py-8">

      <section className="text-center mt-6 mb-16 relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-ping" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>The Library</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight break-words" style={{ color: "var(--text-primary)" }}>
          SayMaven <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 20px var(--accent-subtle))" }}>Tools Hub</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-3xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Kumpulan <b style={{ color: "var(--text-primary)" }}>Micro-tools</b> canggih untuk mempermudah produktivitas Anda. Gratis, super cepat, dan diproses langsung di browser tanpa instalasi.
        </p>
      </section>

      <ToolsGrid />

    </div>
  );
}
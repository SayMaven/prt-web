import ColorConverter from "@/components/tools/ColorConverter";
import type { Metadata } from "next";
import { Palette } from "lucide-react";

export const metadata: Metadata = {
  title: "Color Converter",
  description: "Konversi format warna dari HEX, RGB, HSL, hingga CMYK secara presisi.",
};

export default function ColorPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Palette size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Design Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Color <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Converter</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Alat esensial untuk desainer. Temukan dan konversikan palet warna Anda ke berbagai format digital (HEX, RGB, HSL, CMYK) secara instan.
        </p>
      </section>

      <div className="w-full max-w-5xl">
        <ColorConverter />
      </div>

    </div>
  );
}
import CurrencyConverter from "@/components/tools/CurrencyConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Currency Converter",
  description: "Konversi mata uang asing (USD, EUR, IDR) dengan kurs real-time.",
};

export default function CurrencyPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-10 min-h-screen">
      
      <section className="text-center mt-10 mb-12 relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 backdrop-blur-md border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Finance Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Currency <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Converter</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Cek nilai tukar puluhan mata uang dunia secara Real-Time. Akurat, instan, dan mudah digunakan.
        </p>
      </section>
      
      <CurrencyConverter />
    </div>
  );
}
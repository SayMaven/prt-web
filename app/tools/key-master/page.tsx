import KeyMaster from "@/components/tools/KeyMaster";
import { Metadata } from "next";
import { Keyboard } from "lucide-react"; 

export const metadata: Metadata = {
  title: "KeyMaster | Keyboard & NKRO Tester | SayMaven Tools",
  description: "Test mechanical keyboard switches, N-Key Rollover, and input latency.",
};

export default function KeyMasterPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Keyboard size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Hardware Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-words" style={{ color: "var(--text-primary)" }}>
          Key<span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Master</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Uji <b style={{ color: "var(--text-primary)" }}>switch keyboard</b>, periksa performa <b style={{ color: "var(--text-primary)" }}>NKRO</b> (Ghosting), dan tes responsivitas tuts keyboard Anda secara interaktif.
        </p>
      </section>

      <div className="w-full">
        <KeyMaster />
      </div>

    </div>
  );
}
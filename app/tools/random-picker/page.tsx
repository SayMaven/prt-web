import { Metadata } from "next";
import RandomPicker from "@/components/tools/RandomPicker";
import { Dices } from "lucide-react";

export const metadata: Metadata = {
  title: "Random Picker | SayMaven Tools",
  description: "Bingung memilih? Biarkan alat canggih ini memilihkan secara acak untukmu.",
};

export default function RandomPickerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Dices size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Utility Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-words" style={{ color: "var(--text-primary)" }}>
          Random <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Picker</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Bingung memutuskan pilihan? Masukkan semua opsi yang ada dan biarkan <b style={{ color: "var(--text-primary)" }}>algoritma acak</b> yang menentukan pemenangnya untuk Anda.
        </p>
      </section>

      <div className="w-full">
        <RandomPicker />
      </div>

    </div>
  );
}
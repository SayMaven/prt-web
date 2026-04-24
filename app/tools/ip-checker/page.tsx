import IpChecker from "@/components/tools/IpChecker";
import { Metadata } from "next";
import { Globe2 } from "lucide-react";

export const metadata: Metadata = {
  title: "IP & Network Scanner",
  description: "Cek IP Address publik, lokasi, ISP, dan info perangkat Anda secara akurat.",
};

export default function IpCheckerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Globe2 size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Network Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          IP & Network <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Scanner</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Deteksi otomatis alamat IP publik, penyedia internet (ISP), koordinat geolokasi, dan rincian jaringan Anda secara <b style={{ color: "var(--text-primary)" }}>real-time</b>.
        </p>
      </section>

      <div className="w-full max-w-5xl">
        <IpChecker />
      </div>

    </div>
  );
}
import WeatherCheck from "@/components/tools/WeatherCheck";
import { Metadata } from "next";
import { CloudSun } from "lucide-react";

export const metadata: Metadata = {
  title: "Cek Cuaca Akurat (Open-Meteo) | SayMaven Tools",
  description: "Cek prakiraan cuaca realtime di seluruh dunia. Tanpa iklan, gratis, dan akurat.",
};

export default function Page() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <CloudSun size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Information Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-words" style={{ color: "var(--text-primary)" }}>
          Global <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Weather</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Dapatkan prakiraan cuaca, suhu, kelembaban, dan indeks kualitas udara secara <b style={{ color: "var(--text-primary)" }}>real-time</b> dengan data presisi tinggi.
        </p>
      </section>

      <div className="w-full">
        <WeatherCheck />
      </div>

    </div>
  );
}
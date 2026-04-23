import { Metadata } from "next";
import AnimeExplorer from "@/components/tools/AnimeExplorer";

export const metadata: Metadata = {
  title: "Anime Finder Ultimate | SayMaven Tools",
  description: "Cari anime lengkap dengan filter genre, score, dan status. Data real-time.",
};

export default function AnimeExplorerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4">
      
      <section className="text-center mt-10 mb-12 relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 backdrop-blur-md border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Advanced Search</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Anime Finder <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Ultimate</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Database anime terlengkap. Cari anime favoritmu berdasarkan <b style={{ color: "var(--text-primary)" }}>Genre, Status Tayang,</b> atau <b style={{ color: "var(--text-primary)" }}>Score tertinggi</b>.
        </p>
      </section>

      {/* Panggil Komponen Canggih Kita */}
      <AnimeExplorer />

    </div>
  );
}
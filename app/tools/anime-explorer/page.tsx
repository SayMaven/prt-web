import { Metadata } from "next";
import AnimeExplorer from "@/components/tools/AnimeExplorer";

export const metadata: Metadata = {
  title: "Anime Finder Ultimate | SayMaven Tools",
  description: "Cari anime lengkap dengan filter genre, score, dan status. Data real-time.",
};

export default function AnimeExplorerPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <section className="text-center mt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">
          Anime Finder Ultimate 
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Database anime terlengkap. Cari anime favoritmu berdasarkan Genre, Status Tayang, atau Score tertinggi.
        </p>
      </section>

      {/* Panggil Komponen Canggih Kita */}
      <AnimeExplorer />

    </div>
  );
}
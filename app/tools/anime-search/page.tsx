import AnimeSearch from "@/components/tools/AnimeSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anime Scene Searcher | SayMaven Tools",
  description: "Cari judul anime, episode, dan timestamp hanya bermodalkan screenshot adegan.",
};

export default function AnimeSearchPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-2">
           Anime Scene Searcher
        </h1>
        <p className="text-slate-400">
          Cari judul, episode, dan informasi lengkap anime dari screenshot adegan.
        </p>
      </div>

      <AnimeSearch />
    </div>
  );
}
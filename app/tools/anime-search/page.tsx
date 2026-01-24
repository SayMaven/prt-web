import AnimeSearch from "@/components/tools/AnimeSearch";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Anime Scene Searcher | SayMaven Tools",
  description: "Cari judul anime, episode, dan timestamp hanya bermodalkan screenshot adegan.",
};

export default function AnimeSearchPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
      <AnimeSearch />
    </div>
  );
}
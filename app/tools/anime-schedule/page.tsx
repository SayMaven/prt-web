import { Metadata } from "next";
import AnimeSchedule from "@/components/tools/AnimeSchedule";

export const metadata: Metadata = {
  title: "Seasonal Anime | SayMaven Tools",
  description: "Cek jadwal anime yang sedang tayang musim ini (Real-time data).",
};

export default function AnimePage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <section className="text-center mt-4">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          Seasonal Anime Chart 
        </h1>
        <p className="text-slate-400 max-w-xl mx-auto">
          Daftar anime yang sedang tayang musim ini (Now Airing). 
          Data diambil langsung secara <b>Real-time</b> dari MyAnimeList.
        </p>
      </section>

      <AnimeSchedule />

    </div>
  );
}
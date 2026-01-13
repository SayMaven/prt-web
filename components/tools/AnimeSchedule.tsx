"use client";

import { useState, useEffect } from "react";

// Tipe data untuk hasil API Jikan (Kita definisikan biar TypeScript gak marah)
type Anime = {
  mal_id: number;
  title: string;
  images: {
    webp: {
      image_url: string;
    };
  };
  score: number;
  synopsis: string;
  url: string;
  genres: { name: string }[];
};

export default function AnimeSchedule() {
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fungsi Fetch Data dari API Eksternal
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        setLoading(true);
        // Request ke Server Jikan (MyAnimeList)
        const response = await fetch("https://api.jikan.moe/v4/seasons/now?limit=9");
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data anime.");
        }

        const data = await response.json();
        setAnimeList(data.data); // Simpan data ke state
      } catch (err) {
        setError("Terjadi kesalahan saat memuat data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      
      {/* 1. Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse">Sedang menghubungi markas pusat...</p>
        </div>
      )}

      {/* 2. Error State */}
      {error && (
        <div className="p-4 bg-red-900/20 border border-red-500/50 rounded-xl text-red-300 text-center">
          {error}
        </div>
      )}

      {/* 3. Success State (Grid Anime) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {animeList.map((anime) => (
            <a 
              key={anime.mal_id}
              href={anime.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 transition-all hover:-translate-y-1 block"
            >
              {/* Gambar Cover */}
              <div className="aspect-[3/4] overflow-hidden">
                <img 
                  src={anime.images.webp.image_url} 
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              {/* Info Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4">
                
                {/* Score Badge */}
                <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur text-yellow-400 font-bold px-2 py-1 rounded-lg text-xs border border-yellow-500/30 flex items-center gap-1">
                   ⭐ {anime.score ? anime.score : "N/A"}
                </div>

                <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 mb-1 group-hover:text-blue-400 transition-colors">
                  {anime.title}
                </h3>
                
                <div className="flex flex-wrap gap-1 mt-2">
                  {anime.genres.slice(0, 3).map((g, idx) => (
                    <span key={idx} className="text-[10px] bg-blue-600/30 text-blue-200 px-2 py-0.5 rounded-full border border-blue-500/20">
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      
      <div className="text-center mt-8">
        <p className="text-xs text-slate-500">
          Data powered by <a href="https://jikan.moe/" className="underline hover:text-blue-400">Jikan API</a> (Unofficial MyAnimeList API)
        </p>
      </div>

    </div>
  );
}
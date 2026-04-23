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
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
          <div className="w-12 h-12 border-4 rounded-full animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}></div>
          <p className="animate-pulse font-medium" style={{ color: "var(--text-secondary)" }}>Sedang menghubungi markas pusat...</p>
        </div>
      )}

      {/* 2. Error State */}
      {error && (
        <div className="p-6 rounded-2xl border text-center backdrop-blur-sm" style={{ background: "rgba(239, 68, 68, 0.1)", borderColor: "rgba(239, 68, 68, 0.2)", color: "rgba(252, 165, 165, 1)" }}>
          {error}
        </div>
      )}

      {/* 3. Success State (Grid Anime) */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {animeList.map((anime, idx) => (
            <a 
              key={`${anime.mal_id}-${idx}`}
              href={anime.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative overflow-hidden rounded-3xl border transition-all hover:-translate-y-1 block shadow-lg"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--card-border)")}
            >
              {/* Gambar Cover */}
              <div className="aspect-[3/4] overflow-hidden relative">
                <img 
                  src={anime.images.webp.image_url} 
                  alt={anime.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
              </div>

              {/* Info Overlay */}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                
                {/* Score Badge */}
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-yellow-400 font-bold px-2.5 py-1 rounded-lg text-xs border border-white/10 flex items-center gap-1 shadow-lg">
                   ⭐ {anime.score ? anime.score : "N/A"}
                </div>

                <h3 className="text-white font-extrabold text-xl leading-tight line-clamp-2 mb-2 group-hover:text-[color:var(--accent)] transition-colors drop-shadow-md">
                  {anime.title}
                </h3>
                
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {anime.genres.slice(0, 3).map((g, genreIdx) => (
                    <span key={genreIdx} className="text-[10px] font-bold px-2.5 py-1 rounded-full border shadow-sm" style={{ background: "var(--accent-subtle)", borderColor: "var(--accent)", color: "var(--accent-text)" }}>
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
      
      <div className="text-center mt-12 mb-8">
        <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
          Data powered by <a href="https://jikan.moe/" className="underline hover:text-[color:var(--accent)] transition-colors">Jikan API</a>
        </p>
      </div>

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

// Tipe Data Anime
type Anime = {
  mal_id: number;
  title: string;
  images: { webp: { image_url: string; large_image_url: string } };
  score: number;
  episodes: number;
  status: string;
  type: string;
  synopsis: string;
  year: number;
  genres: { name: string }[];
  url: string;
};

// Tipe Data Pagination
type PaginationData = {
  current_page: number;
  last_visible_page: number;
  has_next_page: boolean;
};

// Mapping Genre
const GENRES = [
  { id: "", name: "All Genres" },
  { id: "1", name: "Action" },
  { id: "2", name: "Adventure" },
  { id: "4", name: "Comedy" },
  { id: "8", name: "Drama" },
  { id: "10", name: "Fantasy" },
  { id: "26", name: "Girls Love (Yuri)" },
  { id: "14", name: "Horror" },
  { id: "7", name: "Mystery" },
  { id: "40", name: "Psychological" },
  { id: "22", name: "Romance" },
  { id: "24", name: "Sci-Fi" },
  { id: "42", name: "Seinen" },
  { id: "25", name: "Shoujo" },
  { id: "27", name: "Shounen" },
  { id: "36", name: "Slice of Life" },
  { id: "30", name: "Sports" },
  { id: "37", name: "Supernatural" },
  { id: "41", name: "Thriller" },
  { id: "62", name: "Isekai" },
];

export default function AnimeExplorer() {
  // --- STATE ---
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(false);
  
  // --- FILTER DEFAULTS ---
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");
  const [status, setStatus] = useState("airing"); 
  const [type, setType] = useState("");
  const [orderBy, setOrderBy] = useState("start_date");
  const [sort, setSort] = useState("desc");

  // Pagination State
  const [page, setPage] = useState(1);
  const [paginationInfo, setPaginationInfo] = useState<PaginationData>({
    current_page: 1,
    last_visible_page: 1,
    has_next_page: false,
  });
  
  const [jumpPage, setJumpPage] = useState("");

  // --- FETCHING FUNCTION ---
  const fetchAnime = async (targetPage: number) => {
    setLoading(true);
    if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const params = new URLSearchParams({
        q: query,
        page: targetPage.toString(),
        limit: "24", // Menampilkan 24 anime per page
        order_by: orderBy,
        sort: sort, 
        sfw: "true",
      });

      if (selectedGenre) params.append("genres", selectedGenre);
      if (status) params.append("status", status);
      if (type) params.append("type", type);

      const res = await fetch(`https://api.jikan.moe/v4/anime?${params.toString()}`);
      
      if (res.status === 429) {
        setTimeout(() => fetchAnime(targetPage), 1500); 
        return;
      }

      const data = await res.json();
      const rawData = data.data || [];

      // Filter Duplikat ID
      const uniqueData = rawData.filter((anime: Anime, index: number, self: Anime[]) =>
        index === self.findIndex((t) => (
          t.mal_id === anime.mal_id
        ))
      );

      setAnimes(uniqueData);
      
      if (data.pagination) {
        setPaginationInfo({
            current_page: data.pagination.current_page,
            last_visible_page: data.pagination.last_visible_page,
            has_next_page: data.pagination.has_next_page
        });
        setPage(data.pagination.current_page);
      }

    } catch (error) {
      console.error("Gagal mengambil data anime", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnime(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if(query) setStatus(""); 
    fetchAnime(1); 
  };

  const handleSortChange = (value: string) => {
    setOrderBy(value);
    if (value === "title") setSort("asc");
    else setSort("desc");
    setPage(1);
  };
  
  // Auto fetch saat filter ganti (Opsional, matikan jika ingin manual tombol cari)
  useEffect(() => {
     if (paginationInfo.last_visible_page > 1 || orderBy !== "start_date" || status !== "airing") {
         fetchAnime(1);
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderBy, status, type, selectedGenre]);


  const handleJumpPage = (e: React.FormEvent) => {
    e.preventDefault();
    const p = parseInt(jumpPage);
    if (p >= 1 && p <= paginationInfo.last_visible_page) {
        fetchAnime(p);
        setJumpPage("");
    } else {
        alert(`Masukkan halaman antara 1 - ${paginationInfo.last_visible_page}`);
    }
  };

  return (
    <div className="space-y-6 md:space-y-8">
      
      {/* --- FILTER SECTION --- */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 md:p-6 rounded-2xl shadow-xl">
        <form onSubmit={handleSearch} className="space-y-3 md:space-y-4">
          
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Cari Judul..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 md:py-3 text-white focus:outline-none focus:border-blue-500 placeholder:text-slate-600 text-sm md:text-base"
            />
            <button 
              type="submit"
              className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-4 md:px-6 py-2.5 md:py-3 rounded-xl transition-all shadow-lg shadow-blue-500/20 text-sm md:text-base"
            >
              🔍
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs md:text-sm rounded-lg p-2 md:p-2.5 focus:border-blue-500"
            >
              {GENRES.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs md:text-sm rounded-lg p-2 md:p-2.5 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="airing">Sedang Tayang</option>
              <option value="complete">Tamat</option>
              <option value="upcoming">Akan Datang</option>
            </select>

            <select 
              value={type} 
              onChange={(e) => setType(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs md:text-sm rounded-lg p-2 md:p-2.5 focus:border-blue-500"
            >
              <option value="">All Types</option>
              <option value="tv">TV Series</option>
              <option value="movie">Movie</option>
              <option value="ova">OVA</option>
            </select>

             <select 
              value={orderBy} 
              onChange={(e) => handleSortChange(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-xs md:text-sm rounded-lg p-2 md:p-2.5 focus:border-blue-500"
            >
              <option value="start_date">Newest Release</option>
              <option value="popularity">Most Popular</option>
              <option value="score">Top Score</option>
              <option value="favorites">Most Favorites</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </form>
      </div>

      {/* --- RESULTS SECTION --- */}
      {loading ? (
        <div className="text-center py-20 space-y-4">
          <div className="inline-block w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 animate-pulse">Mengambil data dari Server...</p>
        </div>
      ) : (
        <>
          {/* 👇 PERUBAHAN UTAMA DI SINI (Grid 2 Kolom di Mobile) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
            {animes.length > 0 ? (
              animes.map((anime) => (
                <a 
                  key={anime.mal_id} 
                  href={anime.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative bg-slate-900 rounded-lg md:rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500 transition-all hover:-translate-y-1 shadow-lg flex flex-col"
                >
                  <div className="aspect-[3/4] overflow-hidden relative">
                    <img 
                      src={anime.images.webp.large_image_url || anime.images.webp.image_url} 
                      alt={anime.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-1.5 left-1.5 md:top-2 md:left-2 flex gap-1">
                      <span className="bg-black/70 backdrop-blur text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded border border-white/10 uppercase font-bold">
                        {anime.type || "TV"}
                      </span>
                      {anime.episodes && (
                        <span className="bg-blue-600/80 backdrop-blur text-white text-[9px] md:text-[10px] px-1.5 py-0.5 rounded border border-blue-400/30 font-bold hidden sm:block">
                          {anime.episodes} Ep
                        </span>
                      )}
                    </div>
                    {/* Score Badge Mobile Friendly */}
                    <div className="absolute bottom-0 right-0 bg-slate-900/90 px-2 py-0.5 rounded-tl-lg text-yellow-400 font-bold text-xs md:hidden flex items-center gap-1">
                         ⭐ {anime.score || "?"}
                    </div>
                  </div>

                  <div className="p-3 md:p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Desktop Only Score Info */}
                      <div className="hidden md:flex justify-between items-start mb-2">
                        <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">
                          {anime.status === "Currently Airing" ? "🟢 Airing" : anime.year || "Finished"}
                        </span>
                        <div className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                          ⭐ {anime.score || "N/A"}
                        </div>
                      </div>

                      <h3 className="text-white font-bold leading-tight line-clamp-2 mb-2 text-sm md:text-base group-hover:text-blue-400 transition-colors">
                        {anime.title}
                      </h3>
                    </div>

                    <div className="flex flex-wrap gap-1 mt-1">
                      {anime.genres.slice(0, 2).map((g, i) => (
                        <span key={i} className="text-[9px] md:text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700/50">
                          {g.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </a>
              ))
            ) : (
              <div className="col-span-full text-center py-10 text-slate-500">
                Tidak ada anime yang ditemukan. Coba reset filter, Senpai! 
              </div>
            )}
          </div>

          {/* --- PAGINATION --- */}
          {animes.length > 0 && (
             <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-6 md:pt-8 border-t border-slate-800">
               
               <div className="flex items-center gap-2">
                 <button 
                   onClick={() => fetchAnime(page - 1)}
                   disabled={page === 1}
                   className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xs md:text-sm"
                 >
                   ⬅ Prev
                 </button>
                 
                 <span className="text-slate-300 text-xs md:text-sm font-bold bg-slate-900 px-3 py-1.5 md:px-4 md:py-2 rounded-lg border border-slate-700">
                    Page {page} <span className="text-slate-600 font-normal">of {paginationInfo.last_visible_page}</span>
                 </span>

                 <button 
                   onClick={() => fetchAnime(page + 1)}
                   disabled={!paginationInfo.has_next_page}
                   className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-800 rounded-lg hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-xs md:text-sm"
                 >
                   Next ➡
                 </button>
               </div>

               <form onSubmit={handleJumpPage} className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 hidden md:block">Jump:</span>
                  <input 
                    type="number" 
                    min="1" 
                    max={paginationInfo.last_visible_page}
                    placeholder="#"
                    value={jumpPage}
                    onChange={(e) => setJumpPage(e.target.value)}
                    className="w-12 md:w-16 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 md:py-2 text-center text-white text-xs md:text-sm focus:border-blue-500 outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-1.5 md:py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white rounded-lg text-xs md:text-sm font-bold transition-colors"
                  >
                    Go
                  </button>
               </form>

             </div>
          )}
        </>
      )}

    </div>
  );
}
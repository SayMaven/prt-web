"use client";

import { useState, useCallback, useRef } from "react";
import { Upload, Search, X, Play, Clock, AlertCircle, Film, Link, Info, BookOpen, Calendar, Volume2, VolumeX } from "lucide-react";

// Tipe Data Hasil Akhir
type AnimeResult = {
  anilist: {
    id: number;
    title: {
      native: string;
      romaji: string;
      english: string;
    };
    synonyms: string[];
    isAdult: boolean;
    description?: string; 
    coverImage?: {        
        large: string;
        color: string;
    };
    genres?: string[];
    studios?: {
        nodes: { name: string }[];
    };
    siteUrl?: string;
    seasonYear?: number;
    startDate?: { year: number };
    episodes?: number;
    format?: string;
  };
  filename: string;
  episode: number | string | null;
  from: number;
  to: number;
  similarity: number;
  video: string;
  image: string;
};

// --- SUB-COMPONENT: VIDEO PREVIEW ---
// Dipisah agar setiap video punya state mute/ref sendiri
const VideoPreview = ({ url, similarityColor, similarityPercent }: { url: string, similarityColor: string, similarityPercent: string }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isMuted, setIsMuted] = useState(true);

    const toggleMute = () => {
        if (videoRef.current) {
            // Toggle properti muted pada elemen video asli
            videoRef.current.muted = !videoRef.current.muted;
            // Update state icon
            setIsMuted(videoRef.current.muted);
        }
    };

    return (
        <div className="w-full lg:w-1/3 aspect-video bg-black relative shrink-0 group">
            <video 
                ref={videoRef}
                src={url} 
                autoPlay    // Otomatis putar
                loop        // Otomatis ulang
                muted       // Wajib mute diawal agar autoplay jalan di browser
                playsInline // Agar tidak fullscreen otomatis di mobile
                className="w-full h-full object-contain"
            />
            
            {/* Badge Similarity */}
            <div className={`absolute top-2 left-2 bg-black/80 ${similarityColor} text-xs font-mono px-2 py-1 rounded border shadow-lg z-10 pointer-events-none`}>
                {similarityPercent}% Match
            </div>

            {/* Custom Volume Button */}
            <button 
                onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                }}
                className="absolute bottom-3 right-3 bg-black/60 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-sm transition-all border border-white/10 z-20 shadow-lg"
                title={isMuted ? "Unmute" : "Mute"}
            >
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
        </div>
    );
};

export default function AnimeSearch() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  };

  const resetAll = () => {
    setImageFile(null);
    setImageUrl("");
    setPreviewUrl(null);
    setResults([]);
    setError("");
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Harap upload file gambar (JPG/PNG/WEBP).");
      return;
    }
    setImageFile(file);
    setImageUrl(""); 
    setPreviewUrl(URL.createObjectURL(file));
    setResults([]); 
    setError("");
  };

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    if (url) {
      setImageFile(null);
      setPreviewUrl(url); 
      setResults([]);
      setError("");
    } else {
      setPreviewUrl(null);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const fetchAnilistMetadata = async (ids: number[]) => {
    const query = `
    query ($ids: [Int]) {
      Page {
        media(id_in: $ids, type: ANIME) {
          id
          description
          seasonYear
          startDate {
            year
          }
          episodes
          format
          coverImage {
            large
            color
          }
          genres
          studios(isMain: true) {
            nodes {
              name
            }
          }
          siteUrl
        }
      }
    }
    `;

    try {
        const response = await fetch("https://graphql.anilist.co", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify({
                query,
                variables: { ids },
            }),
        });
        const data = await response.json();
        
        if (data && data.data && data.data.Page && data.data.Page.media) {
            return data.data.Page.media;
        } else {
            console.warn("AniList API returned unexpected structure or errors:", data);
            return [];
        }
    } catch (e) {
        console.error("Gagal fetch deskripsi AniList", e);
        return [];
    }
  };

  const handleSearch = async () => {
    if (!imageFile && !imageUrl) {
        setError("Harap upload gambar atau masukkan URL gambar.");
        return;
    }

    setLoading(true);
    setError("");
    setResults([]);

    try {
      let response;

      if (imageFile) {
        const formData = new FormData();
        formData.append("image", imageFile);
        response = await fetch("https://api.trace.moe/search?cutBorders&anilistInfo", {
          method: "POST",
          body: formData,
        });
      } else if (imageUrl) {
        const encodedUrl = encodeURIComponent(imageUrl);
        response = await fetch(`https://api.trace.moe/search?cutBorders&anilistInfo&url=${encodedUrl}`);
      }

      if (!response || !response.ok) {
         if (response?.status === 400) throw new Error("Format gambar tidak didukung atau URL tidak bisa diakses.");
         if (response?.status === 429) throw new Error("Terlalu banyak request (Limit). Tunggu sebentar.");
         throw new Error("Gagal mengambil data dari server.");
      }

      const data = await response.json();
      if (data.error) throw new Error(data.error);

      const sortedResults = data.result.sort((a: AnimeResult, b: AnimeResult) => b.similarity - a.similarity);
      const topResults = sortedResults.slice(0, 5);

      if (topResults.length === 0) {
        setError("API tidak mengembalikan hasil apapun. Coba gambar lain.");
        return;
      }

      const animeIds = Array.from(new Set(topResults.map((r: AnimeResult) => r.anilist.id))) as number[];
      const metadata = await fetchAnilistMetadata(animeIds);

      const finalResults = topResults.map((result: AnimeResult) => {
         const meta = metadata ? metadata.find((m: any) => m.id === result.anilist.id) : null;
         
         return {
             ...result,
             anilist: {
                 ...result.anilist,
                 description: meta ? stripHtml(meta.description) : "Tidak ada deskripsi.",
                 coverImage: meta ? meta.coverImage : null,
                 genres: meta ? meta.genres : [],
                 studios: meta ? meta.studios : { nodes: [] },
                 siteUrl: meta ? meta.siteUrl : `https://anilist.co/anime/${result.anilist.id}`,
                 seasonYear: meta ? meta.seasonYear : null,
                 startDate: meta ? meta.startDate : null,
                 episodes: meta ? meta.episodes : null,
                 format: meta ? meta.format : "TV"
             }
         };
      });

      setResults(finalResults);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan koneksi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
      
      {/* HEADER */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-white flex items-center justify-center gap-2">
           Maven Anime Vision
        </h1>
        <p className="text-slate-400">
          Cari judul, episode, dan informasi lengkap anime dari screenshot adegan.
        </p>
      </div>

      {/* INPUT AREA */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
        {!previewUrl ? (
          <div className="space-y-6">
             {/* INPUT URL */}
             <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="text-slate-500 group-focus-within:text-blue-400" size={18} />
                </div>
                <input 
                    type="text" 
                    placeholder="Tempel link gambar (https://...) disini..." 
                    value={imageUrl}
                    onChange={handleUrlChange}
                    className="w-full bg-slate-900/50 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
             </div>
             <div className="relative flex items-center justify-center">
                <hr className="w-full border-slate-700" />
                <span className="absolute bg-[#0f172a] px-3 text-xs text-slate-500 font-bold uppercase tracking-widest">ATAU</span>
             </div>
             {/* DROP ZONE */}
             <div 
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 bg-slate-900/30 group cursor-pointer relative overflow-hidden
                ${isDragging 
                    ? "border-yellow-400 bg-yellow-400/10 scale-[1.02]" 
                    : "border-slate-700 hover:border-blue-500"
                }
                `}
             >
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden" 
                    id="anime-upload"
                />
                <label htmlFor="anime-upload" className="cursor-pointer flex flex-col items-center gap-4 w-full h-full relative z-10">
                    <div className="bg-slate-800 p-4 rounded-full text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-900/30 transition-all">
                        <Upload size={32} />
                    </div>
                    <div>
                        <span className="text-white font-bold text-lg block">Upload Screenshot</span>
                        <span className="text-sm text-slate-500">Klik atau Drag & Drop gambar</span>
                    </div>
                </label>
             </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="relative group w-full md:w-1/2 aspect-video bg-black rounded-lg overflow-hidden border border-slate-700">
               <img 
                 src={previewUrl} 
                 alt="Preview" 
                 className="w-full h-full object-contain"
                 onError={() => setError("Gagal memuat gambar dari URL.")}
               />
               <button 
                 onClick={resetAll}
                 className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full backdrop-blur-sm transition-all shadow-lg"
               >
                 <X size={20} />
               </button>
            </div>
            <div className="w-full md:w-1/2 flex flex-col gap-4">
               <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
                 <h3 className="text-slate-300 font-bold mb-1 flex items-center gap-2">
                    <Info size={16} className="text-blue-400"/> Tips Akurasi
                 </h3>
                 <p className="text-xs text-slate-500 leading-relaxed">
                   Gunakan screenshot <strong>full-frame (16:9)</strong> tanpa crop. 
                   Hasil akan lebih akurat jika gambar tidak mengandung subtitle tebal atau watermark.
                 </p>
               </div>
               <button
                onClick={handleSearch}
                disabled={loading}
                className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
               >
                 {loading ? (
                   <>
                     <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                     Menganalisis...
                   </>
                 ) : (
                   <>
                     <Search size={20} />
                     Cari Anime Ini
                   </>
                 )}
               </button>
            </div>
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-center gap-3 animate-fade-in">
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {/* HASIL PENCARIAN */}
      {results.length > 0 && (
        <div className="space-y-6 animate-fade-in-up">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Film className="text-blue-400" /> Hasil Pencarian ({results.length})
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {results.map((item, idx) => {
              const similarityPercent = (item.similarity * 100);
              let similarityColor = "text-green-400 border-green-500/30";
              if (similarityPercent < 85) similarityColor = "text-yellow-400 border-yellow-500/30";
              if (similarityPercent < 70) similarityColor = "text-red-400 border-red-500/30";

              return (
                <div key={idx} className="bg-slate-900/60 border border-slate-700 rounded-xl overflow-hidden flex flex-col lg:flex-row hover:border-blue-500/50 transition-all shadow-xl group">
                  
                  {/* COMPONENT VIDEO PLAYER CUSTOM (Di Kiri) */}
                  <VideoPreview 
                    url={item.video} 
                    similarityColor={similarityColor} 
                    similarityPercent={similarityPercent.toFixed(1)} 
                  />

                  {/* KOLOM 2: INFO DETAIL & COVER (Di Kanan) */}
                  <div className="p-5 flex-1 flex flex-col md:flex-row gap-6">
                     <div className="flex-1 min-w-0">
                        {/* Judul */}
                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors leading-tight">
                           {item.anilist.title.romaji || item.filename}
                        </h3>

                        {/* Detail List */}
                        <div className="text-xs space-y-2 mb-4">
                            {(item.anilist.title.native || item.anilist.title.english) && (
                                <p className="text-slate-400">
                                    {item.anilist.title.english || item.anilist.title.native}
                                </p>
                            )}

                            {item.anilist.synonyms && item.anilist.synonyms.length > 0 && (
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                    <span className="font-semibold text-slate-500">Alias</span>
                                    <span className="text-slate-300 truncate" title={item.anilist.synonyms.join(", ")}>
                                        {item.anilist.synonyms.slice(0, 3).join(", ")}
                                    </span>
                                </div>
                            )}

                            {/* Format & Total Episode */}
                            <div className="grid grid-cols-[60px_1fr] gap-2">
                                <span className="font-semibold text-slate-500">Format</span>
                                <span className="text-slate-300">
                                    {item.anilist.format || "TV"} • {item.anilist.episodes || "?"} Eps
                                </span>
                            </div>

                            {/* Genre */}
                            {item.anilist.genres && item.anilist.genres.length > 0 && (
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                    <span className="font-semibold text-slate-500">Genre</span>
                                    <span className="text-blue-300">
                                        {item.anilist.genres.slice(0, 4).join(", ")}
                                    </span>
                                </div>
                            )}

                            {/* Studio */}
                            {item.anilist.studios && item.anilist.studios.nodes.length > 0 && (
                                <div className="grid grid-cols-[60px_1fr] gap-2">
                                    <span className="font-semibold text-slate-500">Studio</span>
                                    <span className="text-emerald-300">
                                        {item.anilist.studios.nodes[0].name}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Badges Metadata */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {/* Tahun (Dengan Backup StartDate) */}
                            {(item.anilist.seasonYear || item.anilist.startDate?.year) && (
                                <span className="bg-slate-700/50 text-orange-300 text-[10px] font-bold px-2 py-1 rounded border border-orange-500/30 flex items-center gap-1">
                                    <Calendar size={10} />
                                    {item.anilist.seasonYear || item.anilist.startDate?.year}
                                </span>
                            )}

                            {/* Episode Ditemukan */}
                            <span className="bg-blue-600/20 text-blue-300 text-[10px] font-bold px-2 py-1 rounded border border-blue-500/30 flex items-center gap-1">
                                <Play size={10} fill="currentColor" />
                                EP {item.episode}
                            </span>
                            
                            {/* Timestamp */}
                            <span className="bg-slate-700/50 text-slate-300 text-[10px] font-bold px-2 py-1 rounded border border-slate-600 flex items-center gap-1">
                                <Clock size={10} />
                                {formatTime(item.from)} - {formatTime(item.to)}
                            </span>
                            
                            {item.anilist.isAdult && (
                                <span className="bg-red-600/20 text-red-300 text-[10px] font-bold px-2 py-1 rounded border border-red-500/30">
                                    R-18
                                </span>
                            )}
                        </div>

                        {/* Sinopsis */}
                        {item.anilist.description && (
                             <div className="bg-slate-800/40 p-3 rounded-lg border border-slate-700/50">
                                <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                                    <BookOpen size={10}/> Sinopsis
                                </h4>
                                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                                    {item.anilist.description}
                                </p>
                             </div>
                        )}
                        
                        {/* External Link Mobile */}
                        <div className="mt-4 md:hidden">
                            <a 
                                href={item.anilist.siteUrl || `https://anilist.co/anime/${item.anilist.id}`}
                                target="_blank" 
                                rel="noreferrer"
                                className="block text-center w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded transition-colors"
                            >
                                Lihat di AniList ↗
                            </a>
                        </div>
                     </div>

                     {/* Cover Image (Kanan) */}
                     {item.anilist.coverImage && (
                        <div className="hidden md:flex flex-col gap-2 w-[120px] shrink-0">
                            <img 
                                src={item.anilist.coverImage.large} 
                                alt="Cover" 
                                className="w-full aspect-[2/3] object-cover rounded-lg shadow-lg border border-slate-600/50"
                            />
                            <a 
                                href={item.anilist.siteUrl || `https://anilist.co/anime/${item.anilist.id}`}
                                target="_blank" 
                                rel="noreferrer"
                                className="text-center w-full py-1.5 bg-slate-700 hover:bg-blue-600 text-white text-[10px] font-bold rounded transition-colors border border-slate-600"
                            >
                                AniList ↗
                            </a>
                        </div>
                     )}

                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}
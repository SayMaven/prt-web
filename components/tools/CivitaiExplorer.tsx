"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Filter, Download, Copy, Check, AlertTriangle, Eye, EyeOff, Star, Heart, Layers, Box, Loader2, ThumbsUp } from "lucide-react";

// --- TIPE DATA ---
type CivitaiImage = {
  url: string;
  nsfw: string | boolean;
  width: number;
  height: number;
};

type ModelVersion = {
  id: number;
  name: string;
  baseModel: string;
  trainedWords: string[];
  images: CivitaiImage[];
  downloadUrl: string;
};

type CivitaiModel = {
  id: number;
  name: string;
  type: string;
  nsfw: boolean;
  stats: {
    downloadCount: number;
    favoriteCount: number;
    thumbsUpCount: number; // PERBAIKAN: Field ini seringkali berisi jumlah "Like"
    rating: number;
  };
  creator: {
    username: string;
    image: string;
  };
  modelVersions: ModelVersion[];
};

export default function CivitaiExplorer() {
  const [query, setQuery] = useState("");
  const [models, setModels] = useState<CivitaiModel[]>([]);
  
  // Loading state
  const [initialLoading, setInitialLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Pagination State
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Filter States
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBaseModel, setSelectedBaseModel] = useState("All");
  const [sort, setSort] = useState("Relevancy");
  const [nsfw, setNsfw] = useState(false);
  
  const [copiedWord, setCopiedWord] = useState<string | null>(null);

  // Ref untuk Infinite Scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  // --- FUNGSI FETCH UTAMA ---
  const fetchModels = async (cursor: string | null = null, isNewSearch: boolean = false) => {
    if (isNewSearch) {
        setInitialLoading(true);
    } else {
        if (loadingMore) return;
        setLoadingMore(true);
    }

    try {
      const params = new URLSearchParams({
        limit: "12",
        nsfw: nsfw ? "true" : "false",
        query: query
      });

      if (cursor) params.append("cursor", cursor);

      // --- FILTER LOGIC ---
      if (selectedType !== "All") params.append("types", selectedType);
      
      if (selectedBaseModel !== "All") {
        params.append("baseModels", selectedBaseModel);
      }
      
      if (sort !== "Relevancy") params.append("sort", sort);

      const res = await fetch(`https://civitai.com/api/v1/models?${params.toString()}`);
      
      if (!res.ok) {
        const errorText = await res.text(); 
        console.error("API Error Response:", errorText);
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
      }
      
      const data = await res.json();
      
      // Client-side safety filter
      let newItems = data.items || [];
      if (!nsfw) {
        newItems = newItems.filter((m: CivitaiModel) => !m.nsfw);
      }
      
      if (isNewSearch) {
        setModels(newItems);
      } else {
        // --- PERBAIKAN DUPLIKAT KEY ---
        setModels((prev) => {
            const existingIds = new Set(prev.map((m) => m.id));
            const uniqueNewItems = newItems.filter((m: CivitaiModel) => !existingIds.has(m.id));
            return [...prev, ...uniqueNewItems];
        });
      }

      if (data.metadata && data.metadata.nextCursor) {
        setNextCursor(data.metadata.nextCursor);
        setHasMore(true);
      } else {
        setNextCursor(null);
        setHasMore(false);
      }

    } catch (error) {
      console.error("Gagal ambil data CivitAI", error);
    } finally {
      setInitialLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setModels([]);      
      setHasMore(true);   
      setNextCursor(null); 
      fetchModels(null, true); 
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [selectedType, selectedBaseModel, sort, nsfw, query]); 

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && nextCursor && !loadingMore && !initialLoading) {
          fetchModels(nextCursor, false);
        }
      },
      { threshold: 0, rootMargin: "500px" } 
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) observer.observe(currentTarget);

    return () => {
      if (currentTarget) observer.unobserve(currentTarget);
    };
  }, [nextCursor, loadingMore, initialLoading]);

  const copyTrigger = (word: string) => {
    navigator.clipboard.writeText(word);
    setCopiedWord(word);
    setTimeout(() => setCopiedWord(null), 2000);
  };

  // Helper untuk format angka (1200 -> 1.2k)
  const formatNumber = (num: number) => {
    if (!num) return "0";
    return num > 1000 ? (num/1000).toFixed(1) + 'k' : num.toString();
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-8 min-h-screen">
      

      {/* CONTROLS BAR */}
      <div className="bg-slate-900/50 border border-slate-700 p-4 rounded-2xl sticky top-4 z-30 backdrop-blur-md shadow-xl flex flex-col xl:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full xl:w-1/3 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors" size={18} />
            <input 
                type="text" 
                placeholder="Cari model (misal: Genshin, Mecha)..." 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
            />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center justify-center w-full xl:w-auto">
            
            <div className="relative">
                <select 
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="appearance-none bg-slate-800 text-white text-xs font-bold py-2.5 pl-3 pr-8 rounded-lg border border-slate-600 outline-none cursor-pointer hover:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="All">All Types</option>
                    <option value="Checkpoint">Checkpoint</option>
                    <option value="LORA">LoRA</option>
                    <option value="LoCon">Lycoris</option> 
                    <option value="TextualInversion">Embedding</option>
                    <option value="VAE">VAE</option>
                </select>
                <Layers size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>

            <div className="relative">
                <select 
                    value={selectedBaseModel}
                    onChange={(e) => setSelectedBaseModel(e.target.value)}
                    className="appearance-none bg-slate-800 text-white text-xs font-bold py-2.5 pl-3 pr-8 rounded-lg border border-slate-600 outline-none cursor-pointer hover:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="All">All Base Models</option>
                    <option value="SD 1.5">SD 1.5</option>
                    <option value="SDXL 1.0">SDXL 1.0</option>
                    <option value="Pony">Pony</option>
                    <option value="NoobAI">Noob AI</option>
                    <option value="Illustrious">Illustrious</option>
                    <option value="SD 2.1">SD 2.1</option>
                </select>
                <Box size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>

            <div className="relative">
                <select 
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none bg-slate-800 text-white text-xs font-bold py-2.5 pl-3 pr-8 rounded-lg border border-slate-600 outline-none cursor-pointer hover:border-blue-500 transition-all focus:ring-2 focus:ring-blue-500/20"
                >
                    <option value="Relevancy">Relevancy</option>
                    <option value="Highest Rated">Highest Rated</option>
                    <option value="Most Downloaded">Most Downloaded</option>
                    <option value="Newest">Newest</option>
                </select>
                <Filter size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"/>
            </div>

            <button
                onClick={() => setNsfw(!nsfw)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold border transition-all
                    ${nsfw 
                        ? "bg-red-500/10 text-red-400 border-red-500/50 hover:bg-red-500/20" 
                        : "bg-emerald-500/10 text-emerald-400 border-emerald-500/50 hover:bg-emerald-500/20"
                    }
                `}
            >
                {nsfw ? <EyeOff size={14}/> : <Eye size={14}/>}
                {nsfw ? "NSFW" : "SAFE"}
            </button>
        </div>
      </div>

      {/* GRID HASIL */}
      {initialLoading ? (
          <div className="text-center py-32 animate-pulse">
              <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
              <p className="text-slate-400 font-medium">Sedang memuat model...</p>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {models.map((model) => {
                  const latestVersion = model.modelVersions[0];
                  if (!latestVersion) return null; 

                  const previewImage = latestVersion.images[0]?.url;
                  const triggerWords = latestVersion.trainedWords || [];
                  
                  // --- PERBAIKAN STATS ---
                  const rating = model.stats?.rating ?? 0; // Menggunakan nullish coalescing
                  
                  // Prioritaskan thumbsUpCount (Like) karena lebih relevan untuk "Love" daripada favoriteCount (Bookmark)
                  // Jika thumbsUpCount 0, kita coba tampilkan favoriteCount
                  const loveCount = (model.stats?.thumbsUpCount || 0) + (model.stats?.favoriteCount || 0);
                  
                  const downloadCount = model.stats?.downloadCount || 0;

                  let baseModelClean = latestVersion.baseModel || "Unknown";
                  baseModelClean = baseModelClean
                    .replace(" 1.5", "1")
                    .replace("XL 1.0", "XL")
                    .replace(".0", "")
                    .replace("NoobAI", "Noob");

                  return (
                      <div key={model.id} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden group hover:border-blue-500/50 transition-all hover:shadow-2xl hover:shadow-blue-900/10 flex flex-col h-full relative">
                          
                          {/* Image Preview */}
                          <div className="relative aspect-[2/3] bg-black overflow-hidden">
                              {previewImage ? (
                                  <img 
                                      src={previewImage} 
                                      alt={model.name} 
                                      loading="lazy"
                                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                                  />
                              ) : (
                                  <div className="flex items-center justify-center h-full text-slate-600 bg-slate-950 flex-col gap-2">
                                      <AlertTriangle size={24} />
                                      <span className="text-xs">No Preview</span>
                                  </div>
                              )}
                              
                              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 text-[10px] font-bold text-white border border-white/10 shadow-sm flex items-center gap-2 z-10 max-w-[90%] overflow-hidden">
                                  <span className="uppercase whitespace-nowrap tracking-wide">
                                    {model.type === 'TextualInversion' ? 'Embed' : model.type === 'LoCon' ? 'Lycoris' : model.type}
                                  </span>
                                  <span className="bg-white/30 w-px h-3 block shrink-0"></span>
                                  <span className="uppercase whitespace-nowrap text-slate-200">
                                      {baseModelClean}
                                  </span>
                              </div>
                              
                              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black via-black/80 to-transparent pt-12 flex justify-between items-end opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="flex gap-3 text-xs font-bold text-white">
                                      {/* LOVE / LIKE */}
                                      <span className="flex items-center gap-1" title={`Likes: ${model.stats?.thumbsUpCount || 0}, Favs: ${model.stats?.favoriteCount || 0}`}>
                                          <Heart size={12} className="text-red-400 fill-red-400"/> 
                                          {formatNumber(loveCount)}
                                      </span>
                                      
                                      {/* RATING */}
                                      <span className="flex items-center gap-1">
                                          <Star size={12} className="text-yellow-400 fill-yellow-400"/> 
                                          {rating.toFixed(1)}
                                      </span>
                                  </div>
                                  <span className="text-[10px] text-slate-300 bg-black/50 px-1.5 py-0.5 rounded border border-white/10">
                                      {formatNumber(downloadCount)} DL
                                  </span>
                              </div>
                          </div>

                          {/* Content Body */}
                          <div className="p-4 flex-1 flex flex-col gap-3">
                              <div className="flex items-start justify-between gap-2">
                                  <h3 className="font-bold text-white leading-snug line-clamp-2 text-sm hover:text-blue-400 transition-colors cursor-default" title={model.name}>
                                      {model.name}
                                  </h3>
                                  {model.nsfw && (
                                      <span className="shrink-0 border border-red-500/30 bg-red-500/10 text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">18+</span>
                                  )}
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
                                  {model.creator?.image ? (
                                      <img src={model.creator.image} className="w-5 h-5 rounded-full border border-slate-700" alt="" />
                                  ) : (
                                      <div className="w-5 h-5 rounded-full bg-slate-700 flex items-center justify-center text-[8px] font-bold">?</div>
                                  )}
                                  <span className="truncate hover:text-white transition-colors">{model.creator?.username || "Unknown"}</span>
                              </div>

                              {triggerWords.length > 0 ? (
                                  <div className="mt-auto bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 hover:border-blue-500/30 transition-colors group/trigger">
                                      <div className="flex justify-between items-center mb-1">
                                          <p className="text-[10px] text-slate-500 uppercase font-bold flex items-center gap-1">
                                              <Copy size={10}/> Trigger Word
                                          </p>
                                      </div>
                                      <div 
                                          onClick={() => copyTrigger(triggerWords[0])}
                                          className="flex items-center justify-between gap-2 cursor-pointer"
                                      >
                                          <code className="text-xs text-blue-300 font-mono truncate select-none">
                                              {triggerWords[0]}
                                          </code>
                                          {copiedWord === triggerWords[0] ? (
                                              <Check size={14} className="text-green-400 shrink-0" />
                                          ) : (
                                              <Copy size={14} className="text-slate-600 group-hover/trigger:text-white shrink-0 transition-colors" />
                                          )}
                                      </div>
                                  </div>
                              ) : (
                                  <div className="mt-auto p-3 text-[10px] text-slate-600 text-center italic bg-slate-950/30 rounded-lg border border-slate-800/50">
                                      No Trigger Word Required
                                  </div>
                              )}

                              <a 
                                  href={latestVersion.downloadUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="flex items-center justify-center gap-2 w-full bg-slate-800 hover:bg-blue-600 text-white text-xs font-bold py-2.5 rounded-lg transition-all border border-slate-700 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]"
                              >
                                  <Download size={14} /> 
                                  Download
                              </a>
                          </div>

                      </div>
                  );
              })}
          </div>
      )}
      
      {/* INFINITE SCROLL TRIGGER (LOADER BAWAH) */}
      <div ref={observerTarget} className="py-8 flex justify-center items-center h-20 w-full">
          {loadingMore && (
             <div className="flex items-center gap-2 text-slate-500">
                <Loader2 className="animate-spin text-blue-500" size={24} />
                <span className="text-xs font-bold">Memuat model lainnya...</span>
             </div>
          )}
          {!hasMore && !initialLoading && models.length > 0 && (
             <span className="text-slate-600 text-xs italic opacity-50">~ End of Results ~</span>
          )}
      </div>

      {/* Empty State */}
      {!initialLoading && !loadingMore && models.length === 0 && (
        <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
            <AlertTriangle className="mx-auto text-slate-500 mb-4 opacity-50" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Tidak ada model ditemukan</h3>
            <p className="text-slate-400 max-w-md mx-auto">
                Coba ubah filter atau gunakan kata kunci lain.
            </p>
        </div>
      )}

    </div>
  );
}
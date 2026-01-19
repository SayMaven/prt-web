"use client";

import { tools } from "@/lib/data"; 
import Link from "next/link";
import { useState, useMemo } from "react";

const CATEGORIES = ["All", "Anime", "Dev", "Design", "Productivity", "Utility"];

// Fungsi untuk memberi warna unik tiap kategori
const getCategoryColor = (category: string) => {
  switch (category) {
    case "Anime": return "bg-pink-500/10 text-pink-400 border-pink-500/20";
    case "Dev": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "Design": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
    case "Productivity": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "Utility": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "Media": return "bg-red-500/10 text-red-400 border-red-500/20"; 
    default: return "bg-slate-800 text-slate-400 border-slate-700";
  }
};

export default function ToolsGrid() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8); 

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const toolCat = tool.category || "Utility"; 
      const matchesSearch = 
        tool.title.toLowerCase().includes(query.toLowerCase()) ||
        tool.description.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = 
        activeCategory === "All" || toolCat === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [query, activeCategory]);

  const visibleTools = filteredTools.slice(0, visibleCount);
  const showMore = () => setVisibleCount((prev) => prev + 8);

  return (
    <div className="space-y-8">
      
      {/* --- FILTER BAR --- */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setVisibleCount(8); }}
              className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all border ${
                activeCategory === cat
                  ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/25"
                  : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64 flex-shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">🔍</span>
          <input
            type="text"
            placeholder="Cari tools..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block pl-10 p-2.5 shadow-lg placeholder:text-slate-600 transition-all"
          />
        </div>
      </div>

      {/* --- GRID TOOLS --- */}
      {visibleTools.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-in fade-in zoom-in duration-500">
          {visibleTools.map((tool) => (
            <Link
              href={tool.link}
              key={tool.id}
              className={`group relative block p-5 rounded-3xl border transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10 flex flex-col h-full overflow-hidden ${
                tool.image ? "border-slate-700 hover:border-blue-400" : "bg-slate-900 border-slate-800 hover:border-blue-500/50 hover:bg-slate-800/50"
              }`}
            >
              {/* Background Image Logic */}
              {tool.image && (
                <>
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    style={{ backgroundImage: `url('${tool.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/30" />
                </>
              )}

              <div className="relative z-10 flex flex-col h-full">
                
                <div className="flex items-start justify-between mb-3">
                  <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                    {tool.icon}
                  </span>
                  
                  {/* Status Badge (Pojok Kanan Atas) */}
                  {tool.status && tool.status !== "Ready" && (
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full border shadow-sm backdrop-blur-sm ${
                        tool.status === "New" ? "bg-green-500/20 text-green-400 border-green-500/30" :
                        tool.status === "Hot" ? "bg-orange-500/20 text-orange-400 border-orange-500/30" :
                        "bg-purple-500/20 text-purple-400 border-purple-500/30"
                    }`}>
                        {tool.status === "Ultimate" ? "PRO" : tool.status.toUpperCase()}
                    </span>
                  )}
                </div>
                
                <h2 className={`text-base font-bold mb-1 line-clamp-1 transition-colors ${tool.image ? "text-white group-hover:text-blue-300 drop-shadow-md" : "text-white group-hover:text-blue-400"}`}>
                  {tool.title}
                </h2>
                
                {/* Category Badge (Pindah ke bawah judul, bentuk Pill) */}
                <div className="mb-3">
                   <span className={`text-[10px] font-medium px-2.5 py-0.5 rounded-full border ${
                     tool.image 
                       ? "bg-white/10 text-white/90 border-white/20 backdrop-blur-md" 
                       : getCategoryColor(tool.category)
                   }`}>
                      {tool.category || "App"}
                   </span>
                </div>

                <p className={`text-xs text-slate-400 line-clamp-2 mt-auto ${tool.image ? "text-slate-300" : ""}`}>
                  {tool.description}
                </p>

              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/30">
          <p className="text-slate-500">Tidak ada tool ditemukan.</p>
          <button onClick={() => {setQuery(""); setActiveCategory("All")}} className="mt-2 text-blue-400 hover:text-blue-300 underline text-sm">Reset Filter</button>
        </div>
      )}

      {visibleCount < filteredTools.length && (
        <div className="flex justify-center pt-4">
          <button onClick={showMore} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-full transition-all shadow-lg active:scale-95 text-sm border border-slate-700">
            Load More ({filteredTools.length - visibleCount}) ↓
          </button>
        </div>
      )}

    </div>
  );
}
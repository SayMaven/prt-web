"use client";

import { tools } from "@/lib/data"; // Pastikan import data tools kamu benar
import Link from "next/link";
import { useState } from "react";

export default function ToolsGrid() {
  const [query, setQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(8); // Tampilkan 8 dulu di awal

  // 1. Filter tools berdasarkan pencarian
  const filteredTools = tools.filter((tool) =>
    tool.title.toLowerCase().includes(query.toLowerCase()) ||
    tool.description.toLowerCase().includes(query.toLowerCase())
  );

  // 2. Potong array sesuai jumlah yang ingin ditampilkan (Pagination)
  const visibleTools = filteredTools.slice(0, visibleCount);

  // Fungsi Load More
  const showMore = () => {
    setVisibleCount((prev) => prev + 8); // Tambah 8 lagi
  };

  return (
    <div className="space-y-8">
      
      {/* --- SEARCH BAR --- */}
      <div className="relative max-w-lg">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <span className="text-slate-500">🔍</span>
        </div>
        <input
          type="text"
          placeholder="Cari tools..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-white text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block pl-10 p-3 shadow-lg placeholder:text-slate-600 transition-all"
        />
      </div>

      {/* --- GRID TOOLS --- */}
      {visibleTools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {visibleTools.map((tool) => (
            <Link
              href={tool.link}
              key={tool.id}
              className="group block p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-blue-500/50 hover:bg-slate-800/50 transition-all duration-300 hover:-translate-y-1 shadow-lg hover:shadow-blue-500/10"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl filter drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
                  {tool.icon}
                </span>
                
                {/* Badge Status */}
                {tool.status === "New" && (
                  <span className="px-2 py-1 text-[10px] font-bold bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                    NEW
                  </span>
                )}
                {tool.status === "Hot" && (
                  <span className="px-2 py-1 text-[10px] font-bold bg-orange-500/20 text-orange-400 rounded-full border border-orange-500/30">
                    HOT
                  </span>
                )}
                {tool.status === "Ultimate" && (
                  <span className="px-2 py-1 text-[10px] font-bold bg-purple-500/20 text-purple-400 rounded-full border border-purple-500/30">
                    PRO
                  </span>
                )}
              </div>
              
              <h2 className="text-lg font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h2>
              <p className="text-sm text-slate-400 line-clamp-2">
                {tool.description}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        // State jika tidak ada hasil pencarian
        <div className="text-center py-10 border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
          <p className="text-slate-500">Tool yang kamu cari tidak ditemukan 😔</p>
        </div>
      )}

      {/* --- TOMBOL LOAD MORE --- */}
      {/* Hanya muncul jika masih ada sisa tools yang belum tampil */}
      {visibleCount < filteredTools.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={showMore}
            className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-all shadow-lg active:scale-95 text-sm"
          >
            Tampilkan Lebih Banyak ({filteredTools.length - visibleCount} lagi) ↓
          </button>
        </div>
      )}

    </div>
  );
}
"use client";

import { useState, useEffect } from "react";

export default function AspectRatio() {
  // REVISI: Menggunakan string agar bisa kosong ("") saat dihapus
  const [width, setWidth] = useState<string>("1920");
  const [height, setHeight] = useState<string>("1080");
  const [ratio, setRatio] = useState("16:9");

  // Rumus Matematika Mencari FPB (Faktor Persekutuan Terbesar)
  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  useEffect(() => {
    // Konversi ke Number hanya saat mau menghitung
    const w = parseInt(width);
    const h = parseInt(height);

    // Pastikan w dan h adalah angka valid dan bukan 0
    if (w > 0 && h > 0) {
      const divisor = gcd(w, h);
      setRatio(`${w / divisor}:${h / divisor}`);
    } else {
      setRatio("-:-"); // Tampilkan strip jika input kosong/0
    }
  }, [width, height]);

return (
    <div className="max-w-2xl mx-auto p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
      
      {/* Area Hasil (Visual) */}
      <div className="mb-8 text-center bg-slate-900/50 rounded-xl p-6 border border-slate-700">
        <span className="text-slate-400 text-sm font-medium uppercase tracking-wider">Hasil Rasio</span>
        <div className="text-5xl font-bold text-blue-400 mt-2 font-mono">
          {ratio}
        </div>
      </div>

      {/* Area Input */}
      <div className="flex flex-col md:flex-row gap-6 items-center">
        
        {/* Input Width */}
        <div className="w-full">
          <label className="block text-slate-300 text-sm font-medium mb-2">Width (Lebar)</label>
          <input
            type="number"
            value={width}
            // Hapus Number(), biarkan jadi string
            onChange={(e) => setWidth(e.target.value)} 
            placeholder="0"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono text-lg placeholder-slate-600"
          />
        </div>

        <div className="text-slate-500 font-bold text-xl mt-6">X</div>

        {/* Input Height */}
        <div className="w-full">
          <label className="block text-slate-300 text-sm font-medium mb-2">Height (Tinggi)</label>
          <input
            type="number"
            value={height}
            // Hapus Number(), biarkan jadi string
            onChange={(e) => setHeight(e.target.value)}
            placeholder="0"
            className="w-full bg-slate-800 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-center font-mono text-lg placeholder-slate-600"
          />
        </div>

      </div>

{/* Preset Tombol Cepat */}
      <div className="mt-8 flex flex-wrap gap-2 justify-center">
        {/* Update fungsi onClick agar mengirim string */}
        <button onClick={() => {setWidth("3840"); setHeight("2160")}} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors">4K (16:9)</button>
        <button onClick={() => {setWidth("2560"); setHeight("1440")}} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors">2K (16:9)</button>
        <button onClick={() => {setWidth("1920"); setHeight("1080")}} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors">Full HD (16:9)</button>
        <button onClick={() => {setWidth("1080"); setHeight("1080")}} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors">Square (1:1)</button>
        <button onClick={() => {setWidth("1080"); setHeight("1350")}} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors">IG Portrait (4:5)</button>
        <button onClick={() => {setWidth("800"); setHeight("600")}} className="px-3 py-1 bg-slate-800 hover:bg-slate-700 rounded text-xs text-slate-300 transition-colors">Old Monitor (4:3)</button>
      </div>

    </div>
  );
}
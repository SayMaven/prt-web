"use client";

import { useState, useEffect } from "react";

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6"); // Default warna Biru Next.js
  const [rgb, setRgb] = useState("rgb(59, 130, 246)");

  // Fungsi: Hex ke RGB
  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setHex(val);

    // Cek apakah format Hex valid (6 digit)
    if (/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(val)) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
      if (result) {
        const r = parseInt(result[1], 16);
        const g = parseInt(result[2], 16);
        const b = parseInt(result[3], 16);
        setRgb(`rgb(${r}, ${g}, ${b})`);
      }
    }
  };

  // Fungsi Copy Clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert(`Disalin: ${text}`);
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm shadow-xl">
      
      {/* 1. Preview Box Besar */}
      <div 
        className="w-full h-32 rounded-lg mb-6 shadow-inner flex items-center justify-center border border-white/10 transition-colors duration-300"
        style={{ backgroundColor: hex }} // Warna berubah real-time di sini
      >
        <span className="bg-black/20 text-white px-4 py-1 rounded-full text-sm font-mono backdrop-blur-md border border-white/20">
          Preview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 2. Input HEX */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-medium">HEX Code</label>
          <div className="flex gap-2">
            <input 
              type="color" 
              value={hex}
              onChange={handleHexChange}
              className="h-12 w-12 rounded cursor-pointer border-none bg-transparent"
            />
            <input
              type="text"
              value={hex}
              onChange={handleHexChange}
              className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 text-white font-mono focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="#000000"
            />
          </div>
          <button 
            onClick={() => copyToClipboard(hex)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Copy HEX
          </button>
        </div>

        {/* 3. Output RGB */}
        <div className="space-y-2">
          <label className="text-slate-300 text-sm font-medium">RGB Code</label>
          <div className="h-12 flex items-center px-4 bg-slate-900/30 border border-slate-700 rounded-lg text-slate-400 font-mono select-all">
            {rgb}
          </div>
          <button 
            onClick={() => copyToClipboard(rgb)}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium transition-colors"
          >
            Copy RGB
          </button>
        </div>

      </div>
    </div>
  );
}
"use client";

import { useState } from "react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");

  // Fungsi Utama: Format JSON
  const handleFormat = () => {
    if (!input.trim()) {
      setError("Input kosong!");
      return;
    }

    try {
      // 1. Coba parse (Ubah string jadi Object)
      const parsed = JSON.parse(input);
      
      // 2. Jika sukses, ubah balik jadi String sesuai mode
      if (mode === "pretty") {
        // Indentasi 2 spasi
        setOutput(JSON.stringify(parsed, null, 2)); 
      } else {
        // Hilangkan semua spasi
        setOutput(JSON.stringify(parsed)); 
      }
      
      setError(null); // Reset error jika sukses
    } catch (err: any) {
      // 3. Tangkap Error jika JSON tidak valid
      setOutput("");
      setError(err.message);
    }
  };

  const copyResult = () => {
    if(!output) return;
    navigator.clipboard.writeText(output);
    alert("Hasil JSON berhasil disalin!");
  };

  const loadSample = () => {
    setInput('{"nama":"TakahashiYu","fitur":["Tools","Portfolio"],"rilis":2024,"aktif":true}');
    setError(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto h-[600px]">
      
      {/* --- KOLOM INPUT --- */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium text-sm">Input JSON (Berantakan)</label>
          <button onClick={loadSample} className="text-xs text-blue-400 hover:text-blue-300 underline">
            Load Sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste JSON kamu di sini..."
          className={`flex-1 w-full bg-slate-900/50 border rounded-xl p-4 font-mono text-sm text-slate-300 focus:outline-none resize-none transition-all ${
            error ? "border-red-500 focus:ring-1 focus:ring-red-500" : "border-slate-700 focus:ring-1 focus:ring-blue-500"
          }`}
        />
        {/* Tampilan Pesan Error */}
        {error && (
          <div className="mt-2 p-3 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-xs font-mono break-words">
            ❌ Invalid JSON: {error}
          </div>
        )}
      </div>

      {/* --- TENGAH: TOMBOL AKSI (Mobile: Horizontal, Desktop: Vertical di tengah tapi kita taruh di atas output aja biar rapi) --- */}
      
      {/* --- KOLOM OUTPUT --- */}
      <div className="flex flex-col h-full">
        <div className="flex justify-between items-center mb-2">
          <label className="text-slate-300 font-medium text-sm">Output (Hasil)</label>
          <div className="flex gap-2">
            <button 
              onClick={() => { setMode("pretty"); setTimeout(handleFormat, 0); }}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${mode === "pretty" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}
            >
              Pretty
            </button>
            <button 
              onClick={() => { setMode("minify"); setTimeout(handleFormat, 0); }}
              className={`px-3 py-1 rounded text-xs font-bold transition-colors ${mode === "minify" ? "bg-blue-600 text-white" : "bg-slate-800 text-slate-400"}`}
            >
              Minify
            </button>
          </div>
        </div>

        <div className="relative flex-1">
          <textarea
            readOnly
            value={output}
            className="w-full h-full bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-sm text-green-400 focus:outline-none resize-none"
            placeholder="Hasil akan muncul di sini..."
          />
          
          {/* Tombol Format Utama */}
          <div className="absolute bottom-4 right-4 flex gap-2">
             <button
              onClick={handleFormat}
              className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              ⚡ Format JSON
            </button>
             <button
              onClick={copyResult}
              disabled={!output}
              className="bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all"
            >
              📋 Copy
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
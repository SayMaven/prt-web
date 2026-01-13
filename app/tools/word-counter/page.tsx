"use client"; // 👈 WAJIB: Memberitahu Next.js ini komponen interaktif

import { useState } from "react";

export default function WordCounter() {
  const [text, setText] = useState("");

  // Logika Menghitung
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const paragraphCount = text.length === 0 ? 0 : text.split(/\n+/).length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Tool */}
      <div className="border-b text-center pb-4">
        <h1 className="text-3xl font-bold text-white">Word Counter</h1>
        <p className="text-emerald-500">Hitung jumlah kata, karakter, dan paragraf secara real-time.</p>
      </div>

      {/* Statistik (Kotak-kotak angka) */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Words" value={wordCount} />
        <StatCard label="Characters" value={charCount} />
        <StatCard label="Paragraphs" value={paragraphCount} />
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          className="w-full h-64 p-4 text-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none resize-none transition-all shadow-sm"
          placeholder="Ketik atau tempel tulisanmu di sini..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        ></textarea>
        
        {/* Tombol Clear */}
        {text.length > 0 && (
          <button
            onClick={() => setText("")}
            className="absolute top-4 right-4 text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full hover:bg-red-200 transition-colors"
          >
            Clear Text
          </button>
        )}
      </div>

    </div>
  );
}

// Komponen Kecil untuk Kotak Statistik (Biar rapi)
function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 text-center shadow-sm">
      <div className="text-3xl font-bold text-blue-600">{value}</div>
      <div className="text-sm text-gray-500 font-medium uppercase tracking-wider">{label}</div>
    </div>
  );
}
"use client";

import { useState } from "react";

export default function RandomPicker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    // 1. Ambil data dari textarea (pisahkan per baris)
    const options = input.split("\n").filter((line) => line.trim() !== "");

    if (options.length < 2) {
      alert("Masukkan minimal 2 pilihan dulu dong, Senpai! 😤");
      return;
    }

    setIsRolling(true);

    // 2. Efek Animasi "Gacha" (Acak nama cepat selama 2 detik)
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      counter++;

      // Berhenti setelah 20x ganti (sekitar 2 detik)
      if (counter > 20) {
        clearInterval(interval);
        setIsRolling(false);
        // Pastikan hasil akhir terpilih
        const finalWinner = options[Math.floor(Math.random() * options.length)];
        setResult(finalWinner);
      }
    }, 100); // Ganti nama tiap 100ms
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      
      {/* Area Input */}
      <div className="space-y-2 text-left">
        <label className="text-sm font-bold text-slate-400 ml-1">
          Masukkan Pilihan (Satu per baris):
        </label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Makan Nasi Padang\nMakan Mie Ayam\nPuasa Aja`}
          className="w-full h-40 p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 transition-all resize-none font-mono text-sm"
        />
        <p className="text-xs text-slate-500 text-right">
          Total: {input.split("\n").filter(l => l.trim() !== "").length} Opsi
        </p>
      </div>

      {/* Tombol Roll */}
      <button
        onClick={handleRoll}
        disabled={isRolling || input.trim() === ""}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2
          ${isRolling 
            ? "bg-slate-800 text-slate-400 cursor-wait" 
            : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/20"
          }
        `}
      >
        {isRolling ? "Sedang Mengacak..." : "🎲 Spin the Wheel!"}
      </button>

      {/* Tampilan Hasil (Winner) */}
      {result && (
        <div className={`
          mt-8 p-8 rounded-2xl border text-center transition-all duration-500
          ${isRolling 
            ? "bg-slate-900 border-slate-800 opacity-50 scale-95" 
            : "bg-emerald-900/20 border-emerald-500/50 scale-100 shadow-xl shadow-emerald-500/10 animate-in fade-in zoom-in"
          }
        `}>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
            {isRolling ? "Mencari Pemenang..." : "✨ The Winner is ✨"}
          </p>
          <h2 className={`font-extrabold text-white break-words ${isRolling ? "text-2xl blur-sm" : "text-4xl md:text-5xl text-emerald-400"}`}>
            {result}
          </h2>
        </div>
      )}

    </div>
  );
}
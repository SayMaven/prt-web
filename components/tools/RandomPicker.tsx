"use client";

import { useState } from "react";
import { Dices, Trophy, Shuffle, Sparkles, AlertCircle } from "lucide-react";

export default function RandomPicker() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoll = () => {
    setError(null);
    const options = input.split("\n").filter((line) => line.trim() !== "");

    if (options.length < 2) {
      setError("Masukkan minimal 2 pilihan yang berbeda pada baris baru!");
      return;
    }

    setIsRolling(true);

    // Animasi Gacha
    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * options.length);
      setResult(options[randomIndex]);
      counter++;

      // Berhenti setelah 25 frame
      if (counter > 25) {
        clearInterval(interval);
        setIsRolling(false);
        const finalWinner = options[Math.floor(Math.random() * options.length)];
        setResult(finalWinner);
      }
    }, 80); 
  };

  const optionCount = input.split("\n").filter(l => l.trim() !== "").length;

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-8">
      
      {/* Area Input & Kontrol */}
      <div className="p-8 border rounded-[2.5rem] shadow-2xl backdrop-blur-md relative overflow-hidden"
           style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          
          <div className="flex items-center justify-between mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                  <Shuffle size={16} /> Daftar Opsi
              </h2>
              <span className="text-xs font-bold px-3 py-1 rounded-full border bg-black/10" style={{ color: "var(--text-muted)", borderColor: "var(--card-border)" }}>
                  Total: <b style={{ color: "var(--accent)" }}>{optionCount}</b>
              </span>
          </div>

          <div className="relative mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="1. Nasi Goreng&#10;2. Mie Ayam&#10;3. Sate Ayam&#10;(Masukkan satu opsi per baris)"
              className="w-full h-48 p-6 rounded-2xl bg-black/20 border-2 font-mono text-sm sm:text-base leading-relaxed focus:outline-none transition-all custom-scrollbar resize-none"
              style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", outlineColor: "var(--accent)" }}
            />
            {error && (
                <div className="absolute -bottom-10 left-0 right-0 flex items-center gap-2 text-xs font-bold text-red-500 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">
                    <AlertCircle size={14} /> {error}
                </div>
            )}
          </div>

          <button
            onClick={handleRoll}
            disabled={isRolling || optionCount === 0}
            className={`w-full py-5 rounded-2xl font-black text-lg tracking-widest uppercase transition-all shadow-xl flex items-center justify-center gap-3 relative overflow-hidden
              ${isRolling 
                ? "cursor-wait scale-[0.98] opacity-80" 
                : optionCount === 0 
                    ? "opacity-50 cursor-not-allowed border"
                    : "hover:scale-[1.02] active:scale-[0.98]"
              }
            `}
            style={isRolling ? { background: "var(--accent)", color: "white" } : optionCount === 0 ? { background: "rgba(0,0,0,0.2)", borderColor: "var(--card-border)", color: "var(--text-muted)" } : { background: "var(--accent)", color: "white" }}
          >
            {isRolling ? (
                <>
                    <Dices size={24} className="animate-bounce" /> 
                    <span>Mengacak Pilihan...</span>
                </>
            ) : (
                <>
                    <Dices size={24} /> 
                    <span>Mulai Acak Opsi!</span>
                </>
            )}
          </button>
      </div>

      {/* Tampilan Hasil (Winner) */}
      <div className={`
          p-10 rounded-[2.5rem] border shadow-2xl flex flex-col items-center justify-center text-center transition-all duration-700 min-h-[250px] relative overflow-hidden
          ${result ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none hidden"}
        `}
        style={isRolling ? { background: "var(--card-bg)", borderColor: "var(--card-border)", filter: "blur(4px)", transform: "scale(0.95)" } : { background: "var(--card-bg)", borderColor: "var(--accent)" }}
      >
          {/* Efek kilauan latar saat menang */}
          {!isRolling && result && (
              <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--accent)_0%,_transparent_70%)] pointer-events-none"></div>
          )}

          <div className="relative z-10 flex flex-col items-center">
              <p className="text-xs font-black uppercase tracking-[0.3em] flex items-center gap-2 mb-4" style={{ color: "var(--text-muted)" }}>
                  <Sparkles size={14} style={{ color: "var(--accent)" }}/> 
                  {isRolling ? "Mencari Kandidat..." : "Pemenangnya Adalah"} 
                  <Sparkles size={14} style={{ color: "var(--accent)" }}/>
              </p>
              
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black break-words leading-tight flex items-center gap-4 transition-all" style={isRolling ? { color: "var(--text-primary)", opacity: 0.5 } : { color: "var(--accent)", textShadow: "0 0 30px var(--accent-subtle)" }}>
                  {!isRolling && <Trophy size={40} className="hidden md:block shrink-0" />}
                  {result}
                  {!isRolling && <Trophy size={40} className="hidden md:block shrink-0" />}
              </h2>
          </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
      `}</style>
    </div>
  );
}
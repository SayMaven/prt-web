"use client";

import { useState, useEffect, useRef } from "react";

export default function BpmTapper() {
  const [taps, setTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number>(0);
  const [isTapping, setIsTapping] = useState(false);
  
  // Ref untuk mendeteksi keydown agar tidak re-render berlebihan
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Logic Hitung BPM
  const handleTap = () => {
    const now = Date.now();
    
    // Reset jika jarak ketukan terlalu lama (> 2 detik) dianggap lagu baru
    if (taps.length > 0 && now - taps[taps.length - 1] > 2000) {
      setTaps([now]);
      setBpm(0);
      return;
    }

    // Simpan waktu ketukan (maksimal simpan 4 ketukan terakhir biar responsif)
    const newTaps = [...taps, now].slice(-4); 
    setTaps(newTaps);
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 100); // Efek visual sebentar

    // Kalkulasi Rata-rata
    if (newTaps.length > 1) {
      const intervals = [];
      for (let i = 1; i < newTaps.length; i++) {
        intervals.push(newTaps[i] - newTaps[i - 1]);
      }
      
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const calculatedBpm = Math.round(60000 / avgInterval);
      setBpm(calculatedBpm);
    }
  };

  // Keyboard Event (Spasi / Enter)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.code === "Enter") {
        e.preventDefault(); // Mencegah scroll ke bawah saat spasi
        handleTap();
        // Efek tombol ditekan secara visual
        if (buttonRef.current) {
          buttonRef.current.classList.add("scale-95", "bg-indigo-500");
          setTimeout(() => {
             buttonRef.current?.classList.remove("scale-95", "bg-indigo-500");
          }, 100);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [taps]);

  // Reset Total
  const handleReset = () => {
    setTaps([]);
    setBpm(0);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      
      {/* Display BPM Besar */}
      <div className="relative flex flex-col items-center justify-center h-48 w-48 mx-auto bg-slate-900 rounded-full border-4 border-slate-800 shadow-2xl transition-all duration-100 ease-linear"
           style={{ 
             borderColor: bpm > 0 ? (isTapping ? '#6366f1' : '#334155') : '#334155',
             transform: isTapping ? 'scale(0.95)' : 'scale(1)' 
           }}>
        
        <span className="text-6xl font-black text-white tracking-tighter">
          {bpm > 0 ? bpm : "--"}
        </span>
        <span className="text-xs text-slate-500 font-bold uppercase mt-2">BPM</span>
        
        {/* Indikator Detak Jantung (Pulse) */}
        {bpm > 0 && (
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/50 animate-ping opacity-20"></div>
        )}
      </div>

      <div className="text-center space-y-4">
        <p className="text-slate-400 text-sm">
          Tekan <kbd className="bg-slate-800 px-2 py-1 rounded border border-slate-700 font-mono text-white">SPASI</kbd> atau klik tombol di bawah mengikuti irama lagu.
        </p>

        {/* Tombol TAP Besar */}
        <button
          ref={buttonRef}
          onClick={handleTap}
          className="w-full py-6 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-2xl tracking-widest shadow-lg shadow-indigo-500/20 transition-all active:scale-95 select-none"
        >
          TAP HERE!
        </button>

        <button 
          onClick={handleReset}
          className="text-xs text-slate-500 underline hover:text-slate-300 transition-colors"
        >
          Reset Counter
        </button>
      </div>

      {/* Info Genre Musik Berdasarkan BPM */}
      {bpm > 0 && (
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 text-center animate-in fade-in slide-in-from-bottom-2">
           <p className="text-xs text-slate-500 mb-1">Cocok untuk genre:</p>
           <p className="text-indigo-300 font-medium">
             {bpm < 60 ? "Ballad / Lo-Fi " :
              bpm < 100 ? "R&B / Hip-Hop " :
              bpm < 120 ? "Pop / Funk " :
              bpm < 140 ? "House / Trance " :
              bpm < 170 ? "Dubstep / Rock " :
              "Drum & Bass / Metal / Hardcore "}
           </p>
        </div>
      )}

    </div>
  );
}
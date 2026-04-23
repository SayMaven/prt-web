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
          buttonRef.current.classList.add("scale-95", "opacity-80", "translate-y-1", "border-b-0");
          setTimeout(() => {
            buttonRef.current?.classList.remove("scale-95", "opacity-80", "translate-y-1", "border-b-0");
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
    <div className="max-w-md mx-auto space-y-12">

      {/* Display BPM Besar */}
      <div className="relative flex flex-col items-center justify-center h-56 w-56 mx-auto rounded-full border-[6px] shadow-2xl transition-all duration-100 ease-linear"
        style={{
          background: "var(--card-bg)",
          borderColor: bpm > 0 ? (isTapping ? 'var(--accent)' : 'var(--card-border)') : 'var(--card-border)',
          transform: isTapping ? 'scale(0.95)' : 'scale(1)',
          boxShadow: isTapping ? '0 0 40px var(--accent-subtle)' : '0 10px 30px rgba(0,0,0,0.1)'
        }}>

        <span className="text-7xl font-black tracking-tighter" style={{ color: "var(--text-primary)" }}>
          {bpm > 0 ? bpm : "--"}
        </span>
        <span className="text-sm font-black uppercase mt-2 tracking-widest" style={{ color: "var(--text-muted)" }}>BPM</span>

        {/* Indikator Detak Jantung (Pulse) */}
        {bpm > 0 && (
          <div className="absolute inset-[-6px] rounded-full border-4 animate-ping opacity-20 pointer-events-none" style={{ borderColor: "var(--accent)" }}></div>
        )}
      </div>

      <div className="text-center space-y-6">
        <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
          Tekan <kbd className="px-2.5 py-1 rounded-md border-2 font-bold font-mono uppercase tracking-widest shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}>SPASI</kbd> atau klik tombol di bawah sesuai irama.
        </p>

        {/* Tombol TAP Besar */}
        <button
          ref={buttonRef}
          onClick={handleTap}
          className="w-full py-6 rounded-3xl font-black text-2xl tracking-widest shadow-xl transition-all active:scale-95 select-none border-b-4 active:border-b-0 active:translate-y-1"
          style={{ background: "var(--accent)", color: "var(--page-bg)", borderColor: "var(--accent-subtle)" }}
        >
          TAP HERE!
        </button>

        <button
          onClick={handleReset}
          className="text-xs font-bold uppercase tracking-widest underline hover:opacity-80 transition-opacity"
          style={{ color: "var(--text-muted)" }}
        >
          Reset Counter
        </button>
      </div>

      {/* Info Genre Musik Berdasarkan BPM */}
      {bpm > 0 && (
        <div className="p-5 rounded-2xl border text-center animate-in fade-in slide-in-from-bottom-2 shadow-sm backdrop-blur-md" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Cocok untuk genre:</p>
          <p className="text-lg font-black tracking-wide" style={{ color: "var(--accent)" }}>
            {bpm < 60 ? "Ballad / Lo-Fi" :
              bpm < 100 ? "R&B / Hip-Hop" :
                bpm < 120 ? "Pop / Funk" :
                  bpm < 140 ? "House / Trance" :
                    bpm < 170 ? "Dubstep / Rock" :
                      "Drum & Bass / Metal / Hardcore"}
          </p>
        </div>
      )}

    </div>
  );
}
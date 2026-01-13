"use client";

import { useState, useEffect } from "react";

export default function PomodoroTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 menit (dalam detik)
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "short" | "long">("work");

  // Konfigurasi Waktu (Menit)
  const MODES = {
    work: { label: "Fokus Kerja", minutes: 25, color: "text-blue-400" },
    short: { label: "Rehat Singkat", minutes: 5, color: "text-green-400" },
    long: { label: "Istirahat Panjang", minutes: 15, color: "text-purple-400" },
  };

  // Timer Logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      // Opsional: Bunyikan suara alarm di sini
      alert("Waktu Habis! Istirahat dulu.");
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Fungsi Ganti Mode
  const changeMode = (newMode: "work" | "short" | "long") => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  // Fungsi Format Menit:Detik
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Hitung Progress Circle (Supaya ada lingkaran loading)
  const totalTime = MODES[mode].minutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  return (
    <div className="max-w-xl mx-auto">
      
      {/* 1. Tombol Mode */}
      <div className="flex justify-center gap-2 mb-8 p-1 bg-slate-900/50 rounded-full border border-slate-700 w-fit mx-auto">
        {(Object.keys(MODES) as Array<keyof typeof MODES>).map((m) => (
          <button
            key={m}
            onClick={() => changeMode(m)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              mode === m 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
          >
            {MODES[m].label}
          </button>
        ))}
      </div>

      {/* 2. Timer Utama */}
      <div className="relative w-64 h-64 mx-auto flex items-center justify-center bg-white/5 rounded-full border-4 border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.3)] mb-8">
        {/* Lingkaran Progress Sederhana */}
        <svg className="absolute w-full h-full -rotate-90 pointer-events-none">
           <circle
            cx="128" cy="128" r="120"
            className="stroke-slate-800" strokeWidth="4" fill="none"
          />
          <circle
            cx="128" cy="128" r="120"
            className={`stroke-current ${MODES[mode].color} transition-all duration-1000 ease-linear`}
            strokeWidth="4" fill="none"
            strokeDasharray="754" // Keliling lingkaran (2 * pi * r)
            strokeDashoffset={754 - (754 * progress) / 100}
            strokeLinecap="round"
          />
        </svg>

        {/* Teks Angka */}
        <div className="text-center">
          <div className={`text-6xl font-bold font-mono tracking-widest ${MODES[mode].color}`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-slate-500 text-sm mt-2 font-medium uppercase tracking-widest">
            {isActive ? "Sedang Berjalan" : "Dihentikan"}
          </div>
        </div>
      </div>

      {/* 3. Tombol Kontrol */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setIsActive(!isActive)}
          className={`px-8 py-3 rounded-xl font-bold text-lg transition-transform active:scale-95 ${
            isActive 
              ? "bg-slate-700 text-white border border-slate-600 hover:bg-slate-600" 
              : "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50 shadow-lg"
          }`}
        >
          {isActive ? "Pause" : "Start ▶"}
        </button>
        
        <button
          onClick={() => changeMode(mode)}
          className="px-4 py-3 bg-slate-800/50 text-slate-100 border border-slate-700 rounded-xl hover:bg-slate-800 hover:text-white transition-colors"
          title="Reset Timer"
        >
          Reset
        </button>
      </div>

    </div>
  );
}
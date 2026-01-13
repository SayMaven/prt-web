"use client";

import { useState, useEffect, useRef, useCallback } from "react";

// --- KAMUS KATA ---
const DICTIONARIES = {
  id: [
    "saya", "kamu", "mereka", "kita", "bisa", "melakukan", "ini", "kode", "program",
    "komputer", "internet", "jaringan", "data", "sistem", "aplikasi", "pengembang",
    "belajar", "mengetik", "cepat", "akurat", "fokus", "layar", "keyboard", "mouse",
    "hujan", "kopi", "senja", "malam", "pagi", "siang", "makan", "minum", "tidur",
    "jalan", "lari", "baca", "tulis", "dengar", "lihat", "rasa", "pikir", "buat",
    "karya", "seni", "musik", "lagu", "nada", "irama", "hidup", "mati", "cinta",
    "bahasa", "dunia", "langit", "bumi", "laut", "gunung", "kota", "desa"
  ],
  en: [
    "code", "react", "nextjs", "typescript", "deploy", "server", "client", "function", 
    "variable", "constant", "array", "object", "string", "number", "boolean", "design",
    "frontend", "backend", "database", "api", "cloud", "vercel", "system", "interface",
    "component", "hook", "state", "effect", "render", "build", "pixel", "quality",
    "keyboard", "mouse", "monitor", "laptop", "coffee", "bug", "feature", "async",
    "await", "promise", "import", "export", "default", "class", "return", "void",
    "public", "private", "protected", "static", "final", "try", "catch", "throw"
  ],
  jp: [
    "watashi", "anata", "kare", "kanojo", "arigatou", "sayonara", "konnichiwa", "ohayou",
    "konbanwa", "oyasumi", "gohan", "mizu", "ocha", "sushi", "ramen", "neko", "inu",
    "tori", "sakura", "yuki", "ame", "kaze", "sora", "umi", "yama", "kawa", "ie",
    "gakkou", "sensei", "gakusei", "tomodachi", "kazoku", "ai", "yume", "kibou",
    "mirai", "kakkoii", "kawaii", "sugoi", "yabai", "nani", "doko", "itsu", "dare",
    "manga", "anime", "otaku", "nihon", "tokyo", "osaka", "kyoto", "samurai"
  ]
};

type Language = "id" | "en" | "jp";
type Mode = "time" | "words";

export default function TypingTest() {
  // --- KONFIGURASI ---
  const [lang, setLang] = useState<Language>("en");
  const [mode, setMode] = useState<Mode>("time");
  const [configValue, setConfigValue] = useState(30); // Default 30 detik

  // --- GAME STATE ---
  const [text, setText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // --- STATISTIK ---
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0); // Untuk mode Words
  const [timeLeft, setTimeLeft] = useState(30);      // Untuk mode Time
  
  // Akurasi "Jahat" (Sticky Error Tracking)
  const [totalTyped, setTotalTyped] = useState(0); // Total tombol ditekan (char only)
  const [totalErrors, setTotalErrors] = useState(0); // Total salah ketik (tidak berkurang walau dihapus)
  
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);

  const inputRef = useRef<HTMLInputElement>(null);

  // 1. GENERATE KATA
  const generateWords = useCallback((language: Language, gameMode: Mode, val: number) => {
    const wordList = DICTIONARIES[language];
    let count = 0;
    
    if (gameMode === "words") {
      count = val; // Mode Kata: Generate persis X kata
    } else {
      count = 100; // Mode Waktu: Generate banyak kata biar gak habis
    }

    // Algoritma Acak Kata
    const result = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        result.push(wordList[randomIndex]);
    }
    return result.join(" ");
  }, []);

  // 2. RESET GAME
  const resetGame = useCallback(() => {
    const newText = generateWords(lang, mode, configValue);
    setText(newText);
    setUserInput("");
    setIsActive(false);
    setIsFinished(false);
    
    // Reset Stats
    setStartTime(null);
    setTotalTyped(0);
    setTotalErrors(0);
    setWpm(0);
    setAccuracy(100);
    
    // Reset Timer
    if (mode === "time") {
        setTimeLeft(configValue);
    } else {
        setTimeElapsed(0);
    }

    // Fokus Input
    setTimeout(() => inputRef.current?.focus(), 50);
  }, [lang, mode, configValue, generateWords]);

  // Efek saat config berubah -> Reset
  useEffect(() => {
    resetGame();
  }, [lang, mode, configValue, resetGame]);

  // 3. LOGIC TIMER (Countdown & Stopwatch)
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && !isFinished) {
      interval = setInterval(() => {
        if (mode === "time") {
            // MODE WAKTU: Hitung Mundur
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    finishGame();
                    return 0;
                }
                return prev - 1;
            });
        } else {
            // MODE KATA: Hitung Maju (Stopwatch)
            setTimeElapsed((prev) => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isFinished, mode]);

  // 4. LOGIC AKHIR GAME (Otomatis & Manual)
  const finishGame = () => {
    setIsActive(false);
    setIsFinished(true);
    calculateFinalStats();
  };

  // Kalkulasi Final agar WPM akurat di detik terakhir
  const calculateFinalStats = () => {
      // Durasi dalam menit
      let durationInMinutes = 0;
      if (mode === "time") {
          durationInMinutes = (configValue - timeLeft) / 60;
          if (durationInMinutes <= 0) durationInMinutes = configValue / 60;
      } else {
          durationInMinutes = timeElapsed / 60;
          if (durationInMinutes === 0) durationInMinutes = 0.5 / 60; // Hindari bagi 0
      }

      const wordsTyped = userInput.trim().split(/\s+/).length;
      const finalWpm = Math.round(wordsTyped / durationInMinutes);
      setWpm(finalWpm);
  };

  // 5. INPUT HANDLER (INTI LOGIKA AKURASI BARU)
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isFinished) return;

    const val = e.target.value;
    const prevVal = userInput;

    // A. Start Timer First Key
    if (!isActive && val.length === 1) {
      setIsActive(true);
      setStartTime(Date.now());
    }

    // B. Deteksi Karakter Baru (Untuk Akurasi Strict)
    if (val.length > prevVal.length) {
        // User mengetik karakter baru
        const charTyped = val.slice(-1);       // Huruf yang baru diketik
        const targetChar = text[val.length - 1]; // Huruf yang seharusnya

        setTotalTyped(prev => prev + 1); // Tambah counter ketikan

        if (charTyped !== targetChar) {
            setTotalErrors(prev => prev + 1); // Tambah counter salah
        }
    }
    // Jika user menghapus (Backspace), kita TIDAK mengurangi totalTyped/totalErrors
    // Ini yang membuat akurasi tidak bisa curang kembali ke 100%

    setUserInput(val);

    // C. Update Stats Real-time
    // Hitung Akurasi: (Total Benar / Total Ketukan) * 100
    // Total Benar = Total Ketukan - Total Salah
    const calculatedAcc = totalTyped > 0 
        ? Math.max(0, Math.round(((totalTyped - totalErrors) / totalTyped) * 100))
        : 100;
    
    setAccuracy(calculatedAcc);

    // Hitung WPM Live
    const words = val.trim().split(/\s+/).length;
    let timeMins = 0;
    if (mode === "time") {
        timeMins = (configValue - timeLeft) / 60;
    } else {
        timeMins = timeElapsed / 60;
    }
    // Hindari Infinity di detik ke-0
    if (timeMins > 0) {
        setWpm(Math.round(words / timeMins));
    }

    // D. Cek Selesai (Khusus Mode Kata atau Teks Habis)
    if (val.length >= text.length) {
        finishGame();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      resetGame();
    }
  };

  const handleAreaClick = () => {
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-5xl mx-auto font-mono select-none">
      
      {/* --- TOOLBAR KONFIGURASI --- */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        
        {/* Kiri: Bahasa */}
        <div className="flex gap-2">
            {(["en", "id", "jp"] as Language[]).map((l) => (
                <button
                    key={l}
                    onClick={() => setLang(l)}
                    className={`px-3 py-1 rounded transition-colors ${lang === l ? "text-blue-400 font-bold bg-blue-900/20" : "text-slate-500 hover:text-slate-300"}`}
                >
                    {l === "en" ? "ENG" : l === "id" ? "IND" : "JPN"}
                </button>
            ))}
        </div>

        {/* Tengah: Mode */}
        <div className="flex items-center bg-slate-950 rounded-lg p-1 border border-slate-800">
            <button 
                onClick={() => { setMode("time"); setConfigValue(30); }}
                className={`px-4 py-1 rounded ${mode === "time" ? "bg-slate-800 text-white shadow" : "text-slate-500"}`}
            >
                Time
            </button>
            <button 
                onClick={() => { setMode("words"); setConfigValue(25); }}
                className={`px-4 py-1 rounded ${mode === "words" ? "bg-slate-800 text-white shadow" : "text-slate-500"}`}
            >
                Words
            </button>
        </div>

        {/* Kanan: Opsi Value */}
        <div className="flex gap-2 text-slate-500 font-medium">
            {(mode === "time" ? [15, 30, 60, 120] : [10, 25, 50, 100]).map((val) => (
                <button
                    key={val}
                    onClick={() => setConfigValue(val)}
                    className={`px-2 hover:text-white transition-colors ${configValue === val ? "text-yellow-400 font-bold" : ""}`}
                >
                    {val}
                </button>
            ))}
        </div>

      </div>

      {/* --- STATS DISPLAY --- */}
      <div className="flex justify-between items-end mb-4 px-4">
        {/* Timer Display */}
        <div className="text-4xl font-bold text-yellow-400">
            {mode === "time" ? timeLeft : timeElapsed}
            <span className="text-lg text-slate-500 ml-1">{mode === "time" ? "s" : "s"}</span>
        </div>

        <div className="flex gap-8 text-xl">
           <div className="flex flex-col items-center">
             <span className="text-xs text-slate-500 uppercase">WPM</span>
             <span className="text-white">{wpm}</span>
           </div>
           <div className="flex flex-col items-center">
             <span className="text-xs text-slate-500 uppercase">Accuracy</span>
             <span className={`${accuracy < 100 ? 'text-red-400' : 'text-green-400'} transition-colors duration-300`}>
                {accuracy}%
             </span>
           </div>
        </div>
      </div>

      {/* --- GAME AREA --- */}
      <div 
        onClick={handleAreaClick}
        className="relative bg-slate-900/50 border border-slate-700 rounded-2xl p-8 min-h-[250px] cursor-text group overflow-hidden shadow-inner"
      >
        {/* Result Overlay */}
        {isFinished && (
            <div className="absolute inset-0 bg-slate-950/95 z-30 flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-300">
                <div className="text-slate-400 text-sm uppercase tracking-widest mb-2">Test Complete</div>
                <div className="text-7xl font-bold text-yellow-400 mb-2">{wpm} <span className="text-2xl text-slate-500">WPM</span></div>
                
                <div className="flex gap-8 mb-8 text-center">
                    <div>
                        <div className="text-2xl text-white font-bold">{accuracy}%</div>
                        <div className="text-xs text-slate-500">Accuracy</div>
                    </div>
                    <div>
                        <div className="text-2xl text-white font-bold">{totalErrors}</div>
                        <div className="text-xs text-slate-500">Mistakes</div>
                    </div>
                    <div>
                        <div className="text-2xl text-white font-bold">{mode === "time" ? configValue : timeElapsed}s</div>
                        <div className="text-xs text-slate-500">Time</div>
                    </div>
                </div>

                <button 
                    onClick={resetGame}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-blue-500/20 flex items-center gap-2"
                >
                    <span>Restart Test</span>
                    <span className="bg-blue-500 px-2 py-0.5 rounded text-xs border border-blue-400">TAB</span>
                </button>
            </div>
        )}

        <input
          ref={inputRef}
          type="text"
          value={userInput}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          className="absolute opacity-0 top-0 left-0 w-full h-full cursor-default z-10"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Text Rendering */}
        <div className="text-2xl md:text-3xl leading-relaxed break-words font-medium">
          {text.split("").map((char, index) => {
            let color = "text-slate-600";
            let bgColor = "";
            let isCurrent = false;

            if (index < userInput.length) {
                if (userInput[index] === char) {
                    color = "text-slate-100";
                } else {
                    color = "text-red-500";
                    if (char === " ") bgColor = "bg-red-500/20 rounded";
                }
            } else if (index === userInput.length) {
                isCurrent = true;
            }
            
            return (
              <span 
                key={index} 
                className={`relative ${color} ${bgColor} transition-colors duration-100`}
              >
                {isCurrent && (
                    <span className="absolute -left-0.5 top-1 bottom-1 w-0.5 bg-yellow-400 animate-pulse rounded-full"></span>
                )}
                {char}
              </span>
            );
          })}
        </div>
        
        {/* Overlay Blur Bawah (Supaya user fokus ke baris atas) */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-slate-900 to-transparent pointer-events-none"></div>
      </div>

      <div className="text-center mt-6 text-slate-600 text-xs">
        <p>Tip: Tekan <span className="text-slate-400 font-bold">TAB</span> untuk restart cepat kapan saja.</p>
      </div>

    </div>
  );
}
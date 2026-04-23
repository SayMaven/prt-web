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
    "bahasa", "dunia", "langit", "bumi", "laut", "gunung", "kota", "desa", "waktu",
    "angin", "api", "air", "tanah", "ruang", "kawan", "teman", "musuh", "sekolah"
  ],
  en: [
    "code", "react", "nextjs", "typescript", "deploy", "server", "client", "function", 
    "variable", "constant", "array", "object", "string", "number", "boolean", "design",
    "frontend", "backend", "database", "api", "cloud", "vercel", "system", "interface",
    "component", "hook", "state", "effect", "render", "build", "pixel", "quality",
    "keyboard", "mouse", "monitor", "laptop", "coffee", "bug", "feature", "async",
    "await", "promise", "import", "export", "default", "class", "return", "void",
    "public", "private", "protected", "static", "final", "try", "catch", "throw",
    "interface", "type", "module", "node", "package", "json", "git", "commit", "push"
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
    <div className="max-w-5xl mx-auto font-mono select-none flex flex-col items-center">
      
      {/* --- TOOLBAR KONFIGURASI (Monkeytype style) --- */}
      <div className="inline-flex flex-wrap justify-center items-center gap-4 bg-[color:var(--card-bg)] border border-[color:var(--card-border)] rounded-full px-6 py-2.5 mb-10 shadow-sm text-xs md:text-sm font-bold tracking-widest uppercase transition-all">
        
        {/* Kiri: Bahasa */}
        <div className="flex gap-2 items-center border-r border-[color:var(--card-border)] pr-4">
            {(["en", "id", "jp"] as Language[]).map((l) => (
                <button
                    key={l}
                    onClick={() => setLang(l)}
                    className="px-2 py-1 rounded-md transition-colors"
                    style={lang === l ? { color: "var(--accent)" } : { color: "var(--text-muted)" }}
                >
                    {l === "en" ? "ENG" : l === "id" ? "IND" : "JPN"}
                </button>
            ))}
        </div>

        {/* Tengah: Mode */}
        <div className="flex items-center gap-2 border-r border-[color:var(--card-border)] pr-4">
            <button 
                onClick={() => { setMode("time"); setConfigValue(30); }}
                className="px-2 py-1 rounded-md transition-colors"
                style={mode === "time" ? { color: "var(--accent)" } : { color: "var(--text-muted)" }}
            >
                TIME
            </button>
            <button 
                onClick={() => { setMode("words"); setConfigValue(25); }}
                className="px-2 py-1 rounded-md transition-colors"
                style={mode === "words" ? { color: "var(--accent)" } : { color: "var(--text-muted)" }}
            >
                WORDS
            </button>
        </div>

        {/* Kanan: Opsi Value */}
        <div className="flex gap-2">
            {(mode === "time" ? [15, 30, 60, 120] : [10, 25, 50, 100]).map((val) => (
                <button
                    key={val}
                    onClick={() => setConfigValue(val)}
                    className="px-2 py-1 rounded-md transition-colors"
                    style={configValue === val ? { color: "var(--accent)" } : { color: "var(--text-muted)" }}
                >
                    {val}
                </button>
            ))}
        </div>

      </div>

      {/* --- STATS & TIMER DISPLAY --- */}
      <div className="w-full flex justify-between items-end mb-4 px-2" style={{ opacity: isActive && !isFinished ? 1 : 0.5, transition: 'opacity 0.3s ease' }}>
        <div className="text-3xl font-black" style={{ color: "var(--accent)" }}>
            {mode === "time" ? timeLeft : timeElapsed}
            <span className="text-base font-bold ml-1" style={{ color: "var(--text-muted)" }}>s</span>
        </div>
      </div>

      {/* --- GAME AREA --- */}
      <div 
        onClick={handleAreaClick}
        className="relative w-full rounded-3xl min-h-[250px] cursor-text group overflow-hidden"
      >
        {/* Result Overlay */}
        {isFinished && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center rounded-3xl animate-in zoom-in-95 duration-300 backdrop-blur-xl border shadow-2xl" style={{ background: "var(--nav-bg)", borderColor: "var(--card-border)" }}>
                <div className="text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full border" style={{ color: "var(--text-secondary)", borderColor: "var(--card-border)" }}>Test Complete</div>
                <div className="text-8xl font-black mb-2" style={{ color: "var(--accent)" }}>{wpm}</div>
                <div className="text-xl font-bold uppercase tracking-widest mb-8" style={{ color: "var(--text-muted)" }}>WPM</div>
                
                <div className="flex gap-10 mb-10 text-center">
                    <div>
                        <div className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>{accuracy}%</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Accuracy</div>
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>{totalErrors}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Mistakes</div>
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold" style={{ color: "var(--text-primary)" }}>{mode === "time" ? configValue : timeElapsed}s</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest mt-1" style={{ color: "var(--text-muted)" }}>Time</div>
                    </div>
                </div>

                <button 
                    onClick={resetGame}
                    className="px-8 py-3 rounded-full font-bold transition-all hover:scale-105 flex items-center gap-3 text-sm shadow-xl"
                    style={{ background: "var(--accent)", color: "var(--page-bg)" }}
                >
                    <span>Restart Test</span>
                    <span className="px-2 py-0.5 rounded font-bold text-[10px]" style={{ background: "var(--page-bg)", color: "var(--accent)" }}>TAB</span>
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
        <div className={`text-2xl md:text-3xl leading-[1.6] break-words font-medium transition-all duration-300 ${isFinished ? 'blur-sm opacity-30' : ''}`} style={{ color: "var(--text-muted)" }}>
          {text.split("").map((char, index) => {
            let textColor = "";
            let bgColor = "";
            let isCurrent = false;

            if (index < userInput.length) {
                if (userInput[index] === char) {
                    textColor = "var(--text-primary)";
                } else {
                    textColor = "#ef4444"; // red for error
                    if (char === " ") bgColor = "rgba(239, 68, 68, 0.2)";
                }
            } else if (index === userInput.length) {
                isCurrent = true;
            }
            
            return (
              <span 
                key={index} 
                className="relative transition-colors duration-100"
                style={{ color: textColor || undefined, backgroundColor: bgColor || undefined }}
              >
                {isCurrent && (
                    <span className="absolute -left-[1px] top-1 bottom-1 w-[2px] animate-pulse rounded-full" style={{ background: "var(--accent)" }}></span>
                )}
                {char}
              </span>
            );
          })}
        </div>
      </div>

      <div className="text-center mt-12 text-xs font-bold tracking-widest" style={{ color: "var(--text-muted)" }}>
        <p>TIP: TEKAN <span className="px-1.5 py-0.5 rounded border ml-1 mr-1" style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", background: "var(--card-bg)" }}>TAB</span> UNTUK RESTART CEPAT</p>
      </div>

    </div>
  );
}
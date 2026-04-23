"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, ImagePlus, CheckCircle2, Trash2, ListTodo } from "lucide-react";

type Mode = "work" | "short" | "long";

const MODES = {
  work: { label: "Fokus Kerja", minutes: 25, color: "#3b82f6" },
  short: { label: "Rehat Singkat", minutes: 5, color: "#10b981" },
  long: { label: "Istirahat Panjang", minutes: 15, color: "#8b5cf6" },
};

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>("work");
  const [timeLeft, setTimeLeft] = useState(MODES.work.minutes * 60);
  const [isActive, setIsActive] = useState(false);
  const [bgImage, setBgImage] = useState<string | null>(null);
  
  // Fitur Mini Todo
  const [tasks, setTasks] = useState<{id: number, text: string, done: boolean}[]>([]);
  const [newTask, setNewTask] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load from LocalStorage on mount
  useEffect(() => {
      try {
          const savedBg = localStorage.getItem("pomodoro_bg");
          if (savedBg) setBgImage(savedBg);

          const savedTasks = localStorage.getItem("pomodoro_tasks");
          if (savedTasks) setTasks(JSON.parse(savedTasks));
      } catch (e) {
          console.error("Gagal meload storage", e);
      }
  }, []);

  // Save Tasks to LocalStorage
  useEffect(() => {
      if (tasks.length > 0 || localStorage.getItem("pomodoro_tasks")) {
          localStorage.setItem("pomodoro_tasks", JSON.stringify(tasks));
      }
  }, [tasks]);

  // Play alarm sound
  const playAlarm = () => {
    try {
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
        gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
        gainNode.gain.linearRampToValueAtTime(1, audioCtx.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1);
        oscillator.start(audioCtx.currentTime);
        oscillator.stop(audioCtx.currentTime + 1);
    } catch (e) {
        console.log("Audio failed", e);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      playAlarm();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const changeMode = (newMode: Mode) => {
    setMode(newMode);
    setIsActive(false);
    setTimeLeft(MODES[newMode].minutes * 60);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
              // Resize image agar tidak memberatkan LocalStorage
              const canvas = document.createElement("canvas");
              const MAX_WIDTH = 1920;
              let width = img.width;
              let height = img.height;
              
              if (width > MAX_WIDTH) {
                  height *= MAX_WIDTH / width;
                  width = MAX_WIDTH;
              }
              
              canvas.width = width;
              canvas.height = height;
              const ctx = canvas.getContext("2d");
              ctx?.drawImage(img, 0, 0, width, height);
              
              const dataUrl = canvas.toDataURL("image/webp", 0.7);
              setBgImage(dataUrl);
              try {
                  localStorage.setItem("pomodoro_bg", dataUrl);
              } catch (err) {
                  alert("Gambar terlalu besar untuk disimpan secara permanen. Latar akan hilang saat di-refresh.");
              }
          };
          img.src = event.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const addTask = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newTask.trim()) return;
      setTasks([{ id: Date.now(), text: newTask, done: false }, ...tasks]);
      setNewTask("");
  };

  const toggleTask = (id: number) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const totalTime = MODES[mode].minutes * 60;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const currentAccent = MODES[mode].color;

  return (
    <div className="w-full flex flex-col gap-6 items-center">
      
      {/* KARTU UTAMA POMODORO DENGAN LATAR BELAKANG */}
      <div className="w-full relative min-h-[75vh] flex flex-col md:flex-row rounded-[2.5rem] shadow-2xl overflow-hidden border transition-all duration-700"
           style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          
          {/* Latar Belakang Custom (Zoom Pan Animation) */}
          {bgImage && (
              <div 
                  className="absolute inset-0 bg-cover bg-center z-0 animate-[kenburns_20s_ease-in-out_infinite_alternate]"
                  style={{ backgroundImage: `url(${bgImage})` }}
              />
          )}

          {/* Overlay Transparan Gelap (TANPA BLUR agar gambar jelas!) */}
          <div className="absolute inset-0 z-10 bg-black/50 sm:bg-gradient-to-r sm:from-black/70 sm:to-black/40 pointer-events-none transition-all"></div>

          {/* AREA KIRI: Timer Panel */}
          <div className="relative z-20 flex-1 p-8 md:p-12 flex flex-col items-center justify-center border-r border-white/10">
              
              {/* Tombol Mode */}
              <div className="flex flex-wrap justify-center gap-2 mb-10 p-1.5 rounded-full backdrop-blur-xl border bg-white/10 border-white/20 shadow-lg">
                {(Object.keys(MODES) as Array<Mode>).map((m) => (
                  <button
                    key={m}
                    onClick={() => changeMode(m)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold uppercase tracking-widest transition-all ${
                      mode === m 
                        ? "text-white shadow-md scale-105" 
                        : "text-white/60 hover:text-white hover:bg-white/10"
                    }`}
                    style={mode === m ? { background: MODES[m].color } : {}}
                  >
                    {MODES[m].label}
                  </button>
                ))}
              </div>

              {/* Timer Lingkaran */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] bg-black/20 backdrop-blur-xl border border-white/10 mb-10 group">
                
                {/* Lingkaran SVG Animated */}
                <svg className="absolute w-full h-full -rotate-90 pointer-events-none drop-shadow-lg">
                   {/* Track */}
                   <circle
                    cx="50%" cy="50%" r="46%"
                    className="stroke-white/10" strokeWidth="8" fill="none"
                  />
                  {/* Progress Line */}
                  <circle
                    cx="50%" cy="50%" r="46%"
                    className="transition-all duration-1000 ease-linear"
                    style={{ stroke: currentAccent }}
                    strokeWidth="8" fill="none"
                    strokeDasharray="290%" 
                    strokeDashoffset={`${290 - (290 * progress) / 100}%`}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Angka Timer */}
                <div className="text-center flex flex-col items-center">
                  <div className="text-6xl md:text-8xl font-black font-mono tracking-tighter text-white drop-shadow-2xl mb-2 transition-transform group-hover:scale-105">
                    {formatTime(timeLeft)}
                  </div>
                  <div className="text-white/70 text-xs md:text-sm font-bold uppercase tracking-[0.3em] bg-black/30 px-4 py-1 rounded-full border border-white/10">
                    {isActive ? "Focusing..." : "Paused"}
                  </div>
                </div>
              </div>

              {/* Tombol Kontrol (Play, Pause, Reset) */}
              <div className="flex items-center gap-6">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white shadow-2xl transition-all hover:scale-110 active:scale-95"
                  style={{ background: currentAccent, boxShadow: `0 10px 30px -10px ${currentAccent}` }}
                >
                  {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-2" />}
                </button>
                
                <button
                  onClick={() => changeMode(mode)}
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-all hover:rotate-180"
                  title="Reset Timer"
                >
                  <RotateCcw size={20} />
                </button>
              </div>

          </div>

          {/* AREA KANAN: Tasks & Kustomisasi */}
          <div className="relative z-20 w-full md:w-[400px] bg-black/40 backdrop-blur-2xl p-8 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/10">
                  <ListTodo size={24} className="text-white/80" />
                  <h3 className="text-lg font-black text-white tracking-widest uppercase">Target Sesi Ini</h3>
              </div>

              {/* Input Task */}
              <form onSubmit={addTask} className="mb-6 relative">
                  <input 
                      type="text" 
                      value={newTask}
                      onChange={(e) => setNewTask(e.target.value)}
                      placeholder="Apa yang ingin dikerjakan?" 
                      className="w-full bg-white/5 border border-white/10 text-white placeholder:text-white/40 text-sm px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:border-transparent transition-all"
                      style={{ focusRingColor: currentAccent }}
                  />
                  <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors">
                      <span className="text-xs font-bold px-2">ADD</span>
                  </button>
              </form>

              {/* Task List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                  {tasks.length === 0 ? (
                      <div className="text-center text-white/40 text-sm py-10 italic">
                          Belum ada tugas.
                      </div>
                  ) : (
                      tasks.map((task) => (
                          <div key={task.id} 
                               onClick={() => toggleTask(task.id)}
                               className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/10 cursor-pointer hover:bg-white/10 transition-colors group">
                              <div className="mt-0.5 transition-colors" style={{ color: task.done ? currentAccent : "rgba(255,255,255,0.3)" }}>
                                  <CheckCircle2 size={18} />
                              </div>
                              <span className={`text-sm flex-1 transition-all ${task.done ? 'text-white/40 line-through' : 'text-white/90'}`}>
                                  {task.text}
                              </span>
                              <button onClick={(e) => { e.stopPropagation(); setTasks(tasks.filter(t => t.id !== task.id)) }} 
                                      className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Trash2 size={16} />
                              </button>
                          </div>
                      ))
                  )}
              </div>

              {/* Upload Custom BG */}
              <div className="mt-6 pt-6 border-t border-white/10">
                  <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">Kustomisasi Latar</p>
                  <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      ref={fileInputRef} 
                      className="hidden" 
                  />
                  <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold text-white transition-colors"
                  >
                      <ImagePlus size={16} /> Ganti Gambar Latar
                  </button>
              </div>

          </div>

      </div>

      <style jsx global>{`
        @keyframes kenburns {
            0% { transform: scale(1); }
            100% { transform: scale(1.1); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 10px; }
      `}</style>
    </div>
  );
}
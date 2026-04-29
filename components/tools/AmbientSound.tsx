"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { 
  Play, Pause, Volume2, VolumeX, 
  CloudRain, CloudLightning, CloudDrizzle, Droplets, Droplet, 
  Flame, Waves, Wind, Snowflake, Trees, Leaf, 
  Coffee, BookOpen, Train, Briefcase, Moon, Anchor 
} from "lucide-react";

type SoundCategory = "Hujan & Cuaca" | "Alam Terbuka" | "Tempat & Suasana";

interface SoundConfig {
  id: string;
  label: string;
  icon: any;
  color: string;
  desc: string;
  url: string;
  category: SoundCategory;
}

const SOUND_PRESETS: SoundConfig[] = [
  // --- KATEGORI: HUJAN & CUACA ---
  { id: "heavy-rain", label: "Hujan Lebat", icon: CloudRain, color: "#3b82f6", desc: "Hujan deras terus-menerus", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/rain/heavy-rain.mp3", category: "Hujan & Cuaca" },
  { id: "light-rain", label: "Hujan Rintik", icon: CloudDrizzle, color: "#60a5fa", desc: "Gerimis ringan yang tenang", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/rain/light-rain.mp3", category: "Hujan & Cuaca" },
  { id: "rain-window", label: "Di Jendela", icon: Droplet, color: "#93c5fd", desc: "Rintik mengenai kaca", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/rain/rain-on-window.mp3", category: "Hujan & Cuaca" },
  { id: "rain-leaves", label: "Di Dedaunan", icon: Leaf, color: "#22c55e", desc: "Tetesan hujan pada daun", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/rain/rain-on-leaves.mp3", category: "Hujan & Cuaca" },
  { id: "thunder", label: "Petir & Guruh", icon: CloudLightning, color: "#64748b", desc: "Guruh di kejauhan", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/rain/thunder.mp3", category: "Hujan & Cuaca" },
  
  // --- KATEGORI: ALAM TERBUKA ---
  { id: "campfire", label: "Api Unggun", icon: Flame, color: "#f97316", desc: "Kayu bakar berderak hangat", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/campfire.mp3", category: "Alam Terbuka" },
  { id: "waves", label: "Ombak Pantai", icon: Waves, color: "#0ea5e9", desc: "Deburan ombak memecah pantai", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/waves.mp3", category: "Alam Terbuka" },
  { id: "river", label: "Sungai Segar", icon: Droplets, color: "#0284c7", desc: "Aliran air sungai pegunungan", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/river.mp3", category: "Alam Terbuka" },
  { id: "jungle", label: "Suara Hutan", icon: Trees, color: "#16a34a", desc: "Burung dan satwa liar", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/jungle.mp3", category: "Alam Terbuka" },
  { id: "wind", label: "Angin Bersiul", icon: Wind, color: "#94a3b8", desc: "Angin bertiup cukup kencang", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/howling-wind.mp3", category: "Alam Terbuka" },
  { id: "snow", label: "Langkah di Salju", icon: Snowflake, color: "#7dd3fc", desc: "Suara renyah langkah kaki", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/nature/walk-in-snow.mp3", category: "Alam Terbuka" },

  // --- KATEGORI: TEMPAT & SUASANA ---
  { id: "cafe", label: "Kafe Sibuk", icon: Coffee, color: "#a855f7", desc: "Keramaian ringan & gelas", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/places/cafe.mp3", category: "Tempat & Suasana" },
  { id: "library", label: "Perpustakaan", icon: BookOpen, color: "#8b5cf6", desc: "Ketenangan membalik buku", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/places/library.mp3", category: "Tempat & Suasana" },
  { id: "subway", label: "Stasiun", icon: Train, color: "#f43f5e", desc: "Stasiun bawah tanah", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/places/subway-station.mp3", category: "Tempat & Suasana" },
  { id: "office", label: "Kantor", icon: Briefcase, color: "#6366f1", desc: "Ketik keyboard dan gumam", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/places/office.mp3", category: "Tempat & Suasana" },
  { id: "night-village", label: "Desa Malam", icon: Moon, color: "#312e81", desc: "Suara jangkrik malam", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/places/night-village.mp3", category: "Tempat & Suasana" },
  { id: "underwater", label: "Bawah Air", icon: Anchor, color: "#0369a1", desc: "Gelembung & tekanan laut", url: "https://raw.githubusercontent.com/remvze/moodist/main/public/sounds/places/underwater.mp3", category: "Tempat & Suasana" },
];

export default function AmbientSound() {
  const initialTracks: Record<string, { playing: boolean, volume: number }> = {};
  SOUND_PRESETS.forEach(p => {
    initialTracks[p.id] = { playing: false, volume: 50 };
  });

  const [tracks, setTracks] = useState(initialTracks);
  const [masterPlaying, setMasterPlaying] = useState(false);
  const audioRefs = useRef<Record<string, HTMLAudioElement>>({});

  // Group presets by category
  const groupedPresets = useMemo(() => {
    const groups: Record<string, SoundConfig[]> = {};
    SOUND_PRESETS.forEach(p => {
      if (!groups[p.category]) groups[p.category] = [];
      groups[p.category].push(p);
    });
    return groups;
  }, []);

  // Sync state to audio elements
  useEffect(() => {
      SOUND_PRESETS.forEach(preset => {
          const audio = audioRefs.current[preset.id];
          if (!audio) return;

          const isPlaying = tracks[preset.id].playing && masterPlaying;
          
          if (isPlaying) {
              audio.volume = tracks[preset.id].volume / 100;
              audio.play().catch(e => console.log("Audio play blocked by browser:", e));
          } else {
              audio.pause();
          }
      });
  }, [tracks, masterPlaying]);

  const handleVolumeChange = (id: string, val: number) => {
      setTracks(prev => ({ ...prev, [id]: { ...prev[id], volume: val } }));
      if (audioRefs.current[id]) {
          audioRefs.current[id].volume = val / 100;
      }
  };

  const toggleTrack = (id: string) => {
      setTracks(prev => ({
          ...prev,
          [id]: { ...prev[id], playing: !prev[id].playing }
      }));
      // Auto-start master jika track dinyalakan
      if (!masterPlaying && !tracks[id].playing) setMasterPlaying(true);
  };

  const toggleMaster = () => {
      if (!masterPlaying) {
          // Auto-play default track if empty
          const isAnyPlaying = Object.values(tracks).some(t => t.playing);
          if (!isAnyPlaying) {
              setTracks(prev => ({ ...prev, "light-rain": { ...prev["light-rain"], playing: true } }));
          }
      }
      setMasterPlaying(!masterPlaying);
  };

  const clearAll = () => {
      const resetTracks = { ...tracks };
      Object.keys(resetTracks).forEach(k => resetTracks[k].playing = false);
      setTracks(resetTracks);
      setMasterPlaying(false);
  };

  const isAnyActive = Object.values(tracks).some(t => t.playing);
  const activeCount = Object.values(tracks).filter(t => t.playing).length;

  return (
    <div className="w-full relative">
      {/* Hidden Audio Elements */}
      {SOUND_PRESETS.map(preset => (
          <audio 
              key={preset.id}
              ref={(el) => { if (el) audioRefs.current[preset.id] = el; }}
              src={preset.url}
              loop
              preload="none"
          />
      ))}

      <div className="space-y-16">
          {Object.entries(groupedPresets).map(([category, presets]) => (
              <div key={category} className="animate-in fade-in duration-700">
                  <div className="flex items-center gap-4 mb-8">
                      <h3 className="text-sm md:text-base font-black tracking-widest uppercase tool-muted">
                          {category}
                      </h3>
                      <div className="h-[2px] flex-1 rounded-full" style={{ background: "var(--card-border)" }}></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {presets.map(preset => {
                          const isActive = tracks[preset.id].playing;
                          return (
                              <div key={preset.id} 
                                   className={`flex flex-col p-4 rounded-3xl transition-all duration-300 border
                                              ${isActive 
                                                  ? 'bg-indigo-500/5 dark:bg-indigo-500/10 border-indigo-500/50 shadow-md shadow-indigo-500/10' 
                                                  : 'bg-[var(--card-bg)] border-[var(--card-border)] hover:border-[var(--card-border-hover)] shadow-sm'
                                              }`}>
                                  
                                  <div className="flex items-center gap-4">
                                      <div className={`w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center transition-colors duration-300 shadow-sm
                                          ${isActive ? 'bg-indigo-500 text-white' : 'bg-black/5 dark:bg-white/5 text-[var(--text-muted)]'}`}>
                                          <preset.icon size={20} />
                                      </div>
                                      
                                      <div className="flex-1 min-w-0">
                                          <h4 className="font-bold text-sm md:text-base tool-title mb-0.5 truncate">{preset.label}</h4>
                                          <p className="text-xs tool-muted truncate opacity-80">{preset.desc}</p>
                                      </div>

                                      <button 
                                          onClick={() => toggleTrack(preset.id)}
                                          className={`w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all duration-300
                                              ${isActive 
                                                  ? 'bg-indigo-500/20 text-indigo-500 hover:bg-indigo-500/30' 
                                                  : 'bg-transparent text-[var(--text-muted)] border border-[var(--card-border)] hover:bg-black/5 dark:hover:bg-white/5'
                                              }`}
                                      >
                                          {isActive ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" className="ml-0.5" />}
                                      </button>
                                  </div>
                                  
                                  {/* Volume Slider - Animated Expand/Collapse */}
                                  <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isActive ? 'h-8 mt-4 opacity-100' : 'h-0 mt-0 opacity-0'}`}>
                                      <div className="flex items-center gap-3 px-1 h-full">
                                          <VolumeX size={14} className="text-indigo-500/50 shrink-0" />
                                          <input 
                                              type="range" min="0" max="100" 
                                              value={tracks[preset.id].volume}
                                              onChange={(e) => handleVolumeChange(preset.id, parseInt(e.target.value))}
                                              disabled={!isActive}
                                              className="flex-1 h-1.5 rounded-full appearance-none outline-none transition-all cursor-pointer"
                                              style={{ 
                                                  background: isActive 
                                                      ? `linear-gradient(to right, #6366f1 ${tracks[preset.id].volume}%, var(--card-border) ${tracks[preset.id].volume}%)` 
                                                      : 'var(--card-border)'
                                              }}
                                          />
                                          <Volume2 size={14} className="text-indigo-500/50 shrink-0" />
                                      </div>
                                  </div>

                              </div>
                          )
                      })}
                  </div>
              </div>
          ))}
      </div>

      {/* FLOATING MASTER CONTROL BAR */}
      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                      ${isAnyActive ? 'translate-y-0 opacity-100' : 'translate-y-24 opacity-0 pointer-events-none'}`}>
          <div className="flex items-center gap-4 md:gap-6 px-6 py-3 rounded-full border shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] backdrop-blur-2xl"
               style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              
              <div className="hidden sm:flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-widest tool-muted">Master Mix</span>
                  <span className="text-sm font-black tool-title">{activeCount} Track Aktif</span>
              </div>

              <div className="w-px h-8 hidden sm:block" style={{ background: "var(--card-border)" }}></div>

              <button
                onClick={toggleMaster}
                className="relative w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white shadow-xl transition-transform hover:scale-110 active:scale-95 bg-indigo-500"
                style={{ boxShadow: masterPlaying ? "0 10px 30px -10px rgba(99, 102, 241, 0.5)" : "none" }}
              >
                {masterPlaying && <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></div>}
                {masterPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
              </button>

              <button 
                  onClick={clearAll}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center transition-colors hover:bg-red-500/10 text-red-500/70 hover:text-red-500"
                  title="Hentikan Semua"
              >
                  <VolumeX size={18} />
              </button>
          </div>
      </div>
      
      <style jsx global>{`
        input[type=range]::-webkit-slider-thumb {
            -webkit-appearance: none;
            height: 14px;
            width: 14px;
            border-radius: 50%;
            background: #fff;
            border: 2px solid #6366f1;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            transition: transform 0.1s;
        }
        input[type=range]:disabled::-webkit-slider-thumb {
            border-color: var(--text-muted);
            background: var(--text-muted);
        }
        input[type=range]:active::-webkit-slider-thumb {
            transform: scale(1.3);
        }
      `}</style>
    </div>
  );
}

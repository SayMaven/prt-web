"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRight, Lock, Unlock, Monitor, Image as ImageIcon, Smartphone } from "lucide-react";

export default function AspectRatio() {
  const [width, setWidth] = useState<string>("1920");
  const [height, setHeight] = useState<string>("1080");
  const [ratioStr, setRatioStr] = useState("16:9");
  
  // Fitur Lock Ratio (Auto calculate missing side)
  const [isLocked, setIsLocked] = useState(false);
  const [lockedRatioNum, setLockedRatioNum] = useState<number>(1920/1080);

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b);
  };

  // Recalculate Ratio
  useEffect(() => {
    const w = parseInt(width);
    const h = parseInt(height);

    if (!isLocked) {
        if (w > 0 && h > 0) {
          const divisor = gcd(w, h);
          setRatioStr(`${w / divisor}:${h / divisor}`);
          setLockedRatioNum(w / h);
        } else {
          setRatioStr("-:-");
        }
    }
  }, [width, height, isLocked]);

  const handleWidthChange = (val: string) => {
      setWidth(val);
      const w = parseInt(val);
      if (isLocked && w > 0) {
          setHeight(Math.round(w / lockedRatioNum).toString());
      }
  };

  const handleHeightChange = (val: string) => {
      setHeight(val);
      const h = parseInt(val);
      if (isLocked && h > 0) {
          setWidth(Math.round(h * lockedRatioNum).toString());
      }
  };

  const swapDimensions = () => {
      const tempW = width;
      setWidth(height);
      setHeight(tempW);
      if (!isLocked) {
          setLockedRatioNum(parseInt(height) / parseInt(tempW));
      }
  };

  const toggleLock = () => {
      const w = parseInt(width);
      const h = parseInt(height);
      if (!isLocked && w > 0 && h > 0) {
          setLockedRatioNum(w / h);
      }
      setIsLocked(!isLocked);
  };

  const applyPreset = (w: string, h: string) => {
      setIsLocked(false);
      setWidth(w);
      setHeight(h);
  };

  const wNum = parseInt(width) || 1;
  const hNum = parseInt(height) || 1;
  const validAspectRatio = (wNum > 0 && hNum > 0) ? `${wNum}/${hNum}` : '1/1';

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 items-stretch">
      
      {/* BAGIAN KIRI: KONTROL */}
      <div className="w-full lg:w-[450px] p-8 border rounded-[2rem] shadow-xl flex flex-col bg-black/10 backdrop-blur-md transition-all"
           style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          
          <h2 className="text-sm font-black uppercase tracking-widest mb-6" style={{ color: "var(--text-secondary)" }}>
              Dimensi Resolusi
          </h2>

          <div className="flex items-center gap-4 mb-8 relative">
              {/* Width Input */}
              <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Width</label>
                  <div className="relative">
                      <input 
                          type="number" 
                          value={width} 
                          onChange={(e) => handleWidthChange(e.target.value)}
                          className="w-full bg-black/20 border rounded-xl px-4 py-3 text-2xl font-mono focus:outline-none transition-colors"
                          style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", outlineColor: "var(--accent)" }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-50">PX</span>
                  </div>
              </div>

              {/* Swap Button */}
              <button 
                  onClick={swapDimensions}
                  className="mt-6 w-10 h-10 rounded-full border shadow-sm flex items-center justify-center shrink-0 transition-transform hover:rotate-180 hover:scale-110 active:scale-95 z-10 bg-black/50"
                  style={{ borderColor: "var(--card-border)", color: "var(--accent)" }}
                  title="Swap Width & Height"
              >
                  <ArrowLeftRight size={16} />
              </button>

              {/* Height Input */}
              <div className="flex-1">
                  <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: "var(--text-muted)" }}>Height</label>
                  <div className="relative">
                      <input 
                          type="number" 
                          value={height} 
                          onChange={(e) => handleHeightChange(e.target.value)}
                          className="w-full bg-black/20 border rounded-xl px-4 py-3 text-2xl font-mono focus:outline-none transition-colors"
                          style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", outlineColor: "var(--accent)" }}
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold opacity-50">PX</span>
                  </div>
              </div>

              {/* Garis penghubung lock di belakang (visual sugar) */}
              {isLocked && (
                  <div className="absolute top-[65%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-12 border-b-2 border-x-2 rounded-b-xl -z-10 opacity-30 pointer-events-none" style={{ borderColor: "var(--accent)" }}></div>
              )}
          </div>

          <div className="flex justify-between items-center bg-black/20 p-4 rounded-xl border mb-8" style={{ borderColor: "var(--card-border)" }}>
              <div>
                  <p className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-muted)" }}>Aspect Ratio</p>
                  <p className="text-3xl font-black font-mono tracking-tighter" style={{ color: "var(--accent)" }}>{ratioStr}</p>
              </div>
              <button 
                  onClick={toggleLock}
                  className={`p-3 rounded-lg border transition-all ${isLocked ? 'shadow-md shadow-[color:var(--accent-subtle)]' : 'opacity-60 hover:opacity-100'}`}
                  style={isLocked ? { background: "var(--accent)", color: "white", borderColor: "var(--accent)" } : { background: "transparent", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                  title="Lock Aspect Ratio"
              >
                  {isLocked ? <Lock size={20} /> : <Unlock size={20} />}
              </button>
          </div>

          <div className="flex-1">
              <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--text-secondary)" }}>Presets Populer</h3>
              <div className="grid grid-cols-2 gap-2">
                  <PresetBtn icon={<Monitor size={14}/>} label="1080p (16:9)" w="1920" h="1080" action={applyPreset} />
                  <PresetBtn icon={<Monitor size={14}/>} label="4K UHD (16:9)" w="3840" h="2160" action={applyPreset} />
                  <PresetBtn icon={<Smartphone size={14}/>} label="IG Story (9:16)" w="1080" h="1920" action={applyPreset} />
                  <PresetBtn icon={<ImageIcon size={14}/>} label="Square (1:1)" w="1080" h="1080" action={applyPreset} />
                  <PresetBtn icon={<ImageIcon size={14}/>} label="Portrait (4:5)" w="1080" h="1350" action={applyPreset} />
                  <PresetBtn icon={<Monitor size={14}/>} label="Classic (4:3)" w="1024" h="768" action={applyPreset} />
              </div>
          </div>

      </div>

      {/* BAGIAN KANAN: VISUALIZER */}
      <div className="flex-1 p-8 border rounded-[2rem] shadow-xl flex flex-col relative overflow-hidden min-h-[400px]"
           style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          
          <h2 className="text-sm font-black uppercase tracking-widest mb-6 relative z-10" style={{ color: "var(--text-secondary)" }}>
              Visualisasi Layar
          </h2>
          
          {/* Background pattern grid */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>

          <div className="flex-1 w-full flex items-center justify-center p-4 relative z-10">
              {/* Kotak Visual */}
              <div 
                  className="flex flex-col items-center justify-center border-4 rounded-xl shadow-2xl transition-all duration-500 overflow-hidden relative group"
                  style={{ 
                      aspectRatio: validAspectRatio,
                      maxHeight: '100%',
                      maxWidth: '100%',
                      borderColor: "var(--accent)",
                      background: "var(--accent-subtle)"
                  }}
              >
                  {/* Animasi glow di dalam kotak */}
                  <div className="absolute inset-0 opacity-20 bg-gradient-to-tr from-transparent via-white to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]"></div>

                  <span className="font-mono font-black text-xl sm:text-3xl lg:text-5xl drop-shadow-md z-10" style={{ color: "var(--text-primary)" }}>
                      {ratioStr}
                  </span>
                  <span className="font-mono text-xs sm:text-sm font-bold opacity-70 z-10" style={{ color: "var(--text-primary)" }}>
                      {wNum} × {hNum}
                  </span>
              </div>
          </div>

      </div>

      <style jsx global>{`
        @keyframes shimmer {
            100% { transform: translateX(100%); }
        }
      `}</style>

    </div>
  );
}

function PresetBtn({ icon, label, w, h, action }: { icon: any, label: string, w: string, h: string, action: (w:string, h:string)=>void }) {
    return (
        <button 
            onClick={() => action(w, h)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl border bg-black/10 hover:bg-black/20 transition-all text-left group"
            style={{ borderColor: "var(--card-border)" }}
        >
            <span className="text-white/50 group-hover:text-[color:var(--accent)] transition-colors">{icon}</span>
            <span className="text-xs font-bold" style={{ color: "var(--text-secondary)" }}>{label}</span>
        </button>
    );
}
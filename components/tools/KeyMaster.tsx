"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCcw, Activity, Menu, Fingerprint, Keyboard, History } from "lucide-react";

// --- ICON COMPONENTS ---
const WinIcon = () => (
  <svg viewBox="0 0 88 88" className="w-4 h-4 fill-current">
    <path d="M0 12.4l35.7-4.8v34.6H0V12.4zm0 33.3h35.7v34.8L0 75.6V45.7zm39.3-38.6l48-6.9v36.9h-48v-30zm0 33.5l48-.2v37.1l-48-6.7v-30.2z"/>
  </svg>
);

// --- DATA LAYOUT KEYBOARD (FULL SIZE 104) ---

// 1. Function Row (Top)
const ROW_F = [
  { code: "Escape", label: "Esc", w: 1 },
  { spacer: 1 },
  { code: "F1", label: "F1" }, { code: "F2", label: "F2" }, { code: "F3", label: "F3" }, { code: "F4", label: "F4" },
  { spacer: 0.5 },
  { code: "F5", label: "F5" }, { code: "F6", label: "F6" }, { code: "F7", label: "F7" }, { code: "F8", label: "F8" },
  { spacer: 0.5 },
  { code: "F9", label: "F9" }, { code: "F10", label: "F10" }, { code: "F11", label: "F11" }, { code: "F12", label: "F12" }
];

const ROW_NAV_TOP = [
  { code: "PrintScreen", label: "PrtSc" }, { code: "ScrollLock", label: "ScrLk" }, { code: "Pause", label: "Pause" }
];

// 2. Main Alphanumeric Block
const MAIN_ROWS = [
  [
    { code: "Backquote", label: "`" }, { code: "Digit1", label: "1" }, { code: "Digit2", label: "2" }, { code: "Digit3", label: "3" },
    { code: "Digit4", label: "4" }, { code: "Digit5", label: "5" }, { code: "Digit6", label: "6" }, { code: "Digit7", label: "7" },
    { code: "Digit8", label: "8" }, { code: "Digit9", label: "9" }, { code: "Digit0", label: "0" }, { code: "Minus", label: "-" },
    { code: "Equal", label: "=" }, { code: "Backspace", label: "Backspace", w: 2 }
  ],
  [
    { code: "Tab", label: "Tab", w: 1.5 }, { code: "KeyQ", label: "Q" }, { code: "KeyW", label: "W" }, { code: "KeyE", label: "E" },
    { code: "KeyR", label: "R" }, { code: "KeyT", label: "T" }, { code: "KeyY", label: "Y" }, { code: "KeyU", label: "U" },
    { code: "KeyI", label: "I" }, { code: "KeyO", label: "O" }, { code: "KeyP", label: "P" }, { code: "BracketLeft", label: "[" },
    { code: "BracketRight", label: "]" }, { code: "Backslash", label: "\\", w: 1.5 }
  ],
  [
    { code: "CapsLock", label: "Caps", w: 1.75 }, { code: "KeyA", label: "A" }, { code: "KeyS", label: "S" }, { code: "KeyD", label: "D" },
    { code: "KeyF", label: "F" }, { code: "KeyG", label: "G" }, { code: "KeyH", label: "H" }, { code: "KeyJ", label: "J" },
    { code: "KeyK", label: "K" }, { code: "KeyL", label: "L" }, { code: "Semicolon", label: ";" }, { code: "Quote", label: "'" },
    { code: "Enter", label: "Enter", w: 2.25 }
  ],
  [
    { code: "ShiftLeft", label: "Shift", w: 2.25 }, { code: "KeyZ", label: "Z" }, { code: "KeyX", label: "X" }, { code: "KeyC", label: "C" },
    { code: "KeyV", label: "V" }, { code: "KeyB", label: "B" }, { code: "KeyN", label: "N" }, { code: "KeyM", label: "M" },
    { code: "Comma", label: "," }, { code: "Period", label: "." }, { code: "Slash", label: "/" }, { code: "ShiftRight", label: "Shift", w: 2.75 }
  ],
  [
    { code: "ControlLeft", label: "Ctrl", w: 1.25 }, 
    { code: "MetaLeft", label: "Win", w: 1.25, icon: <WinIcon/> }, 
    { code: "AltLeft", label: "Alt", w: 1.25 }, 
    { code: "Space", label: "", w: 6.25 }, 
    { code: "AltRight", label: "Alt", w: 1.25 },  
    { code: "ContextMenu", label: "Menu", w: 1.25, icon: <Menu size={14}/> }, 
    { code: "ControlRight", label: "Ctrl", w: 1.25 }
  ]
];

// 3. Navigation Cluster
const NAV_CLUSTER = [
  [{ code: "Insert", label: "Ins" }, { code: "Home", label: "Home" }, { code: "PageUp", label: "PgUp" }],
  [{ code: "Delete", label: "Del" }, { code: "End", label: "End" }, { code: "PageDown", label: "PgDn" }],
];

// 4. Numpad
const NUMPAD = [
  { code: "NumLock", label: "Num" }, { code: "NumpadDivide", label: "/" }, { code: "NumpadMultiply", label: "*" }, { code: "NumpadSubtract", label: "-" },
  { code: "Numpad7", label: "7" }, { code: "Numpad8", label: "8" }, { code: "Numpad9", label: "9" }, { code: "NumpadAdd", label: "+", h: 2 }, 
  { code: "Numpad4", label: "4" }, { code: "Numpad5", label: "5" }, { code: "Numpad6", label: "6" },
  { code: "Numpad1", label: "1" }, { code: "Numpad2", label: "2" }, { code: "Numpad3", label: "3" }, { code: "NumpadEnter", label: "Ent", h: 2 }, 
  { code: "Numpad0", label: "0", w: 2 }, { code: "NumpadDecimal", label: "." } 
];

export default function KeyMaster() {
  const [activeKeys, setActiveKeys] = useState<Set<string>>(new Set());
  const [historyKeys, setHistoryKeys] = useState<Set<string>>(new Set());
  const [lastEvent, setLastEvent] = useState<{ code: string; key: string } | null>(null);
  const [nkroCount, setNkroCount] = useState(0);

  const playSound = () => {
    const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3");
    audio.volume = 0.15;
    audio.play().catch(() => {});
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Prevent default on most keys so scrolling/shortcuts don't interrupt
    if(e.code !== "F5" && e.code !== "F12" && !e.ctrlKey) {
        e.preventDefault();
    }
    
    if (!e.repeat) playSound();

    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.add(e.code);
      setNkroCount(newSet.size);
      return newSet;
    });

    setHistoryKeys((prev) => new Set(prev).add(e.code));
    setLastEvent({ code: e.code, key: e.key });
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if(e.code !== "F5" && e.code !== "F12" && !e.ctrlKey) {
        e.preventDefault();
    }
    
    setHistoryKeys((prev) => new Set(prev).add(e.code));
    setLastEvent({ code: e.code, key: e.key });

    setActiveKeys((prev) => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      setNkroCount(newSet.size);
      return newSet;
    });
  }, []);

  const handleBlur = useCallback(() => {
    setActiveKeys(new Set());
    setNkroCount(0);
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: false });
    window.addEventListener("keyup", handleKeyUp, { passive: false });
    window.addEventListener("blur", handleBlur);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, [handleKeyDown, handleKeyUp, handleBlur]);

  const resetTest = () => {
    setActiveKeys(new Set());
    setHistoryKeys(new Set());
    setNkroCount(0);
    setLastEvent(null);
  };

  // --- SUB-COMPONENT: SINGLE KEY ---
  const KeyCap = ({ code, label, w = 1, h = 1, icon, className = "", isStatic = false }: any) => {
    const isActive = activeKeys.has(code);
    const isTested = historyKeys.has(code);

    let baseStyles = "relative flex items-center justify-center rounded-lg border-b-4 font-bold text-xs transition-all duration-75 select-none";
    let colorStyles = "";
    
    if (isStatic) {
        colorStyles = "bg-black/40 border-black/80 text-black/40 cursor-not-allowed";
    } else {
        if (isActive) {
            colorStyles = "text-white translate-y-1 shadow-inner border-b-0";
        } else if (isTested) {
            colorStyles = "border-b-4 text-white opacity-90";
        } else {
            colorStyles = "bg-black/20 border-black/50 text-white/40";
        }
    }

    const style: React.CSSProperties = {};
    if (w !== 1) style.flexGrow = w; 
    if (h !== 1) style.gridRow = `span ${h}`; 
    if (w > 1 && className.includes("grid")) style.gridColumn = `span ${w}`; 

    if (!isStatic && isActive) {
        style.background = "var(--accent)";
        style.boxShadow = "inset 0 0 10px rgba(0,0,0,0.5)";
    } else if (!isStatic && isTested) {
        // Create a darker variant of accent for tested keys using CSS mix-blend-mode or direct variable
        style.background = "var(--accent)";
        style.borderColor = "var(--accent-subtle, rgba(0,0,0,0.5))";
        style.opacity = 0.5; // Dim the tested key
    } else if (!isStatic && !isTested) {
        style.borderColor = "var(--card-border)";
    }

    return (
      <div 
        className={`${baseStyles} ${colorStyles} ${className} shadow-sm backdrop-blur-sm overflow-hidden`} 
        style={{ 
            width: className.includes("flex-none") ? `${w * 38}px` : undefined, 
            flex: className.includes("flex-1") ? w : undefined,
            height: h > 1 ? "100%" : "48px",
            ...style
        }}
        title={isStatic ? "Tombol Fn tidak dapat dideteksi oleh browser" : label}
      >
        {/* Glow effect on active */}
        {isActive && !isStatic && (
            <div className="absolute inset-0 bg-white/20"></div>
        )}
        <span className="relative z-10">{icon ? icon : label}</span>
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-500">
      
      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="border rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-lg backdrop-blur-md relative overflow-hidden group" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><Fingerprint size={40} style={{ color: "var(--accent)" }}/></div>
            <span className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70" style={{ color: "var(--text-secondary)" }}>Active Keys</span>
            <span className={`text-3xl font-mono font-black ${nkroCount > 6 ? "" : ""}`} style={nkroCount > 6 ? { color: "var(--accent)" } : { color: "var(--text-primary)" }}>
                {nkroCount} <span className="text-sm font-bold opacity-50">NKRO</span>
            </span>
        </div>
        
        <div className="border rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-lg backdrop-blur-md relative overflow-hidden group" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><Keyboard size={40} style={{ color: "var(--accent)" }}/></div>
            <span className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70" style={{ color: "var(--text-secondary)" }}>Last Code</span>
            <span className="text-xl font-mono font-black truncate w-full text-center" style={{ color: "var(--accent)" }}>
                {lastEvent?.code || "-"}
            </span>
        </div>
        
        <div className="border rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-lg backdrop-blur-md relative overflow-hidden group" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:scale-110 transition-transform"><History size={40} style={{ color: "var(--accent)" }}/></div>
            <span className="text-[10px] uppercase font-black tracking-widest mb-1 opacity-70" style={{ color: "var(--text-secondary)" }}>Tested</span>
            <span className="text-3xl font-mono font-black" style={{ color: "var(--text-primary)" }}>
                {historyKeys.size}<span className="text-sm font-bold opacity-50">/104</span>
            </span>
        </div>
        
        <button 
            onClick={resetTest}
            className="border rounded-2xl p-4 flex flex-col items-center justify-center transition-all shadow-lg backdrop-blur-md hover:scale-95 active:scale-90 group relative overflow-hidden"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
            <div className="absolute inset-0 bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <RefreshCcw className="mb-2 text-red-500 group-hover:rotate-180 transition-transform duration-700" size={24} />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Reset</span>
        </button>
      </div>

      {/* KEYBOARD VISUALIZER CONTAINER */}
      <div className="flex justify-center overflow-x-auto pb-8 pt-4 custom-scrollbar">
        <div className="p-8 sm:p-10 rounded-[3rem] border shadow-2xl inline-block min-w-[1000px] relative overflow-hidden" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            
            {/* Dekorasi Cahaya Keyboard Chassis */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-20 blur-[100px] opacity-20 pointer-events-none" style={{ background: "var(--accent)" }}></div>

            <div className="relative z-10">
                {/* ROW 0: ESC & F-KEYS */}
                <div className="flex gap-12 mb-4">
                    <KeyCap {...ROW_F[0]} className="w-[48px]" /> {/* Esc */}
                    <div className="flex gap-2"> {/* F1-F4 */}
                        {ROW_F.slice(2, 6).map(k => <KeyCap key={k.code} {...k} className="w-[48px]" />)}
                    </div>
                    <div className="flex gap-2"> {/* F5-F8 */}
                        {ROW_F.slice(7, 11).map(k => <KeyCap key={k.code} {...k} className="w-[48px]" />)}
                    </div>
                    <div className="flex gap-2"> {/* F9-F12 */}
                        {ROW_F.slice(12).map(k => <KeyCap key={k.code} {...k} className="w-[48px]" />)}
                    </div>
                    {/* Print Screen Block */}
                    <div className="flex gap-2 ml-auto">
                        {ROW_NAV_TOP.map(k => <KeyCap key={k.code} {...k} className="w-[48px]" />)}
                    </div>
                </div>

                {/* MAIN BODY: 3 COLUMNS (Main, Nav, Num) */}
                <div className="flex gap-4">
                    
                    {/* 1. MAIN ALPHANUMERIC BOARD */}
                    <div className="flex flex-col gap-2 w-[750px]">
                        {MAIN_ROWS.map((row, rIdx) => (
                            <div key={rIdx} className="flex gap-2 w-full">
                                {row.map((k: any) => (
                                    <KeyCap key={k.code} {...k} className="flex-1" />
                                ))}
                            </div>
                        ))}
                    </div>

                    {/* 2. NAVIGATION CLUSTER */}
                    <div className="flex flex-col justify-between w-[156px]">
                        {/* Ins/Home/PgUp Block */}
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                {NAV_CLUSTER[0].map(k => <KeyCap key={k.code} {...k} className="w-[48px]" />)}
                            </div>
                            <div className="flex gap-2">
                                {NAV_CLUSTER[1].map(k => <KeyCap key={k.code} {...k} className="w-[48px]" />)}
                            </div>
                        </div>

                        {/* Arrow Keys */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-center">
                                <KeyCap code="ArrowUp" label="↑" className="w-[48px]" />
                            </div>
                            <div className="flex gap-2">
                                <KeyCap code="ArrowLeft" label="←" className="w-[48px]" />
                                <KeyCap code="ArrowDown" label="↓" className="w-[48px]" />
                                <KeyCap code="ArrowRight" label="→" className="w-[48px]" />
                            </div>
                        </div>
                    </div>

                    {/* 3. NUMPAD (Grid for alignment) */}
                    <div className="grid grid-cols-4 gap-2 w-[212px] h-fit">
                        {NUMPAD.map(k => (
                            <KeyCap key={k.code} {...k} className={`grid-col-span-${k.w || 1} w-full`} />
                        ))}
                    </div>

                </div>
            </div>
        </div>
      </div>

      <div className="text-center flex justify-center mt-4">
        <div className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--accent)" }}></span>
                <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "var(--accent)" }}></span>
            </div>
            <span className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-primary)" }}>Listening for Input...</span> 
            <span className="text-xs font-medium ml-2 opacity-50" style={{ color: "var(--text-secondary)" }}>(Tekan tombol fisik keyboard Anda)</span>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
      `}</style>
    </div>
  );
}
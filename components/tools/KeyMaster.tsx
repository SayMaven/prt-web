"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCcw, Activity, Menu } from "lucide-react";

// --- ICON COMPONENTS ---
const WinIcon = () => (
  <svg viewBox="0 0 88 88" className="w-4 h-4 fill-current">
    <path d="M0 12.4l35.7-4.8v34.6H0V12.4zm0 33.3h35.7v34.8L0 75.6V45.7zm39.3-38.6l48-6.9v36.9h-48v-30zm0 33.5l48-.2v37.1l-48-6.7v-30.2z"/>
  </svg>
);

// --- DATA LAYOUT KEYBOARD (FULL SIZE 104) ---
// Note: Layout ini sama seperti sebelumnya

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
  // ROW 5: Bottom Row (Fixed: Removed Right Win Key)
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
    // Coba prevent default, tapi PrintScreen sering lolos karena level OS
    if(e.code !== "F5" && e.code !== "F12") {
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

  // --- PERBAIKAN UTAMA DI SINI (HandleKeyUp) ---
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    
    // Logika Tambahan: Jika KeyDown dicuri OS (misal PrintScreen), 
    // kita tangkap di KeyUp agar tetap terhitung sebagai "Tested".
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
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
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

    let baseStyles = "relative flex items-center justify-center rounded bg-slate-800 border-b-4 border-slate-950 text-slate-500 font-bold text-xs transition-all duration-75 select-none";
    
    if (isStatic) {
        baseStyles = "relative flex items-center justify-center rounded bg-slate-900 border-b-4 border-black text-slate-700 font-bold text-xs opacity-50 cursor-not-allowed";
    } else {
        if (isActive) {
            baseStyles = "relative flex items-center justify-center rounded bg-emerald-500 border-b-0 border-emerald-700 text-black font-bold text-xs translate-y-1 shadow-inner";
        } else if (isTested) {
            baseStyles = "relative flex items-center justify-center rounded bg-slate-700 border-b-4 border-slate-900 text-emerald-400 font-bold text-xs";
        }
    }

    const style: React.CSSProperties = {};
    if (w !== 1) style.flexGrow = w; 
    if (h !== 1) style.gridRow = `span ${h}`; 
    if (w > 1 && className.includes("grid")) style.gridColumn = `span ${w}`; 

    return (
      <div 
        className={`${baseStyles} ${className}`} 
        style={{ 
            width: className.includes("flex-none") ? `${w * 38}px` : undefined, 
            flex: className.includes("flex-1") ? w : undefined,
            height: h > 1 ? "100%" : "48px",
            ...style
        }}
        title={isStatic ? "Tombol Fn tidak dapat dideteksi oleh browser (Hardware Layer)" : label}
      >
        {icon ? icon : label}
      </div>
    );
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8">
      
      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Active Keys</span>
            <span className={`text-2xl font-mono font-bold ${nkroCount > 6 ? "text-emerald-400" : "text-white"}`}>
                {nkroCount} <span className="text-sm text-slate-600">NKRO</span>
            </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Last Code</span>
            <span className="text-lg font-mono font-bold text-blue-400 truncate w-full text-center">
                {lastEvent?.code || "-"}
            </span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex flex-col items-center">
            <span className="text-slate-500 text-[10px] uppercase font-bold tracking-wider">Tested</span>
            <span className="text-2xl font-mono font-bold text-white">
                {historyKeys.size}<span className="text-slate-600 text-sm">/104</span>
            </span>
        </div>
        <button 
            onClick={resetTest}
            className="bg-red-900/20 border border-red-500/30 hover:bg-red-900/40 p-3 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors group"
        >
            <RefreshCcw className="text-red-400 group-hover:rotate-180 transition-transform duration-500 mb-1" size={18} />
            <span className="text-red-300 text-[10px] font-bold uppercase">Reset</span>
        </button>
      </div>

      {/* KEYBOARD VISUALIZER CONTAINER */}
      <div className="flex justify-center overflow-x-auto pb-8">
        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800 shadow-2xl inline-block min-w-[1000px]">
            
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

      <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-2">
        <Activity size={14} className="text-emerald-500"/> <span className="text-emerald-500">Listening...</span> Tekan tombol fisik keyboard Anda.
      </div>

    </div>
  );
}
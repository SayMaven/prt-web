"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HexColorPicker } from "react-colorful";

const PRESETS = ["#6366f1", "#10b981", "#ec4899", "#f59e0b", "#06b6d4", "#8b5cf6"];
const LS_DARK = "prt-dark";
const LS_ACCENT = "prt-accent";

function applyAccent(color: string) {
  const root = document.documentElement;
  root.style.setProperty("--accent", color);
  root.style.setProperty("--accent-text", color);
  // hex to rgba helper
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  root.style.setProperty("--accent-subtle", `rgba(${r},${g},${b},0.15)`);
  root.style.setProperty("--accent-glow",   `rgba(${r},${g},${b},0.40)`);
}

function applyDark(dark: boolean) {
  if (dark) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

export default function ThemeController() {
  const [isDark, setIsDark] = useState(true);
  const [accent, setAccent] = useState("#6366f1");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedDark   = localStorage.getItem(LS_DARK);
    const savedAccent = localStorage.getItem(LS_ACCENT);

    const dark = savedDark !== null ? savedDark === "true" : true;
    setIsDark(dark);
    applyDark(dark);

    const acc = savedAccent ?? "#6366f1";
    setAccent(acc);
    applyAccent(acc);

    setMounted(true);
  }, []);

  // Handle click outside to close picker
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setPickerOpen(false);
      }
    }
    
    if (pickerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [pickerOpen]);

  const toggleDark = useCallback(() => {
    setIsDark(prev => {
      const next = !prev;
      applyDark(next);
      localStorage.setItem(LS_DARK, String(next));
      return next;
    });
  }, []);

  const changeAccent = useCallback((color: string) => {
    setAccent(color);
    applyAccent(color);
    localStorage.setItem(LS_ACCENT, color);
  }, []);

  if (!mounted) return null;

  return (
    <div ref={containerRef} className="flex flex-row items-end gap-3">

      {/* ── Color Picker Panel ── */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="absolute bottom-16 right-0 rounded-3xl border p-5 backdrop-blur-2xl shadow-2xl w-60"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              boxShadow: `0 12px 50px var(--accent-glow)`,
            }}
          >
            <p className="text-center text-xs font-black tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>
              Warna Tema
            </p>

            {/* Custom Color Picker using React-Colorful */}
            <div className="flex flex-col items-center justify-center mb-5 w-full">
              <div className="w-full custom-color-picker rounded-2xl overflow-hidden shadow-xl border" style={{ borderColor: "var(--card-border)" }}>
                <HexColorPicker color={accent} onChange={changeAccent} style={{ width: "100%", height: "140px" }} />
              </div>
              <div className="mt-3 flex items-center justify-between w-full px-2">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">HEX</span>
                 <span className="text-xs font-mono font-bold tracking-wider">{accent.toUpperCase()}</span>
              </div>
            </div>

            <p className="text-center text-[10px] font-bold tracking-widest uppercase mb-3 opacity-50" style={{ color: "var(--text-muted)" }}>
              Presets
            </p>

            {/* Presets */}
            <div className="grid grid-cols-3 gap-3 justify-center">
              {PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => changeAccent(c)}
                  className="w-full aspect-square rounded-full border-2 transition-all duration-200 hover:scale-110 active:scale-95 shadow-md"
                  style={{
                    background: c,
                    borderColor: accent === c ? "white" : "transparent",
                    boxShadow: accent === c ? `0 0 15px ${c}88` : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Capsule ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 22 }}
        className="relative flex flex-row gap-2 rounded-2xl p-2 backdrop-blur-2xl border shadow-xl"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
          boxShadow: `0 4px 30px var(--accent-glow)`,
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggleDark}
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
          style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}
        >
          {isDark
            ? <Sun className="w-4 h-4" />
            : <Moon className="w-4 h-4" />
          }
        </button>

        <div className="w-px my-1" style={{ background: "var(--card-border)" }} />

        {/* Accent picker toggle */}
        <button
          onClick={() => setPickerOpen(p => !p)}
          title="Customize accent color"
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 relative"
          style={{
            background: pickerOpen ? "var(--accent-subtle)" : "transparent",
            color: "var(--accent)",
            border: pickerOpen ? `1px solid var(--accent)` : "1px solid transparent",
          }}
        >
          <Palette className="w-4 h-4" />
          <span
            className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
            style={{ background: accent, borderColor: "var(--page-bg)" }}
          />
        </button>
      </motion.div>

      <style jsx global>{`
        .custom-color-picker .react-colorful__pointer {
          width: 20px;
          height: 20px;
          border-width: 3px;
        }
        .custom-color-picker .react-colorful__saturation {
          border-radius: 1rem 1rem 0 0;
          border-bottom: 1px solid var(--card-border);
        }
        .custom-color-picker .react-colorful__hue {
          border-radius: 0 0 1rem 1rem;
          height: 16px;
        }
        .custom-color-picker .react-colorful__hue-pointer {
          width: 16px;
          height: 16px;
          border-width: 2px;
        }
      `}</style>
    </div>
  );
}

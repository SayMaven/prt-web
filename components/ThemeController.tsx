"use client";

import { useState, useEffect, useCallback } from "react";
import { Moon, Sun, Palette } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
    <div className="flex flex-col items-end gap-3">

      {/* ── Color Picker Panel ── */}
      <AnimatePresence>
        {pickerOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="rounded-2xl border p-4 backdrop-blur-2xl shadow-2xl w-52"
            style={{
              background: "var(--card-bg)",
              borderColor: "var(--card-border)",
              boxShadow: `0 12px 50px var(--accent-glow)`,
            }}
          >
            {/* Swatch */}
            <div
              className="w-full h-10 rounded-xl mb-4 border border-white/10"
              style={{ background: `linear-gradient(135deg, ${accent}, ${accent}88)` }}
            />

            <p className="text-center text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "var(--text-muted)" }}>
              Accent Color
            </p>

            {/* Color Wheel button */}
            <div className="flex justify-center mb-4">
              <label
                className="w-14 h-14 rounded-full cursor-pointer flex items-center justify-center border-4 border-white/20 shadow-xl relative overflow-hidden"
                style={{ background: accent, boxShadow: `0 0 24px ${accent}88` }}
                title="Open color wheel"
              >
                <Palette className="w-5 h-5 text-white pointer-events-none relative z-10" />
                <input
                  type="color"
                  value={accent}
                  onChange={(e) => changeAccent(e.target.value)}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                />
              </label>
            </div>

            {/* Presets */}
            <div className="flex gap-2 justify-center flex-wrap">
              {PRESETS.map((c) => (
                <button
                  key={c}
                  onClick={() => changeAccent(c)}
                  className="w-7 h-7 rounded-full border-2 transition-all duration-200 hover:scale-125 hover:shadow-lg"
                  style={{
                    background: c,
                    borderColor: accent === c ? "white" : "transparent",
                    boxShadow: accent === c ? `0 0 12px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Capsule ── */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, type: "spring", stiffness: 220, damping: 22 }}
        className="flex flex-col gap-2 rounded-2xl p-2 backdrop-blur-2xl border shadow-xl"
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

        <div className="h-px mx-1" style={{ background: "var(--card-border)" }} />

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
    </div>
  );
}

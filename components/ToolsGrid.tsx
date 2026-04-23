"use client";

import { tools } from "@/lib/data";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Search, Sparkles, Zap, Layers, Cpu, Wrench, Film } from "lucide-react";

/* ── Constants ─────────────────────────────────────────── */
const CATEGORIES = [
  { label: "All", icon: Layers, color: "var(--accent)" },
  { label: "Anime", icon: Sparkles, color: "#ec4899" },
  { label: "Dev", icon: Cpu, color: "#3b82f6" },
  { label: "Design", icon: Film, color: "#a855f7" },
  { label: "Productivity", icon: Zap, color: "#f59e0b" },
  { label: "Utility", icon: Wrench, color: "#10b981" },
];

const CAT_COLOR: Record<string, string> = {
  Anime: "#ec4899",
  Dev: "#3b82f6",
  Design: "#a855f7",
  Productivity: "#f59e0b",
  Utility: "#10b981",
  Media: "#ef4444",
};

// Placeholder dot-pattern SVG: subtle grid pattern
const PLACEHOLDER_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23888888' fill-opacity='0.08'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`;

const BADGE: Record<string, string> = {
  Hot: "bg-orange-500/10 text-orange-500 border-orange-500/50 shadow-orange-500/20",
  Ultimate: "bg-purple-500/10 text-purple-500 border-purple-500/50 shadow-purple-500/20",
  New: "bg-emerald-500/10 text-emerald-500 border-emerald-500/50 shadow-emerald-500/20",
};

/* ── Framer Motion variants ─────────────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

/* ── Component ──────────────────────────────────────────── */
export default function ToolsGrid() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(12);

  const filteredTools = useMemo(() =>
    tools.filter(t => {
      const q = query.toLowerCase();
      return (
        (t.title.toLowerCase().includes(q) || t.description.toLowerCase().includes(q)) &&
        (activeCategory === "All" || t.category === activeCategory)
      );
    }),
    [query, activeCategory]);

  const visibleTools = filteredTools.slice(0, visibleCount);
  const hasMore = visibleCount < filteredTools.length;

  return (
    <div className="space-y-7">

      {/* ── Sticky Filter + Search ── */}
      <div
        className="sticky top-16 z-30 rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-xl w-full max-w-full"
        style={{ background: "var(--nav-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between w-full max-w-full">

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide w-full max-w-full">
            {CATEGORIES.map(({ label, icon: Icon, color }) => {
              const active = activeCategory === label;
              return (
                <button
                  key={label}
                  onClick={() => { setActiveCategory(label); setVisibleCount(12); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap border transition-all duration-200 shrink-0"
                  style={
                    active
                      ? { background: color + "22", borderColor: color, color }
                      : { background: "transparent", borderColor: "var(--card-border)", color: "var(--text-muted)" }
                  }
                >
                  <Icon className="w-3 h-3" />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-56 flex-shrink-0">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 pointer-events-none"
              style={{ color: "var(--text-muted)" }}
            />
            <input
              type="text"
              placeholder="Cari tools..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="w-full text-sm rounded-full pl-9 pr-4 py-2 border focus:outline-none transition-colors"
              style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
          </div>
        </div>
      </div>

      {/* ── Result count ── */}
      <div className="flex items-center justify-between px-0.5">
        <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
          {filteredTools.length} tools ditemukan
        </p>
        {query && (
          <button onClick={() => setQuery("")} className="text-xs underline" style={{ color: "var(--accent-text)" }}>
            Clear
          </button>
        )}
      </div>

      {/* ── Unified Grid ── */}
      {visibleTools.length > 0 ? (
        <motion.div
          key={activeCategory + "|" + query}
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {visibleTools.map(tool => {
            const catColor = CAT_COLOR[tool.category] ?? "#6366f1";
            const hasImage = Boolean(tool.image);

            return (
              <motion.div key={tool.id} variants={cardVariants} className="flex">
                <Link
                  href={tool.link}
                  className="group flex flex-col w-full rounded-[2rem] overflow-hidden border-2 transition-all duration-500 hover:-translate-y-2 shadow-sm hover:shadow-2xl"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = catColor;
                    el.style.boxShadow = `0 25px 50px -12px ${catColor}30`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--card-border)";
                    el.style.boxShadow = "";
                  }}
                >
                  {/* ── Visual Area ── */}
                  <div className="relative h-44 overflow-hidden flex-shrink-0 border-b-2 transition-colors duration-500" style={{ borderColor: "var(--card-border)" }}>

                    {/* Top accent stripe */}
                    <div
                      className="absolute top-0 inset-x-0 h-1.5 z-20 opacity-80"
                      style={{ background: catColor }}
                    />

                    {/* Background: real image OR dynamic light/dark placeholder */}
                    {hasImage ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url('${tool.image}')` }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 transition-opacity duration-300 flex items-center justify-center"
                        style={{
                          background: `${PLACEHOLDER_PATTERN}, radial-gradient(circle at bottom right, ${catColor}25 0%, var(--card-bg) 100%)`,
                        }}
                      >
                        {/* Big centered icon as placeholder visual */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-7xl opacity-20 group-hover:opacity-100 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-500 select-none drop-shadow-xl"
                            style={{ filter: `drop-shadow(0 10px 20px ${catColor}50)` }}
                          >
                            {tool.icon}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Status badge */}
                    {tool.status && tool.status !== "Ready" && (
                      <span
                        className={`absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-black rounded-full border backdrop-blur-md uppercase tracking-wider shadow-lg ${BADGE[tool.status] ?? ""}`}
                      >
                        {tool.status === "Ultimate" ? "PRO" : tool.status}
                      </span>
                    )}

                    {/* Floating Category Badge */}
                    <span
                      className="absolute bottom-3 right-3 z-30 text-[9px] sm:text-[10px] font-extrabold px-3 py-1.5 rounded-full border-2 shadow-sm uppercase tracking-widest transition-transform group-hover:-translate-y-1"
                      style={{ background: "var(--card-bg)", color: catColor, borderColor: catColor }}
                    >
                      {tool.category}
                    </span>
                  </div>

                  {/* ── Text Content ── */}
                  <div className="flex flex-col flex-1 p-5 sm:p-6 relative">
                    <div className="flex justify-between items-start mb-3">
                      <h2 className="text-lg sm:text-xl font-extrabold group-hover:underline transition-colors" style={{ color: "var(--text-primary)" }}>
                        {tool.title}
                      </h2>
                    </div>
                    <p
                      className="text-xs sm:text-sm leading-relaxed line-clamp-2 font-medium mb-6"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tool.description}
                    </p>
                    
                    <div className="mt-auto pt-4 border-t flex items-center justify-between transition-colors duration-300" style={{ borderColor: "var(--card-border)" }}>
                      <span className="text-xs font-bold uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity" style={{ color: catColor }}>
                        Buka Tool
                      </span>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center border shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:rotate-45"
                        style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                      >
                        <span className="text-sm font-black">↗</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 rounded-3xl border border-dashed"
          style={{ borderColor: "var(--card-border)" }}
        >
          <p className="text-4xl mb-3">🔍</p>
          <p className="font-semibold mb-2" style={{ color: "var(--text-secondary)" }}>Tidak ada tool ditemukan.</p>
          <button
            onClick={() => { setQuery(""); setActiveCategory("All"); }}
            className="text-sm underline"
            style={{ color: "var(--accent-text)" }}
          >
            Reset Filter
          </button>
        </motion.div>
      )}

      {/* ── Load More ── */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <motion.button
            onClick={() => setVisibleCount(p => p + 8)}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3 font-bold rounded-full text-sm border shadow-lg transition-colors"
            style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
          >
            Load More ({filteredTools.length - visibleCount}) ↓
          </motion.button>
        </div>
      )}

    </div>
  );
}
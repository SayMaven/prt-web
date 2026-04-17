"use client";

import { tools } from "@/lib/data";
import Link from "next/link";
import { useState, useMemo } from "react";
import { motion, Variants } from "framer-motion";
import { Search, Sparkles, Zap, Layers, Cpu, Wrench, Film } from "lucide-react";

/* ── Constants ─────────────────────────────────────────── */
const CATEGORIES = [
  { label: "All",          icon: Layers,   color: "var(--accent)" },
  { label: "Anime",        icon: Sparkles, color: "#ec4899" },
  { label: "Dev",          icon: Cpu,      color: "#3b82f6" },
  { label: "Design",       icon: Film,     color: "#a855f7" },
  { label: "Productivity", icon: Zap,      color: "#f59e0b" },
  { label: "Utility",      icon: Wrench,   color: "#10b981" },
];

const CAT_COLOR: Record<string, string> = {
  Anime:        "#ec4899",
  Dev:          "#3b82f6",
  Design:       "#a855f7",
  Productivity: "#f59e0b",
  Utility:      "#10b981",
  Media:        "#ef4444",
};

// Placeholder gradient for tools without a Cloudinary image yet
// Swap out by just adding `image: "url"` in lib/data.ts
const CAT_PLACEHOLDER: Record<string, string> = {
  Anime:        "linear-gradient(135deg, #500724 0%, #1e1b4b 100%)",
  Dev:          "linear-gradient(135deg, #0c1a3a 0%, #0f172a 100%)",
  Design:       "linear-gradient(135deg, #3b0764 0%, #1e1b4b 100%)",
  Productivity: "linear-gradient(135deg, #451a03 0%, #0f172a 100%)",
  Utility:      "linear-gradient(135deg, #022c22 0%, #0f172a 100%)",
  Media:        "linear-gradient(135deg, #500000 0%, #0f172a 100%)",
};

// Placeholder dot-pattern SVG: subtle grid pattern
const PLACEHOLDER_PATTERN = `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.04'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E")`;

const BADGE: Record<string, string> = {
  Hot:      "bg-orange-500/20 text-orange-400 border-orange-500/30",
  Ultimate: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  New:      "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
};

/* ── Framer Motion variants ─────────────────────────────── */
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 28, scale: 0.95 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

/* ── Component ──────────────────────────────────────────── */
export default function ToolsGrid() {
  const [query, setQuery]               = useState("");
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
  const hasMore      = visibleCount < filteredTools.length;

  return (
    <div className="space-y-7">

      {/* ── Sticky Filter + Search ── */}
      <div
        className="sticky top-16 z-30 rounded-2xl border px-4 py-3 backdrop-blur-xl shadow-xl"
        style={{ background: "var(--nav-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">

          {/* Category chips */}
          <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
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
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          {visibleTools.map(tool => {
            const catColor = CAT_COLOR[tool.category] ?? "#6366f1";
            const hasImage = Boolean(tool.image);

            return (
              <motion.div key={tool.id} variants={cardVariants} className="flex">
                <Link
                  href={tool.link}
                  className="group flex flex-col w-full rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1.5 shadow-md"
                  style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = catColor + "80";
                    el.style.boxShadow   = `0 12px 36px ${catColor}28`;
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "var(--card-border)";
                    el.style.boxShadow   = "";
                  }}
                >
                  {/* ── Visual Area (fixed height — always the same) ── */}
                  <div className="relative h-36 overflow-hidden flex-shrink-0">

                    {/* Top accent stripe */}
                    <div
                      className="absolute top-0 inset-x-0 h-0.5 z-20"
                      style={{ background: catColor }}
                    />

                    {/* Background: real image OR gradient placeholder */}
                    {hasImage ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                        style={{ backgroundImage: `url('${tool.image}')` }}
                      />
                    ) : (
                      <div
                        className="absolute inset-0 transition-opacity duration-300"
                        style={{
                          background: CAT_PLACEHOLDER[tool.category] ?? "linear-gradient(135deg,#1e1b4b,#0f172a)",
                          backgroundImage: PLACEHOLDER_PATTERN,
                        }}
                      >
                        {/* Big centered icon as placeholder visual */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span
                            className="text-6xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none"
                          >
                            {tool.icon}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bottom gradient overlay — same for both */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                    {/* Status badge */}
                    {tool.status && tool.status !== "Ready" && (
                      <span
                        className={`absolute top-2.5 right-2.5 z-20 px-2 py-0.5 text-[9px] font-black rounded-full border backdrop-blur-md uppercase tracking-wider ${BADGE[tool.status] ?? ""}`}
                      >
                        {tool.status === "Ultimate" ? "PRO" : tool.status}
                      </span>
                    )}

                    {/* Bottom-left: icon + title */}
                    <div className="absolute bottom-2.5 left-3 right-3 z-10">
                      <div className="flex items-end justify-between gap-2">
                        <div className="min-w-0">
                          {hasImage && (
                            <span className="text-xl drop-shadow-lg leading-none block mb-0.5">
                              {tool.icon}
                            </span>
                          )}
                          <h2 className="text-sm font-extrabold text-white drop-shadow-md leading-tight truncate group-hover:text-white/90 transition-colors">
                            {tool.title}
                          </h2>
                        </div>
                        <span
                          className="text-[9px] font-bold px-1.5 py-0.5 rounded-full border backdrop-blur-sm shrink-0"
                          style={{ background: catColor + "25", color: catColor, borderColor: catColor + "50" }}
                        >
                          {tool.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* ── Text Content (same structure for all) ── */}
                  <div className="flex flex-col flex-1 px-3.5 py-3">
                    <p
                      className="text-xs leading-relaxed line-clamp-2 flex-1"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {tool.description}
                    </p>
                    <div
                      className="mt-2.5 text-xs font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 transition-all duration-200"
                      style={{ color: catColor }}
                    >
                      Buka Tool <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
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
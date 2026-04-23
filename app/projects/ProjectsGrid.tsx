"use client";

import { motion, Variants } from "framer-motion";
import { ExternalLink, Github, Star, FolderGit2, Lock, Flame } from "lucide-react";

export interface GithubRepo {
  id: string | number;
  name: string;
  description: string | null;
  html_url: string;
  homepage: string | null;
  language: string | null;
  stargazers_count: number;
  topics: string[];
  updated_at: string;
  isPrivate?: boolean;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.96 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 120, damping: 18 } },
};

// Each language gets its own palette: { bg, text, border, glow }
const LANG_PALETTE: Record<string, { icon: string; glow: string; badge: string }> = {
  typescript: { icon: "#3b82f6", glow: "rgba(59,130,246,0.25)", badge: "rgba(59,130,246,0.12) border border-blue-500/25 text-blue-400" },
  javascript: { icon: "#f59e0b", glow: "rgba(245,158,11,0.25)", badge: "rgba(245,158,11,0.12) border border-yellow-500/25 text-yellow-400" },
  python: { icon: "#10b981", glow: "rgba(16,185,129,0.25)", badge: "rgba(16,185,129,0.12) border border-emerald-500/25 text-emerald-400" },
  rust: { icon: "#f97316", glow: "rgba(249,115,22,0.25)", badge: "rgba(249,115,22,0.12) border border-orange-500/25 text-orange-400" },
  html: { icon: "#ef4444", glow: "rgba(239,68,68,0.25)", badge: "rgba(239,68,68,0.12) border border-red-500/25 text-red-400" },
  css: { icon: "#6366f1", glow: "rgba(99,102,241,0.25)", badge: "rgba(99,102,241,0.12) border border-indigo-500/25 text-indigo-400" },
  "jupyter notebook": { icon: "#f97316", glow: "rgba(249,115,22,0.25)", badge: "rgba(249,115,22,0.12) border border-orange-600/25 text-orange-500" },
};

function getPalette(language: string | null) {
  return LANG_PALETTE[language?.toLowerCase() ?? ""] ?? { icon: "#94a3b8", glow: "rgba(148,163,184,0.18)", badge: "rgba(148,163,184,0.1) border border-slate-600/30 text-slate-400" };
}

function BadgeCss({ badge }: { badge: string }) {
  // badge is a CSS "background border text" shorthand we added — parse safely
  return null; // unused helper type guard
}

export default function ProjectsGrid({ projects }: { projects: GithubRepo[] }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {projects.map((project) => {
        const pal = getPalette(project.language);
        return (
          <motion.div
            key={project.id}
            variants={itemVariants}
            className="group relative rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:-translate-y-2"
            style={{
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              boxShadow: "var(--shadow)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = `0 12px 48px ${pal.glow}, var(--shadow)`;
              (e.currentTarget as HTMLElement).style.borderColor = pal.icon + "66";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow)";
              (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border)";
            }}
          >
            {/* Top colored bar */}
            <div
              className="h-1 w-full flex-shrink-0"
              style={{ background: `linear-gradient(90deg, ${pal.icon}, ${pal.icon}55)` }}
            />

            {/* Top Glow top edge */}
            <div
              className="absolute top-0 left-1/2 -translate-x-1/2 w-4/5 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10"
              style={{ background: `linear-gradient(90deg, transparent, ${pal.icon}, transparent)` }}
            />

            <div className="p-7 flex flex-col h-full z-20 relative">
              {/* Header */}
              <div className="flex justify-between items-start mb-5">
                {/* Icon */}
                <div
                  className="p-3 rounded-2xl border transition-all duration-500 group-hover:scale-105"
                  style={{
                    background: pal.icon + "15",
                    borderColor: pal.icon + "30",
                    boxShadow: `0 0 20px ${pal.glow}`,
                  }}
                >
                  <FolderGit2 className="w-6 h-6 transition-colors duration-300" style={{ color: pal.icon }} />
                </div>

                {/* Actions */}
                <div className="flex gap-2 items-center">
                  {project.stargazers_count > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded-lg border border-amber-500/20">
                      <Star className="w-3 h-3 fill-current" /> {project.stargazers_count}
                    </span>
                  )}
                  {project.html_url && project.html_url !== "#" && (
                    <a
                      href={project.html_url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}
                      aria-label="GitHub"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.homepage && (
                    <a
                      href={project.homepage}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl transition-all hover:scale-110"
                      style={{ background: pal.icon + "15", color: pal.icon }}
                      aria-label="Live Demo"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Title + Badges */}
              <div className="flex items-start gap-2 mb-3 flex-wrap">
                <h3
                  className="text-xl font-extrabold leading-tight transition-colors duration-300"
                  style={{ color: "var(--text-primary)" }}
                >
                  {project.name}
                </h3>
                {project.isPrivate && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                    <Lock className="w-3 h-3" /> Private
                  </span>
                )}
                {project.stargazers_count > 50 && (
                  <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">
                    <Flame className="w-3 h-3" /> Hot
                  </span>
                )}
              </div>

              {/* Description */}
              <p
                className="text-sm leading-relaxed mb-4 line-clamp-4 flex-1"
                style={{ color: "var(--text-secondary)" }}
              >
                {project.description}
              </p>

              {/* Topics */}
              {project.topics?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {project.topics.slice(0, 3).map((topic) => (
                    <span
                      key={topic}
                      className="text-[11px] font-semibold px-2 py-0.5 rounded-md"
                      style={{ background: "var(--page-bg-2)", color: "var(--text-muted)", border: "1px solid var(--card-border)" }}
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              )}

              {/* Footer: lang + date */}
              <div
                className="flex justify-between items-center pt-4 border-t"
                style={{ borderColor: "var(--card-border)" }}
              >
                <span
                  className="text-xs font-bold px-3 py-1.5 rounded-lg border"
                  style={{ background: pal.icon + "12", color: pal.icon, borderColor: pal.icon + "30" }}
                >
                  {project.language ?? "Multi-Lang"}
                </span>
                <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                  {new Intl.DateTimeFormat("en-GB", { month: "short", year: "numeric" }).format(new Date(project.updated_at))}
                </span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

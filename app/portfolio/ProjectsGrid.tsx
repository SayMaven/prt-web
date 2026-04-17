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
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 100, damping: 20 } },
};

function getLanguageColor(language: string | null) {
  switch (language?.toLowerCase()) {
    case "typescript": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    case "javascript": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
    case "python": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    case "rust": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
    case "html": return "bg-red-500/10 text-red-400 border-red-500/20";
    case "css": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
    case "jupyter notebook": return "bg-orange-600/10 text-orange-500 border-orange-600/20";
    default: return "bg-slate-700/30 text-slate-300 border-slate-600/30";
  }
}

function getCardGlow(language: string | null) {
  switch (language?.toLowerCase()) {
    case "typescript": return "group-hover:bg-blue-500/10";
    case "javascript": return "group-hover:bg-yellow-500/10";
    case "python": return "group-hover:bg-emerald-500/10";
    case "rust": return "group-hover:bg-orange-500/10";
    case "html": return "group-hover:bg-red-500/10";
    case "css": return "group-hover:bg-indigo-500/10";
    case "jupyter notebook": return "group-hover:bg-orange-600/10";
    default: return "group-hover:bg-slate-500/10";
  }
}

function getIconColor(language: string | null) {
  switch (language?.toLowerCase()) {
    case "typescript": return "text-blue-400 group-hover:text-blue-300";
    case "javascript": return "text-yellow-400 group-hover:text-yellow-300";
    case "python": return "text-emerald-400 group-hover:text-emerald-300";
    case "rust": return "text-orange-400 group-hover:text-orange-300";
    case "html": return "text-red-400 group-hover:text-red-300";
    case "css": return "text-indigo-400 group-hover:text-indigo-300";
    case "jupyter notebook": return "text-orange-500 group-hover:text-orange-400";
    default: return "text-slate-400 group-hover:text-white";
  }
}

export default function ProjectsGrid({ projects }: { projects: GithubRepo[] }) {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {projects.map((project) => (
        <motion.div 
          key={project.id} 
          variants={itemVariants}
          className="group relative bg-[#0f172a] rounded-[2rem] overflow-hidden hover:-translate-y-2 flex flex-col shadow-lg transition-all duration-500"
        >
          {/* Animated gradient border wrapper */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900 z-0 rounded-[2rem] transition-colors duration-500 border border-slate-800/80 group-hover:border-slate-700"></div>
          
          {/* Subtle top edge glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[2px] bg-gradient-to-r from-transparent via-slate-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20"></div>

          {/* Hover Glow Background inside */}
          <div className={`absolute inset-0 z-10 transition-colors duration-700 ease-out ${getCardGlow(project.language)} rounded-[2rem]`}></div>
          
          <div className="p-8 flex flex-col h-full z-20 relative">
            {/* Header: Icons */}
            <div className="flex justify-between items-start mb-6">
              <div className="p-3.5 bg-slate-900/80 rounded-2xl border border-slate-700/50 shadow-inner group-hover:scale-110 transition-transform duration-500 ease-out">
                <FolderGit2 className={`w-7 h-7 transition-colors duration-300 ${getIconColor(project.language)}`} />
              </div>
              <div className="flex gap-3 items-center">
                {project.stargazers_count > 0 && (
                  <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400/90 bg-amber-500/10 px-2.5 py-1.5 rounded-lg border border-amber-500/20 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" /> {project.stargazers_count}
                  </span>
                )}
                <div className="flex gap-2">
                  {project.html_url && project.html_url !== "#" && (
                    <a href={project.html_url} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all shadow-sm" aria-label="GitHub Repo">
                      <Github className="w-5 h-5" />
                    </a>
                  )}
                  {project.homepage && (
                    <a href={project.homepage} target="_blank" rel="noreferrer" className="p-2 bg-slate-800/50 rounded-xl text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all shadow-sm" aria-label="Live Demo">
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
            
            {/* Body */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                 <h3 className="text-2xl font-extrabold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all">
                   {project.name}
                 </h3>
                 {project.isPrivate && (
                   <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 rounded-full shadow-sm">
                     <Lock className="w-3 h-3" /> Private
                   </span>
                 )}
                 {project.stargazers_count > 50 && (
                   <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full shadow-sm">
                     <Flame className="w-3 h-3 text-orange-500" /> Hot
                   </span>
                 )}
              </div>
              <p className="text-slate-400/90 text-sm leading-relaxed mb-6 line-clamp-4 font-medium transition-colors group-hover:text-slate-300">
                {project.description}
              </p>
            </div>

            {/* Footer: Tags/Lang */}
            <div className="mt-6 pt-5 flex flex-col gap-4 border-t border-slate-700/50 relative">
               {/* Topics */}
               {(project.topics?.length > 0) && (
                 <div className="flex flex-wrap gap-2">
                   {project.topics.slice(0, 3).map(topic => (
                     <span key={topic} className="text-[11px] font-semibold text-slate-300 bg-slate-800/80 border border-slate-700/80 px-2.5 py-1 rounded-lg group-hover:border-slate-600 transition-colors">
                       #{topic}
                     </span>
                   ))}
                 </div>
               )}
               {/* Language Bar & Badge */}
               <div className="flex justify-between items-center w-full">
                  {project.language ? (
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-lg border shadow-sm ${getLanguageColor(project.language)}`}>
                      {project.language}
                    </span>
                  ) : (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800/50 text-slate-400 border border-slate-700/50">
                      Multi-Lang
                    </span>
                  )}
                  <span className="text-[11px] items-center text-slate-500 font-semibold group-hover:text-slate-400 transition-colors">
                    Updated: {new Intl.DateTimeFormat('en-GB', { month: 'short', year: 'numeric' }).format(new Date(project.updated_at))}
                  </span>
               </div>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}

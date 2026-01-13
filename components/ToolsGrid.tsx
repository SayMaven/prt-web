"use client"; 

import Link from "next/link";
import { tools } from "@/lib/data";

export default function ToolsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tools.map((tool) => {
        const isReady = tool.status === "Ready";
        
        return (
          <Link 
            key={tool.id} 
            href={isReady ? tool.link : "#"}
            className={`
              group relative p-6 rounded-2xl border transition-all duration-300 flex flex-col h-full
              ${isReady 
                ? "bg-slate-900/50 border-slate-800 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer" 
                : "bg-slate-900/30 border-slate-800/50 opacity-60 cursor-not-allowed grayscale-[0.5]"
              }
            `}
            // Mencegah klik jika status Coming Soon
            aria-disabled={!isReady}
            onClick={(e) => !isReady && e.preventDefault()}
          >
            
            {/* Header Card: Icon & Status */}
            <div className="flex items-start justify-between mb-6">
              <div className={`
                  p-3 rounded-xl text-3xl transition-transform duration-300 group-hover:scale-110
                  ${isReady ? "bg-slate-950 border border-slate-800 shadow-sm" : "bg-slate-900"}
              `}>
                  {tool.icon}
              </div>

              {/* Status Badge */}
              {!isReady && (
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-400 px-2 py-1 rounded border border-slate-700">
                  Soon
                </span>
              )}
              {isReady && (
                 <span className="opacity-0 group-hover:opacity-100 transition-opacity text-blue-500 text-xl font-bold">
                   ↗
                 </span>
              )}
            </div>
            
            {/* Content Card */}
            <div>
              <h3 className={`text-xl font-bold mb-2 transition-colors ${isReady ? "text-white group-hover:text-blue-400" : "text-slate-500"}`}>
                  {tool.title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed line-clamp-2">
                {tool.description}
              </p>
            </div>

            {/* Hiasan Glow Biru */}
            {isReady && (
               <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
            )}

          </Link>
        );
      })}
    </div>
  );
}
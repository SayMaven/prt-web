"use client"; 

import { artGallery } from "@/lib/gallery";

export default function GalleryGrid() {
  return (
    // 👇 PERUBAHAN ADA DI BARIS INI
    <div className="columns-2 md:columns-3 lg:columns-4 gap-3 md:gap-6 space-y-3 md:space-y-6">
      
      {artGallery.map((art) => (
        <div 
          key={art.id} 
          className="break-inside-avoid group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 hover:border-blue-500/50 transition-all duration-300"
        >
          
          <img 
            src={art.image} 
            alt={art.title}
            loading="lazy"
            onContextMenu={(e) => e.preventDefault()} 
            className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700"
          />

          {/* Overlay Info */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 md:p-6">
            <h3 className="text-white font-bold text-sm md:text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300 line-clamp-1">
              {art.title}
            </h3>
            <div className="flex justify-between items-center mt-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
              <span className="text-[10px] md:text-xs font-bold px-2 py-1 bg-blue-600/90 text-white rounded-md backdrop-blur-sm">
                {art.category}
              </span>
            </div>
          </div>

        </div>
      ))}
    </div>
  );
}
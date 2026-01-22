"use client"; 

import { useState } from "react";
import type { CloudinaryImage } from "@/lib/cloudinary";
import { Image as ImageIcon, EyeOff } from "lucide-react"; 

type ImageWithTags = CloudinaryImage & { tags: string[] };

// --- KOMPONEN KARTU SATUAN (GalleryCard) ---
const GalleryCard = ({ img }: { img: ImageWithTags }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); 

  // 1. Ambil Tags
  const safeTags = img.tags || [];
  const lowerTags = safeTags.map(t => t.toLowerCase());

  // 2. Logic NSFW
  const isNSFW = lowerTags.includes('nsfw') || lowerTags.includes('r-18');

  // 3. Logic Kategori Utama
  let category = 'ARTWORK';
  if (lowerTags.includes('original')) category = 'ORIGINAL';
  else if (lowerTags.includes('fanart')) category = 'FANART';
  else if (lowerTags.includes('wip')) category = 'WIP';
  else if (lowerTags.includes('ai')) category = 'AI';

  // 4. Logic Tahun
  const year = safeTags.find(tag => /^\d{4}$/.test(tag)) || "";

  // 5. Logic Nama Karakter
  let characterName = "";
  if (img.folder) {
     characterName = img.folder.trim();
  } else {
     const parts = img.public_id.split('/');
     if (parts.length > 1) {
        characterName = parts[0].replace(/[-_]/g, ' '); 
     }
  }

  // 6. Logic Judul
  const parts = img.public_id.split('/');
  const rawFileName = parts[parts.length - 1] || "";
  const title = rawFileName
    .replace(/[-_]/g, ' ')
    .replace(/\b(20\d{2})\b/g, '')
    .replace(/\b(original|fanart|wip|ai|nsfw)\b/gi, '') 
    .replace(/\s+/g, ' ')
    .trim() || "Untitled";

  // Logic Warna Badge
  const getBadgeColor = (cat: string) => {
    switch (cat) {
        case 'ORIGINAL': return 'bg-blue-500 text-white shadow-blue-500/20';
        case 'FANART': return 'bg-pink-500 text-white shadow-pink-500/20';
        case 'WIP': return 'bg-yellow-400 text-black font-extrabold';
        case 'AI' : return 'bg-emerald-500 text-white shadow-emerald-500/20';
        default: return 'bg-slate-600 text-slate-200';
    }
  };

  const isHidden = isNSFW && !isRevealed;

  // Logic Handler Klik
  const handleCardClick = () => {
    if (isHidden) {
      setIsRevealed(true); // Buka sensor
    } else {
      setShowOverlay(!showOverlay); // Toggle info (Mobile)
    }
  };

  return (
    <div 
        className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
        onClick={handleCardClick}
    >
      
      {/* --- AREA GAMBAR --- */}
      <div className="relative overflow-hidden bg-slate-900">
          <img 
            src={img.secure_url} 
            alt={title}
            loading="lazy"
            width={img.width}
            height={img.height}
            onContextMenu={(e) => e.preventDefault()} 
            className={`w-full h-auto object-cover transform transition-all duration-700 ease-in-out
                ${isHidden ? 'blur-xl scale-110 brightness-50 contrast-125' : 'group-hover:scale-105'}
            `}
          />

          {/* LAYER SENSOR NSFW */}
          {isHidden && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
                  <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-full mb-3 backdrop-blur-md animate-pulse">
                    <EyeOff className="text-red-400 w-8 h-8" />
                  </div>
                  <span className="text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      Sensitive Content
                  </span>
                  <p className="text-[10px] text-slate-400 mt-2">Tap to Reveal</p>
              </div>
          )}
      </div>

      {/* --- OVERLAY INFO --- */}
      <div className={`absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent transition-all duration-300
         ${
            // LOGIC BARU (Fix Bug Hover Tembus):
            isHidden 
              ? 'opacity-0 pointer-events-none' // Jika Hidden: MATIKAN total (hover tidak akan jalan)
              : showOverlay 
                  ? 'opacity-100' // Jika Mobile Toggle On: Paksa Muncul
                  : 'opacity-0 group-hover:opacity-100' // Default: Muncul hanya saat Hover
         }
      `}>

        {/* 1. JUDUL */}
        <h3 className="text-white font-bold text-sm md:text-lg leading-tight capitalize drop-shadow-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>

        {/* 3. ROW BADGE UTAMA */}
        <div className="flex flex-wrap gap-2 items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          
          {/* Badge Nama Karakter */}
          {characterName && (
             <span className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md bg-lime-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
                {characterName.toUpperCase()}
             </span>
          )}

          {/* Badge Kategori Utama */}
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md shadow-lg border border-white/10 ${getBadgeColor(category)}`}>
            {category}
          </span>

          {/* Badge Tahun */}
          {year && (
            <span className="text-[10px] font-bold text-slate-300 tracking-wider ml-1 border-l border-slate-500 pl-2">
                {year}
            </span>
          )}

          {/* 2. BADGE NSFW */}
        {isNSFW && (
            <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-50 mb-2">
                <span className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md shadow-lg bg-red-600 text-white border border-red-500/50 shadow-red-500/40 animate-pulse inline-block">
                    R-18
                </span>
            </div>
        )}

        </div>

        {/* TOMBOL FULL RES */}
        <a 
            href={img.secure_url} 
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 bg-black/40 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl pointer-events-auto z-20 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 duration-500 delay-100"
            title="Download HD"
            onClick={(e) => e.stopPropagation()} 
        >
            <ImageIcon size={16} />
        </a>

      </div>
    </div>
  );
};

export default function GalleryGrid({ images }: { images: ImageWithTags[] }) {
  return (
    <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
      {images.map((img) => (
        <GalleryCard key={img.id} img={img} />
      ))}
    </div>
  );
}
"use client"; 

import { useState, useMemo } from "react";
import type { CloudinaryImage } from "@/lib/cloudinary";
import { Image as ImageIcon, EyeOff, Search, Filter, ArrowUpDown } from "lucide-react"; 

type ImageWithTags = CloudinaryImage & { tags: string[] };

// --- KOMPONEN KARTU SATUAN (GalleryCard) ---
const GalleryCard = ({ img }: { img: ImageWithTags }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); 

  const safeTags = img.tags || [];
  const lowerTags = safeTags.map(t => t.toLowerCase());

  const isNSFW = lowerTags.includes('nsfw') || lowerTags.includes('r-18');

  let category = 'ARTWORK';
  if (lowerTags.includes('original')) category = 'ORIGINAL';
  else if (lowerTags.includes('fanart')) category = 'FANART';
  else if (lowerTags.includes('wip')) category = 'WIP';
  else if (lowerTags.includes('ai')) category = 'AI';

  const year = safeTags.find(tag => /^\d{4}$/.test(tag)) || "";

  let characterName = "";
  if (img.folder) {
     characterName = img.folder.trim();
  } else {
     const parts = img.public_id.split('/');
     if (parts.length > 1) {
        characterName = parts[0].replace(/[-_]/g, ' '); 
     }
  }

  const parts = img.public_id.split('/');
  const rawFileName = parts[parts.length - 1] || "";
  const title = rawFileName
    .replace(/[-_]/g, ' ')
    .replace(/\b(20\d{2})\b/g, '')
    .replace(/\b(original|fanart|wip|ai|nsfw)\b/gi, '') 
    .replace(/\s+/g, ' ')
    .trim() || "Untitled";

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

  const handleCardClick = () => {
    if (isHidden) {
      setIsRevealed(true); 
    } else {
      setShowOverlay(!showOverlay); 
    }
  };

  return (
    <div 
        className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden border shadow-xl transition-all duration-300 cursor-pointer"
        style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}
        onClick={handleCardClick}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--accent)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = "var(--card-border)"; }}
    >
      <div className="relative overflow-hidden" style={{ background: "var(--page-bg-2)" }}>
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
          {isHidden && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
                  <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-full mb-3 backdrop-blur-md animate-pulse">
                    <EyeOff className="text-red-400 w-8 h-8" />
                  </div>
                  <span className="font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white">
                      Sensitive
                  </span>
                  <p className="text-[10px] mt-2" style={{ color: "var(--text-muted)" }}>Tap to Reveal</p>
              </div>
          )}
      </div>

      <div className={`absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-black/80 via-black/50 to-transparent transition-all duration-300
         ${isHidden ? 'opacity-0 pointer-events-none' : showOverlay ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
      `}>
        <h3 className="text-white font-bold text-sm md:text-lg leading-tight capitalize drop-shadow-lg mb-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          {title}
        </h3>

        <div className="flex flex-wrap gap-2 items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
          {characterName && (
             <span className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md bg-lime-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/30">
                {characterName.toUpperCase()}
             </span>
          )}
          <span className={`text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md shadow-lg border border-white/10 ${getBadgeColor(category)}`}>
            {category}
          </span>
          {year && (
            <span className="text-[10px] font-bold text-slate-300 tracking-wider ml-1 border-l border-slate-500 pl-2">
                {year}
            </span>
          )}
          {isNSFW && (
            <div className="mb-0"> 
                <span className="text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-md shadow-lg bg-red-600 text-white border border-red-500/50 shadow-red-500/40 animate-pulse ml-1">
                    R-18
                </span>
            </div>
          )}
        </div>

        <a 
            href={img.secure_url} 
            target="_blank"
            rel="noopener noreferrer"
            className="absolute top-3 right-3 p-2 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl pointer-events-auto z-20 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 duration-500 delay-100 text-white"
            style={{ background: "var(--accent)" }}
            onClick={(e) => e.stopPropagation()} 
        >
            <ImageIcon size={16} />
        </a>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA (GRID + FILTER) ---
export default function GalleryGrid({ images }: { images: ImageWithTags[] }) {
  const [filter, setFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredImages = useMemo(() => {
    let result = [...images];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(img => {
        const title = img.public_id.split('/').pop()?.toLowerCase() || "";
        const folder = img.folder?.toLowerCase() || "";
        const tags = (img.tags || []).join(" ").toLowerCase();
        return title.includes(q) || folder.includes(q) || tags.includes(q);
      });
    }

    if (filter !== "ALL") {
      result = result.filter(img => {
        const tags = (img.tags || []).map(t => t.toLowerCase());
        if (filter === "NSFW") return tags.includes("nsfw") || tags.includes("r-18");
        return tags.includes(filter.toLowerCase());
      });
    }

    result.sort((a, b) => {
      if (sortOrder === "NEWEST") {
        return images.indexOf(a) - images.indexOf(b); 
      }
      if (sortOrder === "OLDEST") {
        return images.indexOf(b) - images.indexOf(a);
      }
      if (sortOrder === "AZ") {
        const nameA = a.public_id.split('/').pop() || "";
        const nameB = b.public_id.split('/').pop() || "";
        return nameA.localeCompare(nameB);
      }
      return 0;
    });

    return result;
  }, [images, filter, sortOrder, searchQuery]);

  const categories = [
    { id: "ALL", label: "All" },
    { id: "ORIGINAL", label: "Original" },
    { id: "FANART", label: "Fanart" },
    { id: "WIP", label: "WIP" },
    { id: "AI", label: "AI" },
    { id: "NSFW", label: "R-18" },
  ];

  return (
    <div className="space-y-6">
      
      {/* --- FILTER CONTROL BAR --- */}
      <div
        className="backdrop-blur-xl border p-4 rounded-2xl sticky top-4 z-30 shadow-2xl"
        style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
      >
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* 1. Search Bar */}
          <div className="relative w-full md:w-1/3 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 transition-colors" style={{ color: "var(--text-muted)" }} size={18} />
            <input 
              type="text" 
              placeholder="Search art, character, or year..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full py-2 pl-10 pr-4 text-sm border focus:outline-none transition-all"
              style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
          </div>

          {/* 2. Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar mask-gradient">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className="px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border"
                style={
                  filter === cat.id
                    ? cat.id === 'NSFW'
                      ? { background: "#dc2626", borderColor: "#ef4444", color: "#fff", boxShadow: "0 0 12px rgba(220,38,38,0.4)" }
                      : { background: "var(--accent)", borderColor: "var(--accent)", color: "#fff", boxShadow: "0 0 12px var(--accent-glow)" }
                    : { background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }
                }
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 3. Sort Dropdown */}
          <div className="relative flex items-center gap-2">
             <Filter size={16} style={{ color: "var(--text-muted)" }} />
             <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="text-xs font-bold rounded-lg py-2 px-3 pr-8 border focus:outline-none cursor-pointer appearance-none"
                style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
             >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="AZ">A-Z Name</option>
             </select>
             <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
          </div>

        </div>
      </div>

      {/* --- HASIL GRID --- */}
      {filteredImages.length > 0 ? (
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filteredImages.map((img) => (
            <GalleryCard key={img.id} img={img} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20" style={{ color: "var(--text-muted)" }}>
           <Search className="mx-auto mb-4 opacity-50" size={48} />
           <p>No artworks found matching your filter.</p>
        </div>
      )}
      
    </div>
  );
}
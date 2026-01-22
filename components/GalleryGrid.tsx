"use client"; 

import { useState, useMemo } from "react";
import type { CloudinaryImage } from "@/lib/cloudinary";
import { Image as ImageIcon, EyeOff, Search, Filter, ArrowUpDown } from "lucide-react"; 

type ImageWithTags = CloudinaryImage & { tags: string[] };

// --- KOMPONEN KARTU SATUAN (GalleryCard) ---
// (Bagian ini sama persis seperti sebelumnya, tidak ada perubahan logika tampilan)
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
        className="break-inside-avoid mb-4 group relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 shadow-xl transition-all duration-300 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer"
        onClick={handleCardClick}
    >
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
          {isHidden && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 p-4 text-center">
                  <div className="bg-red-500/20 border border-red-500/50 p-4 rounded-full mb-3 backdrop-blur-md animate-pulse">
                    <EyeOff className="text-red-400 w-8 h-8" />
                  </div>
                  <span className="text-white font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
                      Sensitive
                  </span>
                  <p className="text-[10px] text-slate-400 mt-2">Tap to Reveal</p>
              </div>
          )}
      </div>

      <div className={`absolute inset-0 flex flex-col justify-end p-4 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent transition-all duration-300
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
                 {/* Saya geser Nsfw ke inline agar rapi dengan sort filter */}
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
            className="absolute top-3 right-3 bg-black/40 hover:bg-blue-600 text-white p-2 rounded-full backdrop-blur-md border border-white/10 transition-all hover:scale-110 shadow-xl pointer-events-auto z-20 opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 duration-500 delay-100"
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
  // State untuk Filter & Sort
  const [filter, setFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState("NEWEST");
  const [searchQuery, setSearchQuery] = useState("");

  // Logic Filtering & Sorting (Menggunakan useMemo agar performa cepat)
  const filteredImages = useMemo(() => {
    let result = [...images];

    // 1. Filter by Search Query (Title or Character Name)
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(img => {
        const title = img.public_id.split('/').pop()?.toLowerCase() || "";
        const folder = img.folder?.toLowerCase() || "";
        const tags = (img.tags || []).join(" ").toLowerCase();
        return title.includes(q) || folder.includes(q) || tags.includes(q);
      });
    }

    // 2. Filter by Category Tag
    if (filter !== "ALL") {
      result = result.filter(img => {
        const tags = (img.tags || []).map(t => t.toLowerCase());
        if (filter === "NSFW") return tags.includes("nsfw") || tags.includes("r-18");
        return tags.includes(filter.toLowerCase());
      });
    }

    // 3. Sorting
    result.sort((a, b) => {
      // Ambil tanggal (Created At). Kita asumsikan urutan array awal adalah Descending (terbaru).
      // Untuk "A-Z", kita butuh nama file.
      if (sortOrder === "NEWEST") {
        // Asumsi data dari Cloudinary sudah sort by date desc. 
        // Jika mau lebih akurat, gunakan field 'created_at' jika ada, tapi index array sudah cukup jika API sudah sort.
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


  // Kategori Filter yang tersedia
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
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-4 rounded-2xl sticky top-4 z-30 shadow-2xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* 1. Search Bar */}
          <div className="relative w-full md:w-1/3 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-400 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search art, character, or year..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>

          {/* 2. Filter Tabs (Scrollable on mobile) */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar mask-gradient">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border
                  ${filter === cat.id 
                    ? cat.id === 'NSFW' ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-900/50' : 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50'
                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* 3. Sort Dropdown */}
          <div className="relative flex items-center gap-2">
             <Filter size={16} className="text-slate-400" />
             <select 
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs font-bold rounded-lg py-2 px-3 focus:outline-none focus:border-blue-500 cursor-pointer appearance-none pr-8"
             >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="AZ">A-Z Name</option>
             </select>
             <ArrowUpDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
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
        // Tampilan Jika Kosong
        <div className="text-center py-20 text-slate-500">
           <Search className="mx-auto mb-4 opacity-50" size={48} />
           <p>No artworks found matching your filter.</p>
        </div>
      )}
      
    </div>
  );
}
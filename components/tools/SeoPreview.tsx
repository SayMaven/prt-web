"use client";

import { useState, useRef } from "react";
import { 
  Search, Twitter, MessageSquare, Copy, Check, Upload, Link as LinkIcon, Globe, Facebook, Linkedin
} from "lucide-react";

type Platform = "google" | "facebook" | "twitter" | "linkedin" | "discord";

export default function SeoPreview() {
  const [platform, setPlatform] = useState<Platform>("google");
  
  const [title, setTitle] = useState("SayMaven | Baca Manga & Manhwa Gratis");
  const [desc, setDesc] = useState("Platform baca komik, manga, manhwa, dan manhua favoritmu secara online dan gratis. Nikmati pembaruan chapter setiap harinya tanpa ribet di SayMaven (MavenManga).");
  const [url, setUrl] = useState("https://saymaven.cloud");
  const [image, setImage] = useState("https://i.pinimg.com/736x/48/c5/31/48c5319ce6271eb92f1a6b86585e99b2.jpg");
  
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setImage(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const generatedMeta = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${desc}">

<!-- Open Graph / Facebook / Discord / LinkedIn -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="${image.startsWith('data:') ? 'URL_GAMBAR_KAMU' : image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${desc}">
<meta property="twitter:image" content="${image.startsWith('data:') ? 'URL_GAMBAR_KAMU' : image}">`;

  const copyMeta = () => {
    navigator.clipboard.writeText(generatedMeta);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const domain = url.replace(/^https?:\/\//, '').split('/')[0];

  return (
    <div className="w-full grid grid-cols-1 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] gap-8">
      
      {/* KIRI: INPUT FORM */}
      <div className="flex flex-col gap-6">
        <div className="p-6 md:p-8 rounded-[2rem] border shadow-xl flex flex-col gap-6"
             style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            
            <div className="flex items-center gap-3 border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
              <Globe size={20} style={{ color: "var(--accent)" }} />
              <h2 className="text-xl font-black tool-title">Meta Info</h2>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase tracking-widest tool-muted">Judul (Title)</label>
                  <span className={`text-xs ${title.length > 60 ? 'text-red-500' : 'tool-muted'}`}>{title.length}/60</span>
                </div>
                <input 
                  type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all tool-title text-sm"
                  style={{ borderColor: "var(--card-border)" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-end">
                  <label className="text-xs font-bold uppercase tracking-widest tool-muted">Deskripsi</label>
                  <span className={`text-xs ${desc.length > 160 ? 'text-red-500' : 'tool-muted'}`}>{desc.length}/160</span>
                </div>
                <textarea 
                  value={desc} onChange={(e) => setDesc(e.target.value)} rows={3}
                  className="w-full p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all tool-title text-sm resize-none custom-scrollbar"
                  style={{ borderColor: "var(--card-border)" }}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest tool-muted">URL Website</label>
                <div className="relative">
                  <LinkIcon size={14} className="absolute left-3 top-1/2 -translate-y-1/2 tool-muted" />
                  <input 
                    type="text" value={url} onChange={(e) => setUrl(e.target.value)}
                    className="w-full p-3 pl-9 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all tool-title text-sm"
                    style={{ borderColor: "var(--card-border)" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold uppercase tracking-widest tool-muted">Thumbnail Image</label>
                <div className="flex gap-2">
                  <input 
                    type="text" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..."
                    className="flex-1 p-3 rounded-xl border bg-transparent outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all tool-title text-sm"
                    style={{ borderColor: "var(--card-border)" }}
                  />
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="p-3 rounded-xl bg-[var(--accent)] text-white hover:brightness-110 transition-all flex items-center justify-center shrink-0"
                    title="Upload Gambar Lokal"
                  >
                    <Upload size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
                </div>
              </div>
            </div>
        </div>

        {/* HTML OUTPUT */}
        <div className="p-6 rounded-[2rem] border shadow-xl flex flex-col gap-4 relative overflow-hidden group"
             style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-bold uppercase tracking-widest tool-muted">Generated HTML</h3>
              <button 
                onClick={copyMeta}
                className={`text-xs flex items-center gap-1 font-bold transition-all px-3 py-1.5 rounded-lg ${copied ? "bg-green-500/10 text-green-500" : "bg-[var(--accent-subtle)] text-[var(--accent)] hover:brightness-110"}`}
              >
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
            <textarea 
              value={generatedMeta} readOnly
              className="w-full h-40 p-4 rounded-xl border bg-black/5 dark:bg-white/5 outline-none tool-muted font-mono text-[10px] sm:text-xs resize-none custom-scrollbar"
              style={{ borderColor: "var(--card-border)" }}
            />
        </div>
      </div>

      {/* KANAN: PREVIEW AREA */}
      <div className="flex flex-col gap-6">
        {/* Tabs */}
        <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl border backdrop-blur-md shadow-sm self-start" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
          <button
            onClick={() => setPlatform("google")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              platform === "google" ? "bg-white text-black shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Search size={16} className={platform === "google" ? "text-blue-500" : ""} /> Google
          </button>
          
          <button
            onClick={() => setPlatform("facebook")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              platform === "facebook" ? "bg-[#1877F2] text-white shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Facebook size={16} /> Facebook
          </button>

          <button
            onClick={() => setPlatform("twitter")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              platform === "twitter" ? "bg-[#1DA1F2] text-white shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Twitter size={16} /> Twitter
          </button>
          
          <button
            onClick={() => setPlatform("linkedin")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              platform === "linkedin" ? "bg-[#0A66C2] text-white shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <Linkedin size={16} /> LinkedIn
          </button>

          <button
            onClick={() => setPlatform("discord")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all duration-300 ${
              platform === "discord" ? "bg-[#5865F2] text-white shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
            }`}
          >
            <MessageSquare size={16} /> Discord
          </button>
        </div>

        {/* Canvas Preview */}
        <div className="flex-1 rounded-[2.5rem] border shadow-2xl overflow-hidden p-6 md:p-12 flex items-start justify-center transition-all min-h-[500px] relative" 
             style={{ background: "var(--page-bg-2)", borderColor: "var(--card-border)" }}>
          
          <div className="w-full max-w-xl animate-in fade-in zoom-in-95 duration-500 relative z-10">
            
            {/* GOOGLE PREVIEW */}
            {platform === "google" && (
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-1 text-left font-sans">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    <Globe size={16} className="text-gray-500" />
                  </div>
                  <div>
                    <div className="text-[14px] text-gray-800 line-clamp-1">{url}</div>
                    <div className="text-[12px] text-gray-500 line-clamp-1">{url}</div>
                  </div>
                </div>
                <h3 className="text-[20px] text-[#1a0dab] hover:underline cursor-pointer line-clamp-1">{title || "Judul Halaman"}</h3>
                <p className="text-[14px] text-[#4d5156] line-clamp-2 mt-1 leading-snug">
                  {desc || "Deskripsi halaman akan muncul di sini. Pastikan panjangnya tidak lebih dari 160 karakter agar tidak terpotong oleh Google."}
                </p>
              </div>
            )}

            {/* FACEBOOK PREVIEW */}
            {platform === "facebook" && (
              <div className="bg-white text-black border border-[#ced0d4] overflow-hidden font-sans w-full max-w-md mx-auto shadow-sm" style={{ borderRadius: "8px" }}>
                <div className="w-full h-[220px] bg-[#f0f2f5] overflow-hidden border-b border-[#ced0d4]">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/800x418?text=No+Image"} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#65676B]">No Image</div>
                  )}
                </div>
                <div className="p-3 bg-[#f2f3f5] flex flex-col gap-0.5">
                  <span className="text-[12px] text-[#65676B] line-clamp-1 uppercase tracking-wide">{domain}</span>
                  <h3 className="text-[16px] font-bold text-[#050505] line-clamp-1 leading-snug">{title || "Judul Halaman"}</h3>
                  <p className="text-[14px] text-[#65676B] line-clamp-1 leading-snug">{desc || "Deskripsi akan muncul di sini."}</p>
                </div>
              </div>
            )}

            {/* TWITTER PREVIEW */}
            {platform === "twitter" && (
              <div className="bg-black text-white rounded-2xl border border-gray-800 overflow-hidden font-sans w-full max-w-md mx-auto">
                <div className="w-full h-[220px] bg-gray-900 overflow-hidden border-b border-gray-800">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/800x418?text=No+Image"} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                  )}
                </div>
                <div className="p-3 bg-black flex flex-col gap-0.5">
                  <span className="text-[13px] text-gray-500 line-clamp-1">{domain}</span>
                  <h3 className="text-[15px] font-bold line-clamp-1">{title || "Judul Halaman"}</h3>
                  <p className="text-[14px] text-gray-500 line-clamp-2 mt-0.5 leading-snug">{desc || "Deskripsi akan muncul di sini."}</p>
                </div>
              </div>
            )}

            {/* LINKEDIN PREVIEW */}
            {platform === "linkedin" && (
              <div className="bg-white text-black border border-gray-200 overflow-hidden font-sans w-full max-w-md mx-auto" style={{ borderRadius: "2px" }}>
                <div className="w-full h-[220px] bg-gray-100 overflow-hidden border-b border-gray-200">
                  {image ? (
                    <img src={image} alt="Preview" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = "https://via.placeholder.com/800x418?text=No+Image"} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                  )}
                </div>
                <div className="p-3 bg-[#f3f2ef] flex flex-col gap-1">
                  <h3 className="text-[14px] font-bold text-black/90 line-clamp-2 leading-snug">{title || "Judul Halaman"}</h3>
                  <span className="text-[12px] text-black/60 line-clamp-1">{domain}</span>
                </div>
              </div>
            )}

            {/* DISCORD PREVIEW */}
            {platform === "discord" && (
              <div className="bg-[#2f3136] rounded-md border-l-4 border-[#5865F2] p-4 font-sans text-left max-w-md mx-auto shadow-md">
                <div className="text-[12px] text-gray-300 mb-1 font-semibold">{domain}</div>
                <h3 className="text-[16px] text-[#00b0f4] font-bold hover:underline cursor-pointer mb-2 line-clamp-1">{title || "Judul Halaman"}</h3>
                <p className="text-[14px] text-gray-300 line-clamp-3 mb-4 leading-snug">
                  {desc || "Deskripsi halaman akan muncul di sini saat dibagikan ke server Discord."}
                </p>
                {image && (
                  <div className="rounded-md overflow-hidden max-w-full w-[300px]">
                    <img src={image} alt="Preview" className="w-full h-auto object-cover" onError={(e) => e.currentTarget.style.display = 'none'} />
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--accent); }
      `}</style>
    </div>
  );
}

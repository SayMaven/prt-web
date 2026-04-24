"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Download, X, Settings, RefreshCcw, Check, Plus, Trash2, AlertCircle, Maximize, FileImage } from "lucide-react";

type QueueItem = {
  id: string;
  file: File;
  previewUrl: string;
};

type ProcessedImage = {
  originalName: string;
  blob: Blob;
  url: string;
  size: number;
  format: string;
};

const SUPPORTED_FORMATS = [
  { id: "image/webp", label: "WEBP", desc: "Best for Web" },
  { id: "image/jpeg", label: "JPEG", desc: "Photography" },
  { id: "image/png", label: "PNG", desc: "Transparent" },
  { id: "image/avif", label: "AVIF", desc: "Ultra Comp." },
  { id: "image/bmp", label: "BMP", desc: "Lossless" },
  { id: "image/x-icon", label: "ICO", desc: "Favicon (256px)" },
] as const;

type TargetFormat = typeof SUPPORTED_FORMATS[number]['id'];

export default function PixelConverter() {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [processed, setProcessed] = useState<ProcessedImage[]>([]);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Settings
  const [targetFormat, setTargetFormat] = useState<TargetFormat>("image/webp");
  const [quality, setQuality] = useState(0.8);
  const [scale, setScale] = useState(1); // 0.1 to 1.0 for image resizing

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      queue.forEach(item => URL.revokeObjectURL(item.previewUrl));
      processed.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, []);

  const addToQueue = (newFiles: File[]) => {
    const newItems = newFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    
    setQueue(prev => [...prev, ...newItems]);
    setProcessed([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addToQueue(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith("image/"));
      if (droppedFiles.length > 0) {
        addToQueue(droppedFiles);
      }
    }
  };

  const removeItem = (idToRemove: string) => {
    setQueue(prev => {
      const itemToRemove = prev.find(i => i.id === idToRemove);
      if (itemToRemove) URL.revokeObjectURL(itemToRemove.previewUrl);
      return prev.filter(i => i.id !== idToRemove);
    });
    setProcessed([]); 
  };

  const clearAll = () => {
    queue.forEach(item => URL.revokeObjectURL(item.previewUrl));
    setQueue([]);
    setProcessed([]);
  };

  const convertImage = (item: QueueItem): Promise<ProcessedImage> => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          
          let finalWidth = img.width * scale;
          let finalHeight = img.height * scale;

          if (targetFormat === "image/x-icon") {
              const MAX_ICO_SIZE = 256;
              if (finalWidth > MAX_ICO_SIZE || finalHeight > MAX_ICO_SIZE) {
                  const ratio = Math.min(MAX_ICO_SIZE / finalWidth, MAX_ICO_SIZE / finalHeight);
                  finalWidth = finalWidth * ratio;
                  finalHeight = finalHeight * ratio;
              }
          }

          finalWidth = Math.round(finalWidth) || 1;
          finalHeight = Math.round(finalHeight) || 1;

          const canvas = document.createElement("canvas");
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          
          const ctx = canvas.getContext("2d");
          if (ctx) {
             if (targetFormat === "image/jpeg" || targetFormat === "image/bmp") {
                 ctx.fillStyle = "#FFFFFF"; 
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
             }
             
             ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
             
             const encoderFormat = targetFormat === "image/x-icon" ? "image/png" : targetFormat;

             canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve({
                      originalName: item.file.name,
                      blob,
                      url: URL.createObjectURL(blob),
                      size: blob.size,
                      format: targetFormat.split("/")[1].replace("x-icon", "ico")
                    });
                  } else {
                    canvas.toBlob((fbBlob) => {
                        if(fbBlob) resolve({
                            originalName: item.file.name,
                            blob: fbBlob,
                            url: URL.createObjectURL(fbBlob),
                            size: fbBlob.size,
                            format: "png"
                        });
                    }, "image/png");
                  }
                },
                encoderFormat,
                quality
             );
          }
        };
        img.src = event.target?.result as string;
      };
      reader.readAsDataURL(item.file);
    });
  };

  const handleProcess = async () => {
    if (queue.length === 0) return;
    setIsProcessing(true);
    const results = await Promise.all(queue.map(convertImage));
    setProcessed(results);
    setIsProcessing(false);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="w-full space-y-8 max-w-6xl mx-auto">

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
            border-2 transition-all duration-300 rounded-[2.5rem] shadow-2xl overflow-hidden relative
            ${isDragging ? "scale-[1.01]" : ""}
        `}
        style={{ 
            background: isDragging ? "var(--card-bg)" : "var(--card-bg)", 
            borderColor: isDragging ? "var(--accent)" : "var(--card-border)",
            boxShadow: isDragging ? "0 0 30px var(--accent-subtle)" : undefined
        }}
      >
         
         <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
         />

         {queue.length === 0 ? (
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-16 md:p-24 text-center cursor-pointer hover:bg-black/5 transition-colors relative group"
             >
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-lg border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                    <Upload className={`transition-colors`} style={{ color: isDragging ? "var(--accent)" : "var(--text-secondary)" }} size={40} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-black mb-3" style={{ color: "var(--text-primary)" }}>
                    {isDragging ? "Lepaskan File Disini" : "Upload Gambar"}
                </h3>
                <p className="text-sm sm:text-base font-medium max-w-sm mx-auto opacity-70 leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                    Klik atau drag & drop gambar. Mendukung konversi format modern (WebP, AVIF) dan kompresi tanpa server.
                </p>
             </div>
         ) : (
             <div className="p-8 sm:p-10 space-y-8 flex flex-col lg:flex-row gap-8 items-start">
                 
                 {/* KIRI: DAFTAR GAMBAR */}
                 <div className="w-full lg:w-3/5 space-y-6">
                     <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-4" style={{ borderColor: "var(--card-border)" }}>
                        <div className="flex items-center gap-3">
                            <span className="font-black text-xl flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                                <FileImage size={20} style={{ color: "var(--accent)" }}/> {queue.length} Gambar
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <button 
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-1 hover:bg-black/10 text-xs font-bold px-4 py-2 rounded-xl transition-colors border"
                                style={{ color: "var(--text-primary)", borderColor: "var(--card-border)", background: "var(--card-bg)" }}
                            >
                                <Plus size={14}/> Tambah
                            </button>
                            <button 
                                onClick={clearAll}
                                className="text-red-500 bg-red-500/10 hover:bg-red-500/20 text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1 transition-colors"
                            >
                                <Trash2 size={14}/> Bersihkan
                            </button>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto custom-scrollbar p-2 -mx-2">
                         {queue.map((item) => (
                             <div key={item.id} className="relative group rounded-2xl overflow-hidden aspect-square shadow-md border" style={{ borderColor: "var(--card-border)" }}>
                                 <img src={item.previewUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="preview" />
                                 
                                 <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
                                 
                                 <div className="absolute bottom-0 left-0 right-0 p-4">
                                     <p className="text-[10px] text-white truncate font-mono font-bold mb-0.5">{item.file.name}</p>
                                     <p className="text-[10px] text-white/70 font-bold">{formatSize(item.file.size)}</p>
                                 </div>

                                 <button 
                                    onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                    className="absolute top-3 right-3 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-75 group-hover:scale-100 shadow-lg hover:bg-red-600"
                                 >
                                     <X size={14} strokeWidth={3} />
                                 </button>
                             </div>
                         ))}
                     </div>
                 </div>

                 {/* KANAN: SETTINGS */}
                 <div className="w-full lg:w-2/5 p-6 rounded-3xl border shadow-lg space-y-6" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                    
                    <div className="space-y-4">
                        <label className="text-xs font-black flex items-center gap-2 uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            <Settings size={14}/> Target Format
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {SUPPORTED_FORMATS.map((fmt) => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setTargetFormat(fmt.id)}
                                    className={`
                                        flex flex-col items-center justify-center p-3 rounded-2xl border transition-all
                                        ${targetFormat === fmt.id 
                                            ? "shadow-lg scale-100" 
                                            : "hover:bg-black/5 hover:scale-[0.98] scale-100"
                                        }
                                    `}
                                    style={targetFormat === fmt.id ? { background: "var(--accent)", color: "white", borderColor: "var(--accent)" } : { background: "transparent", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                                >
                                    <span className="text-sm font-black">{fmt.label}</span>
                                    <span className="text-[10px] opacity-70 font-medium mt-0.5">{fmt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black flex items-center gap-2 uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                                <RefreshCcw size={14}/> Quality
                            </label>
                            <span className="text-xs font-black px-2 py-1 rounded-lg" style={{ color: "white", background: "var(--accent)" }}>
                                {(quality * 100).toFixed(0)}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.05" 
                            value={quality}
                            onChange={(e) => setQuality(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{ background: "var(--card-border)", accentColor: "var(--accent)" }}
                        />
                    </div>

                    <div className="space-y-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
                        <div className="flex justify-between items-center">
                            <label className="text-xs font-black flex items-center gap-2 uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                                <Maximize size={14}/> Resize Image
                            </label>
                            <span className="text-xs font-black px-2 py-1 rounded-lg" style={{ color: "white", background: "var(--accent)" }}>
                                {(scale * 100).toFixed(0)}%
                            </span>
                        </div>
                        <input 
                            type="range" 
                            min="0.1" 
                            max="1" 
                            step="0.1" 
                            value={scale}
                            onChange={(e) => setScale(parseFloat(e.target.value))}
                            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                            style={{ background: "var(--card-border)", accentColor: "var(--accent)" }}
                        />
                        <p className="text-[10px] font-medium opacity-70 text-center" style={{ color: "var(--text-secondary)" }}>Turunkan skala untuk mengurangi ukuran piksel secara proporsional.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleProcess}
                            disabled={isProcessing}
                            className="w-full py-5 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: "var(--accent)", color: "white" }}
                        >
                            {isProcessing ? (
                                <div className="flex items-center gap-2 animate-pulse">
                                    <RefreshCcw size={18} className="animate-spin"/> Memproses...
                                </div>
                            ) : (
                                <><Check size={18}/> Convert {queue.length} Images</>
                            )}
                        </button>
                    </div>

                 </div>
             </div>
         )}
      </div>

      {/* RESULTS LIST */}
      {processed.length > 0 && (
          <div className="space-y-6 animate-in slide-in-from-bottom-8 duration-500 pt-4">
              <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-black flex items-center gap-3" style={{ color: "var(--text-primary)" }}>
                      <div className="p-2 rounded-full bg-green-500/10 text-green-500"><Check size={20} strokeWidth={3}/></div> Selesai ({processed.length})
                  </h3>
                  {processed.some(p => targetFormat === 'image/x-icon' ? p.format !== 'ico' : p.format !== targetFormat.split('/')[1]) && (
                      <span className="text-[10px] font-bold text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-3 py-1.5 rounded-full border border-yellow-500/20">
                          <AlertCircle size={12}/> Fallback Format Diterapkan.
                      </span>
                  )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {processed.map((item, idx) => (
                      <div key={idx} className="border p-4 rounded-[2rem] flex items-center justify-between group hover:shadow-lg transition-all" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                          <div className="flex items-center gap-4 overflow-hidden">
                              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border shadow-inner" style={{ borderColor: "var(--card-border)" }}>
                                  <img src={item.url} className="w-full h-full object-cover" alt="result" />
                              </div>
                              <div className="min-w-0 pr-4">
                                  <p className="text-sm font-black truncate" style={{ color: "var(--text-primary)" }}>{item.originalName}</p>
                                  <div className="flex items-center gap-2 text-[10px] font-bold mt-1.5">
                                      <span className="uppercase px-2 py-0.5 rounded-md text-white" style={{ background: "var(--accent)" }}>{item.format}</span>
                                      <span className="text-green-500 bg-green-500/10 px-2 py-0.5 rounded-md font-mono">{formatSize(item.size)}</span>
                                  </div>
                              </div>
                          </div>
                          
                          <a 
                            href={item.url} 
                            download={`converted_${idx + 1}.${item.format}`}
                            className="p-4 rounded-2xl transition-all shadow-md hover:scale-110 active:scale-95"
                            style={{ background: "var(--text-primary)", color: "var(--card-bg)" }}
                            title="Download"
                          >
                              <Download size={20} strokeWidth={2.5} />
                          </a>
                      </div>
                  ))}
              </div>
          </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
      `}</style>
    </div>
  );
}
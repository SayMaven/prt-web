"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Image as ImageIcon, Download, X, Settings, RefreshCcw, Check, Plus, Trash2, AlertCircle } from "lucide-react";

// Struktur data item dalam antrian
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

// Daftar Format
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cleanup effect: Hanya jalan saat component unmount (tutup tab/pindah halaman)
  // Kita TIDAK membersihkan URL saat state berubah agar thumbnail tidak hilang
  useEffect(() => {
    return () => {
      queue.forEach(item => URL.revokeObjectURL(item.previewUrl));
      processed.forEach(item => URL.revokeObjectURL(item.url));
    };
  }, []);

  const addToQueue = (newFiles: File[]) => {
    const newItems = newFiles.map(file => ({
      id: crypto.randomUUID(), // Unique ID untuk key
      file,
      previewUrl: URL.createObjectURL(file)
    }));
    
    setQueue(prev => [...prev, ...newItems]);
    setProcessed([]); // Reset hasil karena antrian berubah
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addToQueue(Array.from(e.target.files));
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- DRAG & DROP ---
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

  // FIX: Hapus item spesifik tanpa merusak URL item lain
  const removeItem = (idToRemove: string) => {
    setQueue(prev => {
      const itemToRemove = prev.find(i => i.id === idToRemove);
      if (itemToRemove) URL.revokeObjectURL(itemToRemove.previewUrl); // Hapus memori item ini saja
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
          
          // --- LOGIC RESIZE (FIX ICO SIZE) ---
          let finalWidth = img.width;
          let finalHeight = img.height;

          // Jika format ICO, paksa resize max 256px (Standar icon modern)
          // Ini mengurangi ukuran file secara drastis (misal 2MB -> 50KB)
          if (targetFormat === "image/x-icon") {
              const MAX_ICO_SIZE = 256;
              if (finalWidth > MAX_ICO_SIZE || finalHeight > MAX_ICO_SIZE) {
                  const ratio = Math.min(MAX_ICO_SIZE / finalWidth, MAX_ICO_SIZE / finalHeight);
                  finalWidth = Math.round(finalWidth * ratio);
                  finalHeight = Math.round(finalHeight * ratio);
              }
          }

          const canvas = document.createElement("canvas");
          canvas.width = finalWidth;
          canvas.height = finalHeight;
          
          const ctx = canvas.getContext("2d");
          if (ctx) {
             // Handle background putih untuk JPEG/BMP (tidak support transparan)
             if (targetFormat === "image/jpeg" || targetFormat === "image/bmp") {
                 ctx.fillStyle = "#FFFFFF"; 
                 ctx.fillRect(0, 0, canvas.width, canvas.height);
             }
             
             // Gunakan ukuran baru yang sudah di-resize
             ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
             
             // Tentukan encoder format
             // ICO sebenarnya tidak didukung native oleh toBlob, jadi kita encode sebagai PNG
             // lalu nanti kita ganti ekstensinya jadi .ico (Trik standar web converter)
             const encoderFormat = targetFormat === "image/x-icon" ? "image/png" : targetFormat;

             canvas.toBlob(
                (blob) => {
                  if (blob) {
                    resolve({
                      originalName: item.file.name,
                      blob,
                      url: URL.createObjectURL(blob),
                      size: blob.size,
                      // Rename extension .png -> .ico
                      format: targetFormat.split("/")[1].replace("x-icon", "ico")
                    });
                  } else {
                    // Fallback
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">

      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
            bg-gray-900 border-2 transition-all duration-300 rounded-2xl shadow-xl overflow-hidden
            ${isDragging 
                ? "border-purple-500 bg-slate-900/80 scale-[1.01] shadow-purple-500/20" 
                : "border-slate-800"
            }
        `}
      >
         
         <input 
            type="file" 
            multiple 
            accept="image/*" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handleFileChange}
         />

         {/* --- LOGIC TAMPILAN --- */}
         {queue.length === 0 ? (
             // STATE KOSONG: UPLOAD AREA BESAR
             <div 
                onClick={() => fileInputRef.current?.click()}
                className="p-12 md:p-20 text-center cursor-pointer hover:bg-slate-800/50 transition-colors"
             >
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <Upload className={`transition-colors ${isDragging ? "text-purple-400" : "text-slate-400"}`} size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">
                    {isDragging ? "Lepaskan File Disini" : "Upload Gambar"}
                </h3>
                <p className="text-slate-500 max-w-sm mx-auto">
                    Klik atau drag & drop gambar. Mendukung format modern dan klasik (ICO, BMP).
                </p>
             </div>
         ) : (
             // STATE TERISI: GRID PREVIEW & SETTINGS
             <div className="p-6 space-y-6">
                 
                 {/* Header Toolbar */}
                 <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                        <span className="text-white font-bold text-lg">{queue.length} Gambar Dipilih</span>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white px-3 py-1.5 rounded-full transition-colors"
                        >
                            <Plus size={14}/> Tambah
                        </button>
                    </div>
                    <button 
                        onClick={clearAll}
                        className="text-red-400 hover:text-red-300 text-xs font-bold flex items-center gap-1"
                    >
                        <Trash2 size={14}/> Hapus Semua
                    </button>
                 </div>

                 {/* GRID PREVIEW (Thumbnail tidak hilang saat hapus item) */}
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-fade-in max-h-[350px] overflow-y-auto custom-scrollbar p-2">
                     {queue.map((item) => (
                         <div key={item.id} className="relative group bg-slate-950 border border-slate-800 rounded-xl overflow-hidden aspect-square shadow-md">
                             <img src={item.previewUrl} className="w-full h-full object-cover transition-opacity group-hover:opacity-75" alt="preview" />
                             
                             <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-6">
                                 <p className="text-[10px] text-slate-200 truncate font-mono">{item.file.name}</p>
                                 <p className="text-[10px] text-slate-500">{formatSize(item.file.size)}</p>
                             </div>

                             <button 
                                onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}
                                className="absolute top-2 right-2 bg-red-500/90 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100 shadow-lg"
                             >
                                 <X size={14} />
                             </button>
                         </div>
                     ))}
                 </div>

                 {/* SETTINGS PANEL */}
                 <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-5">
                    
                    {/* Format Grid */}
                    <div className="space-y-3">
                        <label className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-wider">
                            <Settings size={12}/> Target Format
                        </label>
                        <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                            {SUPPORTED_FORMATS.map((fmt) => (
                                <button
                                    key={fmt.id}
                                    onClick={() => setTargetFormat(fmt.id)}
                                    className={`
                                        flex flex-col items-center justify-center p-2 rounded-lg border transition-all
                                        ${targetFormat === fmt.id 
                                            ? "bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/30" 
                                            : "bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                                        }
                                    `}
                                >
                                    <span className="text-xs font-bold">{fmt.label}</span>
                                    <span className="text-[9px] opacity-70">{fmt.desc}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Compression Slider */}
                    <div className="space-y-3 pt-2">
                        <div className="flex justify-between items-end">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Compression / Quality</label>
                            <span className="text-xs font-mono text-purple-400 bg-purple-900/20 px-2 py-0.5 rounded border border-purple-500/30">
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
                            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500"
                        />
                        <div className="flex justify-between text-[10px] text-slate-600 font-mono">
                            <span>Low Quality (Small)</span>
                            <span>High Quality (Large)</span>
                        </div>
                    </div>
                 </div>

                 {/* ACTION BUTTON */}
                 <button
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl shadow-xl shadow-purple-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                 >
                    {isProcessing ? (
                        <div className="flex items-center gap-2 animate-pulse">
                            <RefreshCcw size={20} className="animate-spin"/> Processing...
                        </div>
                    ) : (
                        <><RefreshCcw size={20}/> Convert {queue.length} Images</>
                    )}
                 </button>
             </div>
         )}
      </div>

      {/* RESULTS LIST */}
      {processed.length > 0 && (
          <div className="space-y-4 animate-fade-in-up pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Check className="text-green-400" /> Selesai ({processed.length})
                  </h3>
                  {/* Warning Info */}
                  {processed.some(p => targetFormat === 'image/x-icon' ? p.format !== 'ico' : p.format !== targetFormat.split('/')[1]) && (
                      <span className="text-[10px] text-yellow-500 flex items-center gap-1 bg-yellow-900/20 px-2 py-1 rounded">
                          <AlertCircle size={10}/> Fallback applied for incompatible format.
                      </span>
                  )}
              </div>
              
              <div className="grid gap-3">
                  {processed.map((item, idx) => (
                      <div key={idx} className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center justify-between group hover:border-purple-500/50 transition-colors">
                          <div className="flex items-center gap-4 overflow-hidden">
                              <div className="w-14 h-14 bg-slate-950 rounded-lg overflow-hidden shrink-0 border border-slate-800">
                                  <img src={item.url} className="w-full h-full object-cover" alt="result" />
                              </div>
                              <div className="min-w-0">
                                  <p className="text-sm font-bold text-white truncate max-w-[200px] md:max-w-md">{item.originalName}</p>
                                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                                      <span className="uppercase bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 text-slate-300">{item.format}</span>
                                      <span className="text-green-400 font-mono">{formatSize(item.size)}</span>
                                  </div>
                              </div>
                          </div>
                          
                          <a 
                            href={item.url} 
                            download={`converted_${idx + 1}.${item.format}`}
                            className="bg-slate-800 hover:bg-green-600 text-slate-300 hover:text-white p-2.5 rounded-lg transition-all shadow-sm"
                            title="Download"
                          >
                              <Download size={20} />
                          </a>
                      </div>
                  ))}
              </div>
          </div>
      )}

    </div>
  );
}
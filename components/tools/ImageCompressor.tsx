"use client";

import { useState, useEffect, useRef } from "react";
import { Image as ImageIcon, Download, RefreshCcw, SlidersHorizontal, Settings2, FileImage } from "lucide-react";

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  
  const [quality, setQuality] = useState<number>(0.8);
  const [uiQuality, setUiQuality] = useState<number>(0.8);
  const [format, setFormat] = useState<"image/jpeg" | "image/webp" | "image/png">("image/jpeg");
  const [isFormatDropdownOpen, setIsFormatDropdownOpen] = useState(false);
  const [isCompressing, setIsCompressing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formats = [
    { value: "image/jpeg", label: "JPEG (.jpg)" },
    { value: "image/webp", label: "WebP (.webp)" },
    { value: "image/png", label: "PNG (.png)" }
  ];

  // Helper: Format Ukuran File (misal 1024 bytes -> 1 KB)
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Process File Handler
  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
        alert("Mohon upload file gambar (JPG/PNG/WEBP).");
        return;
    }
    setOriginalFile(file);
    setOriginalPreview(URL.createObjectURL(file));
    setCompressedPreview(null);
    setCompressedBlob(null);
  };

  // 1. Handle saat user memilih file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // 2. LOGIKA INTI: Kompresi Gambar (Jalan tiap file/quality/format berubah)
  useEffect(() => {
    if (!originalFile) return;

    setIsCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(originalFile);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Jika format adalah PNG, API bawaan browser (toBlob) tidak mendukung pengaturan kualitas karena PNG bersifat lossless.
        // Sebagai solusi, kita menggunakan nilai 'quality' untuk memperkecil skala resolusi (dimension scaling) agar ukuran file mengecil.
        const scale = format === "image/png" ? quality : 1;
        
        // Buat Canvas virtual di memori
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        const ctx = canvas.getContext("2d");
        
        // Gambar image asli ke atas canvas (dengan atau tanpa scale)
        ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Minta canvas mengubah jadi Blob dengan format dan kualitas tertentu
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            setCompressedBlob(blob);
            setCompressedPreview(URL.createObjectURL(blob));
            setIsCompressing(false);
          },
          format,
          quality
        );
      };
    };
  }, [originalFile, quality, format]); 

  // Drag and Drop Logic
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
      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          processFile(e.dataTransfer.files[0]);
      }
  };

  const handleDownload = () => {
    if (!compressedBlob || !compressedPreview) return;
    const link = document.createElement("a");
    link.href = compressedPreview;
    const originalName = originalFile?.name.split(".")[0] || "image";
    let ext = "jpg";
    if (format === "image/webp") ext = "webp";
    if (format === "image/png") ext = "png";
    link.download = `${originalName}-compressed.${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* --- AREA UPLOAD (Jika belum ada file) --- */}
      {!originalFile && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-16 text-center cursor-pointer transition-all duration-300 group shadow-lg ${isDragging ? "scale-105" : "hover:scale-[1.02]"}`}
          style={{ 
              background: isDragging ? "var(--accent-subtle)" : "var(--card-bg)", 
              borderColor: isDragging ? "var(--accent)" : "var(--card-border)" 
          }}
        >
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ background: "var(--page-bg)", color: "var(--accent)" }}>
                <ImageIcon size={40} />
            </div>
            <h3 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>Upload or Drop Image Here</h3>
            <p className="mb-6 font-medium" style={{ color: "var(--text-secondary)" }}>Supports JPG, PNG, and WebP (up to high resolution)</p>
            <button className="px-8 py-3 rounded-xl font-bold transition-transform pointer-events-none shadow-xl" style={{ background: "var(--accent)", color: "var(--page-bg)" }}>
                Select Image
            </button>
            <input 
                type="file" 
                accept="image/*" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
            />
        </div>
      )}

      {/* --- AREA WORKSPACE (Jika file sudah dipilih) --- */}
      {originalFile && originalPreview && (
        <div className="space-y-6 animate-in zoom-in-95 duration-500">
            
            {/* Panel Kontrol Pengaturan */}
            <div className="p-6 md:p-8 rounded-3xl border shadow-xl flex flex-col md:flex-row gap-8 items-center relative z-20" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <div className="flex-1 w-full space-y-4">
                    <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2" style={{ color: "var(--text-primary)" }}>
                            <SlidersHorizontal size={18} />
                            <label className="font-bold text-sm tracking-wide">
                                {format === "image/png" ? "Resolution Scale (PNG)" : "Compression Quality"}
                            </label>
                        </div>
                        <span className="px-3 py-1 text-xs font-mono font-bold rounded-lg" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>{Math.round(uiQuality * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0.1" 
                        max="1.0" 
                        step="0.05" 
                        value={uiQuality}
                        onChange={(e) => setUiQuality(parseFloat(e.target.value))}
                        onMouseUp={() => setQuality(uiQuality)}
                        onTouchEnd={() => setQuality(uiQuality)}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                        style={{ background: "var(--card-border)", accentColor: "var(--accent)" }}
                    />
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-60 flex justify-between" style={{ color: "var(--text-muted)" }}>
                        <span>Lepas geseran untuk apply</span>
                        {format === "image/png" && <span className="text-amber-500">PNG: Resizing Image</span>}
                    </p>
                </div>
                
                <div className="w-px h-16 hidden md:block" style={{ background: "var(--card-border)" }}></div>
                
                <div className="flex-1 w-full space-y-4">
                    <div className="flex items-center gap-2 mb-2" style={{ color: "var(--text-primary)" }}>
                        <Settings2 size={18} />
                        <label className="font-bold text-sm tracking-wide">Output Format</label>
                    </div>
                    
                    {/* Custom Dropdown */}
                    <div className="relative">
                        <button 
                            onClick={() => setIsFormatDropdownOpen(!isFormatDropdownOpen)}
                            className="w-full p-3 font-bold rounded-xl border flex justify-between items-center shadow-sm transition-colors hover:border-[color:var(--accent)]"
                            style={{ background: "var(--page-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                        >
                            {formats.find(f => f.value === format)?.label}
                            <span className={`transform transition-transform ${isFormatDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                        </button>
                        
                        {isFormatDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 rounded-xl border shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                                {formats.map(f => (
                                    <button 
                                        key={f.value}
                                        onClick={() => {
                                            setFormat(f.value as any);
                                            setIsFormatDropdownOpen(false);
                                        }}
                                        className="w-full text-left p-3 font-bold transition-colors hover:bg-[color:var(--accent-subtle)] hover:text-[color:var(--accent)]"
                                        style={{ color: "var(--text-primary)", borderBottom: "1px solid var(--card-border)" }}
                                    >
                                        {f.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Grid Preview Dua Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Kolom Kiri: ASLI */}
                <div className="p-5 rounded-3xl border shadow-sm flex flex-col" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                    <div className="mb-4 flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                            <FileImage size={18} style={{ color: "var(--text-muted)" }} />
                            <h4 className="font-bold text-sm uppercase tracking-wide" style={{ color: "var(--text-secondary)" }}>Original Image</h4>
                        </div>
                        <span className="px-3 py-1 text-xs font-bold rounded-lg border" style={{ background: "var(--page-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}>
                            {formatSize(originalFile.size)}
                        </span>
                    </div>
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden flex items-center justify-center border" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                        <img src={originalPreview} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>

                {/* Kolom Kanan: HASIL KOMPRESI */}
                <div className="p-5 rounded-3xl border shadow-xl flex flex-col relative overflow-hidden transition-all" style={{ background: "var(--page-bg)", borderColor: "var(--accent)" }}>
                    {isCompressing && (
                        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-3xl backdrop-blur-md" style={{ background: "rgba(0,0,0,0.5)" }}>
                            <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin mb-3" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}></div>
                            <div className="animate-pulse font-bold tracking-widest text-sm" style={{ color: "var(--accent)" }}>PROCESSING...</div>
                        </div>
                    )}
                    <div className="mb-4 flex justify-between items-center px-2">
                        <div className="flex items-center gap-2">
                            <FileImage size={18} style={{ color: "var(--accent)" }} />
                            <h4 className="font-bold text-sm uppercase tracking-wide" style={{ color: "var(--accent)" }}>Compressed Result</h4>
                        </div>
                        {compressedBlob && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-extrabold px-2 py-1 rounded bg-green-500/20 text-green-500">
                                    ⬇ {Math.round(((originalFile.size - compressedBlob.size) / originalFile.size) * 100)}%
                                </span>
                                <span className="px-3 py-1 text-xs font-bold rounded-lg" style={{ background: "var(--accent)", color: "var(--page-bg)" }}>
                                    {formatSize(compressedBlob.size)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden flex items-center justify-center border" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                        {compressedPreview ? (
                             <img src={compressedPreview} alt="Compressed" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="font-medium text-sm" style={{ color: "var(--text-muted)" }}>Awaiting Result...</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="flex justify-center gap-4 pt-6">
                <button 
                    onClick={() => setOriginalFile(null)} 
                    className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold transition-transform hover:scale-105 active:scale-95 shadow-md border"
                    style={{ background: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                >
                    <RefreshCcw size={18} /> Restart
                </button>
                <button 
                    onClick={handleDownload}
                    disabled={!compressedBlob || isCompressing}
                    className="flex items-center gap-2 px-8 py-3.5 font-extrabold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:pointer-events-none disabled:scale-100"
                    style={{ background: "var(--accent)", color: "var(--page-bg)" }}
                >
                    <Download size={20} strokeWidth={2.5} /> Download Result
                </button>
            </div>

        </div>
      )}

    </div>
  );
}
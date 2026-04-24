"use client";

import { useState, useRef } from 'react';
import { Download, Upload, Loader2, Image as ImageIcon, X } from 'lucide-react';

export default function BackgroundRemover() {
  const [image, setImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [originalName, setOriginalName] = useState<string>(""); // State untuk simpan nama file
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- HANDLER FILE ---
  const processFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setImage(url);
      setOriginalName(file.name); // Simpan nama asli file
      setProcessedImage(null);
    } else {
      alert("Harap upload file gambar (JPG/PNG).");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  // --- HANDLER DRAG & DROP ---
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
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // --- HANDLER REMOVE BACKGROUND ---
  const handleRemoveBackground = async () => {
    if (!image) return;
    setIsLoading(true);
    setLoadingText("Menyiapkan AI (Download ~40MB)...");

    try {
      const pkg: any = await import("@imgly/background-removal");
      
      // Deteksi fungsi (Named export vs Default export)
      const removeFunc = pkg.removeBackground || pkg.default || pkg;

      if (typeof removeFunc !== 'function') {
         throw new Error(`Library terload, tapi fungsi tidak ditemukan.`);
      }

      setLoadingText("Sedang memproses gambar...");

      const blob = await removeFunc(image, {
        progress: (key: string, current: number, total: number) => {
            // console.log(`Downloading ${key}: ${current} of ${total}`);
        }
      });

      const url = URL.createObjectURL(blob);
      setProcessedImage(url);
    } catch (error) {
      console.error("Error Detail:", error);
      alert(`Gagal memproses: ${error instanceof Error ? error.message : "Error tidak diketahui"}`);
    } finally {
      setIsLoading(false);
      setLoadingText("");
    }
  };

  const handleReset = () => {
    setImage(null);
    setProcessedImage(null);
    setOriginalName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Helper untuk membuat nama file download
  // Contoh: "foto-liburan.jpg" -> "foto-liburan-removed-bg.png"
  const getDownloadFileName = () => {
    if (!originalName) return "image-removed-bg.png";
    const nameWithoutExtension = originalName.replace(/\.[^/.]+$/, "");
    return `${nameWithoutExtension}-removed-bg.png`;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 rounded-2xl border shadow-2xl backdrop-blur-md" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
      {/* --- AREA UPLOAD --- */}
      {!image && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className="border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all text-center group relative overflow-hidden"
          style={{
            background: isDragging ? "var(--accent-subtle)" : "var(--page-bg)",
            borderColor: isDragging ? "var(--accent)" : "var(--card-border)"
          }}
        >
          <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
          />
          
          <div className="flex flex-col items-center gap-4 pointer-events-none relative z-10">
              <div className="p-4 rounded-full transition-all group-hover:bg-[color:var(--accent-subtle)] group-hover:text-[color:var(--accent-text)]" style={{ background: isDragging ? "var(--accent)" : "var(--card-bg)", color: isDragging ? "var(--accent-text)" : "var(--text-muted)" }}>
                  <Upload size={40} />
              </div>
              <div>
                  <p className="font-bold text-lg mb-1" style={{ color: "var(--text-primary)" }}>
                    {isDragging ? "Lepaskan Gambar di Sini" : "Klik atau Drag & Drop Gambar"}
                  </p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>JPG, PNG, WEBP (Max 5MB)</p>
              </div>
          </div>
        </div>
      )}

      {/* --- AREA EDITOR --- */}
      {image && (
        <div className="animate-in fade-in zoom-in duration-300">
            {/* Tombol Reset */}
            <div className="flex justify-end mb-4">
                <button onClick={handleReset} className="hover:text-red-400 flex items-center gap-1 text-sm transition-colors" style={{ color: "var(--text-muted)" }}>
                    <X size={16} /> Ganti Gambar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                         <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Original</span>
                         <span className="text-[10px] truncate max-w-[150px]" style={{ color: "var(--text-secondary)" }}>{originalName}</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border aspect-square flex items-center justify-center" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                        <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>

                {/* Result */}
                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent)" }}>Result</span>
                    <div className="relative rounded-lg overflow-hidden border bg-[url('https://media.istockphoto.com/id/1156515320/vector/checkerboard-pattern-transparent-background.jpg?s=612x612&w=0&k=20&c=B3a936s2-5a-D49Z-6IuM68F05-u0yXF7rK3x6VzXgU=')] aspect-square flex items-center justify-center" style={{ borderColor: "var(--card-border)" }}>
                        {isLoading ? (
                            <div className="text-center p-4 z-10">
                                <Loader2 className="animate-spin mx-auto mb-3" size={40} style={{ color: "var(--accent)" }} />
                                <p className="text-sm font-bold px-3 py-1 rounded shadow-sm" style={{ background: "var(--card-bg)", color: "var(--text-primary)" }}>{loadingText}</p>
                            </div>
                        ) : processedImage ? (
                            <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain z-10" />
                        ) : (
                            <div className="flex flex-col items-center opacity-50" style={{ color: "var(--text-muted)" }}>
                                <ImageIcon size={48} />
                                <span className="text-xs mt-2">Hasil akan muncul di sini</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex justify-center gap-4">
                {!processedImage && !isLoading && (
                    <button 
                        onClick={handleRemoveBackground}
                        className="flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg transition-all shadow-lg transform active:scale-95"
                        style={{ background: "var(--accent)", boxShadow: "0 4px 14px var(--accent-subtle)" }}
                        onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
                        onMouseLeave={e => e.currentTarget.style.opacity = "1"}
                    >
                        ✨ Hapus Background
                    </button>
                )}

                {processedImage && (
                    <a 
                        href={processedImage} 
                        download={getDownloadFileName()} // <-- Menggunakan nama file dinamis
                        className="flex items-center gap-2 px-8 py-3 text-white font-bold rounded-lg transition-all shadow-lg transform active:scale-95 bg-emerald-600 hover:bg-emerald-500"
                    >
                        <Download size={20} /> Download HD
                    </a>
                )}
            </div>
        </div>
      )}
    </div>
  );
}
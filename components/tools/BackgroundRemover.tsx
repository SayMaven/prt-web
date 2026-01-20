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
    <div className="max-w-4xl mx-auto p-6 bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">AI Background Remover</h2>
        <p className="text-slate-400 text-sm">Hapus latar belakang gambar instan di browser. Gratis & Privasi Terjaga.</p>
      </div>

      {/* --- AREA UPLOAD --- */}
      {!image && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-xl p-10 cursor-pointer transition-all text-center group relative
            ${isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-blue-500 bg-slate-900/50'}`}
        >
          <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*"
          />
          
          <div className="flex flex-col items-center gap-4 pointer-events-none">
              <div className={`p-4 rounded-full transition-all ${isDragging ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-blue-400'}`}>
                  <Upload size={40} />
              </div>
              <div>
                  <p className="text-white font-bold text-lg mb-1">
                    {isDragging ? "Lepaskan Gambar di Sini" : "Klik atau Drag & Drop Gambar"}
                  </p>
                  <p className="text-sm text-slate-500">JPG, PNG, WEBP (Max 5MB)</p>
              </div>
          </div>
        </div>
      )}

      {/* --- AREA EDITOR --- */}
      {image && (
        <div className="animate-in fade-in zoom-in duration-300">
            {/* Tombol Reset */}
            <div className="flex justify-end mb-4">
                <button onClick={handleReset} className="text-slate-400 hover:text-red-400 flex items-center gap-1 text-sm">
                    <X size={16} /> Ganti Gambar
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Original */}
                <div className="space-y-2">
                    <div className="flex justify-between items-end">
                         <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Original</span>
                         <span className="text-[10px] text-slate-600 truncate max-w-[150px]">{originalName}</span>
                    </div>
                    <div className="relative rounded-lg overflow-hidden border border-blue-700 bg-slate-900 aspect-square flex items-center justify-center">
                        <img src={image} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>

                {/* Result */}
                <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider">Result</span>
                    <div className="relative rounded-lg overflow-hidden border border-blue-700 bg-[url('https://media.istockphoto.com/id/1156515320/vector/checkerboard-pattern-transparent-background.jpg?s=612x612&w=0&k=20&c=B3a936s2-5a-D49Z-6IuM68F05-u0yXF7rK3x6VzXgU=')] aspect-square flex items-center justify-center">
                        {isLoading ? (
                            <div className="text-center p-4 z-10">
                                <Loader2 className="animate-spin mx-auto text-blue-500 mb-3" size={40} />
                                <p className="text-sm font-bold text-slate-800 bg-white/90 px-3 py-1 rounded shadow-sm">{loadingText}</p>
                            </div>
                        ) : processedImage ? (
                            <img src={processedImage} alt="Processed" className="max-w-full max-h-full object-contain z-10" />
                        ) : (
                            <div className="text-slate-500 flex flex-col items-center opacity-50">
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
                        className="flex items-center gap-2 px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
                    >
                        ✨ Hapus Background
                    </button>
                )}

                {processedImage && (
                    <a 
                        href={processedImage} 
                        download={getDownloadFileName()} // <-- Menggunakan nama file dinamis
                        className="flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-emerald-500/30 transform hover:-translate-y-1"
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
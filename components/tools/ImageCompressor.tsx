"use client";

import { useState, useEffect, useRef } from "react";

export default function ImageCompressor() {
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalPreview, setOriginalPreview] = useState<string | null>(null);
  const [compressedPreview, setCompressedPreview] = useState<string | null>(null);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  
  const [quality, setQuality] = useState<number>(0.8); // Default kualitas 80%
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper: Format Ukuran File (misal 1024 bytes -> 1 KB)
  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // 1. Handle saat user memilih file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Cek tipe file (hanya gambar)
    if (!file.type.startsWith("image/")) {
        alert("Mohon upload file gambar (JPG/PNG).");
        return;
    }

    setOriginalFile(file);
    // Buat preview lokal
    setOriginalPreview(URL.createObjectURL(file));
    // Reset state kompresi sebelumnya
    setCompressedPreview(null);
    setCompressedBlob(null);
  };

  // 2. LOGIKA INTI: Kompresi Gambar (Jalan tiap file/quality berubah)
  useEffect(() => {
    if (!originalFile) return;

    setIsCompressing(true);

    const reader = new FileReader();
    reader.readAsDataURL(originalFile);
    
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Buat Canvas virtual di memori
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        
        // Gambar image asli ke atas canvas
        ctx?.drawImage(img, 0, 0);

        // Minta canvas mengubah jadi Blob JPG dengan kualitas tertentu
        // 'image/jpeg' adalah kunci agar ukuran bisa mengecil drastis
        canvas.toBlob(
          (blob) => {
            if (!blob) return;
            setCompressedBlob(blob);
            // Buat URL preview untuk hasil kompresi
            setCompressedPreview(URL.createObjectURL(blob));
            setIsCompressing(false);
          },
          "image/jpeg", // Output paksa ke JPEG agar quality berfungsi
          quality       // Nilai 0.1 (jelek) sampai 1.0 (bagus)
        );
      };
    };
  }, [originalFile, quality]); // <- Dependency array penting!

  // 3. Handle Download
  const handleDownload = () => {
    if (!compressedBlob || !compressedPreview) return;
    const link = document.createElement("a");
    link.href = compressedPreview;
    // Tambahkan suffix -compressed.jpg pada nama file asli
    const originalName = originalFile?.name.split(".")[0] || "image";
    link.download = `${originalName}-compressed.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      
      {/* --- AREA UPLOAD (Jika belum ada file) --- */}
      {!originalFile && (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-blue-500 bg-slate-900/30 rounded-2xl p-12 text-center cursor-pointer transition-all group"
        >
            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">🖼️</div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Gambar di Sini</h3>
            <p className="text-slate-400 mb-4">Mendukung JPG, PNG, WebP</p>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-500 pointer-events-none">
                Pilih File
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
        <div className="space-y-8">
            
            {/* Kontrol Kualitas (Slider) */}
            <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700">
                <div className="flex justify-between mb-2">
                    <label className="text-slate-300 font-bold">Tingkat Kualitas (Quality)</label>
                    <span className="text-blue-400 font-mono font-bold">{Math.round(quality * 100)}%</span>
                </div>
                <input 
                    type="range" 
                    min="0.1" 
                    max="1.0" 
                    step="0.1" 
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-xs text-slate-500 mt-2">Geser ke kiri untuk ukuran file yang lebih kecil.</p>
            </div>

            {/* Grid Preview Dua Kolom */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* Kolom Kiri: ASLI */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-slate-800">
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-white font-bold">Original Image</h4>
                        <span className="px-3 py-1 bg-slate-800 text-slate-300 text-xs rounded-full">
                            {formatSize(originalFile.size)}
                        </span>
                    </div>
                    <div className="relative h-64 md:h-80 bg-slate-950/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                        <img src={originalPreview} alt="Original" className="max-w-full max-h-full object-contain" />
                    </div>
                </div>

                {/* Kolom Kanan: HASIL KOMPRESI */}
                <div className="bg-slate-900/30 p-4 rounded-xl border border-blue-900/30 relative">
                    {isCompressing && (
                        <div className="absolute inset-0 bg-slate-900/80 z-10 flex items-center justify-center rounded-xl">
                            <div className="text-blue-400 animate-pulse font-bold">Mengompres... 🔨</div>
                        </div>
                    )}
                    <div className="mb-4 flex justify-between items-center">
                        <h4 className="text-blue-400 font-bold">Compressed Result (JPG)</h4>
                        {compressedBlob && (
                            <div className="flex items-center gap-2">
                                {/* Indikator Penghematan */}
                                <span className="text-green-400 text-xs font-bold">
                                    ⬇ Hemat {Math.round(((originalFile.size - compressedBlob.size) / originalFile.size) * 100)}%
                                </span>
                                <span className="px-3 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">
                                    {formatSize(compressedBlob.size)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="relative h-64 md:h-80 bg-slate-950/50 rounded-lg overflow-hidden flex items-center justify-center border border-slate-800">
                        {compressedPreview ? (
                             <img src={compressedPreview} alt="Compressed" className="max-w-full max-h-full object-contain" />
                        ) : (
                            <div className="text-slate-600">Menunggu hasil...</div>
                        )}
                    </div>
                </div>
            </div>

            {/* Tombol Aksi Bawah */}
            <div className="flex justify-center gap-4 pt-4 border-t border-slate-800">
                <button 
                    onClick={() => setOriginalFile(null)} 
                    className="px-6 py-3 bg-slate-800 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors"
                >
                    🔄 Reset / Ganti Gambar
                </button>
                <button 
                    onClick={handleDownload}
                    disabled={!compressedBlob || isCompressing}
                    className="px-8 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 shadow-lg shadow-blue-900/20"
                >
                    ⬇️ Download Hasil
                </button>
            </div>

        </div>
      )}

    </div>
  );
}
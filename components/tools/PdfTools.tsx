"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, X, FileText, Download, ArrowUp, ArrowDown, Image as ImageIcon, FileStack } from "lucide-react";

type ToolMode = "MERGE_PDF" | "IMAGE_TO_PDF";

export default function PdfTools() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<ToolMode>("MERGE_PDF");
  const [isDragging, setIsDragging] = useState(false);

  // --- HELPER: Reset saat ganti mode ---
  const changeMode = (newMode: ToolMode) => {
    if (files.length > 0) {
      if (confirm("Ganti mode akan menghapus file yang sudah dipilih. Lanjutkan?")) {
        setFiles([]);
        setMode(newMode);
      }
    } else {
      setMode(newMode);
    }
  };

  // --- HELPER: Validasi File ---
  const validateFiles = (newFiles: File[]) => {
    const allowedTypes = mode === "MERGE_PDF" 
      ? ["application/pdf"] 
      : ["image/png", "image/jpeg", "image/jpg"];

    const validFiles = newFiles.filter(f => allowedTypes.includes(f.type));
    
    if (validFiles.length < newFiles.length) {
      alert(`Beberapa file ditolak. Mode ${mode === "MERGE_PDF" ? "PDF" : "Gambar"} hanya menerima file yang sesuai.`);
    }

    setFiles((prev) => [...prev, ...validFiles]);
  };

  // --- 1. HANDLE DRAG & DROP ---
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      validateFiles(droppedFiles);
    }
  }, [mode]);

  // --- 2. HANDLE INPUT MANUAL ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      validateFiles(Array.from(e.target.files));
    }
  };

  // --- 3. UTILS (Hapus & Geser) ---
  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const newFiles = [...files];
    if (direction === 'up' && index > 0) {
      [newFiles[index], newFiles[index - 1]] = [newFiles[index - 1], newFiles[index]];
    } else if (direction === 'down' && index < newFiles.length - 1) {
      [newFiles[index], newFiles[index + 1]] = [newFiles[index + 1], newFiles[index]];
    }
    setFiles(newFiles);
  };

  // --- 4. LOGIC PROCESSING (Dual Mode) ---
  const processFiles = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);

    try {
      const doc = await PDFDocument.create();

      if (mode === "MERGE_PDF") {
        // --- LOGIC GABUNG PDF ---
        for (const file of files) {
          const fileBuffer = await file.arrayBuffer();
          const srcPdf = await PDFDocument.load(fileBuffer);
          const copiedPages = await doc.copyPages(srcPdf, srcPdf.getPageIndices());
          copiedPages.forEach((page) => doc.addPage(page));
        }
      } else {
        // --- LOGIC GAMBAR JADI PDF ---
        for (const file of files) {
          const fileBuffer = await file.arrayBuffer();
          let image;
          
          if (file.type === "image/jpeg" || file.type === "image/jpg") {
            image = await doc.embedJpg(fileBuffer);
          } else {
            image = await doc.embedPng(fileBuffer);
          }

          const page = doc.addPage([image.width, image.height]);
          page.drawImage(image, {
            x: 0,
            y: 0,
            width: image.width,
            height: image.height,
          });
        }
      }

      // --- SIMPAN & DOWNLOAD (CUSTOM FILENAME) ---
      const pdfBytes = await doc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      
      // LOGIC PENAMAAN FILE BARU:
      let outputName = "merged-document"; // Default fallback
      if (files.length > 0) {
          const firstFileName = files[0].name;
          // Hapus ekstensi lama (misal: .pdf atau .jpg) agar tidak dobel
          const baseName = firstFileName.substring(0, firstFileName.lastIndexOf('.')) || firstFileName;
          
          // Format: "NamaFileAsli + pdf tools.pdf"
          outputName = `${baseName}-pdf tools`;
      }

      link.download = `${outputName}.pdf`;
      link.click();

    } catch (error) {
      console.error("Process Error:", error);
      alert("Gagal memproses file. Pastikan file tidak corrupt.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm shadow-xl">
      
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
            <span className="text-3xl">📑</span> PDF Tools
        </h2>
        <p className="text-slate-400 text-sm mt-2">
            Kelola file PDF dan Gambar secara instan (Client-side).
        </p>
      </div>

      {/* TABS MODE SWITCHER */}
      <div className="flex bg-slate-900/50 p-1 rounded-xl mb-6 border border-slate-700">
          <button 
            onClick={() => changeMode("MERGE_PDF")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all
                ${mode === "MERGE_PDF" ? "bg-blue-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}
            `}
          >
            <FileStack size={16} /> Merge PDF
          </button>
          <button 
            onClick={() => changeMode("IMAGE_TO_PDF")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold transition-all
                ${mode === "IMAGE_TO_PDF" ? "bg-emerald-600 text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"}
            `}
          >
            <ImageIcon size={16} /> Images to PDF
          </button>
      </div>

      {/* DROP ZONE */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 bg-slate-900/30 mb-6 group cursor-pointer relative overflow-hidden
            ${isDragging 
                ? "border-yellow-400 bg-yellow-400/10 scale-[1.02]" 
                : "border-slate-700 hover:border-blue-500"
            }
        `}
      >
        <input 
          type="file" 
          multiple 
          accept={mode === "MERGE_PDF" ? ".pdf" : ".jpg,.jpeg,.png"}
          onChange={handleFileChange}
          className="hidden" 
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-3 w-full h-full relative z-10">
            <div className={`p-4 rounded-full transition-all ${isDragging ? "bg-yellow-400 text-black" : "bg-slate-800 text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-900/30"}`}>
                {isDragging ? <Download size={32} className="animate-bounce" /> : <Upload size={32} />}
            </div>
            <div>
                <span className="text-white font-bold block text-lg">
                    {isDragging ? "Lepaskan File Disini!" : mode === "MERGE_PDF" ? "Upload File PDF" : "Upload Gambar (JPG/PNG)"}
                </span>
                <span className="text-xs text-slate-500 mt-1">
                    Atau klik untuk memilih file • Drag & Drop Supported
                </span>
            </div>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center text-xs text-slate-500 uppercase font-bold tracking-wider px-2">
                <span>Urutan Halaman ({files.length})</span>
                <button onClick={() => setFiles([])} className="text-red-400 hover:text-red-300">Hapus Semua</button>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between bg-slate-800/80 p-3 rounded-lg border border-slate-700 hover:border-slate-500 transition-all">
                        <div className="flex items-center gap-3 overflow-hidden">
                            <span className="bg-slate-900 text-slate-400 font-mono text-xs w-6 h-6 flex items-center justify-center rounded-full border border-slate-700">
                                {index + 1}
                            </span>
                            {mode === "MERGE_PDF" ? <FileText size={18} className="text-red-400 shrink-0" /> : <ImageIcon size={18} className="text-emerald-400 shrink-0" />}
                            
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm text-white truncate max-w-[150px] md:max-w-[250px]">{file.name}</span>
                                <span className="text-[10px] text-slate-500">{(file.size / 1024).toFixed(0)} KB</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1">
                            <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30 hover:text-white transition-colors">
                                <ArrowUp size={14}/>
                            </button>
                            <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 disabled:opacity-30 hover:text-white transition-colors">
                                <ArrowDown size={14}/>
                            </button>
                            <button onClick={() => removeFile(index)} className="p-1.5 hover:bg-red-900/30 rounded text-slate-500 hover:text-red-400 ml-1 transition-colors">
                                <X size={16}/>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={processFiles}
        disabled={files.length < (mode === "MERGE_PDF" ? 2 : 1) || isProcessing}
        className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
            ${files.length < (mode === "MERGE_PDF" ? 2 : 1)
                ? "bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700" 
                : mode === "MERGE_PDF"
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-900/20 active:scale-[0.98]"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20 active:scale-[0.98]"
            }
        `}
      >
        {isProcessing ? (
            <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memproses...
            </span>
        ) : (
            <>
                <Download size={20} />
                {mode === "MERGE_PDF" ? `Gabungkan PDF (${files.length})` : `Convert Gambar ke PDF (${files.length})`}
            </>
        )}
      </button>

    </div>
  );
}
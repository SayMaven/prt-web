"use client";

import { useState, useCallback } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, X, FileText, Download, ArrowUp, ArrowDown, Image as ImageIcon, FileStack, Files, Trash2, CheckCircle2 } from "lucide-react";

type ToolMode = "MERGE_PDF" | "IMAGE_TO_PDF";

export default function PdfTools() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mode, setMode] = useState<ToolMode>("MERGE_PDF");
  const [isDragging, setIsDragging] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // --- HELPER: Reset saat ganti mode ---
  const changeMode = (newMode: ToolMode) => {
    if (files.length > 0) {
      if (confirm("Ganti mode akan menghapus file yang sudah dipilih. Lanjutkan?")) {
        setFiles([]);
        setMode(newMode);
        setIsDone(false);
      }
    } else {
      setMode(newMode);
      setIsDone(false);
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
    setIsDone(false);
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
    setIsDone(false);
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
    setIsDone(false);

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
          const baseName = firstFileName.substring(0, firstFileName.lastIndexOf('.')) || firstFileName;
          outputName = `${baseName}-SayMaven`;
      }

      link.download = `${outputName}.pdf`;
      link.click();
      
      setIsDone(true);
    } catch (error) {
      console.error("Process Error:", error);
      alert("Gagal memproses file. Pastikan file tidak corrupt atau terenkripsi password.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-8 border rounded-[2rem] shadow-2xl backdrop-blur-md transition-all duration-500"
         style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
      
      {/* TABS MODE SWITCHER */}
      <div className="flex p-1.5 rounded-2xl mb-8 border" style={{ background: "rgba(0,0,0,0.1)", borderColor: "var(--card-border)" }}>
          <button 
            onClick={() => changeMode("MERGE_PDF")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                ${mode === "MERGE_PDF" ? "shadow-md" : "opacity-60 hover:opacity-100 hover:bg-black/5"}
            `}
            style={mode === "MERGE_PDF" ? { background: "var(--accent)", color: "white" } : { color: "var(--text-primary)" }}
          >
            <FileStack size={18} /> Gabung PDF
          </button>
          <button 
            onClick={() => changeMode("IMAGE_TO_PDF")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                ${mode === "IMAGE_TO_PDF" ? "shadow-md" : "opacity-60 hover:opacity-100 hover:bg-black/5"}
            `}
            style={mode === "IMAGE_TO_PDF" ? { background: "var(--accent)", color: "white" } : { color: "var(--text-primary)" }}
          >
            <ImageIcon size={18} /> Gambar ke PDF
          </button>
      </div>

      {/* DROP ZONE */}
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-[2rem] p-10 text-center transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col items-center justify-center min-h-[250px] mb-8
            ${isDragging ? "scale-[1.02]" : ""}
        `}
        style={{ 
            borderColor: isDragging ? "var(--accent)" : "var(--card-border)", 
            background: isDragging ? "var(--accent-subtle)" : "rgba(0,0,0,0.1)" 
        }}
      >
        <input 
          type="file" 
          multiple 
          accept={mode === "MERGE_PDF" ? ".pdf" : ".jpg,.jpeg,.png"}
          onChange={handleFileChange}
          className="hidden" 
          id="file-upload"
        />
        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4 w-full h-full relative z-10 justify-center">
            <div 
                className={`p-5 rounded-full transition-all shadow-lg border ${isDragging ? "animate-bounce" : "group-hover:scale-110"}`}
                style={{ 
                    background: isDragging ? "var(--accent)" : "var(--card-bg)", 
                    color: isDragging ? "white" : "var(--accent)",
                    borderColor: isDragging ? "transparent" : "var(--card-border)"
                }}
            >
                <Upload size={36} strokeWidth={2.5} />
            </div>
            <div>
                <span className="font-black block text-xl mb-2" style={{ color: "var(--text-primary)" }}>
                    {isDragging ? "Lepaskan File Di Sini" : mode === "MERGE_PDF" ? "Upload File PDF" : "Upload Gambar (JPG/PNG)"}
                </span>
                <span className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    Atau klik area ini untuk mencari file • Mendukung Drag & Drop
                </span>
            </div>
        </label>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4 px-2">
                <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                    Urutan File ({files.length})
                </span>
                <button 
                    onClick={() => { setFiles([]); setIsDone(false); }} 
                    className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/50 transition-all"
                    style={{ borderColor: "var(--card-border)", color: "var(--text-muted)" }}
                >
                    <Trash2 size={14} /> Bersihkan
                </button>
            </div>
            
            <div className="max-h-[350px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {files.map((file, index) => (
                    <div 
                        key={index} 
                        className="flex items-center justify-between p-4 rounded-xl border transition-all hover:translate-x-1"
                        style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
                    >
                        <div className="flex items-center gap-4 overflow-hidden">
                            <span className="font-mono text-xs w-7 h-7 flex items-center justify-center rounded-full border bg-black/10 shrink-0" style={{ borderColor: "var(--card-border)", color: "var(--text-secondary)" }}>
                                {index + 1}
                            </span>
                            
                            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-black/5 border shrink-0" style={{ borderColor: "var(--card-border)" }}>
                                {mode === "MERGE_PDF" ? <FileText size={20} className="text-red-500" /> : <ImageIcon size={20} className="text-emerald-500" />}
                            </div>
                            
                            <div className="flex flex-col overflow-hidden">
                                <span className="text-sm font-bold truncate max-w-[150px] md:max-w-[250px]" style={{ color: "var(--text-primary)" }}>{file.name}</span>
                                <span className="text-xs font-medium mt-0.5" style={{ color: "var(--text-muted)" }}>{(file.size / 1024).toFixed(0)} KB</span>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-1 shrink-0 ml-4">
                            <button onClick={() => moveFile(index, 'up')} disabled={index === 0} className="p-2 rounded-lg border hover:bg-black/10 disabled:opacity-30 transition-all" style={{ borderColor: "transparent", color: "var(--text-secondary)" }}>
                                <ArrowUp size={16}/>
                            </button>
                            <button onClick={() => moveFile(index, 'down')} disabled={index === files.length - 1} className="p-2 rounded-lg border hover:bg-black/10 disabled:opacity-30 transition-all" style={{ borderColor: "transparent", color: "var(--text-secondary)" }}>
                                <ArrowDown size={16}/>
                            </button>
                            <div className="w-px h-6 bg-black/20 mx-1"></div>
                            <button onClick={() => removeFile(index)} className="p-2 rounded-lg hover:bg-red-500/10 hover:text-red-500 transition-all" style={{ color: "var(--text-secondary)" }}>
                                <X size={18}/>
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
        className={`w-full py-4 rounded-xl font-black flex items-center justify-center gap-3 transition-all text-base uppercase tracking-wider
            ${files.length < (mode === "MERGE_PDF" ? 2 : 1)
                ? "opacity-50 cursor-not-allowed border" 
                : isDone
                    ? "bg-emerald-500 text-white shadow-lg hover:bg-emerald-600"
                    : "text-white shadow-xl hover:scale-[1.02] active:scale-[0.98]"
            }
        `}
        style={files.length >= (mode === "MERGE_PDF" ? 2 : 1) && !isDone ? { background: "var(--accent)" } : files.length < (mode === "MERGE_PDF" ? 2 : 1) ? { background: "rgba(0,0,0,0.2)", borderColor: "var(--card-border)", color: "var(--text-muted)" } : {}}
      >
        {isProcessing ? (
            <span className="flex items-center gap-3">
                <span className="w-5 h-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></span>
                Memproses File...
            </span>
        ) : isDone ? (
            <>
                <CheckCircle2 size={22} /> Selesai Diunduh
            </>
        ) : (
            <>
                <Download size={22} />
                {mode === "MERGE_PDF" ? `Gabungkan ${files.length} PDF` : `Convert ${files.length} Gambar`}
            </>
        )}
      </button>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
      `}</style>
    </div>
  );
}
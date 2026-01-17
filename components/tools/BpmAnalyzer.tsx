"use client";

import { useState, useRef } from "react";
// @ts-ignore (Library ini kadang butuh ignore kalau type definition-nya belum ke-load)
import { analyze } from "web-audio-beat-detector";

export default function BpmAnalyzer() {
  const [bpm, setBpm] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null); // Simpan file dulu, jangan langsung analisa
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- 1. HANDLE DRAG & DROP ---
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFile = e.dataTransfer.files[0];
      validateAndSetFile(droppedFile);
    }
  };

  // --- 2. HANDLE FILE SELECTION ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    // Reset state sebelumnya
    setBpm(null);
    setError("");
    
    // Cek tipe file (Audio only)
    if (!selectedFile.type.startsWith("audio/")) {
      setError("Format file tidak didukung. Harap upload file audio (MP3/WAV).");
      return;
    }
    setFile(selectedFile);
  };

  // --- 3. CORE LOGIC (ENGINE BARU) ---
  const runAnalysis = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setBpm(null);

    try {
      // Setup Audio Context
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContext();

      // Baca file sebagai ArrayBuffer
      const buffer = await file.arrayBuffer();
      
      // Decode audio (Ini proses berat, browser akan kerja keras di sini)
      const audioBuffer = await audioCtx.decodeAudioData(buffer);

      // Jalankan Library web-audio-beat-detector
      const tempo = await analyze(audioBuffer);

      // Bulatkan hasil
      const roundedBpm = Math.round(tempo);
      setBpm(roundedBpm.toString());
      
    } catch (err) {
      console.error(err);
      setError("Gagal menganalisa. Pastikan file audio memiliki beat/drum yang jelas.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl text-center space-y-6">
      
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-white">BPM Analyzer</h2>
        <p className="text-slate-400">Drag & drop lagu kamu.</p>
      </div>

      {/* --- AREA UPLOAD (DRAG & DROP) --- */}
      <div 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`cursor-pointer border-2 border-dashed rounded-2xl p-10 transition-all group relative overflow-hidden ${
          isDragging 
            ? "border-blue-400 bg-blue-500/10 scale-105 shadow-xl shadow-blue-500/20" 
            : file 
              ? "border-green-500/50 bg-green-500/5"
              : "border-slate-700 hover:border-blue-500 hover:bg-slate-800/50"
        }`}
      >
        <div className="flex flex-col items-center gap-4 relative z-10">
          <span className="text-5xl group-hover:scale-110 transition-transform duration-300">
            {file ? "💿" : isDragging ? "inbox_tray" : "Upload"}
          </span>
          
          <div className="space-y-1">
            <p className={`font-medium text-lg ${file ? "text-green-400" : "text-white"}`}>
              {file ? file.name : "Klik atau Drop file audio di sini"}
            </p>
            {!file && <p className="text-sm text-slate-500">Support MP3, WAV, OGG</p>}
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="audio/*" 
          className="hidden" 
        />
      </div>

      {/* --- TOMBOL EKSEKUSI --- */}
      {file && !loading && !bpm && (
        <button
          onClick={runAnalysis}
          className="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all active:scale-95 flex items-center gap-2 mx-auto"
        >
          <span>🚀</span> Jalankan Analisa BPM
        </button>
      )}

      {/* --- LOADING STATE --- */}
      {loading && (
        <div className="space-y-3 py-4 animate-pulse">
          <div className="flex justify-center gap-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-100"></div>
            <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce delay-200"></div>
          </div>
          <p className="text-slate-400 text-sm">Sedang decode audio & hitung beat... (Tunggu sebentar)</p>
        </div>
      )}

      {/* --- HASIL --- */}
      {bpm && (
        <div className="animate-in zoom-in duration-500 py-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-2xl relative overflow-hidden group">
          {/* Efek Glow Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full"></div>
          
          <div className="relative z-10">
            <p className="text-slate-400 mb-2 text-sm uppercase tracking-widest font-semibold">Hasil Deteksi</p>
            <p className="text-7xl font-black text-white tracking-tight drop-shadow-2xl">
              {bpm}
            </p>
            <p className="text-2xl font-bold text-blue-400 mt-[-5px]">BPM</p>
          </div>

          <button 
             onClick={() => {setFile(null); setBpm(null);}}
             className="mt-6 text-sm text-slate-500 hover:text-white underline transition-colors"
          >
            Coba Lagu Lain
          </button>
        </div>
      )}

      {/* --- ERROR MESSAGE --- */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm flex items-center justify-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

    </div>
  );
}
"use client";

import { useState, useRef } from "react";
import { 
  ArrowRightLeft, FileText, Image as ImageIcon, 
  Copy, Trash2, Upload, AlertCircle, Check, ArrowRight
} from "lucide-react";

type Mode = "text" | "image";
type TextAction = "encode" | "decode";

export default function Base64Converter() {
  const [mode, setMode] = useState<Mode>("text");
  
  // Text State
  const [textInput, setTextInput] = useState("");
  const [textOutput, setTextOutput] = useState("");
  const [textAction, setTextAction] = useState<TextAction>("encode");
  const [textError, setTextError] = useState("");

  // Image State
  const [imageAction, setImageAction] = useState<"encode" | "decode">("encode");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState("");
  const [imageError, setImageError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Copy State for Toast Notification
  const [copied, setCopied] = useState<"textOut" | "imgOut" | null>(null);

  // --- TEXT LOGIC ---
  const handleTextConvert = () => {
    setTextError("");
    try {
      if (textAction === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(textInput)));
        setTextOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(textInput)));
        setTextOutput(decoded);
      }
    } catch (e) {
      setTextError("Format input tidak valid untuk di-decode.");
      setTextOutput("");
    }
  };

  const swapTextAction = () => {
    setTextAction(prev => prev === "encode" ? "decode" : "encode");
    setTextInput(textOutput);
    setTextOutput(textInput);
    setTextError("");
  };

  // --- IMAGE LOGIC ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setImageError("File harus berupa gambar.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImagePreview(result);
      setImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const handleBase64ImageInput = (val: string) => {
    setImageBase64(val);
    setImageError("");
    
    if (!val.trim()) {
      setImagePreview(null);
      return;
    }

    const img = new window.Image();
    img.onload = () => setImagePreview(val);
    img.onerror = () => {
      if (!val.startsWith("data:image")) {
        const assumedUri = `data:image/png;base64,${val}`;
        const imgRetry = new window.Image();
        imgRetry.onload = () => setImagePreview(assumedUri);
        imgRetry.onerror = () => setImageError("String Base64 bukan gambar yang valid.");
        imgRetry.src = assumedUri;
      } else {
        setImageError("String Base64 bukan gambar yang valid.");
        setImagePreview(null);
      }
    };
    img.src = val;
  };

  // --- UTILS ---
  const handleCopy = (text: string, type: "textOut" | "imgOut") => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      
      {/* Mode Selector */}
      <div className="flex p-1.5 rounded-2xl border backdrop-blur-md shadow-sm" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <button
          onClick={() => setMode("text")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            mode === "text" ? "bg-[var(--accent)] text-white shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <FileText size={18} /> Teks String
        </button>
        <button
          onClick={() => setMode("image")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
            mode === "image" ? "bg-[var(--accent)] text-white shadow-md" : "text-[var(--text-secondary)] hover:bg-black/5 dark:hover:bg-white/5"
          }`}
        >
          <ImageIcon size={18} /> File Gambar
        </button>
      </div>

      <div className="w-full rounded-[2rem] border shadow-2xl overflow-hidden p-6 md:p-8 transition-all" 
           style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        
        {/* ================= TEXT MODE ================= */}
        {mode === "text" && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            
            {/* Header / Direction */}
            <div className="flex items-center justify-between">
              <div className="flex bg-black/5 dark:bg-white/5 rounded-xl p-1 border" style={{ borderColor: "var(--card-border)" }}>
                <button
                  onClick={() => { setTextAction("encode"); setTextInput(""); setTextOutput(""); }}
                  className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${textAction === "encode" ? "bg-white dark:bg-gray-800 shadow-sm tool-title" : "tool-muted hover:bg-black/5 dark:hover:bg-white/10"}`}
                >
                  Text <ArrowRight size={12} className="mx-1.5 opacity-50" /> Base64
                </button>
                <button
                  onClick={() => { setTextAction("decode"); setTextInput(""); setTextOutput(""); }}
                  className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${textAction === "decode" ? "bg-white dark:bg-gray-800 shadow-sm tool-title" : "tool-muted hover:bg-black/5 dark:hover:bg-white/10"}`}
                >
                  Base64 <ArrowRight size={12} className="mx-1.5 opacity-50" /> Text
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-4 items-center">
              
              {/* INPUT */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-sm font-bold uppercase tracking-widest tool-muted">Input</label>
                  <button onClick={() => setTextInput("")} className="text-xs tool-muted hover:text-red-500 flex items-center gap-1 transition-colors">
                    <Trash2 size={12} /> Clear
                  </button>
                </div>
                <textarea
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder={textAction === "encode" ? "Ketik teks apapun di sini..." : "Paste string Base64 di sini..."}
                  className="w-full h-64 p-4 rounded-2xl border bg-transparent resize-none focus:ring-2 focus:ring-[var(--accent)] outline-none tool-title font-mono text-sm transition-all custom-scrollbar hover:border-[var(--card-border-hover)] focus:border-[var(--accent)]"
                  style={{ borderColor: "var(--card-border)" }}
                />
              </div>

              {/* ACTION BUTTON */}
              <div className="flex lg:flex-col justify-center gap-4 py-4">
                <button 
                  onClick={handleTextConvert}
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
                  style={{ background: "var(--accent)" }}
                  title="Convert"
                >
                  <ArrowRightLeft size={24} className="rotate-90 lg:rotate-0" />
                </button>
                
                <button 
                  onClick={swapTextAction}
                  className="w-12 h-12 rounded-full mx-auto flex items-center justify-center border transition-all hover:bg-black/5 dark:hover:bg-white/5 tool-muted hover:text-[var(--text-primary)]"
                  style={{ borderColor: "var(--card-border)" }}
                  title="Swap Action"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* OUTPUT */}
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-sm font-bold uppercase tracking-widest tool-muted">Output</label>
                  <button 
                    onClick={() => handleCopy(textOutput, "textOut")} 
                    className={`text-xs flex items-center gap-1 font-bold transition-all ${copied === "textOut" ? "text-green-500" : "text-[var(--accent)] hover:brightness-125"}`}
                  >
                    {copied === "textOut" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                  </button>
                </div>
                <div className="relative">
                  <textarea
                    value={textOutput}
                    readOnly
                    placeholder="Hasil akan muncul di sini..."
                    className="w-full h-64 p-4 rounded-2xl border bg-black/5 dark:bg-white/5 resize-none outline-none tool-title font-mono text-sm custom-scrollbar hover:border-[var(--card-border-hover)] transition-all"
                    style={{ borderColor: "var(--card-border)" }}
                  />
                  {textError && (
                    <div className="absolute inset-0 bg-red-500/10 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center text-red-500 p-4 text-center border border-red-500/50">
                      <AlertCircle size={32} className="mb-2" />
                      <p className="font-bold">{textError}</p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ================= IMAGE MODE ================= */}
        {mode === "image" && (
          <div className="flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-300">
            
            <div className="flex items-center justify-between">
              <div className="flex bg-black/5 dark:bg-white/5 rounded-xl p-1 border" style={{ borderColor: "var(--card-border)" }}>
                <button
                  onClick={() => { setImageAction("encode"); setImagePreview(null); setImageBase64(""); }}
                  className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${imageAction === "encode" ? "bg-white dark:bg-gray-800 shadow-sm tool-title" : "tool-muted hover:bg-black/5 dark:hover:bg-white/10"}`}
                >
                  Image <ArrowRight size={12} className="mx-1.5 opacity-50" /> Base64
                </button>
                <button
                  onClick={() => { setImageAction("decode"); setImagePreview(null); setImageBase64(""); }}
                  className={`flex items-center px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${imageAction === "decode" ? "bg-white dark:bg-gray-800 shadow-sm tool-title" : "tool-muted hover:bg-black/5 dark:hover:bg-white/10"}`}
                >
                  Base64 <ArrowRight size={12} className="mx-1.5 opacity-50" /> Image
                </button>
              </div>
            </div>

            {imageAction === "encode" ? (
               // IMAGE TO BASE64
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-widest tool-muted px-2">1. Upload Gambar</label>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all hover:bg-black/5 dark:hover:bg-white/5 relative overflow-hidden group hover:border-[var(--accent)]"
                      style={{ borderColor: "var(--card-border)" }}
                    >
                        {imagePreview ? (
                            <>
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-contain opacity-50 group-hover:opacity-20 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <span className="bg-black/70 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2"><Upload size={16}/> Ganti Gambar</span>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-16 h-16 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] flex items-center justify-center mb-4 transition-transform group-hover:scale-110">
                                    <Upload size={28} />
                                </div>
                                <p className="font-bold tool-title">Klik untuk memilih gambar</p>
                                <p className="text-xs tool-muted mt-1">JPG, PNG, GIF, WEBP</p>
                            </>
                        )}
                        <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-sm font-bold uppercase tracking-widest tool-muted">2. Base64 Output</label>
                      <button 
                        onClick={() => handleCopy(imageBase64, "imgOut")} 
                        className={`text-xs flex items-center gap-1 font-bold transition-all ${copied === "imgOut" ? "text-green-500" : "text-[var(--accent)] hover:brightness-125"}`}
                      >
                        {copied === "imgOut" ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
                      </button>
                    </div>
                    <textarea
                        value={imageBase64}
                        readOnly
                        placeholder="String Base64 akan muncul di sini..."
                        className="w-full h-64 p-4 rounded-2xl border bg-black/5 dark:bg-white/5 resize-none outline-none tool-title font-mono text-xs custom-scrollbar hover:border-[var(--card-border-hover)] transition-all"
                        style={{ borderColor: "var(--card-border)" }}
                    />
                  </div>
               </div>
            ) : (
               // BASE64 TO IMAGE
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center px-2">
                      <label className="text-sm font-bold uppercase tracking-widest tool-muted">1. Paste Base64</label>
                      <button onClick={() => setImageBase64("")} className="text-xs tool-muted hover:text-red-500 flex items-center gap-1 transition-colors">
                        <Trash2 size={12} /> Clear
                      </button>
                    </div>
                    <textarea
                        value={imageBase64}
                        onChange={(e) => handleBase64ImageInput(e.target.value)}
                        placeholder="Paste data:image/png;base64,iVBORw0KGgo... di sini"
                        className="w-full h-64 p-4 rounded-2xl border bg-transparent resize-none focus:ring-2 focus:ring-[var(--accent)] outline-none tool-title font-mono text-xs transition-all custom-scrollbar hover:border-[var(--card-border-hover)] focus:border-[var(--accent)]"
                        style={{ borderColor: "var(--card-border)" }}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-bold uppercase tracking-widest tool-muted px-2">2. Image Preview</label>
                    <div className="w-full h-64 border rounded-2xl flex flex-col items-center justify-center bg-black/5 dark:bg-white/5 relative overflow-hidden transition-all hover:border-[var(--card-border-hover)]"
                         style={{ borderColor: "var(--card-border)" }}>
                        
                        {imageError ? (
                            <div className="text-red-500 flex flex-col items-center gap-2">
                                <AlertCircle size={32} />
                                <span className="font-bold text-sm">{imageError}</span>
                            </div>
                        ) : imagePreview ? (
                            <img src={imagePreview} alt="Decoded Base64" className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-center tool-muted">
                                <ImageIcon size={32} className="mx-auto mb-2 opacity-50" />
                                <p className="text-sm">Preview akan muncul otomatis</p>
                            </div>
                        )}
                    </div>
                  </div>
               </div>
            )}
            
          </div>
        )}

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

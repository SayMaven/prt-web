"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Trash2, FileJson, Copy, Check, Download, Braces, Wand2, Minimize2, AlertCircle } from "lucide-react";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [highlightedOutput, setHighlightedOutput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<"pretty" | "minify">("pretty");
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Regex Syntax Highlighting Sederhana tapi Ampuh
  const highlightJson = (jsonStr: string) => {
    if (!jsonStr) return "";
    let str = jsonStr.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return str.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        let color = 'var(--text-primary)';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                color = 'var(--accent)'; // Key
            } else {
                color = '#10b981'; // String (Emerald)
            }
        } else if (/true|false/.test(match)) {
            color = '#8b5cf6'; // Boolean (Purple)
        } else if (/null/.test(match)) {
            color = 'var(--text-muted)'; // Null
        } else {
            color = '#f59e0b'; // Number (Amber)
        }
        return `<span style="color: ${color}">${match}</span>`;
    });
  };

  // 2. Logic Format
  const handleFormat = (currentInput: string, currentMode: "pretty" | "minify") => {
    if (!currentInput.trim()) {
      setOutput("");
      setHighlightedOutput("");
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(currentInput);
      const formatted = currentMode === "pretty" ? JSON.stringify(parsed, null, 2) : JSON.stringify(parsed);
      
      setOutput(formatted);
      setHighlightedOutput(highlightJson(formatted));
      setError(null);
    } catch (err: any) {
      setOutput("");
      setHighlightedOutput("");
      setError(err.message);
    }
  };

  // Auto-format jika input atau mode berubah
  useEffect(() => {
      const timeoutId = setTimeout(() => {
          handleFormat(input, mode);
      }, 300);
      return () => clearTimeout(timeoutId);
  }, [input, mode]);

  // 3. Utils: File Upload & Download
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
          const text = event.target?.result as string;
          setInput(text);
      };
      reader.readAsText(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDownload = () => {
      if (!output) return;
      const blob = new Blob([output], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `formatted_${Date.now()}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  const copyResult = () => {
    if(!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadSample = () => {
    setInput('{"project":"SayMaven","version":1.0,"features":["JSON Formatter","Color Picker"],"active":true,"data":{"users":1024,"nullVal":null}}');
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[85vh] min-h-[600px] w-full">
      
      {/* KIRI: EDITOR INPUT */}
      <div className="flex flex-col flex-1 border rounded-[2rem] shadow-xl overflow-hidden" style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
          
          {/* Header Input */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-black/10" style={{ borderColor: "var(--card-border)" }}>
              <div className="flex items-center gap-2">
                  <FileJson size={18} style={{ color: "var(--text-muted)" }} />
                  <span className="text-sm font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Raw JSON</span>
              </div>
              
              <div className="flex gap-2">
                  <button onClick={loadSample} className="px-3 py-1.5 text-xs font-bold rounded-lg border hover:bg-white/5 transition-all" style={{ color: "var(--accent)", borderColor: "var(--card-border)" }}>
                      Sample
                  </button>
                  <input type="file" accept=".json" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
                  <button onClick={() => fileInputRef.current?.click()} className="p-1.5 rounded-lg border hover:bg-white/5 transition-all" style={{ borderColor: "var(--card-border)", color: "var(--text-secondary)" }} title="Upload .json File">
                      <Upload size={16} />
                  </button>
                  <button onClick={() => setInput("")} className="p-1.5 rounded-lg border hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all" style={{ borderColor: "var(--card-border)", color: "var(--text-secondary)" }} title="Clear">
                      <Trash2 size={16} />
                  </button>
              </div>
          </div>

          {/* Textarea Input */}
          <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Paste kode JSON mentah Anda di sini..."
                spellCheck="false"
                className="absolute inset-0 w-full h-full p-6 bg-transparent font-mono text-sm resize-none focus:outline-none custom-scrollbar"
                style={{ color: "var(--text-primary)" }}
              />
          </div>

          {/* Error Banner */}
          <div className={`transition-all duration-300 overflow-hidden ${error ? 'h-auto border-t' : 'h-0 border-transparent'}`} style={{ borderColor: "rgba(239,68,68,0.3)" }}>
              {error && (
                  <div className="p-4 bg-red-500/10 flex items-start gap-3">
                      <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
                      <div>
                          <p className="text-xs font-bold text-red-500 uppercase tracking-widest mb-1">Invalid JSON</p>
                          <p className="text-sm text-red-400/90 font-mono break-all">{error}</p>
                      </div>
                  </div>
              )}
          </div>
      </div>

      {/* KANAN: EDITOR OUTPUT (HIGHLIGHTED) */}
      <div className="flex flex-col flex-1 border rounded-[2rem] shadow-xl overflow-hidden relative group" style={{ borderColor: "var(--card-border)", background: "var(--page-bg)" }}>
          
          {/* Header Output */}
          <div className="px-6 py-4 border-b flex justify-between items-center bg-black/10" style={{ borderColor: "var(--card-border)" }}>
              <div className="flex items-center gap-2">
                  <Braces size={18} style={{ color: "var(--accent)" }} />
                  <span className="text-sm font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Formatted Output</span>
              </div>
              
              <div className="flex gap-2 bg-black/20 p-1 rounded-xl border" style={{ borderColor: "var(--card-border)" }}>
                  <button 
                      onClick={() => setMode("pretty")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "pretty" ? "shadow-md" : "opacity-50 hover:opacity-100"}`}
                      style={mode === "pretty" ? { background: "var(--accent)", color: "white" } : { color: "var(--text-primary)" }}
                  >
                      <Wand2 size={14} /> Pretty
                  </button>
                  <button 
                      onClick={() => setMode("minify")}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${mode === "minify" ? "shadow-md" : "opacity-50 hover:opacity-100"}`}
                      style={mode === "minify" ? { background: "var(--accent)", color: "white" } : { color: "var(--text-primary)" }}
                  >
                      <Minimize2 size={14} /> Minify
                  </button>
              </div>
          </div>

          {/* Syntax Highlighted Display */}
          <div className="flex-1 relative overflow-auto custom-scrollbar p-6 bg-black/20" style={{ boxShadow: "inset 0 0 50px rgba(0,0,0,0.2)" }}>
              {!output && !error && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                      <Braces size={100} style={{ color: "var(--text-muted)" }} />
                  </div>
              )}
              
              {output && (
                  <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-all" dangerouslySetInnerHTML={{ __html: highlightedOutput }} />
              )}
          </div>

          {/* Floating Action Buttons di pojok kanan bawah output */}
          {output && (
              <div className="absolute bottom-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                      onClick={handleDownload}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest border shadow-lg backdrop-blur-md transition-all hover:scale-105"
                      style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                      title="Download JSON"
                  >
                      <Download size={16} />
                  </button>
                  <button 
                      onClick={copyResult}
                      className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest shadow-xl transition-all hover:scale-105"
                      style={{ 
                          background: copied ? "#10b981" : "var(--accent)", 
                          color: "white"
                      }}
                  >
                      {copied ? <Check size={16} /> : <Copy size={16} />} {copied ? "Copied" : "Copy"}
                  </button>
              </div>
          )}

      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; height: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
      `}</style>
    </div>
  );
}
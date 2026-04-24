"use client";

import { useState } from "react";
import { FileText, Type, AlignLeft, Clock, Mic, Trash2, Copy, CheckCheck } from "lucide-react";

export default function WordCounterPage() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  // Logic
  const wordCount = text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;
  const charCount = text.length;
  const charCountNoSpaces = text.replace(/\s/g, "").length;
  const paragraphCount = text.length === 0 ? 0 : text.split(/\n+/).filter(p => p.trim().length > 0).length;
  const sentenceCount = text.length === 0 ? 0 : text.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  
  const readingTimeMins = Math.ceil(wordCount / 200); // 200 wpm
  const speakingTimeMins = Math.ceil(wordCount / 130); // 130 wpm

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-6xl mx-auto px-4 py-8 min-h-screen flex flex-col">
      
      <section className="text-center mt-6 mb-12 relative z-10">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Text Utility</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Word <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Counter</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Ketahui statistik mendetail dari tulisan Anda. Hitung jumlah kata, karakter, paragraf, hingga estimasi waktu baca secara seketika.
        </p>
      </section>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-stretch pb-10">
        
        {/* Left: Input Area */}
        <div className="flex-1 w-full flex flex-col rounded-[2rem] border shadow-2xl overflow-hidden relative group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)]" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <div className="absolute top-0 left-0 w-full h-1.5 z-20" style={{ background: "var(--accent)" }}></div>
            
            <div className="flex justify-between items-center px-6 py-4 border-b" style={{ borderColor: "var(--card-border)", background: "var(--page-bg)" }}>
                <span className="text-sm font-bold tracking-widest uppercase flex items-center gap-2" style={{ color: "var(--text-secondary)" }}>
                    <FileText size={16} /> Input Text
                </span>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={handleCopy}
                        disabled={!text}
                        className="p-2 rounded-xl transition-colors hover:bg-[color:var(--card-border)] disabled:opacity-30 flex items-center gap-1.5 text-xs font-bold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {copied ? <CheckCheck size={16} className="text-green-500" /> : <Copy size={16} />} 
                        <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
                    </button>
                    <button 
                        onClick={() => setText("")}
                        disabled={!text}
                        className="p-2 rounded-xl transition-colors hover:bg-red-500/10 hover:text-red-500 disabled:opacity-30 flex items-center gap-1.5 text-xs font-bold"
                        style={{ color: "var(--text-primary)" }}
                    >
                        <Trash2 size={16} /> <span className="hidden sm:inline">Clear</span>
                    </button>
                </div>
            </div>

            <textarea
                className="w-full h-[400px] lg:h-[500px] p-8 text-lg outline-none resize-none bg-transparent transition-colors font-medium leading-relaxed"
                style={{ color: "var(--text-primary)" }}
                placeholder="Ketik, tempel tulisan, atau dokumen Anda di sini..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck="false"
            ></textarea>
        </div>

        {/* Right: Stats Panel */}
        <div className="w-full lg:w-[340px] flex flex-col gap-6">
            
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 gap-4">
                <StatCard icon={<Type size={20} />} label="Words" value={wordCount} highlight />
                <StatCard icon={<AlignLeft size={20} />} label="Characters" value={charCount} />
            </div>

            {/* Detailed Stats */}
            <div className="rounded-3xl border p-8 space-y-6 shadow-xl" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <h3 className="text-xs font-black uppercase tracking-widest border-b pb-4" style={{ color: "var(--text-muted)", borderColor: "var(--card-border)" }}>Detailed Statistics</h3>
                
                <div className="space-y-5">
                    <DetailedStat label="Sentences" value={sentenceCount} />
                    <DetailedStat label="Paragraphs" value={paragraphCount} />
                    <DetailedStat label="Char (No Spaces)" value={charCountNoSpaces} />
                </div>
            </div>

            {/* Estimations */}
            <div className="rounded-3xl border p-8 space-y-6 shadow-xl" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                <h3 className="text-xs font-black uppercase tracking-widest border-b pb-4" style={{ color: "var(--text-muted)", borderColor: "var(--card-border)" }}>Estimations</h3>
                
                <div className="space-y-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                            <Clock size={18} style={{ color: "var(--accent)" }} /> Reading
                        </div>
                        <span className="font-mono font-black" style={{ color: "var(--text-primary)" }}>~{readingTimeMins}m</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5 text-sm font-bold" style={{ color: "var(--text-secondary)" }}>
                            <Mic size={18} style={{ color: "var(--accent)" }} /> Speaking
                        </div>
                        <span className="font-mono font-black" style={{ color: "var(--text-primary)" }}>~{speakingTimeMins}m</span>
                    </div>
                </div>
            </div>

        </div>

      </div>

    </div>
  );
}

function StatCard({ icon, label, value, highlight = false }: { icon: React.ReactNode, label: string; value: number, highlight?: boolean }) {
  return (
    <div className={`p-6 rounded-[2rem] border shadow-xl flex flex-col items-center justify-center text-center transition-all duration-300 ${highlight ? 'scale-[1.02] z-10 hover:scale-[1.05]' : 'hover:scale-105'}`} 
         style={{ 
             background: highlight ? "var(--accent)" : "var(--card-bg)", 
             borderColor: highlight ? "var(--accent)" : "var(--card-border)",
             color: highlight ? "var(--page-bg)" : "var(--text-primary)",
             boxShadow: highlight ? "0 10px 30px var(--accent-subtle)" : undefined
         }}>
      <div className="mb-3 opacity-80">{icon}</div>
      <div className="text-5xl font-black mb-1.5 tracking-tighter">{value}</div>
      <div className="text-[10px] font-bold uppercase tracking-widest opacity-80">{label}</div>
    </div>
  );
}

function DetailedStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex justify-between items-center">
        <span className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>{label}</span>
        <span className="text-xl font-black font-mono" style={{ color: "var(--text-primary)" }}>{value}</span>
    </div>
  );
}
"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot, User, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Halo! Aku asisten AI Maven. Ada yang bisa dibantu hari ini?" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (widgetRef.current && !widgetRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text: userMsg }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });

      const data = await res.json();
      
      if (data.reply) {
        setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", text: "Maaf, lagi error nih servernya. " }]);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: "bot", text: "Gagal terhubung ke server AI. Coba lagi nanti." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={widgetRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div
          className="mb-4 w-80 md:w-96 rounded-[2rem] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in-95 slide-in-from-bottom-6 duration-300 border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          
          {/* Header */}
          <div className="p-4 px-6 flex justify-between items-center relative overflow-hidden" style={{ background: "var(--accent)", boxShadow: "0 2px 20px var(--accent-glow)" }}>
            <div className="absolute top-0 left-0 w-full h-full bg-white/10 pointer-events-none"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border border-white/30">
                <Bot size={18} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-white text-sm tracking-wide">Maven AI</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse shadow-[0_0_8px_#4ade80]"></div>
                  <span className="text-[10px] text-white/80 font-medium">Online & Ready</span>
                </div>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-all hover:scale-110 hover:rotate-90 relative z-10 bg-white/10 p-1.5 rounded-full">
               <X size={16} />
            </button>
          </div>

          {/* Body Chat */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 custom-scrollbar" style={{ background: "var(--page-bg)" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {msg.role === "bot" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
                        <Sparkles size={12} />
                    </div>
                )}
                
                <div 
                    className="max-w-[75%] p-3.5 text-sm shadow-sm relative group"
                    style={
                      msg.role === "user"
                        ? { background: "var(--accent)", color: "#fff", borderRadius: "1.25rem 1.25rem 0.25rem 1.25rem" }
                        : { background: "var(--card-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)", borderRadius: "0.25rem 1.25rem 1.25rem 1.25rem" }
                    }
                >
                    <div className="leading-relaxed">
                        <ReactMarkdown
                            components={{
                                strong: ({ node, ...props }) => <span className="font-bold" style={{ color: msg.role === "bot" ? "var(--text-primary)" : "#fff" }} {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 space-y-1 my-1" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1 my-1" {...props} />,
                                li: ({ node, ...props }) => <li className="marker:text-current" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                a: ({ node, ...props }) => <a className="underline hover:opacity-80 font-medium" style={{ color: "var(--accent-text)" }} target="_blank" rel="noopener noreferrer" {...props} />,
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                </div>
                
                {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full flex items-center justify-center ml-2 shrink-0 mt-1 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                        <User size={12} />
                    </div>
                )}
                
              </div>
            ))}
            
            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full flex items-center justify-center mr-2 shrink-0 mt-1" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
                    <Bot size={12} className="animate-pulse" />
                </div>
                <div className="px-4 py-3 rounded-2xl text-xs flex items-center gap-1 border" style={{ background: "var(--card-bg)", color: "var(--text-muted)", borderColor: "var(--card-border)", borderRadius: "0.25rem 1.25rem 1.25rem 1.25rem" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 px-4 flex gap-2 border-t items-center" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanyakan sesuatu..."
              className="flex-1 text-sm rounded-full px-4 py-2.5 border focus:outline-none transition-colors"
              style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="p-2.5 rounded-full transition-all text-white disabled:opacity-40 disabled:scale-100 hover:scale-110 active:scale-95 shadow-md flex items-center justify-center"
              style={{ background: "var(--accent)", boxShadow: "0 2px 10px var(--accent-glow)" }}
            >
              <Send size={16} className="ml-0.5" />
            </button>
          </form>
        </div>
      )}

      {/* --- FAB BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 active:scale-90 border-2 border-transparent hover:border-white/20"
        style={{ background: "var(--accent)", boxShadow: "0 8px 30px var(--accent-glow)" }}
      >
        <div className={`transition-transform duration-300 absolute ${isOpen ? "rotate-90 opacity-0 scale-50" : "rotate-0 opacity-100 scale-100"}`}>
            <MessageCircle className="text-white" size={26} />
        </div>
        <div className={`transition-transform duration-300 absolute ${isOpen ? "rotate-0 opacity-100 scale-100" : "-rotate-90 opacity-0 scale-50"}`}>
            <X className="text-white" size={26} />
        </div>
        
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-[var(--page-bg)] animate-bounce shadow-md" />
        )}
      </button>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--card-border); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: var(--text-muted); }
      `}</style>
    </div>
  );
}
"use client";

import ReactMarkdown from "react-markdown";
import { useState, useRef, useEffect } from "react";

type Message = {
  role: "user" | "bot";
  text: string;
};

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Halo! 👋 Aku asisten AI Maven. Ada yang bisa dibantu?" }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

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
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* --- CHAT WINDOW --- */}
      {isOpen && (
        <div
          className="mb-4 w-80 md:w-96 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300 border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          
          {/* Header */}
          <div className="p-4 flex justify-between items-center" style={{ background: "var(--accent)", boxShadow: "0 2px 20px var(--accent-glow)" }}>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
              <h3 className="font-bold text-white text-sm">Maven AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors text-lg leading-none">✕</button>
          </div>

          {/* Body Chat */}
          <div className="h-80 overflow-y-auto p-4 space-y-4" style={{ background: "var(--page-bg)" }}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div 
                    className="max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm"
                    style={
                      msg.role === "user"
                        ? { background: "var(--accent)", color: "#fff", borderRadius: "1rem 1rem 0.25rem 1rem" }
                        : { background: "var(--card-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)", borderRadius: "1rem 1rem 1rem 0.25rem" }
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
                                a: ({ node, ...props }) => <a className="underline hover:opacity-80" style={{ color: "var(--accent-text)" }} target="_blank" rel="noopener noreferrer" {...props} />,
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                </div>
              </div>
            ))}
            
            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="p-3 rounded-2xl text-xs animate-pulse border" style={{ background: "var(--card-bg)", color: "var(--text-muted)", borderColor: "var(--card-border)" }}>
                  Sedang mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 flex gap-2 border-t" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 text-sm rounded-xl px-3 py-2 border focus:outline-none transition-colors"
              style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--text-primary)" }}
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="p-2 rounded-xl transition-colors text-white disabled:opacity-40"
              style={{ background: "var(--accent)" }}
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* --- FAB BUTTON --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 active:scale-90"
        style={{ background: "var(--accent)", boxShadow: "0 4px 20px var(--accent-glow)" }}
      >
        {isOpen ? (
          <span className="text-2xl text-white font-bold">✕</span>
        ) : (
          <span className="text-2xl text-white">💬</span>
        )}
        
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-bounce" />
        )}
      </button>

    </div>
  );
}
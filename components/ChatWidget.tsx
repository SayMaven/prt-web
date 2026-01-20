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

  // Auto scroll ke bawah saat chat baru muncul
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
        <div className="mb-4 w-80 md:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
          
          {/* Header */}
          <div className="bg-blue-600 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <h3 className="font-bold text-white text-sm">Maven AI Assistant </h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-blue-200 hover:text-white">✕</button>
          </div>

          {/* Body Chat */}
          <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-950/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                
                {/* 👇 BAGIAN INI SAYA KEMBALIKAN (Bubble Container) */}
                <div 
                    className={`max-w-[85%] p-3.5 rounded-2xl text-sm shadow-sm ${
                    msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-slate-800 text-slate-200 rounded-bl-none border border-slate-700"
                    }`}
                >
                    {/* Render Markdown di dalam Bubble */}
                    <div className="leading-relaxed">
                        <ReactMarkdown
                            components={{
                                // Styling manual biar rapi & warna pas
                                strong: ({ node, ...props }) => <span className="font-bold text-white" {...props} />,
                                ol: ({ node, ...props }) => <ol className="list-decimal ml-4 space-y-1 my-1" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc ml-4 space-y-1 my-1" {...props} />,
                                li: ({ node, ...props }) => <li className="marker:text-current" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-2 last:mb-0" {...props} />,
                                a: ({ node, ...props }) => <a className="text-blue-300 hover:text-white underline" target="_blank" rel="noopener noreferrer" {...props} />,
                            }}
                        >
                            {msg.text}
                        </ReactMarkdown>
                    </div>
                </div>

              </div>
            ))}
            
            {/* Loading Indicator */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl rounded-bl-none text-xs text-slate-500 animate-pulse border border-slate-700">
                  Sedang mengetik...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ketik pesan..."
              className="flex-1 bg-slate-950 border border-slate-700 text-white text-sm rounded-xl px-3 focus:outline-none focus:border-blue-500"
            />
            <button 
              type="submit" 
              disabled={loading || !input.trim()}
              className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 text-white p-2 rounded-xl transition-colors"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      {/* --- FLOATING BUTTON (FAB) --- */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg hover:scale-110 transition-transform duration-300 active:scale-90"
      >
        {isOpen ? (
          <span className="text-2xl text-white font-bold">✕</span>
        ) : (
          <span className="text-2xl text-white">🗪</span>
        )}
        
        {/* Notif Badge (Hiasan) */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 rounded-full border-2 border-slate-900 animate-bounce"></span>
        )}
      </button>

    </div>
  );
}
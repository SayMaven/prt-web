"use client";

import { useState } from "react";
import QRCode from "react-qr-code";
import { Download, QrCode as QrIcon } from "lucide-react"; // Kita pakai icon biar cantik

export default function QrGenerator() {
  const [text, setText] = useState("");

  // Fungsi Download Gambar
  const downloadQR = () => {
    if (!text) return; // Cegah download kalau kosong

    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        // Tambahkan padding putih agar QR tidak mepet saat didownload
        const padding = 40; 
        canvas.width = img.width + padding;
        canvas.height = img.height + padding;
        
        if (ctx) {
            // Fill background putih
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Gambar QR di tengah
            ctx.drawImage(img, padding / 2, padding / 2);
            
            const pngFile = canvas.toDataURL("image/png");
            
            // Trigger download
            const downloadLink = document.createElement("a");
            downloadLink.download = `qr-code-${Date.now()}.png`;
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        }
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
      
      {/* Kolom Kiri: Input */}
      <div className="space-y-6 flex flex-col">
        <div className="p-6 rounded-2xl border shadow-xl backdrop-blur-md flex-1 flex flex-col" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <label className="block text-sm font-bold mb-4" style={{ color: "var(--text-primary)" }}>Isi Konten QR Code:</label>
            <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan link website, teks, atau nomor WA di sini..."
            className="w-full flex-1 min-h-[200px] border rounded-xl p-4 focus:ring-2 focus:ring-[color:var(--accent)] outline-none transition-all resize-none placeholder:text-[color:var(--text-muted)]"
            style={{ background: "var(--page-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
            />
        </div>
        
        <div className="p-4 rounded-xl border text-sm" style={{ background: "var(--accent-subtle)", borderColor: "var(--accent)", color: "var(--accent-text)" }}>
            💡 <b>Tips:</b> Ketik sesuatu di kolom atas, QR Code akan otomatis terbuat di sebelah kanan.
        </div>
      </div>

      {/* Kolom Kanan: Preview */}
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl shadow-xl min-h-[400px] border transition-all duration-500" style={{ background: text ? "var(--accent)" : "var(--card-bg)", borderColor: "var(--card-border)" }}>
        <div className="mb-8 flex-1 flex items-center justify-center w-full relative">
            {/* LOGIKA UTAMA: Cek jika ada text */}
            {text ? (
                <div className="p-4 bg-white rounded-xl shadow-2xl animate-in zoom-in duration-300 transform hover:scale-105 transition-transform cursor-pointer">
                    <QRCode 
                        id="qr-code-svg"
                        value={text} 
                        size={220} 
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                </div>
            ) : (
                /* Placeholder jika kosong */
                <div className="flex flex-col items-center space-y-4" style={{ color: "var(--text-muted)" }}>
                    <div className="p-8 rounded-2xl border-2 border-dashed flex items-center justify-center" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                        <QrIcon size={80} className="opacity-30" />
                    </div>
                    <p className="text-sm font-bold" style={{ color: "var(--text-secondary)" }}>Menunggu Input...</p>
                </div>
            )}
        </div>

        <button 
            onClick={downloadQR}
            disabled={!text} 
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold transition-all w-full justify-center shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
            style={{ 
                background: text ? "var(--page-bg)" : "var(--page-bg)", 
                color: text ? "var(--text-primary)" : "var(--text-muted)",
                boxShadow: text ? "0 8px 30px rgba(0,0,0,0.3)" : "none"
            }}
        >
            <Download size={20} />
            Download PNG
        </button>
      </div>

    </div>
  );
}
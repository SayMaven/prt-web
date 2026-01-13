"use client";

import { useState } from "react";
import QRCode from "react-qr-code"; // Library yang baru diinstall

export default function QrGenerator() {
  const [text, setText] = useState("");

  // Fungsi Download Gambar
  const downloadQR = () => {
    const svg = document.getElementById("qr-code-svg");
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        if (ctx) {
            ctx.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");
            
            // Trigger download
            const downloadLink = document.createElement("a");
            downloadLink.download = "qr-code.png";
            downloadLink.href = `${pngFile}`;
            downloadLink.click();
        }
      };
      
      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
      
      {/* Kolom Kiri: Input */}
      <div className="space-y-6">
        <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Isi Konten QR Code:</label>
            <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan link website, teks, atau nomor WA..."
            className="w-full h-32 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
        </div>
        
        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-blue-200 text-sm">
            💡 Tips: Tidak ada tips, langsung ketik aja
        </div>
      </div>

      {/* Kolom Kanan: Preview */}
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-2xl">
        <div className="mb-6">
            {/* Komponen QR Code dari Library */}
            <div className="p-2 border-2 border-slate-100 rounded-lg">
                <QRCode 
                    id="qr-code-svg"
                    value={text || " "} 
                    size={200} 
                    level="H" // Level Error Correction (High)
                />
            </div>
        </div>

        <button 
            onClick={downloadQR}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-full font-bold hover:bg-blue-800 transition-colors">
            Download PNG
        </button>
      </div>

    </div>
  );
}
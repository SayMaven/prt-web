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
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      
      {/* Kolom Kiri: Input */}
      <div className="space-y-6">
        <div>
            <label className="block text-slate-300 text-sm font-medium mb-2">Isi Konten QR Code:</label>
            <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Masukkan link website, teks, atau nomor WA di sini..."
            className="w-full h-40 bg-slate-900/50 border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
        </div>
        
        <div className="p-4 bg-blue-900/20 border border-blue-800 rounded-lg text-blue-200 text-sm">
            💡 <b>Tips:</b> Ketik sesuatu di kolom atas, QR Code akan muncul otomatis di sebelah kanan.
        </div>
      </div>

      {/* Kolom Kanan: Preview */}
      <div className="flex flex-col items-center justify-center p-8 bg-green-800 rounded-2xl shadow-2xl min-h-[350px]">
        <div className="mb-6 flex-1 flex items-center justify-center w-full">
            {/* LOGIKA UTAMA: Cek jika ada text */}
            {text ? (
                <div className="p-2 border-2 border-slate-100 rounded-lg animate-in fade-in zoom-in duration-300">
                    <QRCode 
                        id="qr-code-svg"
                        value={text} 
                        size={200} 
                        level="H"
                        bgColor="#ffffff"
                        fgColor="#000000"
                    />
                </div>
            ) : (
                /* Placeholder jika kosong */
                <div className="flex flex-col items-center text-slate-300 space-y-2">
                    <div className="p-6 bg-slate-100 rounded-2xl border-2 border-dashed border-slate-200">
                        <QrIcon size={64} className="opacity-50" />
                    </div>
                    <p className="text-sm font-medium text-slate-400">Menunggu Input...</p>
                </div>
            )}
        </div>

        <button 
            onClick={downloadQR}
            disabled={!text} // Tombol mati jika text kosong
            className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold transition-all
                ${text 
                    ? 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-lg cursor-pointer' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
        >
            <Download size={18} />
            Download PNG
        </button>
      </div>

    </div>
  );
}
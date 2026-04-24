import PixelConverter from "@/components/tools/PixelConverter";
import { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "PixelConverter | Image Format & Compression | SayMaven Tools",
  description: "Convert images to WebP, JPG, or PNG and resize them directly in your browser. Fast, secure, and free.",
};

export default function PixelConverterPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <ImageIcon size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Image Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight break-words" style={{ color: "var(--text-primary)" }}>
          Pixel<span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Converter</span>
        </h1>
        <p className="text-base sm:text-lg md:text-xl max-w-2xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Ubah format gambar, sesuaikan dimensi piksel, dan kompres ukuran secara <b style={{ color: "var(--text-primary)" }}>lokal</b> tanpa perlu mengunggah ke server.
        </p>
      </section>

      <div className="w-full">
        <PixelConverter />
      </div>

    </div>
  );
}
import PixelConverter from "@/components/tools/PixelConverter";
import { Metadata } from "next";
import { Image as ImageIcon } from "lucide-react";

export const metadata: Metadata = {
  title: "PixelConverter | Image Format & Compression",
  description: "Convert images to WebP, JPG, or PNG directly in your browser. Fast, secure, and free.",
};

export default function PixelConverterPage() {
  return (
    <div className="container mx-auto px-4 py-20 min-h-screen">
        <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-white flex items-center justify-center gap-2">
           <ImageIcon className="text-purple-400" size={32}/> PixelConverter
        </h1>
        <p className="text-slate-400">
          Ubah format gambar (JPG/PNG ke format lain ICO/WebP) & Kompresi secara lokal.  
        </p>
      </div>
      <PixelConverter />
    </div>
  );
}
import ImageCompressor from "@/components/tools/ImageCompressor";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Image Compressor (Client-Side)",
  description: "Kecilkan ukuran file gambar JPG/PNG langsung di browser tanpa upload ke server.",
};

export default function CompressorPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Image Compressor</h1>
        <p className="text-emerald-500 max-w-2xl mx-auto">
          Optimalkan ukuran gambar secara instan dan aman. Proses dilakukan 100% di browser Anda.
        </p>
      </div>
      
      <ImageCompressor />
    </div>
  );
}
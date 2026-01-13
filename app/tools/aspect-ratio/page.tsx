import AspectRatio from "@/components/tools/AspectRatio";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Aspect Ratio Calculator",
  description: "Hitung rasio dimensi layar atau gambar dengan mudah.",
};

export default function AspectRatioPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Aspect Ratio Calculator</h1>
        <p className="text-emerald-500">
          Masukkan dimensi pixel untuk mendapatkan rasio layar yang tepat.
        </p>
      </div>
      
      <AspectRatio />
    </div>
  );
}
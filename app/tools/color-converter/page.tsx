import ColorConverter from "@/components/tools/ColorConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Color Converter",
  description: "Konversi kode warna HEX ke RGB dengan preview langsung.",
};

export default function ColorPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Color Converter</h1>
        <p className="text-emerald-500">
          Pilih warna dan dapatkan kode HEX & RGB secara instan.
        </p>
      </div>
      
      <ColorConverter />
    </div>
  );
}
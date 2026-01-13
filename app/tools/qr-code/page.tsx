import QrGenerator from "@/components/tools/QrGenerator";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QR Code Generator",
  description: "Buat QR Code untuk link atau teks secara instan.",
};

export default function QrPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">QR Code Generator</h1>
        <p className="text-emerald-500">
          Ubah teks atau link menjadi kode QR siap scan.
        </p>
      </div>
      
      <QrGenerator />
    </div>
  );
}
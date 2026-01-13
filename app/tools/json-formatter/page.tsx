import JsonFormatter from "@/components/tools/JsonFormatter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description: "Validasi, rapikan (Pretty Print), atau perkecil (Minify) kode JSON.",
};

export default function JsonPage() {
  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">JSON Formatter</h1>
        <p className="text-emerald-500">
          Validasi dan rapikan struktur data JSON-mu.
        </p>
      </div>
      
      <JsonFormatter />
    </div>
  );
}
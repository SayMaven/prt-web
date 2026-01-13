import CurrencyConverter from "@/components/tools/CurrencyConverter";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Currency Converter",
  description: "Konversi mata uang asing (USD, EUR, IDR) dengan kurs real-time.",
};

export default function CurrencyPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Currency Converter</h1>
        <p className="text-emerald-500">
          Cek nilai tukar mata uang dunia secara Real-Time (Live API).
        </p>
      </div>
      
      <CurrencyConverter />
    </div>
  );
}
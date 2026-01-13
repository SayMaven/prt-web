import { Metadata } from "next";
import ToolsGrid from "@/components/ToolsGrid"; 

export const metadata: Metadata = {
  title: "Tools Library",
  description: "Kumpulan alat utilitas digital gratis.",
};

export default function ToolsPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Halaman */}
      <section className="mt-4">
        <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">
          Dev Tools
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Kumpulan <b>Micro-tools</b> utilitas yang saya buat untuk mempermudah produktivitas. Gratis, cepat, dan berjalan langsung di browser.
        </p>
      </section>

      {/* Panggil Client Component Grid di sini */}
      <ToolsGrid />

    </div>
  );
}
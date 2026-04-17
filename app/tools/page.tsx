import { Metadata } from "next";
import ToolsGrid from "@/components/ToolsGrid"; 

export const metadata: Metadata = {
  title: "Tools Library",
  description: "Kumpulan alat utilitas digital gratis.",
};

export default function ToolsPage() {
  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <section className="mt-4">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Dev Tools
        </h1>
        <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Kumpulan <b style={{ color: "var(--text-primary)" }}>Micro-tools</b> utilitas yang saya buat untuk mempermudah produktivitas. Gratis, cepat, dan berjalan langsung di browser.
        </p>
      </section>

      <ToolsGrid />

    </div>
  );
}
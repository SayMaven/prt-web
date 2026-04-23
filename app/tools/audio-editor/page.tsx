import AudioEditor from "@/components/tools/AudioEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Editor & Visualizer | SayMaven",
  description: "Edit dan visualisasikan file audio Anda secara offline langsung di browser.",
};

export default function Page() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-7xl mx-auto px-4 py-10 min-h-screen">
      
      <section className="text-center mt-10 mb-12 relative z-10">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-6 backdrop-blur-md border"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--accent)" }}></span>
          <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>Audio Processing</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Web Audio <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Editor</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Visualisasi waveform, edit, potong, dan berikan efek audio secara real-time. 100% Offline di browser.
        </p>
      </section>
      
      <AudioEditor />
    </div>
  );
}
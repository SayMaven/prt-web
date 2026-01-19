import AudioEditor from "@/components/tools/AudioEditor";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Audio Editor & Visualizer | SayMaven",
  description: "Edit dan visualisasikan file audio Anda secara offline langsung di browser.",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
          Web Audio Editor 🎹
        </h1>
        <p className="text-slate-400">
          Visualisasi waveform dan tools audio sederhana menggunakan teknologi Web Audio.
        </p>
      </div>
      <AudioEditor />
    </div>
  );
}
import BpmAnalyzer from "@/components/tools/BpmAnalyzer"; 

export const metadata = {
  title: "BPM Analyzer (Auto Detect) | SayMaven",
  description: "Upload lagu dan cek BPM / Tempo secara otomatis tanpa perlu tap manual.",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
          Auto BPM Analyzer
        </h1>
        <p className="text-slate-400">
          Analisis tempo lagu secara instan menggunakan teknologi Web Audio API.
        </p>
      </div>

      <BpmAnalyzer />
    </div>
  );
}
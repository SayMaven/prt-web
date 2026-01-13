import { Metadata } from "next";
import BpmTapper from "@/components/tools/BpmTapper";

export const metadata: Metadata = {
  title: "BPM Tapper | SayMaven Tools",
  description: "Hitung tempo lagu dengan ketukan jari. Berguna untuk musisi dan rhythm gamer.",
};

export default function BpmPage() {
  return (
    <div className="max-w-xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <section className="mt-4">
        <h1 className="text-3xl font-extrabold text-white mb-2">
          BPM Tapper
        </h1>
        <p className="text-slate-400">
          Susah nebak kecepatan lagu buat chart osu! atau tuning Synthesizer? Ketuk aja di sini.
        </p>
      </section>

      <BpmTapper />

    </div>
  );
}
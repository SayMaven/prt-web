import TypingTest from "@/components/tools/TypingTest";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Speed Typing Test",
  description: "Uji kecepatan mengetikmu (WPM) dengan gaya Monkeytype.",
};

export default function TypingPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Speed Typer ⚡</h1>
        <p className="text-emerald-500">
          Berapa WPM kecepatan jarimu? Tes sekarang dalam mode 30 detik.
        </p>
      </div>
      
      <TypingTest />
    </div>
  );
}
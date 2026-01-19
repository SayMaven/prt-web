import WeatherCheck from "@/components/tools/WeatherCheck";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cek Cuaca Akurat (Open-Meteo) | SayMaven",
  description: "Cek prakiraan cuaca realtime di seluruh dunia. Tanpa iklan, gratis, dan akurat.",
};

export default function Page() {
  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Cek Cuaca Dunia
        </h1>
        <p className="text-4xl font-bold">🌤️</p>
        <p className="text-slate-400">
          Data cuaca akurat tanpa perlu ribet.
        </p>
      </div>

      <WeatherCheck />
    </div>
  );
}
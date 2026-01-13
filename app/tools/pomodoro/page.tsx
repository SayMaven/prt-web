import PomodoroTimer from "@/components/tools/PomodoroTimer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pomodoro Focus Timer",
  description: "Timer produktivitas dengan teknik Pomodoro agar tetap fokus.",
};

export default function PomodoroPage() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-white mb-2">Pomodoro Timer</h1>
        <p className="text-emerald-500">
          Gunakan teknik manajemen waktu ini: 25 menit fokus, 5 menit istirahat.
        </p>
      </div>
      
      <PomodoroTimer />
    </div>
  );
}
import { Metadata } from "next";
import RandomPicker from "@/components/tools/RandomPicker";

export const metadata: Metadata = {
  title: "Random Picker | SayMaven Tools",
  description: "Bingung memilih? Biarkan alat ini memilihkan secara acak untukmu.",
};

export default function RandomPickerPage() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <section className="mt-4">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Random Gacha Picker 🎲
        </h1>
        <p className="text-emerald-500 max-w-xl mx-auto">
          Bingung mau makan apa? Atau bingung pengen ngapain hari ini?
          Masukkan semua opsinya di bawah, dan biarkan takdir yang memilih!
        </p>
      </section>

      {/* Panggil Komponen di sini */}
      <RandomPicker />

    </div>
  );
}
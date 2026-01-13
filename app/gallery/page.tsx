import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid"; 

export const metadata: Metadata = {
  title: "Waifu Gallery | SayMaven",
  description: "Koleksi waifu original dan fanart.",
};

export default function GalleryPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Header Halaman */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            {/* Teks Judul */}
            <span>Gallery Maya Yamato</span>

            {/* Gambar Signature */}
            {/* GANTI '/signature.png' dengan link/path gambarmu */}
            <img
            src="https://static.wikia.nocookie.net/bandori/images/8/8a/Yamato_Maya_Signature.png"
            alt="Signature My Bini Maya Yamato"
            // Class untuk mengatur ukuran dan agar warnanya agak menyatu (opsional: opacity/invert)
            className="h-12 w-auto object-contain opacity-90"
            />
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Arsip Waifu. Dilarang mengklaim waifu secara sepihak ( Punya Gweh ).
        </p>
      </div>

      {/* Panggil Client Component di sini */}
      <GalleryGrid />

      {/* Footer Link ke Pixiv */}
      <div className="mt-16 text-center">
        <p className="text-blue-500 text-sm mb-4">Btw ini akun pixiv saya ( Khusus Wip ).</p>
        <a 
            href="https://www.pixiv.net/en/users/120738157" 
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#0096fa] hover:bg-[#007acc] text-white rounded-full font-bold transition-all shadow-lg shadow-blue-500/20"
        >
            Buka Pixiv Saya ↗
        </a>
      </div>

    </div>
  );
}
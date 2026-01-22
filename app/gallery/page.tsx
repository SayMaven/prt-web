import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid"; 
import { getGalleryImages } from "@/lib/cloudinary"; // Import fungsi fetcher

export const metadata: Metadata = {
  title: "Waifu Gallery | SayMaven",
  description: "Koleksi waifu original dan fanart.",
};

// Agar data di-refresh tiap 60 detik (ISR)
export const revalidate = 60; 

export default async function GalleryPage() {
  // 1. AMBIL DATA DARI CLOUDINARY
  // Ganti 'portfolio' dengan nama FOLDER di Cloudinary kamu
  // Jika gambarmu tidak di dalam folder (di root), kosongkan atau hapus logic folder di lib/cloudinary
  const images = await getGalleryImages(['Yamato Maya', 'Hatsune Miku']);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Header Halaman (TETAP SAMA) */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold text-white mb-4 flex items-center justify-center gap-4">
            <span>Gallery Maya Yamato</span>
            <img
            src="https://static.wikia.nocookie.net/bandori/images/a/a8/Maya_charaImage.png"
            alt="Signature My Bini Maya Yamato"
            className="h-12 w-auto object-contain opacity-90"
            />
        </h1>
        <p className="text-slate-300 max-w-2xl mx-auto">
          Arsip Waifu. Dilarang mengklaim waifu secara sepihak ( Punya Gweh ).
          <br/>
          <span className="text-xl text-blue-300 mt-2 block">
            Menampilkan {images.length} gambar dari Database.
          </span>
        </p>
      </div>

      {/* Panggil Client Component dengan Props Images */}
      <GalleryGrid images={images} />

      {/* Footer Link ke Pixiv (TETAP SAMA) */}
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
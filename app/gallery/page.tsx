import type { Metadata } from "next";
import GalleryGrid from "@/components/GalleryGrid"; 
import { getGalleryImages } from "@/lib/cloudinary";

export const metadata: Metadata = {
  title: "Waifu Gallery | SayMaven",
  description: "Koleksi waifu original dan fanart.",
};

export const revalidate = 60; 

export default async function GalleryPage() {
  const images = await getGalleryImages(['Yamato Maya', 'Hatsune Miku']);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      
      {/* Header */}
      <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-4" style={{ color: "var(--text-primary)" }}>
            <span>Gallery Maya Yamato</span>
            <img
            src="https://static.wikia.nocookie.net/bandori/images/a/a8/Maya_charaImage.png"
            alt="Signature My Bini Maya Yamato"
            className="h-12 w-auto object-contain opacity-90"
            />
        </h1>
        <p className="max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
          Arsip Waifu. Dilarang mengklaim waifu secara sepihak ( Punya Gweh ).
          <br/>
          <span className="text-xl mt-2 block" style={{ color: "var(--accent-text)" }}>
            Menampilkan {images.length} gambar dari Database.
          </span>
        </p>
      </div>

      <GalleryGrid images={images} />

      {/* Footer Pixiv */}
      <div className="mt-16 text-center">
        <p className="text-sm mb-4" style={{ color: "var(--accent-text)" }}>Btw ini akun pixiv saya ( Khusus Wip ).</p>
        <a 
            href="https://www.pixiv.net/en/users/120738157" 
            target="_blank"
            className="inline-flex items-center gap-2 px-8 py-3 text-white rounded-full font-bold transition-all shadow-lg hover:opacity-90"
            style={{ background: "var(--accent)", boxShadow: "0 0 20px var(--accent-glow)" }}
        >
            Buka Pixiv Saya ↗
        </a>
      </div>

    </div>
  );
}
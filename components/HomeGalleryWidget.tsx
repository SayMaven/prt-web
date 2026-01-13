"use client";

import { useState, useEffect } from "react";
import { artGallery } from "@/lib/gallery"; 

export default function HomeGalleryWidget() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Ambil 5 gambar pertama
  const slides = artGallery.slice(0, 8);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3000); 

    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return <div className="p-4 text-slate-500">No images</div>;

  return (
    <div className="relative w-full h-full min-h-[200px] overflow-hidden rounded-xl">
      {slides.map((art, index) => (
        <div
          key={art.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          {/* PERUBAHAN ADA DI SINI:
            Ditambahkan class 'object-top' 
            Agar gambar di-crop mulai dari atas (Wajah aman), bukan dari tengah.
          */}
          <img
            src={art.image}
            alt={art.title}
            className="w-full h-full object-cover"
            style={{ objectPosition: "50% 25%" }}
          />
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
          
          {/* Judul Gambar */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <p className="text-xs font-bold bg-blue-600/80 inline-block px-2 py-1 rounded mb-1 backdrop-blur-sm">
                {art.category}
            </p>
            <h3 className="text-sm font-medium truncate drop-shadow-md">{art.title}</h3>
          </div>
        </div>
      ))}
      
      {/* Indikator */}
      <div className="absolute bottom-3 right-3 z-20 flex gap-1">
        {slides.map((_, idx) => (
            <div 
                key={idx} 
                className={`w-1.5 h-1.5 rounded-full transition-all shadow-sm ${idx === currentIndex ? "bg-white w-3" : "bg-white/40"}`} 
            />
        ))}
      </div>
    </div>
  );
}
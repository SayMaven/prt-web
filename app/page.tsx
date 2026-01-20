import { tools } from "@/lib/data";
import Link from "next/link";
import HomeGalleryWidget from "@/components/HomeGalleryWidget";

export default function Home() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* --- HERO SECTION --- */}
      <section className="mt-4 mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
          Sayang <span className="text-emerald-400">Maya </span>
          <span className="text-pink-400">For Even Now</span>
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Halo, Saya <b>Abil Ar Rasyid</b>. Seorang Fullstack Developer, Illustrator, Komposer, Teknisi dan Mahasiswa. 
          Selamat datang di ruang digital tempat logika bertemu estetika. Desain website ini terinspirasi dari karakter Bang Dream Series, Maya Yamato.
        </p>
      </section>
      
      {/* --- BENTO GRID LAYOUT --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* 1. ABOUT ME (Lebar: 2 kolom) */}
        <div className="md:col-span-2 p-8 bg-slate-900/50 rounded-2xl border border-slate-800 backdrop-blur-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <h2 className="font-bold text-xl mb-3 text-white flex items-center gap-2">
            About Me
          </h2>
          <p className="text-slate-400 leading-relaxed text-sm md:text-base">
            Disaat logika bertemu estetika. Sebagai seorang Illustrator dan Web Developer, saya tidak hanya menulis kode, tetapi juga merancang pengalaman digital yang visual dan interaktif. Website ini adalah garasi digital tempat saya menyimpan eksperimen dan tools harian.
          </p>
          <div className="mt-6 flex gap-3">
             <Link href="/portfolio" className="text-sm font-bold text-blue-400 hover:text-blue-300 hover:underline">
                Lihat Portfolio &rarr;
             </Link>
             <Link href="https://github.com/saymaven" target="_blank" className="text-sm font-bold text-slate-300 hover:text-white transition-colors">
                GitHub ↗
             </Link>
          </div>
        </div>
        
        {/* 2. GALLERY PREVIEW (Lebar: 1 kolom) - Pakai Widget Slideshow */}
        <div className="md:col-span-1 h-64 md:h-auto bg-slate-900/50 rounded-2xl border border-slate-800 p-1 relative group hover:border-blue-500/50 transition-colors">
            {/* Widget Slideshow dipanggil di sini */}
            <HomeGalleryWidget />
            
            {/* Link overlay full */}
            <Link href="/gallery" className="absolute inset-0 z-30" aria-label="Go to Gallery"></Link>
        </div>

        {/* 3. GAME CARD (Lebar: 1 kolom) */}
        <div className="md:col-span-1 bg-gradient-to-br from-indigo-900/50 to-blue-900/50 rounded-2xl border border-indigo-500/30 p-6 flex flex-col justify-between hover:scale-[1.02] transition-transform relative overflow-hidden group">
            <div className="absolute inset-0 bg-[url('https://res.cloudinary.com/ds4a54vuy/image/upload/v1768242971/head3_u2nbxk.jpg')] opacity-15 bg-cover bg-left"></div>
            <div>
                <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">Mini Game</span>
                <h3 className="text-xl font-bold text-white mt-1"> Ganso BanG Dream!</h3>
                <p className="text-xs text-indigo-100 mt-2">Web Shooter Game Simulator.</p>
            </div>
            <a 
                href="https://game.saymaven.cloud/bangdream.html" 
                target="_blank"
                className="mt-4 bg-emerald-500 hover:bg-emerald-400 text-white text-center py-2 rounded-lg text-sm font-bold transition-colors z-10"
            >
                Gas coba cuy
            </a>
        </div>

        {/* 4. TOOLS LIST (Lebar: 2 kolom) */}
        <div className="md:col-span-2 bg-slate-900/50 rounded-2xl border border-slate-800 p-6">
           <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-white flex items-center gap-2">
                🛠️ Quick Tools
              </h2>
              <Link href="/tools" className="text-xs text-slate-500 hover:text-white">View All</Link>
           </div>
           
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Ambil 4 tools pertama */}
              {tools.slice(0, 4).map((tool) => (
                <Link 
                    key={tool.id} 
                    href={tool.link}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/50 hover:bg-blue-900/20 border border-slate-800 hover:border-blue-500/30 transition-all group"
                >
                    <span className="text-2xl group-hover:scale-110 transition-transform">{tool.icon}</span>
                    <div>
                        <div className="text-sm font-bold text-slate-200 group-hover:text-blue-400">{tool.title}</div>
                        <div className="text-[10px] text-slate-500 line-clamp-1">{tool.description}</div>
                    </div>
                </Link>
              ))}
           </div>
        </div>

        {/* 5. FEATURED PROJECT (Lebar: 2 kolom) */}
        <div className="md:col-span-2 bg-slate-900/50 rounded-2xl border border-slate-800 p-8 flex flex-col justify-center relative overflow-hidden">
             <div className="absolute right-0 bottom-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl"></div>
             <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-2">Latest Project</span>
             <h3 className="text-2xl font-bold text-white mb-2">Portfolio Website V1</h3>
             <p className="text-slate-400 text-sm mb-6 max-w-md">
                Website ini sendiri adalah project utama saat ini. Dibangun menggunakan Next.js , TypeScript, Tailwind CSS, dan Native React.
             </p>
             <div className="flex gap-2">
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">Next.js</span>
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">TypeScript</span>
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">Tailwind</span>
                 <span className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">React</span>
             </div>
        </div>

      </div>
    </div>
  );
}
import { Metadata } from "next";
import ProjectsGrid, { GithubRepo } from "./ProjectsGrid";

export const metadata: Metadata = {
  title: "Projects",
  description: "Daftar proyek eksklusif, case study coding, dan repository aktif dari GitHub.",
};

export default async function PortfolioPage() {
  let githubRepos: GithubRepo[] = [];
  try {
    const res = await fetch("https://api.github.com/users/SayMaven/repos?sort=updated&per_page=100", {
      next: { revalidate: 3600 }, // Cache statis revalidate tiap 1 jam
    });
    if (res.ok) {
      const data = await res.json();
      
      // Filter repos: Abaikan forks, saymaven.github.io, dan repo profil
      githubRepos = data.filter((repo: any) => 
        !repo.fork && 
        repo.name !== 'saymaven.github.io' && 
        repo.name !== 'SayMaven'
      ).map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        description: repo.description,
        html_url: repo.html_url,
        homepage: repo.homepage,
        language: repo.language,
        stargazers_count: repo.stargazers_count,
        topics: repo.topics || [],
        updated_at: repo.updated_at,
      }));

      // Mapping khusus untuk repo yang deskripsinya null atau perlu penyesuaian detail
      githubRepos = githubRepos.map(repo => {
         if (repo.name === 'mavmanga-web') {
           repo.description = "Platform baca manga murni memanfaatkan sumber API MangaDex, di mana saya menambahkan optimasi khusus, fitur kustom, dan perombakan antarmuka yang tidak dimiliki versi bawaannya.";
         } else if (repo.name === 'bangdream') {
           repo.description = "Ganso! BanG Dream Chan Note Shooter. Modifikasi dari web shooter game statis dengan injeksi translasi Bahasa Indonesia, integrasi API live score mandiri, serta peningkatan logika permainan & UI.";
         } else if (repo.name === 'mavenflow') {
           repo.description = "Web Data Aggregator seputar Jejepangan. Merangkum informasi spesifik secara presisi dengan AI, mencakup perbandingan harga barang, ranking ilustrasi Pixiv bulanan, tangga lagu Jepang, dan kompilasi berita.";
         } else if (repo.name === 'prt-web') {
           repo.description = "Digital Portfolio Website (Sistem yang sedang Anda gunakan saat ini!). Dibangun modern untuk menampilkan rincian proyek eksklusif dan visual showcase karya saya.";
         } else if (repo.name === 'bangdream-api') {
           repo.description = "API Backend Live Score & global leaderboard berbasis Python FastAPI, dirancang secara khusus untuk diintegrasikan dalam menampung data skor interaktif game Ganso BanG Dream Chan.";
         }
         return repo;
      });

    }
  } catch (error) {
    console.error("Gagal mengambil data dari GitHub:", error);
  }

  // Inject Private Repositories secara hardcoded sesuai rincian
  const privateRepos: GithubRepo[] = [
    {
      id: "private-mavenbooru",
      name: "mavenbooru-web",
      description: "Sistem Galeri mutakhir ala Pinterest ditenagai API Danbooru. Mendukung filter tags spesifik, penyimpanan bookmark lokal beserta ekspor data, history gambar mulus, modal preview gambar mendetail, dan sistem Custom Collection.",
      html_url: "https://mavenbooru.saymaven.cloud",
      homepage: "https://mavenbooru.saymaven.cloud",
      language: "TypeScript",
      stargazers_count: 0,
      topics: ["danbooru", "pinterest-ui", "gallery"],
      updated_at: new Date().toISOString(),
      isPrivate: true,
    },
    {
      id: "private-mavenchat",
      name: "mavenchat",
      description: "Platform AI Custom Chat (mirip C.ai) yang memanfaatkan tenaga integrasi Multi-model LLM via OpenRouter. Pengguna bebas mengatur persona karakternya, ikon profil spesifik, beserta penyesuaian gaya bahasanya untuk chat interaktif berkelanjutan.",
      html_url: "#",
      homepage: null,
      language: "TypeScript",
      stargazers_count: 0,
      topics: ["llm", "chatbot", "openrouter", "c.ai-clone"],
      updated_at: new Date().toISOString(),
      isPrivate: true,
    }
  ];

  // Menggabungkan Public & Private repositori
  const finalProjects = [...privateRepos, ...githubRepos];

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header Halaman */}
      <section className="mt-4">
        <h1 className="text-4xl font-extrabold mb-4 tracking-tight flex justify-between items-center flex-wrap gap-4" style={{ color: "var(--text-primary)" }}>
          <span>My Projects 💡</span>
          <span className="text-sm font-medium px-3 py-1.5 rounded-full border shadow-inner" style={{ color: "var(--accent-text)", background: "var(--accent-subtle)", borderColor: "var(--accent)" }}>
            {finalProjects.length} Active System{finalProjects.length > 1 ? 's' : ''}
          </span>
        </h1>
        <p className="text-lg max-w-2xl leading-relaxed" style={{ color: "var(--text-secondary)" }}>
          Pusat integrasi dari beberapa proyek <b style={{ color: "var(--text-primary)" }}>open-source</b> dan privat mutakhir yang pernah saya rintis, meliputi eksperimen <b style={{ color: "var(--text-primary)" }}>web-app</b>, API <b style={{ color: "var(--text-primary)" }}>endpoint</b>, hingga eksplorasi AI interaktif.
        </p>
      </section>

      {/* Komponen Grid Client terisolasi buat Animasi */}
      <ProjectsGrid projects={finalProjects} />

      {/* Empty State Darurat jika gagal me-load data */}
      {finalProjects.length === 0 && (
        <div className="text-center py-20 rounded-2xl border border-dashed" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            <p style={{ color: "var(--text-muted)" }}>Menunggu respons dari server GitHub...</p>
        </div>
      )}
    </div>
  );
}
// lib/data.ts

// 1. Kita buat Interface biar TypeScript tidak bingung
export type Tool = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon: string;
  status: "Ready" | "New" | "Hot" | "Ultimate";
  // 👇 Tambahkan tipe Category di sini
  category: "Anime" | "Dev" | "Design" | "Productivity" | "Utility";
  image?: string;
};

export const projects = [
  {
    id: 1,
    title: "Maven Downloader",
    description: "Program GUI yt-dlp yang dibalut dengan settingan tambahan serta kustomisasi dengan aria2.",
    tech: ["Python", "Tinktr"],
    link: "https://github.com/SayMaven/MavenDownloader/releases/download/MavenDownloader/MavenDownloader.exe",
    github: "https://github.com/SayMaven/MavenDownloader",
    color: "bg-blue-500"
  },
  {
    id: 2,
    title: "Pixiv Mass Unfoll",
    description: "Skrip otomatis untuk menghapus mengikuti pengguna secara massal di Pixiv menggunakan Tampermonkey.",
    tech: ["Javascript", "Tampermonkey", "Pixiv"],
    link: "https://github.com/SayMaven/PixivMassUnfoll/releases/download/version/Pixiv.Mass.Unfollow.MouseEvent.Fix.V1.0.user.js",
    github: "https://github.com/SayMaven/PixivMassUnfoll",
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Personal Landing Page",
    description: "Website profil pribadi (seperti web ini!) untuk branding personal.",
    tech: ["React", "CSS Modules"],
    link: "https://saymaven.cloud",
    github: "https://github.com/SayMaven",
    color: "bg-emerald-500"
  },
  {
    id: 4,
    title: "Foocus Custom Anime Generate",
    description: "Model generative AI hasil forking dari illyasviel/Foocus yang dikustomisasi dengan dukungan web ui.",
    tech: ["Python", "SDXL", "Safetensors"],
    link: "https://github.com/SayMaven/ColabFoocus",
    github: "https://github.com/SayMaven/Fooocus",
    color: "bg-pink-500"
  }
];

// 👇 DATA TOOLS YANG SUDAH DIKATEGORIKAN
export const tools: Tool[] = [
  {
    id: 1,
    title: "Anime Season",
    description: "Cek anime apa saja yang sedang tayang musim ini (API Integration).",
    icon: "⛩️", 
    link: "/tools/anime-schedule",
    status: "Ready",
    category: "Anime" // 👈 Kategori Baru
  },
  {
    id: 2,
    title: "Anime Finder",
    description: "Database pencarian anime super lengkap (Genre, Year, Score, dll).",
    icon: "🔍", 
    link: "/tools/anime-explorer",
    status: "Ultimate", // Ubah jadi Ultimate biar keren
    category: "Anime",
    image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1768587191/%E0%AD%A8%E0%AD%A7_maya_yamato_card_doye7r.jpg"
  },
  {
    id: 3,
    title: "Color Converter",
    description: "Ubah Hex ke RGB dengan fitur color picker visual.",
    icon: "🎨",
    link: "/tools/color-converter",
    status: "Ready",
    category: "Design"
  },
  {
    id: 4,
    title: "Pomodoro Timer",
    description: "Timer fokus sederhana dengan metode 25/5 menit.",
    icon: "⏱️",
    link: "/tools/pomodoro",
    status: "Ready",
    category: "Productivity"
  },
  {
    id: 5,
    title: "Aspect Ratio Calc",
    description: "Hitung skala resolusi layar (misal 1920x1080 = 16:9).",
    icon: "📐",
    link: "/tools/aspect-ratio",
    status: "Ready",
    category: "Design"
  },
  {
    id: 6,
    title: "QR Code Gen",
    description: "Ubah link/teks jadi gambar QR Code siap scan.",
    icon: "📱",
    link: "/tools/qr-code",
    status: "Ready",
    category: "Dev"
  },
  {
    id: 7,
    title: "JSON Formatter",
    description: "Validasi dan rapikan kode JSON yang berantakan.",
    icon: "📋",
    link: "/tools/json-formatter",
    status: "Ready",
    category: "Dev"
  },
  {
    id: 8, 
    title: "Currency Converter",
    description: "Konversi mata uang asing dengan Live API Data.",
    icon: "💱",
    link: "/tools/currency",
    status: "Ready",
    category: "Utility"
  },
  {
    id: 9,
    title: "Image Compressor",
    description: "Kecilkan ukuran gambar JPG/PNG di browser.",
    icon: "🖼️",
    link: "/tools/image-compressor",
    status: "Hot", // Fitur berguna biasanya Hot
    category: "Design"
  },
  {
    id: 10,
    title: "GitHub Finder",
    description: "Cari profil GitHub & lihat repository terbaru.",
    icon: "🐱",
    link: "/tools/github-finder",
    status: "Ready",
    category: "Dev"
  },
  {
    id: 11,
    title: "Typing Speed Test",
    description: "Uji kecepatan mengetik (WPM) ala Monkeytype.",
    icon: "⌨️",
    link: "/tools/typing-test",
    status: "Ready",
    category: "Productivity"
  },
  {
    id: 12,
    title: "Random Picker",
    description: "Alat pengacak pilihan. Cocok buat yang susah ambil keputusan (Gacha style).",
    icon: "🎲", 
    link: "/tools/random-picker",
    status: "Ready",
    category: "Utility"
  },
  {
    id: 13,
    title: "BPM Tapper",
    description: "Cari tahu tempo (BPM) lagu dengan mengetuk irama.",
    icon: "🥁", 
    link: "/tools/bpm-tapper",
    status: "Ready",
    category: "Utility"
  },
  {
    id: 14,
    title: "Word Counter",
    description: "Hitung jumlah kata, karakter, dan estimasi waktu baca dengan cepat.",
    link: "/tools/word-counter",
    icon: "📝", 
    status: "Ready",
    category: "Productivity"
  },
  {
    id: 15,
    title: "Password Generator",
    description: "Buat password acak yang kuat dan aman dengan kustomisasi karakter.",
    link: "/tools/password-gen", 
    icon: "🔐",
    status: "New", // Tandai New
    category: "Utility"
  },
];
// lib/data.ts

// Interface 
export type Tool = {
  id: number;
  title: string;
  description: string;
  link: string;
  icon: string;
  status: "Ready" | "New" | "Hot" | "Ultimate";
  //  tipe Category
  category: "Anime" | "Dev" | "Design" | "Productivity" | "Utility" | "Media";
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

// DATA TOOLS
export const tools: Tool[] = [
  {
    id: 1,
    title: "Anime Season",
    description: "Cek anime apa saja yang sedang tayang musim ini (API Integration).",
    icon: "", 
    link: "/tools/anime-schedule",
    status: "Hot",
    category: "Anime",
    image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1768230433/Sweet_Cat_%28After_Training%29.jpg"
  },
  {
    id: 2,
    title: "Anime Finder",
    description: "Database pencarian anime super lengkap (Genre, Year, Score, dll).",
    icon: "", 
    link: "/tools/anime-explorer",
    status: "Ultimate", 
    category: "Anime",
    image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1768587191/%E0%AD%A8%E0%AD%A7_maya_yamato_card_doye7r.jpg"
  },
  {
    id: 3,
    title: "What Anime Is This?",
    description: "Cari judul anime, episode, dan menit keberapa hanya dari screenshot adegan.",
    icon: "",
    link: "/tools/anime-search",
    status: "Ultimate",
    category: "Anime",
    image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1769011969/Happy_Heart_Filling_Messages_%28After_Training%29.png"
  },
  {
  id: 4, 
  title: "Maven Downloader",
  description: "Download video dari berbagai situs populer dengan berbagai fitur.",
  icon: "", 
  link: "/tools/maven-downloader",
  status: "Hot", 
  category: "Utility",
  image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1768794809/4951Maya-Yamato-Power-A-Moment-Of-Morning-Sunlight-Ofcqtv_nnr9lz.png"
  },
  {
    id: 5,
    title: "CivitAI Explorer",
    description: "Cari model AI & LoRA, lihat preview, dan salin Trigger Word dengan cepat.",
    icon: "",
    link: "/tools/civitai-explorer",
    status: "Ultimate",
    category: "Media",
    image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1768230432/Let%27s_Get_Started%21_%28After_Training%29.jpg"
  },
  {
  id: 6,
  title: "Background Remover",
  description: "Hapus latar belakang foto otomatis dengan AI.",
  icon: "",
  link: "/tools/bg-remover",
  status: "New",
  category: "Design",
  image: "https://res.cloudinary.com/ds4a54vuy/image/upload/v1768925528/Precise_and_Brilliant_Judgment.png"
  },
  {
  id: 7,
  title: "QR Code Gen",
  description: "Ubah link/teks jadi gambar QR Code siap scan.",
  icon: "📱",
  link: "/tools/qr-code",
  status: "Ready",
  category: "Dev"
  },
  {
  id: 8,
  title: "Audio Editor & Visualizer",
  description: "Visualisasi waveform dan pemutar audio offline berbasis browser.",
  icon: "🎧", 
  link: "/tools/audio-editor",
  status: "New",
  category: "Media", 
  },
  {
    id: 9, 
    title: "Currency Converter",
    description: "Konversi mata uang asing dengan Live API Data.",
    icon: "💱",
    link: "/tools/currency",
    status: "Ready",
    category: "Utility"
  },
  {
    id: 10,
    title: "Image Compressor",
    description: "Kecilkan ukuran gambar JPG/PNG di browser.",
    icon: "🖼️",
    link: "/tools/image-compressor",
    status: "Hot", // Fitur berguna biasanya Hot
    category: "Design"
  },
  {
    id: 11,
    title: "GitHub Finder",
    description: "Cari profil GitHub & lihat repository terbaru.",
    icon: "🐱",
    link: "/tools/github-finder",
    status: "Ready",
    category: "Dev"
  },
  {
    id: 12,
    title: "Typing Speed Test",
    description: "Uji kecepatan mengetik (WPM) ala Monkeytype.",
    icon: "⌨️",
    link: "/tools/typing-test",
    status: "Ready",
    category: "Productivity"
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
    status: "Ready", // Tandai New
    category: "Utility"
  },
  {
  id: 16, 
  title: "BPM Analyzer",
  description: "Upload lagu dan biarkan sistem mendeteksi BPM secara otomatis.",
  icon: "🎧", 
  link: "/tools/bpm-analyzer",
  status: "Ready",
  category: "Utility"
  },
  {
    id: 17,
    title: "Color Converter",
    description: "Ubah Hex ke RGB dengan fitur color picker visual.",
    icon: "🎨",
    link: "/tools/color-converter",
    status: "Ready",
    category: "Design"
  },
  {
  id: 18,
  title: "Cek IP & Lokasi",
  description: "Lihat IP Address publik, ISP, dan lokasi server internetmu.",
  icon: "🌍", 
  link: "/tools/ip-checker",
  status: "New",
  category: "Utility",
  },
  {
    id: 19,
    title: "Pomodoro Timer",
    description: "Timer fokus sederhana dengan metode 25/5 menit.",
    icon: "⏱️",
    link: "/tools/pomodoro",
    status: "Ready",
    category: "Productivity"
  },
  {
    id: 20,
    title: "JSON Formatter",
    description: "Validasi dan rapikan kode JSON yang berantakan.",
    icon: "📋",
    link: "/tools/json-formatter",
    status: "Ready",
    category: "Dev"
  },
  {
    id: 21,
    title: "Aspect Ratio Calc",
    description: "Hitung skala resolusi layar (misal 1920x1080 = 16:9).",
    icon: "📐",
    link: "/tools/aspect-ratio",
    status: "Ready",
    category: "Design"
  },
  {
    id: 22,
    title: "PDF Merger",
    description: "Gabungkan banyak file PDF menjadi satu dokumen urutan yang bisa diatur (100% Client-side).",
    icon: "📑", 
    link: "/tools/pdf-merger",
    status: "New",
    category: "Productivity"
  },
  {
    id: 23,
    title: "Random Picker",
    description: "Alat pengacak pilihan. Cocok buat yang susah ambil keputusan (Gacha style).",
    icon: "🎲", 
    link: "/tools/random-picker",
    status: "Ready",
    category: "Utility"
  },
  {
  id: 24,
  title: "Cek Cuaca",
  description: "Lihat suhu, kondisi, dan kelembaban udara di kotamu.",
  icon: "🌤️", 
  link: "/tools/weather",
  status: "Ready",
  category: "Utility",
  },
];
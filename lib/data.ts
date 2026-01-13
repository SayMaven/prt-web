// lib/data.ts

import { title } from "process";

export const projects = [
  {
    id: 1,
    title: "Maven Downloader",
    description: "Program GUI yt-dlp yang dibalut dengan settingan tambahan serta kustomisasi dengan aria2.",
    tech: ["Python", "Tinktr"],
    link: "https://github.com/SayMaven/MavenDownloader/releases/download/MavenDownloader/MavenDownloader.exe", // Ganti dengan link asli nanti
    github: "https://github.com/SayMaven/MavenDownloader", // Link repo
    color: "bg-blue-500" // Warna dekorasi (opsional)
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
    link: "saymaven.cloud",
    github: "https://github.com/SayMaven",
    color: "bg-emerald-500"
  },
  {
    id: 4,
    title: "Foocus Custom Anime Generate",
    description: "Model generative AI hasil forking dari illyasviel/Foocus yang telah dikustomisasi dengan dukungan web ui dan dijalankan dengan online service seperti google colab.",
    tech: ["Python", "SDXL", "Safetensors"],
    link: "https://github.com/SayMaven/ColabFoocus",
    github: "https://github.com/SayMaven/Fooocus",
    color: "bg-pink-500"
  }
  
  // Tambahkan project lain di sini...
  
];

// ... (kode projects yang tadi biarkan saja di atas)

export const tools = [
  {
    id: 1,
    title: "Anime Season",
    description: "Cek anime apa saja yang sedang tayang musim ini (API Integration).",
    icon: "⛩️", 
    link: "/tools/anime-schedule",
    status: "Ready",
  },
  {
    id: 2,
    title: "Anime Finder", // Nama diubah jadi lebih general
    description: "Database pencarian anime super lengkap (Genre, Year, Score, dll).",
    icon: "🔍", 
    link: "/tools/anime-explorer", // Link arahkan ke folder baru
    status: "Ready", // Status baru biar keren
  },
  {
  id: 3, // Pastikan ID-nya urut (1, 2, 3...)
  title: "Color Converter",
  description: "Ubah Hex ke RGB dengan fitur color picker visual.",
  icon: "🎨", // Ikon palet lukis
  link: "/tools/color-converter",
  status: "Ready",
  },
  {
  id: 4,
  title: "Pomodoro Timer",
  description: "Timer fokus sederhana dengan metode 25/5 menit.",
  icon: "⏱️", // Ikon Stopwatch
  link: "/tools/pomodoro",
  status: "Ready",
  },
  {
  id: 5,
  title: "Aspect Ratio Calc",
  description: "Hitung skala resolusi layar (misal 1920x1080 = 16:9).",
  icon: "📐",
  link: "/tools/aspect-ratio",
  status: "Ready",
  },
  {
  id: 6,
  title: "QR Code Gen",
  description: "Ubah link/teks jadi gambar QR Code siap scan.",
  icon: "📱",
  link: "/tools/qr-code",
  status: "Ready",
  },
  {
  id: 7,
  title: "JSON Formatter",
  description: "Validasi dan rapikan kode JSON yang berantakan.",
  icon: "📋", // Ikon Clipboard/Code
  link: "/tools/json-formatter",
  status: "Ready",
  },
  {
  id: 8, 
  title: "Currency Converter",
  description: "Konversi mata uang asing dengan Live API Data.",
  icon: "💱",
  link: "/tools/currency",
  status: "Ready",
  },
  {
  id: 9,
  title: "Image Compressor",
  description: "Kecilkan ukuran gambar JPG/PNG di browser.",
  icon: "🖼️", // Ikon Gambar/Frame
  link: "/tools/image-compressor",
  status: "Ready",
  },
  {
  id: 10,
  title: "GitHub Finder",
  description: "Cari profil GitHub & lihat repository terbaru.",
  icon: "🔍",
  link: "/tools/github-finder",
  status: "Ready",
  },
  {
  id: 11,
  title: "Typing Speed Test",
  description: "Uji kecepatan mengetik (WPM) ala Monkeytype.",
  icon: "⌨️", // Ikon Keyboard
  link: "/tools/typing-test",
  status: "Ready",
  },
  {
    id: 12,
    title: "Random Picker",
    description: "Alat pengacak pilihan. Cocok buat yang susah ambil keputusan (Gacha style).",
    icon: "🎲", 
    link: "/tools/random-picker",
    status: "Ready",
  },
  {
    id: 13,
    title: "BPM Tapper",
    description: "Cari tahu tempo (BPM) lagu dengan mengetuk irama.",
    icon: "🥁", 
    link: "/tools/bpm-tapper",
    status: "Ready",
  },
  {
    id: 14,
    title: "Word Counter",
    description: "Hitung jumlah kata, karakter, dan estimasi waktu baca dengan cepat.",
    link: "/tools/word-counter",
    icon: "📝", 
    status: "Ready"
  },
  {
    id: 15,
    title: "Password Generator",
    description: "Buat password acak yang kuat dan aman dengan kustomisasi karakter.",
    link: "/tools/password-gen", 
    icon: "🔐",
    status: "Ready"
  },
];
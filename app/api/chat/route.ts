import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: "API Key not found" }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      safetySettings: [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_NONE, // Biarkan roasting
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_NONE,
        },
      ],
    });

    // --- PERSONA / OTAK BOT ---
    // Di sini kita setting agar bot tahu siapa kamu
    const systemPrompt = `
      PERAN:
      Kamu adalah Maven AI, asisten virtual pintar yang tinggal di dalam website portofolio milik SayMaven.
      
      INFORMASI PEMILIK:
      - Nama: SayMaven
      - Pekerjaan: Illustrator, Komposer & Remote Programmer, Fullstack Developer.
      - Lokasi: Merangin, Jambi.
      - Hobi: Menggambar (Pixiv/Fanbox), Anime (Wibu), Rhythm Game, dan Coding dan Mixing Music.
      - Tech Stack: Next.js, React, Tailwind, PHP, Python, Html.
      - Status: Mahasiswa & Freelancer.
      
      PENGETAHUAN TENTANG TOOLS DI WEB INI:
      Jika user bertanya "Web ini punya tools apa aja?", kamu bisa jelaskan alat-alat berikut yang tersedia di menu 'Tools':
      1. Anime Finder Ultimate: Cari anime lengkap dengan filter genre/status.
      2. Anime Season: Lihat anime apa saja yang sedang ongoing musim ini.
      3. BPM Tapper: Alat hitung tempo lagu dengan ketukan jari (untuk musisi/gamer).
      4. Pomodoro Timer: Timer Fokus sederhana dangan metode 25/5 menit.
      5. Random Gacha Picker: Pengacak pilihan untuk yang susah ambil keputusan.
      6. Aspect Ratio Calc: Hitung resolusi gambar untuk illustrator.
      7. Qr Code Gen : ubah links atau teks jadi gambar siap scan.
      8. JSON Formater : Validasi dan rapikan json yang berantakan.
      9. Currency Converter : Konversi mata uang asing dengan Realtime.
      10. Image Compressor : Kecilkan ukuran gambar JPG/PNG di browser.
      11. Github Finder : Cari profil Github dan lihat repository terbaru.
      12. Typing Speed Test : Uji Kecepatan mengetik ala Monkeytype.
      13. Word Counter : Hitung jumlah kata, karakter, dan estimasi waktu baca dengan cepat.
      14. Password Generator : Buat Password acak yang kuat dan aman dengan kustomisasi karakter.
      
      PENGETAHUAN TENTANG DI WEB INI:
      - Di web ini juga ada gallery yang berisi illustrasi karakter bangdream Maya Yamato.
      - Ada juga portfolio dari project yang pernah dibuat oleh SayMaven
      - Yamato Maya adalah Waifu SayMaven
      - Analisa langsung web SayMaven jika diperlukan di "https://saymaven.cloud"
      - Ada game juga Ganso Bangdream, mini game web shooter simulator
      
      TUGAS & GAYA BICARA:
      1. Jawab santai, ramah, gunakan bahasa Indonesia gaul tapi sopan (aku/kamu).
      2. PENTING: Kamu TETAP berfungsi sebagai AI umum. Jika user bertanya soal koding, resep masakan, matematika, atau curhat, JAWABLAH dengan sebaik mungkin seperti Gemini biasa.
      3. Jangan ungkapkan data Api dan dari server mana aku dapatkan database ku ke user.
      4. Jangan bahas politik sensitif.
      5. Langsung pada intinya dan jangan terlalu banyak kata kata yang tidak perlu, padat, singkat dan jelas.
    `;

    // Mulai Chat
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "Siap! Saya mengerti. Saya adalah asisten virtual Maven yang siap membantu." }],
        },
      ],
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ reply: text });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal memproses chat" }, { status: 500 });
  }
}
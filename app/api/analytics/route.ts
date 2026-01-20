import { NextResponse } from 'next/server';
import { redis } from '@/lib/redis';
import { headers } from 'next/headers';

export async function POST(req: Request) {
  try {
    // 1. Identifikasi User (Bisa pakai IP atau Hash Browser)
    const headerList = await headers();
    const ip = headerList.get("x-forwarded-for") || "127.0.0.1";
    
    // Gunakan user agent + IP untuk membuat ID unik sederhana
    const userAgent = headerList.get("user-agent") || "unknown";
    const userId = `${ip}-${userAgent.replace(/[^a-zA-Z0-9]/g, "")}`;

    const currentTime = Date.now();

    // --- LOGIC 1: REAL-TIME ONLINE USERS ---
    // Tambahkan user ke set 'online_users' dengan skor = waktu sekarang
    await redis.zadd('online_users', { score: currentTime, member: userId });

    // Hapus user yang tidak aktif selama 60 detik terakhir (Timeout)
    const oneMinuteAgo = currentTime - 60000;
    await redis.zremrangebyscore('online_users', 0, oneMinuteAgo);

    // Hitung berapa user yang tersisa di set (ini yang sedang online)
    const onlineCount = await redis.zcard('online_users');

    // --- LOGIC 2: TOTAL VISITS (Page Views) ---
    // Kita cek apakah IP ini baru saja visit (deduplikasi sederhana pakai SETNX dengan TTL 30 menit)
    // Agar refresh page tidak nambah counter terus menerus
    const sessionKey = `session:${ip}`;
    const isNewSession = await redis.set(sessionKey, "1", { nx: true, ex: 1800 }); // 1800 detik = 30 menit

    let totalVisits = await redis.get<number>('total_visits') || 0;

    if (isNewSession) {
        // Jika sesi baru, tambah counter
        totalVisits = await redis.incr('total_visits');
    }

    return NextResponse.json({
      online: onlineCount,
      total: totalVisits
    });

  } catch (error) {
    console.error("Redis Error:", error);
    return NextResponse.json({ online: 0, total: 0 }, { status: 500 });
  }
}
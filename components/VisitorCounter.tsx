"use client";

import { useEffect, useState } from "react";

export default function VisitorCounter() {
  const [stats, setStats] = useState({ online: 0, total: 0 });

  useEffect(() => {
    // Fungsi untuk ping ke API
    const updateStats = async () => {
      try {
        const res = await fetch('/api/analytics', { method: 'POST' });
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Failed to update stats", error);
      }
    };

    // Panggil saat pertama kali load
    updateStats();

    // Setup Interval: Ping setiap 30 detik agar status tetap "Online" di Redis
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-[#111] border border-slate-800 px-3 py-1 rounded-full w-fit">
      
      {/* Indikator Online */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span>{stats.online} Online</span>
      </div>

      <div className="w-[1px] h-3 bg-slate-700"></div>

      {/* Total Visits */}
      <div className="flex items-center gap-1">
        <span> {stats.total.toLocaleString()} Views</span>
      </div>
      
    </div>
  );
}
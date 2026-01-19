"use client";

import { useState, useEffect } from "react";

interface IpData {
  ip: string;
  type: string;
  continent: string;
  country: string;
  country_code: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  connection: {
    isp: string;
    org: string;
  };
  timezone: {
    id: string;
    utc: string;
  };
  flag: {
    img: string;
    emoji: string;
  };
}

export default function IpChecker() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAgent, setUserAgent] = useState("");

  const fetchIp = async () => {
    setLoading(true);
    setError("");
    try {
      // Menggunakan ipwho.is (Gratis, No Key, HTTPS Support)
      const res = await fetch("https://ipwho.is/");
      const json = await res.json();

      if (!json.success) {
        throw new Error(json.message || "Gagal mengambil data IP");
      }

      setData(json);
    } catch (err) {
      setError("Gagal mendeteksi IP. Mungkin diblokir adblocker/VPN.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
    // Ambil info browser (User Agent)
    if (typeof window !== "undefined") {
      setUserAgent(window.navigator.userAgent);
    }
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* --- MAIN CARD (IP ADDRESS) --- */}
      <div className="p-8 bg-slate-900 border border-slate-800 rounded-3xl text-center shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full"></div>
        
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-4 bg-slate-800 rounded w-1/4 mx-auto"></div>
            <div className="h-12 bg-slate-800 rounded w-1/2 mx-auto"></div>
          </div>
        ) : error ? (
          <div className="text-red-400">⚠️ {error}</div>
        ) : (
          <div className="relative z-10 animate-in zoom-in duration-500">
            <p className="text-slate-400 text-sm font-bold tracking-widest uppercase mb-2">
              Public IP Address Kamu
            </p>
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight drop-shadow-2xl font-mono">
              {data?.ip}
            </h2>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-1 bg-slate-800 rounded-full border border-slate-700">
              <span className="text-xl text-emerald-500">{data?.flag.emoji}</span>
              <span className="text-slate-300 font-medium">{data?.country}</span>
            </div>
          </div>
        )}
      </div>

      {/* --- DETAILS GRID --- */}
      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in slide-in-from-bottom-4 duration-700 delay-100">
          
          {/* Lokasi */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-blue-500/50 transition-colors">
            <p className="text-slate-500 text-xs uppercase font-bold">Lokasi Fisik</p>
            <p className="text-xl text-white font-semibold">
              {data.city}, {data.region}
            </p>
            <p className="text-sm text-slate-400">
              Koordinat: {data.latitude}, {data.longitude}
            </p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`}
              target="_blank"
              rel="noreferrer"
              className="text-blue-400 text-sm hover:underline inline-block mt-1"
            >
              📍 Lihat di Google Maps
            </a>
          </div>

          {/* Provider */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-green-500/50 transition-colors">
            <p className="text-slate-500 text-xs uppercase font-bold">Provider Internet (ISP)</p>
            <p className="text-xl text-white font-semibold">
              {data.connection.isp}
            </p>
            <p className="text-sm text-slate-400">
              Organisasi: {data.connection.org || "-"}
            </p>
          </div>

          {/* Timezone */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-purple-500/50 transition-colors">
            <p className="text-slate-500 text-xs uppercase font-bold">Zona Waktu</p>
            <p className="text-xl text-white font-semibold">
              {data.timezone.id}
            </p>
            <p className="text-sm text-slate-400">
              UTC: {data.timezone.utc}
            </p>
          </div>

          {/* Device Info */}
          <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl space-y-2 hover:border-pink-500/50 transition-colors">
            <p className="text-slate-500 text-xs uppercase font-bold">Info Perangkat (User Agent)</p>
            <p className="text-sm text-slate-300 font-mono break-all leading-relaxed">
              {userAgent}
            </p>
          </div>

        </div>
      )}

      {/* --- RELOAD BUTTON --- */}
      <div className="text-center pt-4">
        <button 
          onClick={fetchIp} 
          className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full text-sm font-medium transition-all active:scale-95"
        >
          Refresh Data
        </button>
      </div>

    </div>
  );
}
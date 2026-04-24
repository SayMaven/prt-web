"use client";

import { useState, useEffect } from "react";
import { Globe2, MapPin, Wifi, Smartphone, ShieldAlert, Copy, Check, Hash, Navigation, Clock, Network } from "lucide-react";

interface IpData {
  ip: string;
  city: string;
  region: string;
  country: string;
  country_code: string;
  latitude: number;
  longitude: number;
  org: string;
  asn: string;
  timezone: string;
  utc_offset: string;
  postal: string;
  network: string;
}

export default function IpChecker() {
  const [data, setData] = useState<IpData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userAgent, setUserAgent] = useState("");
  const [copied, setCopied] = useState(false);

  const fetchIp = async () => {
    setLoading(true);
    setError("");
    setData(null);

    try {
        // API UTAMA: ipapi.co (Akurat, banyak fitur)
        const res = await fetch("https://ipapi.co/json/");
        const json = await res.json();
        
        if (json.error || !json.ip) throw new Error("ipapi failed");
        
        setData({
            ip: json.ip,
            city: json.city || "Unknown",
            region: json.region || "Unknown",
            country: json.country_name || "Unknown",
            country_code: json.country_code || "",
            latitude: json.latitude || 0,
            longitude: json.longitude || 0,
            org: json.org || "Unknown ISP",
            asn: json.asn || "Unknown",
            timezone: json.timezone || "Unknown",
            utc_offset: json.utc_offset || "Unknown",
            postal: json.postal || "Unknown",
            network: json.network || "Unknown",
        });
    } catch {
        // FALLBACK: ipwhois.app (Gratis, aman dari beberapa blokir)
        try {
            const res2 = await fetch("https://ipwhois.app/json/");
            const json2 = await res2.json();
            if (!json2.success || !json2.ip) throw new Error("ipwhois failed");
            
            setData({
                ip: json2.ip,
                city: json2.city || "Unknown",
                region: json2.region || "Unknown",
                country: json2.country || "Unknown",
                country_code: json2.country_code || "",
                latitude: json2.latitude || 0,
                longitude: json2.longitude || 0,
                org: json2.org || json2.isp || "Unknown ISP",
                asn: json2.asn || "Unknown",
                timezone: json2.timezone || "Unknown",
                utc_offset: "Unknown",
                postal: "Unknown",
                network: "Unknown",
            });
        } catch {
            setError("Gagal mendeteksi IP. Permintaan diblokir secara ketat (mungkin oleh Adblocker/VPN).");
        }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchIp();
    if (typeof window !== "undefined") {
      setUserAgent(window.navigator.userAgent);
    }
  }, []);

  const handleCopy = () => {
      if (!data) return;
      navigator.clipboard.writeText(data.ip);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-6">
      
      {/* ERROR MESSAGE */}
      {error && (
        <div className="p-4 rounded-xl text-sm flex items-center justify-center gap-3 font-bold border mx-auto w-full max-w-2xl" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", borderColor: "rgba(239, 68, 68, 0.2)" }}>
            <ShieldAlert size={20} /> {error}
            <button onClick={fetchIp} className="ml-4 px-3 py-1 bg-red-500/20 rounded-md hover:bg-red-500/30 transition-colors">Coba Lagi</button>
        </div>
      )}

      {/* --- KARTU UTAMA (IP) --- */}
      <div className="w-full p-8 md:p-12 border rounded-[2.5rem] shadow-2xl relative overflow-hidden flex flex-col items-center justify-center text-center transition-all min-h-[300px]"
           style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[300px] blur-[100px] rounded-full pointer-events-none opacity-20" style={{ background: "var(--accent)" }}></div>
        
        {loading && (
            <div className="flex flex-col items-center gap-4 animate-pulse relative z-10">
                <div className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}></div>
                <p className="text-sm font-bold tracking-widest uppercase" style={{ color: "var(--text-secondary)" }}>Memindai Jaringan...</p>
            </div>
        )}

        {data && !loading && (
          <div className="relative z-10 animate-in zoom-in duration-500 flex flex-col items-center">
            <p className="text-xs md:text-sm font-black tracking-widest uppercase mb-4" style={{ color: "var(--text-muted)" }}>
              Public IPv4 Address
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <h2 className="text-5xl md:text-7xl lg:text-[6rem] leading-none font-black tracking-tighter drop-shadow-2xl font-mono" style={{ color: "var(--text-primary)" }}>
                {data.ip}
                </h2>
                <button 
                    onClick={handleCopy}
                    className="p-4 rounded-2xl border shadow-lg transition-all hover:scale-105 active:scale-95"
                    style={{ 
                        background: copied ? "rgba(16, 185, 129, 0.1)" : "var(--page-bg)", 
                        color: copied ? "#10b981" : "var(--accent)",
                        borderColor: copied ? "rgba(16, 185, 129, 0.5)" : "var(--card-border)"
                    }}
                    title="Copy IP"
                >
                    {copied ? <Check size={28} /> : <Copy size={28} />}
                </button>
            </div>

            <div className="inline-flex flex-wrap justify-center items-center gap-3 px-6 py-3 rounded-full border shadow-sm backdrop-blur-md" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                <img 
                    src={`https://flagcdn.com/24x18/${data.country_code.toLowerCase()}.png`} 
                    alt={data.country}
                    className="w-6 h-auto rounded-sm shadow-sm"
                    onError={(e) => e.currentTarget.style.display = 'none'}
                />
                <span className="text-sm font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>{data.country}</span>
            </div>
          </div>
        )}
      </div>

      {/* --- GRID DETAIL --- */}
      {data && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-8 duration-700 delay-150">
          
          <InfoCard 
              icon={<MapPin />} 
              title="Geolocation" 
              main={`${data.city}, ${data.region}`} 
              sub={`Lat: ${data.latitude} | Lon: ${data.longitude}`}
              action={{
                  label: "Google Maps",
                  href: `https://www.google.com/maps/search/?api=1&query=${data.latitude},${data.longitude}`
              }}
          />

          <InfoCard 
              icon={<Wifi />} 
              title="ISP / Organization" 
              main={data.org} 
              sub={`ASN: ${data.asn}`} 
          />

          <InfoCard 
              icon={<Network />} 
              title="Network Type" 
              main="IPv4 Connection" 
              sub={`IP Block: ${data.network}`} 
          />

          <InfoCard 
              icon={<Navigation />} 
              title="Postal Code" 
              main={data.postal} 
              sub={`Kawasan ${data.city}`} 
          />

          <InfoCard 
              icon={<Clock />} 
              title="Timezone" 
              main={data.timezone} 
              sub={`UTC Offset: ${data.utc_offset}`} 
          />

          <InfoCard 
              icon={<Smartphone />} 
              title="Device & Browser (User Agent)" 
              main="Current Device" 
              sub={userAgent} 
              isLongSub
          />

        </div>
      )}

      {/* TOMBOL REFRESH DI BAWAH */}
      {data && !loading && (
          <div className="flex justify-center mt-6">
              <button 
                  onClick={fetchIp} 
                  className="px-8 py-3 rounded-full border text-xs font-bold uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg flex items-center gap-2"
                  style={{ background: "var(--page-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
              >
                  <Globe2 size={16} style={{ color: "var(--accent)" }} /> Pindai Ulang Jaringan
              </button>
          </div>
      )}

    </div>
  );
}

function InfoCard({ icon, title, main, sub, isLongSub = false, action }: { icon: any, title: string, main: string, sub: string, isLongSub?: boolean, action?: {label: string, href: string} }) {
    return (
        <div className="p-6 rounded-[2rem] border shadow-xl flex flex-col relative overflow-hidden group transition-all hover:-translate-y-1 hover:shadow-2xl"
             style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
            
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 rounded-xl border transition-colors group-hover:bg-[color:var(--accent-subtle)]" style={{ color: "var(--accent)", borderColor: "var(--card-border)", background: "var(--page-bg)" }}>
                    {icon}
                </div>
                <p className="text-xs font-black uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>{title}</p>
            </div>
            
            <div className="flex-1">
                <p className="text-lg font-black tracking-tight mb-1 line-clamp-2" style={{ color: "var(--text-primary)" }}>{main}</p>
                <p className={`text-xs font-medium leading-relaxed ${!isLongSub ? 'truncate' : 'line-clamp-4'}`} style={{ color: "var(--text-muted)" }}>
                    {sub}
                </p>
            </div>

            {action && (
                <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--card-border)" }}>
                    <a 
                        href={action.href} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xs font-bold uppercase tracking-widest flex items-center gap-1 transition-colors hover:underline"
                        style={{ color: "var(--accent)" }}
                    >
                        ↗ {action.label}
                    </a>
                </div>
            )}
        </div>
    );
}
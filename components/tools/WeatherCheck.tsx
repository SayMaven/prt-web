"use client";

import { useState, useEffect } from "react";
import { 
    Search, MapPin, 
    Sun, CloudSun, Cloud, CloudFog, 
    CloudDrizzle, CloudRain, CloudLightning, Snowflake,
    Thermometer, Wind, Activity, SunDim, CalendarDays, BarChart3, AlertCircle
} from "lucide-react";

// --- HELPER: WMO Weather Code ---
const getWeatherInfo = (code: number, isDay: number) => {
  const iconProps = { size: 64, strokeWidth: 1.5 };
  const weatherMap: Record<number, { label: string; icon: React.ReactNode; color: string }> = {
    0: { label: "Cerah", icon: <Sun {...iconProps} />, color: "text-amber-400" },
    1: { label: "Cerah Berawan", icon: <CloudSun {...iconProps} />, color: "text-orange-300" },
    2: { label: "Berawan", icon: <Cloud {...iconProps} />, color: "text-slate-300" },
    3: { label: "Mendung", icon: <Cloud {...iconProps} fill="currentColor" opacity={0.5} />, color: "text-slate-400" },
    45: { label: "Berkabut", icon: <CloudFog {...iconProps} />, color: "text-slate-300" },
    48: { label: "Kabut Es", icon: <CloudFog {...iconProps} />, color: "text-slate-300" },
    51: { label: "Gerimis Ringan", icon: <CloudDrizzle {...iconProps} />, color: "text-blue-300" },
    53: { label: "Gerimis Sedang", icon: <CloudDrizzle {...iconProps} />, color: "text-blue-400" },
    55: { label: "Gerimis Lebat", icon: <CloudDrizzle {...iconProps} />, color: "text-blue-500" },
    61: { label: "Hujan Ringan", icon: <CloudRain {...iconProps} />, color: "text-blue-300" },
    63: { label: "Hujan Sedang", icon: <CloudRain {...iconProps} />, color: "text-blue-400" },
    65: { label: "Hujan Lebat", icon: <CloudRain {...iconProps} />, color: "text-blue-500" },
    80: { label: "Hujan Lokal Ringan", icon: <CloudRain {...iconProps} />, color: "text-blue-300" },
    81: { label: "Hujan Lokal", icon: <CloudRain {...iconProps} />, color: "text-blue-400" },
    82: { label: "Hujan Lokal Lebat", icon: <CloudRain {...iconProps} />, color: "text-blue-500" },
    95: { label: "Badai Petir", icon: <CloudLightning {...iconProps} />, color: "text-amber-500" },
    96: { label: "Badai Petir & Es Ringan", icon: <CloudLightning {...iconProps} />, color: "text-amber-500" },
    99: { label: "Badai Petir & Es Lebat", icon: <CloudLightning {...iconProps} />, color: "text-amber-500" },
  };

  const defaultWeather = { label: "Tidak Diketahui", icon: <Cloud {...iconProps} />, color: "text-slate-400" };
  const info = weatherMap[code] || defaultWeather;

  // Modify icon if it's night time
  if (isDay === 0 && (code === 0 || code === 1)) {
     // Optional: We can use Moon icon here if we import it, but standard Sun/CloudSun is okay for daytime mapping.
     // For simplicity, we just dim the color a bit at night.
     return { ...info, color: "text-indigo-300" };
  }

  return info;
};

// --- HELPER: AQI Status ---
const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { label: "Baik", color: "text-emerald-500" };
  if (aqi <= 100) return { label: "Sedang", color: "text-yellow-500" };
  if (aqi <= 150) return { label: "Sensitif", color: "text-orange-500" };
  if (aqi <= 200) return { label: "Tidak Sehat", color: "text-red-500" };
  return { label: "Berbahaya", color: "text-rose-700" };
};

// --- HELPER: Format Waktu ---
const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", { weekday: "long" });
};

const getHour = (isoString: string) => {
    const date = new Date(isoString);
    return date.getHours().toString().padStart(2, '0') + ":00";
}

// --- HELPER: SMOOTH CURVE GENERATOR (BEZIER) ---
const getSmoothPath = (points: [number, number][]) => {
  if (points.length === 0) return "";
  if (points.length === 1) return `M ${points[0][0]} ${points[0][1]}`;

  const controlPoint = (current: number[], previous: number[], next: number[], reverse?: boolean) => {
    const p = previous || current;
    const n = next || current;
    const smoothing = 0.15; 
    const o = { x: n[0] - p[0], y: n[1] - p[1] };
    const angle = Math.atan2(o.y, o.x) + (reverse ? Math.PI : 0);
    const length = Math.sqrt(Math.pow(o.x, 2) + Math.pow(o.y, 2)) * smoothing;
    return [
      current[0] + Math.cos(angle) * length,
      current[1] + Math.sin(angle) * length
    ];
  };

  return points.reduce((acc, point, i, a) => {
    if (i === 0) return `M ${point[0]} ${point[1]}`;
    const [cpsX, cpsY] = controlPoint(a[i - 1], a[i - 2], point);
    const [cpeX, cpeY] = controlPoint(point, a[i - 1], a[i + 1], true);
    return `${acc} C ${cpsX} ${cpsY}, ${cpeX} ${cpeY}, ${point[0]} ${point[1]}`;
  }, "");
};

// Tipe Data
interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  weatherCode: number;
  isDay: number;
  feelsLike: number;
  uvIndex: number;
  aqi: number;
  daily: {
    time: string[];
    weatherCode: number[];
    tempMax: number[];
    tempMin: number[];
    rainProb: number[];
  };
  hourly: {
    time: string[];
    temp: number[];
  }
}

interface CityResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country?: string;
  admin1?: string;
}

export default function WeatherCheck() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<CityResult[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Load last searched city on mount
  useEffect(() => {
      const savedCity = localStorage.getItem("lastWeatherCity");
      if (savedCity) {
          try {
              const city = JSON.parse(savedCity);
              selectCity(city);
          } catch (e) {
              console.error(e);
          }
      }
  }, []);

  // --- SEARCH ---
  const searchCity = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setResults([]);
    setIsSearching(true);

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=id&format=json`
      );
      const geoData = await geoRes.json();
      if (!geoData.results?.length) throw new Error("Kota tidak ditemukan.");
      setResults(geoData.results);
    } catch (err: any) {
      setError(err.message || "Gagal mencari kota.");
    } finally {
      setLoading(false);
    }
  };

  // --- FETCH DATA ---
  const selectCity = async (city: CityResult) => {
    setIsSearching(false);
    setQuery(""); 
    setLoading(true);
    setError("");

    localStorage.setItem("lastWeatherCity", JSON.stringify(city));

    const cityName = `${city.name}${city.admin1 && city.admin1 !== city.name ? `, ${city.admin1}` : ""}${city.country ? `, ${city.country}` : ""}`;
    
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m&timezone=auto&forecast_days=6`
      );
      const weatherData = await weatherRes.json();

      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${city.latitude}&longitude=${city.longitude}&current=us_aqi,uv_index`
      );
      const aqiData = await aqiRes.json();

      const current = weatherData.current;
      const daily = weatherData.daily;
      const hourly = weatherData.hourly;
      
      // Ambil 24 Jam
      const currentHourIndex = new Date().getHours();
      const startIndex = currentHourIndex;
      const endIndex = startIndex + 24;
      
      const graphTime = hourly.time.slice(startIndex, endIndex);
      const graphTemp = hourly.temperature_2m.slice(startIndex, endIndex);

      setWeather({
        city: cityName,
        temp: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
        isDay: current.is_day,
        feelsLike: current.apparent_temperature,
        uvIndex: aqiData.current?.uv_index || 0,
        aqi: aqiData.current?.us_aqi || 0,
        daily: {
            time: daily.time,
            weatherCode: daily.weather_code,
            tempMax: daily.temperature_2m_max,
            tempMin: daily.temperature_2m_min,
            rainProb: daily.precipitation_probability_max
        },
        hourly: {
            time: graphTime,
            temp: graphTemp
        }
      });
    } catch (err) {
      setError("Gagal mengambil data lengkap.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError("Browser tidak support Geolocation.");
      return;
    }
    setLoading(true);
    setIsSearching(false);
    setResults([]);
    setError("");
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectCity({
            id: 0,
            name: "Lokasi Terkini",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: "GPS",
            admin1: "Akurat"
        });
      },
      () => {
        setError("Gagal mendeteksi lokasi atau akses ditolak.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="w-full space-y-8">
      
      {/* SEARCH BAR */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
                <input
                type="text"
                placeholder="Cari Kota (Contoh: Jakarta, Tokyo)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchCity()}
                className="w-full bg-black/10 backdrop-blur-md border rounded-2xl pl-12 pr-4 py-4 text-sm sm:text-base focus:outline-none focus:ring-2 transition-all shadow-sm"
                style={{ borderColor: "var(--card-border)", color: "var(--text-primary)", outlineColor: "var(--accent)" }}
                />
                <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-50" style={{ color: "var(--text-primary)" }} />
            </div>
            <button 
                onClick={searchCity} 
                disabled={loading} 
                className="px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "var(--accent)", color: "white" }}
            >
                Cari
            </button>
            <button 
                onClick={handleAutoDetect} 
                disabled={loading} 
                className="px-5 py-4 bg-black/10 backdrop-blur-md border rounded-2xl flex items-center justify-center hover:bg-black/20 transition-all group"
                style={{ borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                title="Gunakan Lokasi GPS"
            >
                <MapPin size={20} className="group-hover:scale-110 transition-transform" />
            </button>
        </div>

        {isSearching && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 border rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto custom-scrollbar backdrop-blur-xl" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                {results.map((city) => (
                    <button key={city.id} onClick={() => selectCity(city)} className="w-full text-left p-4 hover:bg-black/10 border-b last:border-0 flex justify-between items-center transition-colors" style={{ borderColor: "var(--card-border)" }}>
                        <div className="flex flex-col">
                            <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{city.name}</span>
                            <span className="text-xs font-medium" style={{ color: "var(--text-secondary)" }}>{city.admin1 ? `${city.admin1}, ` : ""}{city.country}</span>
                        </div>
                    </button>
                ))}
            </div>
        )}
      </div>

      {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold text-red-500">
              <AlertCircle size={16} /> {error}
          </div>
      )}

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-6 animate-pulse">
            <div className="h-80 rounded-[2.5rem] opacity-50" style={{ background: "var(--card-bg)" }}></div>
            <div className="h-48 rounded-[2.5rem] opacity-50" style={{ background: "var(--card-bg)" }}></div>
        </div>
      )}

      {/* WEATHER CONTENT */}
      {weather && !loading && !isSearching && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in slide-in-from-bottom-8 duration-700">
            
            {/* KOLOM KIRI (KARTU UTAMA) */}
            <div className="lg:col-span-5 flex flex-col h-full">
                {/* 1. MAIN CARD */}
                <div className="relative overflow-hidden rounded-[2.5rem] border shadow-2xl p-8 sm:p-10 text-center transition-all h-full flex flex-col justify-center"
                     style={{ borderColor: "var(--card-border)", background: "var(--card-bg)" }}>
                    
                    {/* Dynamic Background Glow based on Day/Night */}
                    <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[120%] h-[120%] blur-[120px] rounded-[100%] opacity-20 pointer-events-none -z-10 transition-colors duration-1000"
                         style={{ background: weather.isDay ? "radial-gradient(circle, var(--accent) 0%, transparent 70%)" : "radial-gradient(circle, #3b82f6 0%, transparent 70%)" }}>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center">
                        <p className="text-xs font-black uppercase tracking-[0.2em] mb-1 opacity-70" style={{ color: "var(--text-secondary)" }}>
                            Cuaca Terkini
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-black tracking-tight mb-8" style={{ color: "var(--text-primary)" }}>
                            {weather.city}
                        </h2>

                        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-10 mb-10">
                            <div className={`drop-shadow-2xl transition-transform hover:scale-110 ${getWeatherInfo(weather.weatherCode, weather.isDay).color}`}>
                                {getWeatherInfo(weather.weatherCode, weather.isDay).icon}
                            </div>
                            <div className="text-center sm:text-left">
                                <p className="text-7xl sm:text-8xl font-black tracking-tighter leading-none mb-1" style={{ color: "var(--text-primary)" }}>
                                    {Math.round(weather.temp)}°
                                </p>
                                <p className={`text-lg sm:text-xl font-bold tracking-wide ${getWeatherInfo(weather.weatherCode, weather.isDay).color}`}>
                                    {getWeatherInfo(weather.weatherCode, weather.isDay).label}
                                </p>
                            </div>
                        </div>

                        <div className="w-full grid grid-cols-2 gap-3 sm:gap-4 mt-auto">
                            <InfoCard icon={<Thermometer size={16} />} label="Terasa Seperti" value={`${Math.round(weather.feelsLike)}°`} />
                            <InfoCard icon={<Wind size={16} />} label="Kecepatan Angin" value={`${weather.windSpeed} km/h`} />
                            <InfoCard 
                                icon={<Activity size={16} />} 
                                label="Kualitas Udara" 
                                value={weather.aqi.toString()} 
                                subValue={getAqiInfo(weather.aqi).label} 
                                valueColor={getAqiInfo(weather.aqi).color} 
                            />
                            <InfoCard 
                                icon={<SunDim size={16} />} 
                                label="UV Index" 
                                value={weather.uvIndex.toString()} 
                                valueColor={weather.uvIndex > 5 ? "text-red-500" : "text-emerald-500"} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* KOLOM KANAN (GRAFIK & FORECAST) */}
            <div className="lg:col-span-7 flex flex-col gap-6">
                
                {/* 2. GRAFIK SUHU */}
                <div className="border rounded-[2.5rem] p-8 sm:p-10 relative overflow-hidden flex-1"
                     style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8" style={{ color: "var(--text-secondary)" }}>
                         <BarChart3 size={16} /> Suhu 24 Jam Ke Depan
                    </h3>
                    
                    <div className="relative w-full overflow-x-auto custom-scrollbar pb-2 -mx-2 sm:mx-0">
                        <div className="min-w-[600px] w-full">
                            {(() => {
                                const data = weather.hourly.temp;
                                let max = Math.max(...data);
                                let min = Math.min(...data);
                                
                                if ((max - min) > 3) {
                                    max += 5;
                                    min -= 5;
                                } else {
                                    max += 3;
                                    min -= 3;
                                }
                                
                                const range = max - min;
                                const svgWidth = 1000;
                                const svgHeight = 250;
                                
                                const points: [number, number][] = data.map((t, i) => {
                                    const x = (i / (data.length - 1)) * svgWidth;
                                    const y = (svgHeight - 40) - ((t - min) / range) * (svgHeight - 80); 
                                    return [x, y];
                                });

                                const pathD = getSmoothPath(points);
                                const fillD = `${pathD} L ${svgWidth} ${svgHeight} L 0 ${svgHeight} Z`;

                                return (
                                    <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-auto overflow-visible">
                                        <defs>
                                            <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
                                                <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                                            </linearGradient>
                                            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                                <feGaussianBlur stdDeviation="3" result="blur" />
                                                <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                            </filter>
                                        </defs>
                                        
                                        <path d={fillD} fill="url(#tempGradient)" stroke="none" />
                                        
                                        <path d={pathD} fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" style={{ filter: "url(#glow)" }} />
                                        
                                        {data.map((t, i) => {
                                            if (i % 3 !== 0) return null; // Show label every 3 hours
                                            const x = (i / (data.length - 1)) * svgWidth;
                                            const y = (svgHeight - 40) - ((t - min) / range) * (svgHeight - 80);
                                            return (
                                                <g key={i}>
                                                    <circle cx={x} cy={y} r="5" fill="var(--card-bg)" stroke="var(--accent)" strokeWidth="3" />
                                                    <text x={x} y={y - 15} textAnchor="middle" fontSize="16" fill="var(--text-primary)" fontWeight="900">{Math.round(t)}°</text>
                                                    <text x={x} y={svgHeight - 5} textAnchor="middle" fontSize="14" fill="var(--text-secondary)" fontWeight="800">{getHour(weather.hourly.time[i])}</text>
                                                </g>
                                            );
                                        })}
                                    </svg>
                                );
                            })()}
                        </div>
                    </div>
                </div>

                {/* 3. FORECAST 5 HARI */}
                <div className="border rounded-[2.5rem] p-8 sm:p-10 flex-1"
                     style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                    <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6" style={{ color: "var(--text-secondary)" }}>
                        <CalendarDays size={16} /> Prediksi 5 Hari
                    </h3>
                    <div className="space-y-2">
                        {weather.daily.time.slice(1, 6).map((dateStr, i) => {
                            const idx = i + 1;
                            if (weather.daily.weatherCode[idx] === undefined) return null;
                            
                            const wInfo = getWeatherInfo(weather.daily.weatherCode[idx], 1); // assume day for forecast

                            return (
                                <div key={dateStr} className="flex items-center justify-between p-4 rounded-2xl hover:bg-black/5 transition-colors border border-transparent hover:border-black/10 group" style={{ borderColor: "transparent" }}>
                                    <div className="w-24 shrink-0">
                                        <p className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>{getDayName(dateStr)}</p>
                                    </div>
                                    <div className="flex items-center gap-3 flex-1">
                                        <div className={`${wInfo.color} scale-75 sm:scale-100 origin-left`}>
                                            {wInfo.icon}
                                        </div>
                                        <span className="font-medium text-sm hidden sm:block opacity-80" style={{ color: "var(--text-secondary)" }}>
                                            {wInfo.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        {weather.daily.rainProb[idx] > 0 && (
                                            <span className="text-xs font-bold text-blue-500 bg-blue-500/10 px-2.5 py-1 rounded-full whitespace-nowrap">
                                                {weather.daily.rainProb[idx]}% 💧
                                            </span>
                                        )}
                                        <div className="w-20 text-right">
                                            <span className="font-bold text-base" style={{ color: "var(--text-primary)" }}>{Math.round(weather.daily.tempMax[idx])}°</span>
                                            <span className="font-bold text-xs ml-1.5 opacity-50" style={{ color: "var(--text-secondary)" }}>{Math.round(weather.daily.tempMin[idx])}°</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

            </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(150,150,150,0.2); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(150,150,150,0.4); }
      `}</style>
    </div>
  );
}

function InfoCard({ icon, label, value, subValue, valueColor }: { icon: any, label: string, value: string, subValue?: string, valueColor?: string }) {
    return (
        <div className="bg-black/5 p-4 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:bg-black/10"
             style={{ borderColor: "var(--card-border)" }}>
            <span className="mb-2 opacity-70" style={{ color: "var(--text-secondary)" }}>{icon}</span>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1 opacity-70" style={{ color: "var(--text-secondary)" }}>{label}</p>
            <p className={`font-black text-lg sm:text-xl ${valueColor || ''}`} style={!valueColor ? { color: "var(--text-primary)" } : {}}>
                {value}
            </p>
            {subValue && (
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mt-1 opacity-80" style={{ color: "var(--text-secondary)" }}>{subValue}</p>
            )}
        </div>
    );
}
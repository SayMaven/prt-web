"use client";

import { useState, useEffect } from "react";

// --- HELPER: WMO Weather Code ---
const getWeatherInfo = (code: number) => {
  const weatherMap: Record<number, { label: string; icon: string }> = {
    0: { label: "Cerah", icon: "☀️" },
    1: { label: "Cerah Berawan", icon: "🌤️" },
    2: { label: "Berawan", icon: "☁️" },
    3: { label: "Mendung", icon: "☁️" },
    45: { label: "Berkabut", icon: "🌫️" },
    48: { label: "Kabut Es", icon: "🌫️" },
    51: { label: "Gerimis", icon: "🌧️" },
    53: { label: "Gerimis", icon: "🌧️" },
    55: { label: "Hujan", icon: "🌧️" },
    61: { label: "Hujan Ringan", icon: "☔" },
    63: { label: "Hujan Sedang", icon: "☔" },
    65: { label: "Hujan Lebat", icon: "⛈️" },
    80: { label: "Hujan Lokal", icon: "🌦️" },
    81: { label: "Hujan Lokal", icon: "🌦️" },
    82: { label: "Hujan Petir", icon: "⛈️" },
    95: { label: "Badai Petir", icon: "⚡" },
    96: { label: "Badai Es", icon: "⛈️" },
  };
  return weatherMap[code] || { label: "Unknown", icon: "❓" };
};

// --- HELPER: AQI Status ---
const getAqiInfo = (aqi: number) => {
  if (aqi <= 50) return { label: "Baik", color: "text-green-400", bg: "bg-green-500" };
  if (aqi <= 100) return { label: "Sedang", color: "text-yellow-400", bg: "bg-yellow-500" };
  if (aqi <= 150) return { label: "Sensitif", color: "text-orange-400", bg: "bg-orange-500" };
  if (aqi <= 200) return { label: "Tdk Sehat", color: "text-red-400", bg: "bg-red-500" };
  return { label: "Bahaya", color: "text-rose-600", bg: "bg-rose-600" };
};

// --- HELPER: Format Waktu ---
const getDayName = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("id-ID", { weekday: "long" });
};

const getHour = (isoString: string) => {
    const date = new Date(isoString);
    return date.getHours() + ":00";
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

  // --- SEARCH ---
  const searchCity = async () => {
    if (!query) return;
    setLoading(true);
    setError("");
    setWeather(null);
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

    const cityName = `${city.name}, ${city.admin1 || ""} ${city.country || ""}`;
    
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.latitude}&longitude=${city.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&hourly=temperature_2m&timezone=auto&forecast_days=3`
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
        uvIndex: aqiData.current.uv_index,
        aqi: aqiData.current.us_aqi,
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
    
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        selectCity({
            id: 0,
            name: "Lokasi Anda",
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            country: "GPS",
            admin1: "Saat Ini"
        });
      },
      () => {
        setError("Gagal mendeteksi lokasi.");
        setLoading(false);
      }
    );
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* SEARCH BAR */}
      <div className="flex flex-col gap-2 relative">
        <div className="flex flex-col sm:flex-row gap-3">
            <input
            type="text"
            placeholder="Cari Kota..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && searchCity()}
            className="flex-1 bg-slate-800 border border-slate-700 text-white rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button onClick={searchCity} disabled={loading} className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl">🔍</button>
            <button onClick={handleAutoDetect} disabled={loading} className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl">📍</button>
        </div>

        {isSearching && results.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl z-50 max-h-60 overflow-y-auto">
                {results.map((city) => (
                    <button key={city.id} onClick={() => selectCity(city)} className="w-full text-left p-3 hover:bg-slate-700 text-white border-b border-slate-700/50 flex justify-between items-center group">
                        <div><span className="font-bold text-blue-400">{city.name}</span><span className="text-slate-400 text-sm ml-2">{city.admin1}, {city.country}</span></div>
                    </button>
                ))}
            </div>
        )}
      </div>

      {error && <div className="p-4 bg-red-500/10 text-red-400 rounded-xl text-center text-sm">{error}</div>}

      {/* WEATHER CONTENT */}
      {weather && !loading && !isSearching && (
        <div className="space-y-6">
            
            {/* 1. MAIN CARD */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 shadow-2xl p-6 text-center animate-in zoom-in duration-500">
                <div className={`absolute top-0 right-0 w-64 h-64 blur-[80px] rounded-full opacity-30 ${weather.isDay ? 'bg-orange-500' : 'bg-blue-900'}`}></div>
                
                <div className="relative z-10">
                    <h2 className="text-2xl font-bold text-white">{weather.city}</h2>
                    <p className="text-slate-400 text-xs mb-4">Update Terkini</p>

                    <div className="flex justify-center items-center gap-6 mb-6">
                        <span className="text-7xl drop-shadow-lg">{getWeatherInfo(weather.weatherCode).icon}</span>
                        <div className="text-left">
                            <p className="text-6xl font-black text-white">{Math.round(weather.temp)}°</p>
                            <p className="text-blue-400 font-medium">{getWeatherInfo(weather.weatherCode).label}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                            <p className="text-slate-500 text-xs">Suhu</p>
                            <p className="text-white font-bold text-lg">{Math.round(weather.feelsLike)}°</p>
                        </div>
                        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                            <p className="text-slate-500 text-xs">Angin</p>
                            <p className="text-white font-bold text-lg">{weather.windSpeed} <span className="text-xs font-normal">km/h</span></p>
                        </div>
                        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                            <p className="text-slate-500 text-xs">Udara (AQI)</p>
                            <p className={`font-bold text-lg ${getAqiInfo(weather.aqi).color}`}>{weather.aqi}</p>
                            <p className="text-[10px] text-slate-400 leading-none">{getAqiInfo(weather.aqi).label}</p>
                        </div>
                        <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800">
                            <p className="text-slate-500 text-xs">UV Index</p>
                            <p className={`font-bold text-lg ${weather.uvIndex > 5 ? 'text-red-400' : 'text-green-400'}`}>{weather.uvIndex}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. GRAFIK SUHU (VERSI TINGGI) */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 animate-in slide-in-from-bottom-4 duration-700 delay-100 overflow-hidden">
                <h3 className="text-sm font-bold text-slate-300 mb-8 flex items-center gap-2">
                     Temperatur 24 Jam
                </h3>
                
                {/* TINGGI DIPERBESAR: h-96 (384px) supaya tidak gepeng */}
                <div className="relative h-110 w-full">
                    {(() => {
                        const data = weather.hourly.temp;
                        let max = Math.max(...data);
                        let min = Math.min(...data);
                        
                        // Force minimal range 3 derajat agar grafik tidak datar
                        if ((max - min) > 3) {
                            max += 8;
                            min -= 8;
                        }
                        
                        const range = max - min;
                        
                        // Map points ke area 5% - 95% vertikal
                        const points: [number, number][] = data.map((t, i) => {
                            const x = (i / (data.length - 1)) * 100;
                            const y = 95 - ((t - min) / range) * 90; 
                            return [x, y];
                        });

                        const pathD = getSmoothPath(points);
                        const fillD = `${pathD} L 100 100 L 0 100 Z`;

                        return (
                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                <defs>
                                    <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                    {/* Efek Glow Shadow */}
                                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                        <feGaussianBlur stdDeviation="2" result="blur" />
                                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                    </filter>
                                </defs>
                                
                                <path d={fillD} fill="url(#tempGradient)" stroke="none" />
                                
                                {/* STROKE LEBIH TEBAL (3) & PAKAI FILTER GLOW */}
                                <path d={pathD} fill="none" stroke="#60a5fa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" style={{ filter: "drop-shadow(0px 0px 8px rgba(96, 165, 250, 0.6))" }} />
                                
                                {/* Dots & Labels */}
                                {data.map((t, i) => {
                                    if (i % 3 !== 0) return null;
                                    const x = (i / (data.length - 1)) * 100;
                                    const y = 95 - ((t - min) / range) * 90;
                                    return (
                                        <g key={i}>
                                            <circle cx={x} cy={y} r="1.5" fill="white" stroke="#1e293b" strokeWidth="0.5" />
                                            <text x={x} y={y - 6} textAnchor="middle" fontSize="3" fill="white" fontWeight="bold">{Math.round(t)}°</text>
                                            <text x={x} y="106" textAnchor="middle" fontSize="2.5" fill="#94a3b8">{getHour(weather.hourly.time[i])}</text>
                                        </g>
                                    );
                                })}
                            </svg>
                        );
                    })()}
                </div>
            </div>

            {/* 3. FORECAST 5 HARI */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 animate-in slide-in-from-bottom-4 duration-700 delay-200">
                <h3 className="text-sm font-bold text-slate-300 mb-4">📅 Prediksi 5 Hari</h3>
                <div className="space-y-3">
                    {weather.daily.time.slice(1, 6).map((dateStr, i) => {
                        const idx = i + 1;
                        if (!weather.daily.weatherCode[idx]) return null;

                        return (
                            <div key={dateStr} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                                <div className="w-16">
                                    <p className="text-white font-bold text-sm">{getDayName(dateStr)}</p>
                                </div>
                                <div className="flex items-center gap-2 flex-1">
                                    <span className="text-xl">{getWeatherInfo(weather.daily.weatherCode[idx]).icon}</span>
                                    <span className="text-slate-400 text-xs hidden sm:block">{getWeatherInfo(weather.daily.weatherCode[idx]).label}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    {weather.daily.rainProb[idx] > 0 && (
                                        <span className="text-xs text-blue-400 bg-blue-500/10 px-2 py-1 rounded-full whitespace-nowrap">💧 {weather.daily.rainProb[idx]}%</span>
                                    )}
                                    <div className="w-16 text-right">
                                        <span className="text-white font-bold">{Math.round(weather.daily.tempMax[idx])}°</span>
                                        <span className="text-slate-600 text-xs ml-1">{Math.round(weather.daily.tempMin[idx])}°</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

        </div>
      )}

      {loading && (
        <div className="space-y-6 animate-pulse">
            <div className="h-64 bg-slate-800 rounded-3xl"></div>
            <div className="h-40 bg-slate-800 rounded-3xl"></div>
        </div>
      )}
    </div>
  );
}
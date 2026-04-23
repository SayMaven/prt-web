"use client";

import { useState } from "react";
import { Copy, Check, SlidersHorizontal, Hash, Droplets } from "lucide-react";

export default function ColorConverter() {
  const [hex, setHex] = useState("#3b82f6");
  const [copiedState, setCopiedState] = useState<string | null>(null);

  // --- PARSERS & CONVERTERS ---
  const hexToRgbObj = (h: string) => {
    let raw = h.replace("#", "");
    if (raw.length === 3) raw = raw.split("").map(c => c+c).join("");
    if (raw.length !== 6) return { r: 0, g: 0, b: 0 };
    return {
      r: parseInt(raw.substring(0, 2), 16),
      g: parseInt(raw.substring(2, 4), 16),
      b: parseInt(raw.substring(4, 6), 16)
    };
  };

  const hexToHslObj = (hStr: string) => {
    const rgb = hexToRgbObj(hStr);
    let r = rgb.r / 255, g = rgb.g / 255, b = rgb.b / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  };

  const rgbToCmykStr = (r: number, g: number, b: number) => {
    let c = 1 - (r / 255);
    let m = 1 - (g / 255);
    let y = 1 - (b / 255);
    let k = Math.min(c, Math.min(m, y));
    
    if (k === 1) return "cmyk(0%, 0%, 0%, 100%)";
    
    c = (c - k) / (1 - k);
    m = (m - k) / (1 - k);
    y = (y - k) / (1 - k);
    
    return `cmyk(${Math.round(c * 100)}%, ${Math.round(m * 100)}%, ${Math.round(y * 100)}%, ${Math.round(k * 100)}%)`;
  };

  // --- HANDLERS ---
  const handleHexInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (!val.startsWith("#")) val = "#" + val;
    if (val.length <= 7) setHex(val);
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedState(type);
    setTimeout(() => setCopiedState(null), 2000);
  };

  // --- DERIVED STATES ---
  const validHex = hex.length === 7 ? hex : "#000000";
  const rgbObj = hexToRgbObj(validHex);
  const hslObj = hexToHslObj(validHex);

  const rgbStr = `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`;
  const hslStr = `hsl(${hslObj.h}, ${hslObj.s}%, ${hslObj.l}%)`;
  const cmykStr = rgbToCmykStr(rgbObj.r, rgbObj.g, rgbObj.b);

  const handleSliderChange = (type: "h" | "s" | "l", value: number) => {
      let newH = hslObj.h;
      let newS = hslObj.s;
      let newL = hslObj.l;
      if (type === "h") newH = value;
      if (type === "s") newS = value;
      if (type === "l") newL = value;
      setHex(hslToHex(newH, newS, newL));
  };

  const formatList = [
      { id: "HEX", value: hex },
      { id: "RGB", value: rgbStr },
      { id: "HSL", value: hslStr },
      { id: "CMYK", value: cmykStr },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start w-full">
      
      {/* KIRI: Custom Color Picker & Preview */}
      <div className="flex-1 w-full flex flex-col gap-6">
          
          {/* Main Preview Block */}
          <div className="w-full h-48 md:h-64 rounded-3xl shadow-xl border relative overflow-hidden transition-colors duration-200 flex items-center justify-center"
               style={{ backgroundColor: validHex, borderColor: "var(--card-border)" }}>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none"></div>
              
              <div className="relative z-10 px-6 py-2 rounded-full backdrop-blur-md bg-white/20 border border-white/30 text-white shadow-xl flex items-center gap-2 font-mono font-bold tracking-widest uppercase">
                  <Droplets size={16} /> {validHex}
              </div>
          </div>

          {/* Custom HSL Sliders */}
          <div className="w-full p-6 md:p-8 rounded-3xl border shadow-xl flex flex-col gap-8"
               style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
              
              <div className="flex items-center gap-2 mb-2">
                  <SlidersHorizontal size={20} style={{ color: "var(--accent)" }} />
                  <h3 className="text-lg font-extrabold tracking-tight" style={{ color: "var(--text-primary)" }}>Custom Picker</h3>
              </div>

              {/* Hue Slider */}
              <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                      <span>Hue</span>
                      <span className="font-mono">{hslObj.h}°</span>
                  </div>
                  <input 
                      type="range" min="0" max="360" value={hslObj.h}
                      onChange={(e) => handleSliderChange("h", parseInt(e.target.value))}
                      className="w-full h-4 rounded-full appearance-none cursor-pointer outline-none border shadow-inner"
                      style={{ 
                          background: "linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%)",
                          borderColor: "var(--card-border)"
                      }}
                  />
              </div>

              {/* Saturation Slider */}
              <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                      <span>Saturation</span>
                      <span className="font-mono">{hslObj.s}%</span>
                  </div>
                  <input 
                      type="range" min="0" max="100" value={hslObj.s}
                      onChange={(e) => handleSliderChange("s", parseInt(e.target.value))}
                      className="w-full h-4 rounded-full appearance-none cursor-pointer outline-none border shadow-inner"
                      style={{ 
                          background: `linear-gradient(to right, hsl(${hslObj.h}, 0%, ${hslObj.l}%), hsl(${hslObj.h}, 100%, ${hslObj.l}%))`,
                          borderColor: "var(--card-border)"
                      }}
                  />
              </div>

              {/* Lightness Slider */}
              <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                      <span>Lightness</span>
                      <span className="font-mono">{hslObj.l}%</span>
                  </div>
                  <input 
                      type="range" min="0" max="100" value={hslObj.l}
                      onChange={(e) => handleSliderChange("l", parseInt(e.target.value))}
                      className="w-full h-4 rounded-full appearance-none cursor-pointer outline-none border shadow-inner"
                      style={{ 
                          background: `linear-gradient(to right, #000000, hsl(${hslObj.h}, ${hslObj.s}%, 50%), #ffffff)`,
                          borderColor: "var(--card-border)"
                      }}
                  />
              </div>

          </div>

      </div>

      {/* KANAN: Hasil Konversi */}
      <div className="flex-1 w-full flex flex-col gap-4">
        
        {formatList.map((format) => (
            <div key={format.id} className="w-full p-5 md:p-6 rounded-3xl border shadow-lg flex flex-col gap-3 group transition-all hover:-translate-y-1 hover:shadow-xl"
                 style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
                
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        {format.id === "HEX" && <Hash size={16} style={{ color: "var(--accent)" }} />}
                        <span className="text-sm font-black uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>
                            {format.id}
                        </span>
                    </div>
                    <button 
                        onClick={() => copyToClipboard(format.value, format.id)}
                        className="p-2 rounded-xl transition-all"
                        style={{ 
                            background: copiedState === format.id ? "rgba(16, 185, 129, 0.1)" : "var(--page-bg)", 
                            color: copiedState === format.id ? "#10b981" : "var(--text-muted)",
                            border: "1px solid var(--card-border)"
                        }}
                        title={`Copy ${format.id}`}
                    >
                        {copiedState === format.id ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                </div>

                <div className="flex items-center border rounded-xl px-4 overflow-hidden focus-within:ring-2 focus-within:ring-[color:var(--accent)] transition-all"
                     style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
                    
                    {format.id === "HEX" ? (
                        <input 
                            type="text"
                            value={hex}
                            onChange={handleHexInput}
                            spellCheck="false"
                            className="w-full bg-transparent outline-none py-4 font-mono font-black text-xl tracking-wider"
                            style={{ color: "var(--text-primary)" }}
                        />
                    ) : (
                        <div className="w-full py-4 font-mono font-bold text-lg tracking-wider truncate" style={{ color: "var(--text-primary)" }}>
                            {format.value}
                        </div>
                    )}
                    
                </div>
            </div>
        ))}

      </div>

    </div>
  );
}
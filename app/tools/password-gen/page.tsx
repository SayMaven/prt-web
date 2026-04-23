"use client";

import { useState, useEffect } from "react";
import { Copy, Check, RefreshCcw, KeyRound, ShieldCheck, ShieldAlert, Settings2, ShieldHalf, Lock } from "lucide-react";

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    // Prevent error if all checkboxes are unchecked somehow
    if (charset.length === 0) charset = "abcdefghijklmnopqrstuvwxyz";

    let generatedPassword = "";
    // Ensure at least one of each required character type is included
    if (includeUppercase) generatedPassword += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    if (includeNumbers) generatedPassword += "0123456789"[Math.floor(Math.random() * 10)];
    if (includeSymbols) generatedPassword += "!@#$%^&*()_+~`|}{[]:;?><,./-="[Math.floor(Math.random() * 29)];
    
    // Fill the rest
    const remainingLength = length - generatedPassword.length;
    for (let i = 0; i < remainingLength; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }

    // Shuffle the string
    generatedPassword = generatedPassword.split('').sort(() => 0.5 - Math.random()).join('');

    setPassword(generatedPassword);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, includeUppercase, includeNumbers, includeSymbols]);

  // Kalkulasi Kekuatan Password
  const calculateStrength = () => {
    let score = 0;
    if (length > 8) score += 1;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (includeUppercase) score += 1;
    if (includeNumbers) score += 1;
    if (includeSymbols) score += 1;
    return score; // Max 6
  };
  
  const score = calculateStrength();
  const strengthData = 
    score <= 2 ? { label: "Weak", color: "#ef4444", icon: <ShieldAlert size={18} /> } :
    score <= 4 ? { label: "Moderate", color: "#f59e0b", icon: <ShieldHalf size={18} /> } :
    { label: "Strong", color: "#10b981", icon: <ShieldCheck size={18} /> };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center">
      
      <section className="text-center mt-6 mb-10 relative z-10 w-full">
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6 backdrop-blur-md border shadow-sm"
          style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}
        >
          <Lock size={14} style={{ color: "var(--accent)" }} />
          <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-secondary)" }}>Security Tool</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight" style={{ color: "var(--text-primary)" }}>
          Password <span style={{ color: "var(--accent)", filter: "drop-shadow(0 0 15px var(--accent-subtle))" }}>Generator</span>
        </h1>
        <p className="text-lg max-w-xl mx-auto leading-relaxed font-medium" style={{ color: "var(--text-secondary)" }}>
          Ciptakan kata sandi acak yang tak tertembus untuk melindungi akun dan aset digital Anda.
        </p>
      </section>

      {/* Main Card */}
      <div className="w-full max-w-2xl rounded-[2.5rem] border shadow-2xl overflow-hidden p-8 md:p-12" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
        
        {/* Output Box */}
        <div className="relative w-full mb-8 group">
            <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--accent-subtle)] to-transparent opacity-20 rounded-2xl blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-4 p-5 md:p-6 rounded-2xl border bg-[color:var(--page-bg)] border-[color:var(--card-border)] shadow-inner">
                <div className="w-full overflow-hidden">
                    <div className="text-2xl md:text-3xl font-mono font-bold tracking-wider break-all leading-tight" style={{ color: "var(--text-primary)" }}>
                        {password}
                    </div>
                </div>
                
                <div className="flex items-center gap-2 w-full md:w-auto shrink-0 mt-4 md:mt-0">
                    <button
                        onClick={generatePassword}
                        className="flex-1 md:flex-none p-4 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 border bg-[color:var(--card-bg)] hover:bg-[color:var(--accent-subtle)]"
                        style={{ borderColor: "var(--card-border)", color: "var(--text-primary)" }}
                        title="Generate New"
                    >
                        <RefreshCcw size={20} />
                    </button>
                    <button
                        onClick={handleCopy}
                        className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-sm transition-all shadow-lg hover:scale-105 active:scale-95"
                        style={{ background: copied ? "#10b981" : "var(--accent)", color: "var(--page-bg)" }}
                    >
                        {copied ? <Check size={20} /> : <Copy size={20} />}
                        <span className="md:hidden">{copied ? "Copied" : "Copy"}</span>
                    </button>
                </div>
            </div>
            
            {/* Strength Indicator */}
            <div className="flex items-center gap-2 mt-4 px-2">
                <div className="flex gap-1 flex-1 h-2">
                    {[...Array(6)].map((_, i) => (
                        <div 
                            key={i} 
                            className="h-full flex-1 rounded-full transition-all duration-500"
                            style={{ background: i < score ? strengthData.color : "var(--card-border)" }}
                        ></div>
                    ))}
                </div>
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest w-28 justify-end" style={{ color: strengthData.color }}>
                    {strengthData.icon} {strengthData.label}
                </div>
            </div>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--card-border)] to-transparent my-10"></div>

        {/* Configuration */}
        <div className="space-y-8">
            <div className="flex items-center gap-3 mb-6">
                <Settings2 size={24} style={{ color: "var(--text-muted)" }} />
                <h3 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>Configuration</h3>
            </div>
            
            {/* Length Slider */}
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <label className="font-bold uppercase tracking-widest text-xs" style={{ color: "var(--text-secondary)" }}>Password Length</label>
                    <div className="px-4 py-1.5 rounded-lg border font-black text-lg font-mono shadow-inner" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--accent)" }}>
                        {length}
                    </div>
                </div>
                <input
                    type="range"
                    min="6"
                    max="64"
                    value={length}
                    onChange={(e) => setLength(Number(e.target.value))}
                    className="w-full h-3 bg-[color:var(--card-border)] rounded-full appearance-none cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ 
                        accentColor: "var(--accent)"
                    }}
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                {[
                    { label: "Uppercase (A-Z)", state: includeUppercase, setter: setIncludeUppercase },
                    { label: "Numbers (0-9)", state: includeNumbers, setter: setIncludeNumbers },
                    { label: "Symbols (!@#$)", state: includeSymbols, setter: setIncludeSymbols },
                ].map(({ label, state, setter }) => (
                    <label key={label} className="flex items-center gap-3 p-4 rounded-2xl border cursor-pointer group transition-all" style={{ background: state ? "var(--accent-subtle)" : "var(--page-bg)", borderColor: state ? "var(--accent)" : "var(--card-border)" }}>
                        <div className="relative flex items-center justify-center w-6 h-6 rounded-md border transition-all" style={{ background: state ? "var(--accent)" : "transparent", borderColor: state ? "var(--accent)" : "var(--text-muted)" }}>
                            {state && <Check size={14} style={{ color: "var(--page-bg)" }} strokeWidth={4} />}
                        </div>
                        <input 
                            type="checkbox" 
                            checked={state} 
                            onChange={(e) => setter(e.target.checked)}
                            className="hidden"
                        />
                        <span className="font-bold text-xs uppercase tracking-wider transition-colors" style={{ color: state ? "var(--text-primary)" : "var(--text-muted)" }}>{label}</span>
                    </label>
                ))}
            </div>

        </div>

      </div>

    </div>
  );
}
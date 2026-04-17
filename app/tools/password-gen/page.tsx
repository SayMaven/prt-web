"use client";

import { useState, useEffect } from "react";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "abcdefghijklmnopqrstuvwxyz";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+~`|}{[]:;?><,./-=";

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      generatedPassword += charset[randomIndex];
    }
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
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2 tool-title">Password Generator</h1>
        <p style={{ color: "var(--accent-text)" }}>Buat password kuat dan aman dalam hitungan detik.</p>
      </div>

      {/* Result Box */}
      <div className="tool-card p-6 rounded-xl relative group">
        <div className="text-2xl font-mono font-bold text-center break-all tracking-wider tool-title">
          {password}
        </div>
        
        <button
          onClick={handleCopy}
          className="absolute top-1/2 -translate-y-1/2 right-4 p-2 rounded-lg transition-all hover:scale-110"
          style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}
          title="Copy to Clipboard"
        >
          {copied ? (
            <span className="text-sm font-bold text-green-500">Copied!</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Settings */}
      <div className="tool-card p-6 rounded-xl space-y-6">
        
        {/* Length Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium tool-body">Panjang Karakter</label>
            <span className="font-bold px-2 py-1 rounded-md text-sm" style={{ background: "var(--accent-subtle)", color: "var(--accent-text)" }}>
              {length}
            </span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            style={{ accentColor: "var(--accent)" }}
          />
        </div>

        {/* Checkbox Options */}
        <div className="space-y-3">
          {[
            { label: "Huruf Besar (A-Z)", state: includeUppercase, setter: setIncludeUppercase },
            { label: "Angka (0-9)", state: includeNumbers, setter: setIncludeNumbers },
            { label: "Simbol (!@#$)", state: includeSymbols, setter: setIncludeSymbols },
          ].map(({ label, state, setter }) => (
            <label key={label} className="flex items-center space-x-3 cursor-pointer group/c">
              <input 
                type="checkbox" 
                checked={state} 
                onChange={(e) => setter(e.target.checked)}
                className="w-5 h-5 rounded focus:ring-0 cursor-pointer"
                style={{ accentColor: "var(--accent)" }}
              />
              <span className="tool-body group-hover/c:text-[var(--text-primary)] transition-colors">{label}</span>
            </label>
          ))}
        </div>

        {/* Generate Button */}
        <button
          onClick={generatePassword}
          className="tool-btn-primary w-full py-3 font-bold rounded-lg transition-all hover:opacity-90 active:scale-95"
        >
          Generate Password Baru 🔄
        </button>

      </div>

    </div>
  );
}
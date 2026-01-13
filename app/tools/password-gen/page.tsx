"use client";

import { useState, useEffect } from "react";

export default function PasswordGenerator() {
  // State untuk menyimpan konfigurasi
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  // Logic: Fungsi Membuat Password
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
    setCopied(false); // Reset status copy
  };

  // Logic: Fungsi Copy ke Clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Balikin teks setelah 2 detik
  };

  // Generate otomatis saat pertama kali dibuka
  useEffect(() => {
    generatePassword();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-xl mx-auto space-y-8">
      
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Password Generator</h1>
        <p className="text-emerald-500">Buat password kuat dan aman dalam hitungan detik.</p>
      </div>

      {/* Box Hasil Password */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative group">
        <div className="text-2xl font-mono font-bold text-center break-all tracking-wider text-gray-800">
          {password}
        </div>
        
        {/* Tombol Copy Absolute di kanan */}
        <button
          onClick={handleCopy}
          className="absolute top-1/2 -translate-y-1/2 right-4 p-2 bg-gray-100 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-lg transition-colors"
          title="Copy to Clipboard"
        >
          {copied ? (
            <span className="text-sm font-bold text-green-600">Copied!</span>
          ) : (
            // Ikon Copy sederhana
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          )}
        </button>
      </div>

      {/* Kontrol / Setting */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
        
        {/* Slider Panjang Karakter */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="font-medium text-gray-700">Panjang Karakter</label>
            <span className="font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">{length}</span>
          </div>
          <input
            type="range"
            min="6"
            max="32"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
        </div>

        {/* Checkbox Options */}
        <div className="space-y-3">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeUppercase} 
              onChange={(e) => setIncludeUppercase(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
            />
            <span className="text-gray-700">Huruf Besar (A-Z)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeNumbers} 
              onChange={(e) => setIncludeNumbers(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
            />
            <span className="text-gray-700">Angka (0-9)</span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeSymbols} 
              onChange={(e) => setIncludeSymbols(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500" 
            />
            <span className="text-gray-700">Simbol (!@#$)</span>
          </label>
        </div>

        {/* Tombol Generate Ulang */}
        <button
          onClick={generatePassword}
          className="w-full py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-transform active:scale-95"
        >
          Generate Password Baru 🔄
        </button>

      </div>

    </div>
  );
}
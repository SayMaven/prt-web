"use client";

import { useState, useEffect } from "react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  // Daftar Mata Uang Populer
  const currencies = [
    "USD", "IDR", "EUR", "GBP", "JPY", "SGD", "MYR", "AUD", "CNY", "KRW"
  ];

  // Fungsi Fetch Data dari API
  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        // Kita ambil data berdasarkan 'fromCurrency'
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await res.json();
        
        // Ambil nilai tukar untuk 'toCurrency'
        const newRate = data.rates[toCurrency];
        setRate(newRate);
        setLastUpdate(data.date);
      } catch (error) {
        console.error("Gagal mengambil data kurs", error);
        alert("Gagal koneksi ke server mata uang.");
      } finally {
        setLoading(false);
      }
    };

    fetchRates();
  }, [fromCurrency, toCurrency]); // Jalankan ulang jika mata uang berubah

  // Fungsi Tukar Posisi (Swap)
  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
      
      {/* Header Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-xs font-mono text-green-400">LIVE DATA</span>
        </div>
        <span className="text-xs text-slate-500">Update: {lastUpdate}</span>
      </div>

      {/* Area Input */}
      <div className="space-y-4 relative">
        
        {/* Input Dari (From) */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
            <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Jumlah</label>
                <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="bg-transparent text-2xl font-bold text-white w-full outline-none"
                />
            </div>
            <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="bg-slate-800 text-white font-bold p-2 rounded-lg outline-none border border-slate-600 cursor-pointer"
            >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>

        {/* Tombol Swap (Di Tengah) */}
        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-10">
            <button 
                onClick={handleSwap}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg border-4 border-[#0f172a] transition-transform hover:rotate-180"
            >
                ⇅
            </button>
        </div>

        {/* Input Ke (To) - Read Only */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
            <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Dikonversi ke</label>
                <div className="text-2xl font-bold text-blue-400 w-full overflow-hidden text-ellipsis">
                    {loading ? "Loading..." : (amount * rate).toLocaleString("id-ID")}
                </div>
            </div>
            <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="bg-slate-800 text-white font-bold p-2 rounded-lg outline-none border border-slate-600 cursor-pointer"
            >
                {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
        </div>

      </div>

      {/* Info Rate */}
      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
            Nilai Tukar Saat Ini: <br/>
            <span className="text-white font-mono">1 {fromCurrency} = {rate.toLocaleString("id-ID")} {toCurrency}</span>
        </p>
      </div>

    </div>
  );
}
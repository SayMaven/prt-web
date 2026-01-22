"use client";

import { useState, useEffect } from "react";

export default function CurrencyConverter() {
  // 1. UPDATE: Izinkan state berupa number ATAU string kosong
  const [amount, setAmount] = useState<number | string>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  const currencies = [
    "USD", "IDR", "EUR", "GBP", "JPY", "SGD", "MYR", "AUD", "CNY", "KRW", "CHF", "INR", "CAD"
  ];

  useEffect(() => {
    const fetchRates = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
        const data = await res.json();
        
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
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl">
      
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

      <div className="space-y-4 relative">
        
        {/* Input Dari (From) */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
            <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Jumlah</label>
                <input 
                    type="number" 
                    value={amount}
                    placeholder="0" // Placeholder muncul saat state kosong
                    // 2. UPDATE: Logic onChange agar tidak memaksa jadi 0
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") {
                            setAmount(""); // Set string kosong agar input bersih
                        } else {
                            // Convert ke number, tapi jangan parse jika user ngetik "0." (desimal)
                            // Cara paling aman untuk UX angka adalah simpan value as is atau cast parseFloat
                            setAmount(Number(val));
                        }
                    }}
                    className="bg-transparent text-2xl font-bold text-white w-full outline-none placeholder:text-slate-600"
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

        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-10">
            <button 
                onClick={handleSwap}
                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full shadow-lg border-4 border-[#0f172a] transition-transform hover:rotate-180"
            >
                ⇅
            </button>
        </div>

        {/* Input Ke (To) */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700 flex items-center gap-4">
            <div className="flex-1">
                <label className="text-xs text-slate-400 block mb-1">Dikonversi ke</label>
                <div className="text-2xl font-bold text-blue-400 w-full overflow-hidden text-ellipsis">
                    {/* 3. UPDATE: Pastikan amount di-convert ke Number() sebelum dikali */}
                    {loading ? "Loading..." : (Number(amount) * rate).toLocaleString("id-ID")}
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

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-400">
            Nilai Tukar Saat Ini: <br/>
            <span className="text-white font-mono">1 {fromCurrency} = {rate.toLocaleString("id-ID")} {toCurrency}</span>
        </p>
      </div>

    </div>
  );
}
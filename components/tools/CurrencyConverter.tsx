"use client";

import { useState, useEffect } from "react";
import { ArrowUpDown, RefreshCcw, Coins } from "lucide-react";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | string>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("IDR");
  const [rate, setRate] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState("");

  // Ditambahkan lebih banyak mata uang & diurutkan alfabetis
  const currencies = [
    "USD", "IDR", "EUR", "GBP", "JPY", "SGD", "MYR", "AUD", "CNY", "KRW", "CHF", "INR", "CAD", 
    "THB", "PHP", "VND", "HKD", "TWD", "NZD", "ZAR", "BRL", "MXN", "RUB", "TRY", "AED", "SAR"
  ].sort();

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

  useEffect(() => {
    fetchRates();
  }, [fromCurrency, toCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const setQuickAmount = (val: number) => {
    setAmount(val);
  }

  const numericAmount = Number(amount) || 0;

  return (
    <div className="max-w-xl mx-auto p-6 md:p-8 rounded-3xl border shadow-2xl backdrop-blur-md" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)" }}>
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: "var(--accent)" }}></span>
              <span className="relative inline-flex rounded-full h-3 w-3" style={{ background: "var(--accent)" }}></span>
            </span>
            <span className="text-xs font-mono font-bold tracking-wider" style={{ color: "var(--accent)" }}>LIVE RATES</span>
        </div>
        <button onClick={fetchRates} className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all hover:scale-105 active:scale-95" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }} onMouseEnter={e => {e.currentTarget.style.color = "var(--text-primary)"; e.currentTarget.style.borderColor = "var(--accent)"}} onMouseLeave={e => {e.currentTarget.style.color = "var(--text-secondary)"; e.currentTarget.style.borderColor = "var(--card-border)"}}>
            <RefreshCcw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      <div className="space-y-3 relative">
        
        {/* Input Dari (From) */}
        <div className="p-5 rounded-2xl border transition-colors group" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }} onMouseEnter={e => e.currentTarget.style.borderColor="var(--accent)"} onMouseLeave={e => e.currentTarget.style.borderColor="var(--card-border)"}>
            <div className="flex justify-between items-end mb-3">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Amount</label>
                <div className="flex gap-1.5">
                    {[10, 100, 1000].map(val => (
                        <button key={val} onClick={() => setQuickAmount(val)} className="text-[10px] px-2 py-0.5 rounded-md border transition-colors font-mono" style={{ background: "var(--card-bg)", borderColor: "var(--card-border)", color: "var(--text-secondary)" }} onMouseEnter={e => {e.currentTarget.style.borderColor="var(--accent)"; e.currentTarget.style.color="var(--accent)"}} onMouseLeave={e => {e.currentTarget.style.borderColor="var(--card-border)"; e.currentTarget.style.color="var(--text-secondary)"}}>
                            +{val}
                        </button>
                    ))}
                </div>
            </div>
            <div className="flex items-center gap-4">
                <input 
                    type="number" 
                    value={amount}
                    placeholder="0" 
                    onChange={(e) => {
                        const val = e.target.value;
                        if (val === "") setAmount("");
                        else setAmount(Number(val));
                    }}
                    className="bg-transparent text-4xl md:text-5xl font-extrabold w-full outline-none"
                    style={{ color: "var(--text-primary)" }}
                />
                <select 
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="font-bold p-2.5 rounded-xl outline-none border cursor-pointer appearance-none text-center min-w-[90px] shadow-sm transition-colors hover:border-[color:var(--accent)]"
                    style={{ background: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

        <div className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 top-1/2 z-10 flex items-center justify-center">
            <button 
                onClick={handleSwap}
                className="p-3.5 rounded-full shadow-xl border-4 transition-transform hover:rotate-180 active:scale-95"
                style={{ background: "var(--accent)", borderColor: "var(--card-bg)", color: "var(--page-bg)" }}
            >
                <ArrowUpDown size={20} strokeWidth={3} />
            </button>
        </div>

        {/* Input Ke (To) */}
        <div className="p-5 rounded-2xl border transition-colors" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
            <div className="flex justify-between items-end mb-3">
                <label className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>Converted To</label>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-4xl md:text-5xl font-extrabold w-full overflow-hidden text-ellipsis truncate" style={{ color: "var(--accent)" }}>
                    {loading ? "..." : (numericAmount * rate).toLocaleString("id-ID", { maximumFractionDigits: 4 })}
                </div>
                <select 
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="font-bold p-2.5 rounded-xl outline-none border cursor-pointer appearance-none text-center min-w-[90px] shadow-sm transition-colors hover:border-[color:var(--accent)]"
                    style={{ background: "var(--card-bg)", color: "var(--text-primary)", borderColor: "var(--card-border)" }}
                >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
            </div>
        </div>

      </div>

      <div className="mt-6 flex flex-col md:flex-row items-center justify-between p-4 rounded-xl border border-dashed gap-4 text-center md:text-left" style={{ background: "var(--page-bg)", borderColor: "var(--card-border)" }}>
        <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-lg" style={{ background: "var(--accent-subtle)", color: "var(--accent)" }}>
               <Coins size={22} />
            </div>
            <div>
               <p className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>Current Exchange Rate</p>
               <p className="text-sm font-mono font-bold" style={{ color: "var(--text-primary)" }}>1 {fromCurrency} = {rate.toLocaleString("id-ID", { maximumFractionDigits: 6 })} {toCurrency}</p>
            </div>
        </div>
        <p className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
            Last Update<br/>
            <span style={{ color: "var(--text-muted)" }}>{lastUpdate}</span>
        </p>
      </div>

    </div>
  );
}
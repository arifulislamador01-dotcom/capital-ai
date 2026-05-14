'use client';
import { useState, useEffect } from 'react';
export default function DollarGoldRatePage() {
  const [usdRate, setUsdRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('https://api.exchangerate-api.com/v4/latest/USD')
      .then(r => r.json())
      .then(d => { setUsdRate(d.rates?.BDT || 120); setLoading(false); })
      .catch(() => { setUsdRate(120); setLoading(false); });
  }, []);
  const goldPerOz = 2350; // approx USD
  const goldBDT = usdRate ? Math.round(goldPerOz * usdRate) : 0;
  const goldPerBhori = Math.round(goldBDT / 2.66); // 1 bhori ≈ 11.664g, 1 oz = 31.1g
  const goldPerGram = Math.round(goldBDT / 31.1);
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">💰</span><h1 className="text-2xl font-bold font-display">ডলার ও গোল্ড রেট</h1></div>
        <p className="text-gray-400 font-bengali">লাইভ ডলার ও স্বর্ণের দাম</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="skeleton h-24 w-full" />)}</div> : <>
        <div className="glass-card p-6 text-center bg-green-500/5 border border-green-500/20">
          <span className="text-4xl">💵</span>
          <p className="text-sm text-gray-400 mt-2">US Dollar → BDT</p>
          <p className="text-5xl font-extrabold text-gradient mt-2">৳{usdRate?.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">1 USD = ৳{usdRate?.toFixed(2)} BDT</p>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 text-center bg-yellow-500/5 border border-yellow-500/20">
            <span className="text-3xl">🥇</span>
            <p className="text-xs text-gray-400 mt-2">প্রতি ভরি</p>
            <p className="text-2xl font-extrabold text-yellow-400 mt-1">৳{goldPerBhori.toLocaleString()}</p>
          </div>
          <div className="glass-card p-6 text-center bg-yellow-500/5 border border-yellow-500/20">
            <span className="text-3xl">✨</span>
            <p className="text-xs text-gray-400 mt-2">প্রতি গ্রাম</p>
            <p className="text-2xl font-extrabold text-yellow-400 mt-1">৳{goldPerGram.toLocaleString()}</p>
          </div>
        </div>
        <div className="glass-card p-4 text-center text-xs text-gray-500">⚠️ দাম আনুমানিক — আন্তর্জাতিক বাজারের উপর ভিত্তি করে হিসাব করা</div>
      </>}
    </div>
  );
}

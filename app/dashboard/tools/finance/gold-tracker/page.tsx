'use client';
import { useState } from 'react';
export default function GoldTrackerPage() {
  const [goldBDT, setGoldBDT] = useState<number|null>(null);
  const [usdBDT, setUsdBDT] = useState<number|null>(null);
  useState(() => { fetch('https://api.exchangerate-api.com/v4/latest/USD').then(r=>r.json()).then(d=> setUsdBDT(d.rates.BDT)).catch(()=>setUsdBDT(120)); });
  const approxGold = usdBDT ? Math.round(usdBDT * 2400) : null; // approx per ounce
  const perBhori = approxGold ? Math.round(approxGold / 2.66) : null; // 1 bhori ~ 11.66g, 1 oz = 31.1g
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🥇</span><h1 className="text-2xl font-bold font-display">গোল্ড/ডলার রেট</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-6 text-center"><span className="text-3xl">💵</span><p className="text-xs text-gray-500 mt-2">USD → BDT</p><p className="text-3xl font-bold text-gradient mt-1">৳{usdBDT?.toFixed(2) || '...'}</p></div>
        <div className="glass-card p-6 text-center"><span className="text-3xl">🥇</span><p className="text-xs text-gray-500 mt-2">Gold/ভরি (আনুমানিক)</p><p className="text-3xl font-bold text-gradient mt-1">৳{perBhori?.toLocaleString() || '...'}</p></div>
      </div>
      <div className="glass-card p-4 text-center text-xs text-gray-500">⚠️ দাম আনুমানিক — সর্বশেষ আপডেটের জন্য আপনার ব্যাংক দেখুন</div>
    </div>
  );
}

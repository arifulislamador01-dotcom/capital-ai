'use client';
import { useState, useEffect } from 'react';
export default function CryptoTrackerPage() {
  const [data, setData] = useState<any>(null);
  const coins = ['bitcoin', 'ethereum', 'binancecoin', 'solana', 'dogecoin', 'cardano'];
  useEffect(() => { fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coins.join(',')}&vs_currencies=usd,bdt&include_24hr_change=true`).then(r => r.json()).then(setData).catch(() => {}); }, []);
  const names: Record<string, string> = { bitcoin: 'Bitcoin', ethereum: 'Ethereum', binancecoin: 'BNB', solana: 'Solana', dogecoin: 'Dogecoin', cardano: 'Cardano' };
  const icons: Record<string, string> = { bitcoin: '₿', ethereum: 'Ξ', binancecoin: '🔶', solana: '◎', dogecoin: '🐕', cardano: '🔵' };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">₿</span><h1 className="text-2xl font-bold font-display">ক্রিপ্টো ট্র্যাকার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="space-y-3">
        {data ? coins.map(c => data[c] && <div key={c} className="glass-card p-5 flex items-center justify-between">
          <div className="flex items-center gap-3"><span className="text-2xl">{icons[c]}</span><div><p className="font-semibold text-white">{names[c]}</p><p className="text-xs text-gray-500">{c.toUpperCase()}</p></div></div>
          <div className="text-right"><p className="text-lg font-bold text-white">${data[c].usd?.toLocaleString()}</p><p className="text-sm text-gray-400">৳{data[c].bdt?.toLocaleString()}</p></div>
        </div>) : <div className="space-y-3">{[1,2,3,4].map(i => <div key={i} className="skeleton h-20 w-full" />)}</div>}
      </div>
    </div>
  );
}

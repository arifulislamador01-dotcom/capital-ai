'use client';
import { useState } from 'react';
export default function EMICalculatorPage() {
  const [p, setP] = useState(''); const [r, setR] = useState(''); const [n, setN] = useState('');
  const calc = () => { const P = +p; const R = +r / 12 / 100; const N = +n; if (!P || !R || !N) return null; const emi = P * R * Math.pow(1+R, N) / (Math.pow(1+R, N) - 1); return { emi: emi.toFixed(0), total: (emi * N).toFixed(0), interest: (emi * N - P).toFixed(0) }; };
  const result = calc();
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🏦</span><h1 className="text-2xl font-bold font-display">EMI ক্যালকুলেটর</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <div><label className="text-sm text-gray-300 font-bengali">লোনের পরিমাণ (৳)</label><input type="number" value={p} onChange={e => setP(e.target.value)} placeholder="500000" className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300 font-bengali">সুদের হার (% বার্ষিক)</label><input type="number" value={r} onChange={e => setR(e.target.value)} placeholder="12" className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300 font-bengali">সময়কাল (মাস)</label><input type="number" value={n} onChange={e => setN(e.target.value)} placeholder="36" className="input-field mt-1" /></div>
      </div>
      {result && <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center"><p className="text-xs text-gray-500">মাসিক EMI</p><p className="text-2xl font-bold text-gradient">৳{(+result.emi).toLocaleString()}</p></div>
        <div className="glass-card p-5 text-center"><p className="text-xs text-gray-500">মোট সুদ</p><p className="text-2xl font-bold text-red-400">৳{(+result.interest).toLocaleString()}</p></div>
        <div className="glass-card p-5 text-center"><p className="text-xs text-gray-500">মোট পরিশোধ</p><p className="text-2xl font-bold text-white">৳{(+result.total).toLocaleString()}</p></div>
      </div>}
    </div>
  );
}

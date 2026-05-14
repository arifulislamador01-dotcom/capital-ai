'use client';
import { useState } from 'react';
export default function SIPCalculatorPage() {
  const [monthly, setMonthly] = useState(''); const [rate, setRate] = useState('12'); const [years, setYears] = useState('10');
  const calc = () => { const P = +monthly; const r = +rate / 12 / 100; const n = +years * 12; if (!P || !r || !n) return null;
    const fv = P * ((Math.pow(1+r, n) - 1) / r) * (1+r); const invested = P * n; return { fv: Math.round(fv), invested, gain: Math.round(fv - invested) }; };
  const result = calc();
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📈</span><h1 className="text-2xl font-bold font-display">SIP ক্যালকুলেটর</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <div><label className="text-sm text-gray-300">মাসিক বিনিয়োগ (৳)</label><input type="number" value={monthly} onChange={e => setMonthly(e.target.value)} placeholder="5000" className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300">প্রত্যাশিত রিটার্ন (% বার্ষিক)</label><input type="number" value={rate} onChange={e => setRate(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300">সময়কাল (বছর)</label><input type="number" value={years} onChange={e => setYears(e.target.value)} className="input-field mt-1" /></div>
      </div>
      {result && <div className="grid grid-cols-3 gap-4">
        <div className="glass-card p-5 text-center"><p className="text-xs text-gray-500">বিনিয়োগ</p><p className="text-xl font-bold text-white">৳{result.invested.toLocaleString()}</p></div>
        <div className="glass-card p-5 text-center"><p className="text-xs text-gray-500">লাভ</p><p className="text-xl font-bold text-green-400">৳{result.gain.toLocaleString()}</p></div>
        <div className="glass-card p-5 text-center"><p className="text-xs text-gray-500">মোট</p><p className="text-xl font-bold text-gradient">৳{result.fv.toLocaleString()}</p></div>
      </div>}
    </div>
  );
}

'use client';
import { useState } from 'react';
const UNITS: Record<string, { name: string; units: { name: string; factor: number }[] }> = {
  length: { name: '📏 দৈর্ঘ্য', units: [{ name: 'মিটার', factor: 1 }, { name: 'কিলোমিটার', factor: 0.001 }, { name: 'সেন্টিমিটার', factor: 100 }, { name: 'ফুট', factor: 3.28084 }, { name: 'ইঞ্চি', factor: 39.3701 }, { name: 'মাইল', factor: 0.000621371 }] },
  weight: { name: '⚖️ ওজন', units: [{ name: 'কেজি', factor: 1 }, { name: 'গ্রাম', factor: 1000 }, { name: 'পাউন্ড', factor: 2.20462 }, { name: 'আউন্স', factor: 35.274 }] },
  temp: { name: '🌡️ তাপমাত্রা', units: [{ name: '°C', factor: 1 }, { name: '°F', factor: 1 }, { name: 'K', factor: 1 }] },
  volume: { name: '🥤 আয়তন', units: [{ name: 'লিটার', factor: 1 }, { name: 'মিলিলিটার', factor: 1000 }, { name: 'গ্যালন', factor: 0.264172 }] },
};
export default function UnitConverterPage() {
  const [cat, setCat] = useState('length'); const [val, setVal] = useState('1'); const [from, setFrom] = useState(0); const [to, setTo] = useState(1);
  const convert = () => {
    const v = +val; const c = UNITS[cat];
    if (cat === 'temp') {
      const temps = [v, (v * 9/5) + 32, v + 273.15]; // C base
      return temps[to].toFixed(2);
    }
    return ((v / c.units[from].factor) * c.units[to].factor).toFixed(4);
  };
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📐</span><h1 className="text-2xl font-bold font-display">ইউনিট কনভার্টার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="flex gap-2 flex-wrap">{Object.entries(UNITS).map(([k, v]) => <button key={k} onClick={() => { setCat(k); setFrom(0); setTo(1); }} className={`px-3 py-1.5 rounded-lg text-sm ${cat === k ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400'}`}>{v.name}</button>)}</div>
      <div className="glass-card p-6 space-y-4">
        <input type="number" value={val} onChange={e => setVal(e.target.value)} className="input-field text-2xl font-bold" />
        <div className="grid grid-cols-2 gap-4">
          <select value={from} onChange={e => setFrom(+e.target.value)} className="input-field">{UNITS[cat].units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}</select>
          <select value={to} onChange={e => setTo(+e.target.value)} className="input-field">{UNITS[cat].units.map((u, i) => <option key={i} value={i}>{u.name}</option>)}</select>
        </div>
      </div>
      <div className="glass-card p-8 text-center"><p className="text-sm text-gray-400">{val} {UNITS[cat].units[from].name} =</p>
        <p className="text-4xl font-extrabold text-gradient mt-2">{convert()} {UNITS[cat].units[to].name}</p></div>
    </div>
  );
}

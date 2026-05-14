'use client';
import { useState } from 'react';
export default function ShippingCalcPage() {
  const [weight, setWeight] = useState('1'); const [zone, setZone] = useState('inside');
  const providers = [
    { name: 'Pathao', inside: 60, outside: 120, perKg: 15 },
    { name: 'Steadfast', inside: 70, outside: 130, perKg: 20 },
    { name: 'RedX', inside: 65, outside: 110, perKg: 15 },
    { name: 'Paperfly', inside: 55, outside: 100, perKg: 10 },
    { name: 'Sundarban', inside: 80, outside: 150, perKg: 25 },
  ];
  const w = +weight;
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📦</span><h1 className="text-2xl font-bold font-display">শিপিং কস্ট ক্যালকুলেটর</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <div><label className="text-sm text-gray-300">ওজন (কেজি)</label><input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="input-field mt-1" min="0.5" step="0.5" /></div>
        <div className="flex gap-2"><button onClick={() => setZone('inside')} className={`px-4 py-2 rounded-lg text-sm flex-1 ${zone==='inside'?'bg-primary-500 text-white':'bg-white/5 text-gray-400'}`}>ঢাকার ভিতরে</button>
          <button onClick={() => setZone('outside')} className={`px-4 py-2 rounded-lg text-sm flex-1 ${zone==='outside'?'bg-primary-500 text-white':'bg-white/5 text-gray-400'}`}>ঢাকার বাইরে</button></div>
      </div>
      <div className="space-y-3">{providers.map((p, i) => {
        const base = zone === 'inside' ? p.inside : p.outside;
        const extra = w > 1 ? Math.ceil(w - 1) * p.perKg : 0;
        const total = base + extra;
        return <div key={i} className="glass-card p-4 flex items-center justify-between">
          <div><p className="font-semibold text-white">{p.name}</p><p className="text-xs text-gray-500">বেস: ৳{base} + ৳{p.perKg}/কেজি</p></div>
          <p className="text-xl font-bold text-gradient">৳{total}</p>
        </div>;
      })}</div>
    </div>
  );
}

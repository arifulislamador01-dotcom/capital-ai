'use client';
import { useState } from 'react';
export default function DiscountCalcPage() {
  const [price, setPrice] = useState(''); const [discount, setDiscount] = useState(''); const [tip, setTip] = useState('');
  const p = +price; const d = +discount; const t = +tip;
  const discounted = p > 0 && d > 0 ? p - (p * d / 100) : 0;
  const tipAmount = p > 0 && t > 0 ? p * t / 100 : 0;
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🏷️</span><h1 className="text-2xl font-bold font-display">ডিসকাউন্ট/টিপ ক্যালকুলেটর</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <div><label className="text-sm text-gray-300">মূল্য (৳)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="1000" className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300">ডিসকাউন্ট (%)</label><input type="number" value={discount} onChange={e => setDiscount(e.target.value)} placeholder="20" className="input-field mt-1" />
          <div className="flex gap-2 mt-2">{[10,15,20,25,30,50].map(v => <button key={v} onClick={() => setDiscount(v.toString())} className="text-xs bg-white/5 text-gray-400 px-2 py-1 rounded hover:bg-white/10">{v}%</button>)}</div></div>
        <div><label className="text-sm text-gray-300">টিপ (%)</label><input type="number" value={tip} onChange={e => setTip(e.target.value)} placeholder="10" className="input-field mt-1" /></div>
      </div>
      {p > 0 && <div className="glass-card p-6 space-y-3">
        {d > 0 && <div className="flex justify-between"><span className="text-gray-400">ডিসকাউন্ট সেভ</span><span className="text-green-400 font-bold">-৳{(p * d / 100).toFixed(0)}</span></div>}
        {d > 0 && <div className="flex justify-between"><span className="text-gray-400">ডিসকাউন্ট পরে</span><span className="text-white font-bold">৳{discounted.toFixed(0)}</span></div>}
        {t > 0 && <div className="flex justify-between"><span className="text-gray-400">টিপ</span><span className="text-primary-400 font-bold">+৳{tipAmount.toFixed(0)}</span></div>}
        <div className="border-t border-white/10 pt-3 flex justify-between"><span className="text-white font-semibold">সর্বমোট</span><span className="text-2xl font-bold text-gradient">৳{((discounted || p) + tipAmount).toFixed(0)}</span></div>
      </div>}
    </div>
  );
}

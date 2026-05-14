'use client';
import { useState } from 'react';
export default function TaxCalculatorPage() {
  const [income, setIncome] = useState(''); const [type, setType] = useState('vat');
  const calcVAT = (a: number) => ({ vat: a * 0.15, total: a * 1.15 });
  const calcTax = (a: number) => { let tax = 0; const slabs = [[350000,0],[100000,0.05],[300000,0.1],[400000,0.15],[500000,0.2],[Infinity,0.25]]; let rem = a;
    for (const [limit, rate] of slabs) { const t = Math.min(rem, limit as number); tax += t * (rate as number); rem -= t; if (rem <= 0) break; } return { tax, effective: ((tax/a)*100).toFixed(1) }; };
  const amt = +income;
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📊</span><h1 className="text-2xl font-bold font-display">ট্যাক্স/VAT ক্যালকুলেটর</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <div className="flex gap-2"><button onClick={() => setType('vat')} className={`px-4 py-2 rounded-lg text-sm ${type==='vat'?'bg-primary-500 text-white':'bg-white/5 text-gray-400'}`}>VAT (15%)</button>
          <button onClick={() => setType('income')} className={`px-4 py-2 rounded-lg text-sm ${type==='income'?'bg-primary-500 text-white':'bg-white/5 text-gray-400'}`}>Income Tax</button></div>
        <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder={type === 'vat' ? 'পণ্যের মূল্য (৳)' : 'বার্ষিক আয় (৳)'} className="input-field" />
      </div>
      {amt > 0 && type === 'vat' && <div className="glass-card p-6 grid grid-cols-2 gap-4 text-center">
        <div><p className="text-xs text-gray-500">VAT (15%)</p><p className="text-2xl font-bold text-red-400">৳{calcVAT(amt).vat.toLocaleString()}</p></div>
        <div><p className="text-xs text-gray-500">সর্বমোট</p><p className="text-2xl font-bold text-gradient">৳{calcVAT(amt).total.toLocaleString()}</p></div></div>}
      {amt > 0 && type === 'income' && <div className="glass-card p-6 grid grid-cols-2 gap-4 text-center">
        <div><p className="text-xs text-gray-500">ট্যাক্স</p><p className="text-2xl font-bold text-red-400">৳{calcTax(amt).tax.toLocaleString()}</p></div>
        <div><p className="text-xs text-gray-500">কার্যকর হার</p><p className="text-2xl font-bold text-gradient">{calcTax(amt).effective}%</p></div></div>}
    </div>
  );
}

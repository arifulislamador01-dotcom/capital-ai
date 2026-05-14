'use client';
import { useState } from 'react';
const BANKS = [
  { name: 'সোনালী ব্যাংক', fd: 5.5, savings: 2.5 },
  { name: 'জনতা ব্যাংক', fd: 5.0, savings: 2.0 },
  { name: 'ডাচ-বাংলা ব্যাংক', fd: 6.0, savings: 3.0 },
  { name: 'ব্র্যাক ব্যাংক', fd: 5.75, savings: 2.5 },
  { name: 'ইসলামী ব্যাংক', fd: 6.5, savings: 3.5 },
  { name: 'সিটি ব্যাংক', fd: 5.5, savings: 2.75 },
  { name: 'ইস্টার্ন ব্যাংক', fd: 6.0, savings: 3.0 },
  { name: 'ওয়ান ব্যাংক', fd: 7.0, savings: 3.5 },
];
export default function BankInterestPage() {
  const [amount, setAmount] = useState('100000'); const [years, setYears] = useState('1');
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🏦</span><h1 className="text-2xl font-bold font-display">ব্যাংক সুদ ক্যালকুলেটর</h1></div></div>
      <div className="glass-card p-6 grid grid-cols-2 gap-4">
        <div><label className="text-sm text-gray-300">জমার পরিমাণ (৳)</label><input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300">সময়কাল (বছর)</label><input type="number" value={years} onChange={e => setYears(e.target.value)} className="input-field mt-1" /></div>
      </div>
      <div className="space-y-3">{BANKS.map((b, i) => {
        const interest = +amount * b.fd / 100 * +years;
        return <div key={i} className="glass-card p-4 flex items-center justify-between">
          <div><p className="font-semibold text-white font-bengali">{b.name}</p>
            <p className="text-xs text-gray-500">FDR: {b.fd}% | সঞ্চয়ী: {b.savings}%</p></div>
          <div className="text-right"><p className="text-lg font-bold text-gradient">৳{Math.round(interest).toLocaleString()}</p><p className="text-xs text-gray-500">সুদ ({+years} বছরে)</p></div>
        </div>;
      })}</div>
    </div>
  );
}

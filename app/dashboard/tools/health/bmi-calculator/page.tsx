'use client';
import { useState } from 'react';

export default function BMICalculatorPage() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState<number | null>(null);

  const calculate = () => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (w > 0 && h > 0) setBmi(parseFloat((w / (h * h)).toFixed(1)));
  };

  const getCategory = (b: number) => {
    if (b < 18.5) return { label: 'কম ওজন', color: 'text-blue-400', bg: 'bg-blue-500/20' };
    if (b < 25) return { label: 'স্বাভাবিক ✅', color: 'text-green-400', bg: 'bg-green-500/20' };
    if (b < 30) return { label: 'অতিরিক্ত ওজন', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { label: 'স্থূলকায়', color: 'text-red-400', bg: 'bg-red-500/20' };
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⚖️</span>
          <h1 className="text-2xl font-bold font-display">BMI ক্যালকুলেটর</h1>
        </div>
        <p className="text-gray-400 font-bengali">আপনার BMI (Body Mass Index) মাপুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-300 font-bengali">ওজন (কেজি)</label>
          <input type="number" value={weight} onChange={e => setWeight(e.target.value)} placeholder="65" className="input-field mt-1" />
        </div>
        <div>
          <label className="text-sm text-gray-300 font-bengali">উচ্চতা (সেন্টিমিটার)</label>
          <input type="number" value={height} onChange={e => setHeight(e.target.value)} placeholder="170" className="input-field mt-1" />
        </div>
        <button onClick={calculate} disabled={!weight || !height} className="btn-glow w-full disabled:opacity-50">⚖️ BMI হিসাব করো</button>
      </div>

      {bmi !== null && (
        <div className="glass-card p-8 text-center space-y-4">
          <p className="text-sm text-gray-400 font-bengali">আপনার BMI</p>
          <p className="text-6xl font-extrabold text-gradient">{bmi}</p>
          <div className={`inline-block px-4 py-2 rounded-full ${getCategory(bmi).bg}`}>
            <span className={`font-semibold font-bengali ${getCategory(bmi).color}`}>{getCategory(bmi).label}</span>
          </div>
          <div className="mt-4 w-full h-3 bg-white/5 rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-500 w-[18.5%]" />
            <div className="h-full bg-green-500 w-[6.5%]" />
            <div className="h-full bg-yellow-500 w-[5%]" />
            <div className="h-full bg-red-500 flex-1" />
          </div>
          <div className="flex justify-between text-[10px] text-gray-500 px-1">
            <span>কম ওজন</span><span>স্বাভাবিক</span><span>অতিরিক্ত</span><span>স্থূলকায়</span>
          </div>
        </div>
      )}
    </div>
  );
}

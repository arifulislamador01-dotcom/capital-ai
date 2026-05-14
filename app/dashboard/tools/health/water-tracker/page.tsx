'use client';
import { useState, useEffect } from 'react';
export default function WaterTrackerPage() {
  const [glasses, setGlasses] = useState(0); const goal = 8;
  useEffect(() => { const saved = localStorage.getItem('water-today'); if (saved) { const d = JSON.parse(saved); if (d.date === new Date().toDateString()) setGlasses(d.count); } }, []);
  const add = () => { const n = glasses + 1; setGlasses(n); localStorage.setItem('water-today', JSON.stringify({ date: new Date().toDateString(), count: n })); };
  const pct = Math.min(100, (glasses / goal) * 100);
  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div><div className="flex items-center justify-center gap-3 mb-2"><span className="text-3xl">💧</span><h1 className="text-2xl font-bold font-display">পানি ট্র্যাকার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">ফ্রি</span></div>
      <div className="glass-card p-8">
        <div className="w-40 h-40 rounded-full mx-auto border-4 border-primary-500/30 flex items-center justify-center relative overflow-hidden">
          <div className="absolute bottom-0 w-full bg-blue-500/30 transition-all duration-500" style={{ height: `${pct}%` }} />
          <div className="relative z-10"><p className="text-4xl font-extrabold text-gradient">{glasses}</p><p className="text-xs text-gray-400">/ {goal} গ্লাস</p></div>
        </div>
        <p className="mt-4 text-sm text-gray-400">{glasses >= goal ? '🎉 আজকের লক্ষ্য পূরণ!' : `আরও ${goal - glasses} গ্লাস বাকি`}</p>
      </div>
      <button onClick={add} className="btn-glow w-full">💧 ১ গ্লাস পানি খেলাম</button>
      <button onClick={() => { setGlasses(0); localStorage.removeItem('water-today'); }} className="btn-outline w-full text-sm">🔄 রিসেট</button>
    </div>
  );
}

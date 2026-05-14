'use client';
import { useState } from 'react';
const ROUTES = [
  { name: 'মিরপুর - মতিঝিল', buses: ['বিআরটিসি ১', 'হানিফ ৭'], fare: '৳25-35' },
  { name: 'উত্তরা - সদরঘাট', buses: ['গ্রিনলাইন', 'রয়্যাল'], fare: '৳40-60' },
  { name: 'গুলশান - ধানমন্ডি', buses: ['বিআরটিসি ৫'], fare: '৳20-30' },
  { name: 'মোহাম্মদপুর - গুলিস্তান', buses: ['লোকাল বাস'], fare: '৳15-25' },
  { name: 'বনানী - মতিঝিল', buses: ['সিটি বাস', 'বিআরটিসি'], fare: '৳20-30' },
  { name: 'যাত্রাবাড়ী - মিরপুর', buses: ['বিআরটিসি ৩'], fare: '৳30-40' },
  { name: 'রামপুরা - মহাখালী', buses: ['লোকাল বাস'], fare: '৳15-20' },
  { name: 'খিলগাঁও - ফার্মগেট', buses: ['সিটি বাস'], fare: '৳20-25' },
];
export default function BusRoutePage() {
  const [search, setSearch] = useState('');
  const filtered = ROUTES.filter(r => r.name.includes(search) || r.buses.some(b => b.includes(search)));
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🚌</span><h1 className="text-2xl font-bold font-display">ঢাকা বাস রুট</h1></div></div>
      <div className="glass-card p-4"><input value={search} onChange={e => setSearch(e.target.value)} placeholder="এলাকা বা বাসের নাম খুঁজুন..." className="input-field" /></div>
      <div className="space-y-3">{filtered.map((r, i) => <div key={i} className="glass-card p-4">
        <p className="font-semibold text-white font-bengali">{r.name}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex gap-2">{r.buses.map((b, j) => <span key={j} className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full">{b}</span>)}</div>
          <span className="text-green-400 font-semibold">{r.fare}</span>
        </div>
      </div>)}</div>
    </div>
  );
}

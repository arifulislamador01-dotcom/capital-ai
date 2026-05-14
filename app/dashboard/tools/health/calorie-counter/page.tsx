'use client';
import { useState } from 'react';
export default function CalorieCounterPage() {
  const [food, setFood] = useState(''); const [results, setResults] = useState<any[]>([]); const [loading, setLoading] = useState(false);
  const search = async () => { if (!food.trim()) return; setLoading(true);
    try { const r = await fetch(`https://world.openfoodfacts.org/cgi/search.pl?search_terms=${food}&json=1&page_size=5`); const d = await r.json(); setResults(d.products || []); } catch {} finally { setLoading(false); } };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🍎</span><h1 className="text-2xl font-bold font-display">ক্যালরি কাউন্টার</h1></div></div>
      <div className="glass-card p-6 flex gap-3"><input value={food} onChange={e => setFood(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="খাবারের নাম (English)..." className="input-field flex-1" />
        <button onClick={search} disabled={loading} className="btn-glow !px-6 disabled:opacity-50">🔍</button></div>
      {results.length > 0 && <div className="space-y-3">{results.map((p, i) => <div key={i} className="glass-card p-4 flex justify-between items-center">
        <div><p className="text-white font-semibold text-sm">{p.product_name || 'Unknown'}</p><p className="text-xs text-gray-500">{p.brands || ''}</p></div>
        <div className="text-right"><p className="text-lg font-bold text-gradient">{p.nutriments?.['energy-kcal_100g'] || '?'} kcal</p><p className="text-xs text-gray-500">per 100g</p></div>
      </div>)}</div>}
    </div>
  );
}

'use client';
import { useState } from 'react';
export default function StockPhotoPage() {
  const [query, setQuery] = useState(''); const [photos, setPhotos] = useState<any[]>([]); const [loading, setLoading] = useState(false);
  const search = async () => {
    if (!query.trim()) return; setLoading(true);
    try {
      const res = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=12`, {
        headers: { 'Authorization': `Client-ID ${process.env.NEXT_PUBLIC_UNSPLASH_KEY || 'demo'}` },
      });
      const data = await res.json();
      setPhotos(data.results || []);
    } catch { setPhotos([]); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📷</span><h1 className="text-2xl font-bold font-display">ফ্রি স্টক ফটো</h1></div>
        <p className="text-gray-400 font-bengali">Unsplash থেকে ফ্রি হাই-কোয়ালিটি ছবি খুঁজুন</p></div>
      <div className="glass-card p-4 flex gap-3">
        <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Search photos... (nature, office, food)" className="input-field flex-1" />
        <button onClick={search} disabled={loading} className="btn-glow !px-6 disabled:opacity-50">🔍</button>
      </div>
      {loading && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-48 w-full rounded-xl" />)}</div>}
      {photos.length > 0 && <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {photos.map((p: any) => <div key={p.id} className="group relative rounded-xl overflow-hidden border border-white/10">
          <img src={p.urls?.small} alt={p.alt_description} className="w-full h-48 object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
            <div className="flex-1"><p className="text-xs text-white truncate">{p.user?.name}</p></div>
            <a href={p.urls?.full} target="_blank" download className="text-xs bg-primary-500 text-white px-2 py-1 rounded">📥</a>
          </div>
        </div>)}
      </div>}
    </div>
  );
}

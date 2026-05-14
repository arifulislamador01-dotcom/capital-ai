'use client';
import { useState } from 'react';
export default function PosterPage() {
  const [title, setTitle] = useState(''); const [subtitle, setSubtitle] = useState('');
  const [bg, setBg] = useState('#1a1a2e'); const [accent, setAccent] = useState('#6366f1');
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🎨</span><h1 className="text-2xl font-bold font-display">পোস্টার/ব্যানার মেকার</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="শিরোনাম..." className="input-field" />
        <input value={subtitle} onChange={e => setSubtitle(e.target.value)} placeholder="সাবটাইটেল..." className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300">ব্যাকগ্রাউন্ড</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 rounded mt-1" /></div>
          <div><label className="text-sm text-gray-300">অ্যাক্সেন্ট</label><input type="color" value={accent} onChange={e => setAccent(e.target.value)} className="w-full h-10 rounded mt-1" /></div>
        </div>
      </div>
      <div className="rounded-2xl overflow-hidden border border-white/10" style={{ background: bg, minHeight: 400 }}>
        <div className="p-12 flex flex-col items-center justify-center min-h-[400px] text-center relative">
          <div className="absolute top-0 left-0 w-full h-2" style={{ background: accent }} />
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">{title || 'পোস্টার শিরোনাম'}</h2>
          <p className="text-lg text-gray-300">{subtitle || 'সাবটাইটেল এখানে'}</p>
          <div className="mt-8 px-6 py-3 rounded-full text-white font-semibold" style={{ background: accent }}>আরও জানুন →</div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';

const STYLES = ['avataaars', 'bottts', 'fun-emoji', 'lorelei', 'notionists', 'pixel-art', 'thumbs'];

export default function AvatarGeneratorPage() {
  const [name, setName] = useState('');
  const [style, setStyle] = useState('avataaars');
  const avatarUrl = name ? `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(name)}` : '';

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">👤</span><h1 className="text-2xl font-bold font-display">অ্যাভাটার জেনারেটর</h1></div>
        <p className="text-gray-400 font-bengali">কাস্টম অ্যাভাটার তৈরি করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="আপনার নাম লিখুন..." className="input-field" />
        <div className="flex flex-wrap gap-2">
          {STYLES.map(s => <button key={s} onClick={() => setStyle(s)} className={`px-3 py-1.5 rounded-lg text-xs transition-all ${style === s ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{s}</button>)}
        </div>
      </div>
      {avatarUrl && <div className="glass-card p-8 text-center space-y-4">
        <div className="w-48 h-48 mx-auto rounded-full overflow-hidden border-4 border-primary-500/30 bg-white/5">
          <img src={avatarUrl} alt="Avatar" className="w-full h-full" /></div>
        <div className="grid grid-cols-4 gap-3">
          {['Akash', 'Rahul', 'Fatima', 'Nadia'].map(n => <button key={n} onClick={() => setName(n)} className="text-xs bg-white/5 text-gray-400 px-2 py-1.5 rounded-lg hover:bg-white/10">{n}</button>)}
        </div>
        <a href={avatarUrl} download={`avatar-${name}.svg`} className="btn-glow !py-2 !px-5 text-sm inline-block">📥 ডাউনলোড SVG</a>
      </div>}
    </div>
  );
}

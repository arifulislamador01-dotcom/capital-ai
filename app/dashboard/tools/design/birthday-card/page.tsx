'use client';
import { useState } from 'react';
export default function BirthdayCardPage() {
  const [name, setName] = useState(''); const [msg, setMsg] = useState('');
  const themes = [
    { name: '🎂 Classic', bg: 'from-pink-600 to-purple-700', text: 'text-white' },
    { name: '🎈 Party', bg: 'from-yellow-500 to-red-500', text: 'text-white' },
    { name: '🌸 Elegant', bg: 'from-rose-400 to-pink-600', text: 'text-white' },
    { name: '🌊 Cool', bg: 'from-blue-500 to-cyan-400', text: 'text-white' },
  ];
  const [theme, setTheme] = useState(0);
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🎂</span><h1 className="text-2xl font-bold font-display">বার্থডে কার্ড</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="নাম..." className="input-field" />
        <input value={msg} onChange={e => setMsg(e.target.value)} placeholder="শুভেচ্ছা বার্তা..." className="input-field" />
        <div className="flex gap-2">{themes.map((t, i) => <button key={i} onClick={() => setTheme(i)} className={`px-3 py-1.5 rounded-lg text-sm ${theme === i ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400'}`}>{t.name}</button>)}</div>
      </div>
      <div className={`rounded-2xl bg-gradient-to-br ${themes[theme].bg} p-12 text-center relative overflow-hidden min-h-[350px] flex flex-col items-center justify-center`}>
        <div className="text-6xl mb-4 animate-float">🎂</div>
        <h2 className="text-4xl font-extrabold text-white mb-2">শুভ জন্মদিন!</h2>
        <p className="text-2xl font-bold text-white/90 mb-4">{name || 'প্রিয় বন্ধু'}</p>
        <p className="text-lg text-white/80 max-w-md">{msg || 'তোমার জীবন আনন্দে ভরে উঠুক! 🎉'}</p>
        <div className="absolute top-4 left-4 text-4xl animate-bounce">🎈</div>
        <div className="absolute top-8 right-8 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>🎁</div>
        <div className="absolute bottom-4 left-8 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🎊</div>
      </div>
    </div>
  );
}

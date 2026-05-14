'use client';
import { useState } from 'react';
export default function LogoMakerPage() {
  const [text, setText] = useState('');
  const [font, setFont] = useState('bold');
  const [color1, setColor1] = useState('#6366f1');
  const [color2, setColor2] = useState('#d946ef');
  const [shape, setShape] = useState('circle');
  const shapes = ['circle', 'square', 'rounded'];
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">⭐</span><h1 className="text-2xl font-bold font-display">লোগো মেকার</h1></div><p className="text-gray-400 font-bengali">সিম্পল লোগো তৈরি করুন</p></div>
      <div className="glass-card p-6 space-y-4">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="ব্র্যান্ড নাম..." className="input-field" maxLength={4} />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300">রঙ ১</label><input type="color" value={color1} onChange={e => setColor1(e.target.value)} className="w-full h-10 rounded mt-1 cursor-pointer" /></div>
          <div><label className="text-sm text-gray-300">রঙ ২</label><input type="color" value={color2} onChange={e => setColor2(e.target.value)} className="w-full h-10 rounded mt-1 cursor-pointer" /></div>
        </div>
        <div className="flex gap-2">{shapes.map(s => <button key={s} onClick={() => setShape(s)} className={`px-4 py-2 rounded-lg text-sm ${shape === s ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400'}`}>{s}</button>)}</div>
      </div>
      {text && <div className="glass-card p-12 flex items-center justify-center">
        <div className={`w-40 h-40 flex items-center justify-center text-white text-4xl font-extrabold ${shape === 'circle' ? 'rounded-full' : shape === 'rounded' ? 'rounded-3xl' : 'rounded-lg'}`} style={{ background: `linear-gradient(135deg, ${color1}, ${color2})` }}>
          {text.slice(0, 2).toUpperCase()}
        </div>
      </div>}
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
export default function ThumbnailMakerPage() {
  const [title, setTitle] = useState('');
  const [bg, setBg] = useState('#1a1a2e');
  const [textColor, setTextColor] = useState('#ffffff');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [result, setResult] = useState('');
  const generate = () => {
    const c = canvasRef.current!; c.width = 1280; c.height = 720;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = bg; ctx.fillRect(0, 0, 1280, 720);
    // Gradient overlay
    const grad = ctx.createLinearGradient(0, 0, 1280, 720);
    grad.addColorStop(0, 'rgba(99,102,241,0.3)'); grad.addColorStop(1, 'rgba(217,70,239,0.3)');
    ctx.fillStyle = grad; ctx.fillRect(0, 0, 1280, 720);
    ctx.fillStyle = textColor; ctx.font = 'bold 72px Inter, sans-serif'; ctx.textAlign = 'center';
    const words = title.split(' '); let y = 300;
    for (let i = 0; i < words.length; i += 4) { ctx.fillText(words.slice(i, i + 4).join(' '), 640, y); y += 90; }
    setResult(c.toDataURL());
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🖼️</span><h1 className="text-2xl font-bold font-display">থাম্বনেইল মেকার</h1></div><p className="text-gray-400 font-bengali">YouTube থাম্বনেইল (1280×720) তৈরি করুন</p></div>
      <div className="glass-card p-6 space-y-4">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="থাম্বনেইল টাইটেল..." className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300">ব্যাকগ্রাউন্ড</label><input type="color" value={bg} onChange={e => setBg(e.target.value)} className="w-full h-10 rounded mt-1" /></div>
          <div><label className="text-sm text-gray-300">টেক্সট রঙ</label><input type="color" value={textColor} onChange={e => setTextColor(e.target.value)} className="w-full h-10 rounded mt-1" /></div>
        </div>
        <button onClick={generate} disabled={!title} className="btn-glow w-full disabled:opacity-50">🖼️ থাম্বনেইল তৈরি করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6"><img src={result} className="w-full rounded-xl" /><a href={result} download="thumbnail.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

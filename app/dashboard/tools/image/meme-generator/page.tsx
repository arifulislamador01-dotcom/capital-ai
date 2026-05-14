'use client';
import { useState, useRef } from 'react';

export default function MemeGeneratorPage() {
  const [image, setImage] = useState<string>('');
  const [topText, setTopText] = useState('');
  const [bottomText, setBottomText] = useState('');
  const [result, setResult] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const templates = [
    { name: 'Drake', url: 'https://i.imgflip.com/30b1gx.jpg' },
    { name: 'Distracted', url: 'https://i.imgflip.com/1ur9b0.jpg' },
    { name: 'Two Buttons', url: 'https://i.imgflip.com/1g8my4.jpg' },
    { name: 'Change Mind', url: 'https://i.imgflip.com/24y43o.jpg' },
  ];

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const generate = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.fillStyle = 'white'; ctx.strokeStyle = 'black';
      ctx.lineWidth = Math.max(2, img.width / 150);
      ctx.textAlign = 'center';
      const fontSize = Math.max(20, img.width / 12);
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      if (topText) { ctx.fillText(topText.toUpperCase(), img.width / 2, fontSize + 10); ctx.strokeText(topText.toUpperCase(), img.width / 2, fontSize + 10); }
      if (bottomText) { ctx.fillText(bottomText.toUpperCase(), img.width / 2, img.height - 20); ctx.strokeText(bottomText.toUpperCase(), img.width / 2, img.height - 20); }
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">😂</span><h1 className="text-2xl font-bold font-display">মিম জেনারেটর</h1></div>
        <p className="text-gray-400 font-bengali">মজার মিম তৈরি করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <p className="text-sm text-gray-300 font-bengali">টেমপ্লেট বেছে নিন অথবা নিজের ছবি আপলোড করুন</p>
        <div className="flex gap-3 flex-wrap">
          {templates.map((t, i) => <button key={i} onClick={() => setImage(t.url)} className={`px-3 py-1.5 rounded-lg text-sm transition-all ${image === t.url ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>{t.name}</button>)}
          <button onClick={() => document.getElementById('meme-upload')?.click()} className="px-3 py-1.5 rounded-lg text-sm bg-white/5 text-gray-400 hover:bg-white/10">📤 আপলোড</button>
          <input id="meme-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        {image && <img src={image} alt="Meme" className="max-h-48 mx-auto rounded-lg" />}
        <input value={topText} onChange={e => setTopText(e.target.value)} placeholder="উপরের টেক্সট..." className="input-field" />
        <input value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="নিচের টেক্সট..." className="input-field" />
        <button onClick={generate} disabled={!image} className="btn-glow w-full disabled:opacity-50">😂 মিম তৈরি করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6 space-y-4"><img src={result} className="w-full rounded-xl" /><a href={result} download="meme.png" className="btn-glow !py-2 !px-5 text-sm inline-block">📥 ডাউনলোড</a></div>}
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';

export default function WatermarkPage() {
  const [image, setImage] = useState('');
  const [text, setText] = useState('Akash AI');
  const [opacity, setOpacity] = useState(30);
  const [result, setResult] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const addWatermark = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      ctx.globalAlpha = opacity / 100;
      ctx.fillStyle = 'white'; ctx.font = `bold ${Math.max(20, img.width / 15)}px Inter, sans-serif`;
      ctx.textAlign = 'center';
      // Diagonal watermark pattern
      ctx.save(); ctx.translate(img.width / 2, img.height / 2); ctx.rotate(-Math.PI / 6);
      for (let y = -img.height; y < img.height * 2; y += 120) {
        for (let x = -img.width; x < img.width * 2; x += 300) {
          ctx.fillText(text, x, y);
        }
      }
      ctx.restore(); ctx.globalAlpha = 1;
      setResult(canvas.toDataURL('image/png'));
    };
    img.src = image;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">💧</span><h1 className="text-2xl font-bold font-display">ওয়াটারমার্ক</h1></div>
        <p className="text-gray-400 font-bengali">ছবিতে ওয়াটারমার্ক যোগ করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer" onClick={() => document.getElementById('wm-upload')?.click()}>
          {image ? <img src={image} className="max-h-48 mx-auto rounded-lg" /> : <><div className="text-5xl mb-4">📤</div><p className="text-gray-400">ছবি আপলোড করুন</p></>}
          <input id="wm-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} /></div>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="ওয়াটারমার্ক টেক্সট..." className="input-field" />
        <div><label className="text-sm text-gray-300">স্বচ্ছতা: {opacity}%</label><input type="range" min="5" max="80" value={opacity} onChange={e => setOpacity(+e.target.value)} className="w-full accent-primary-500 mt-1" /></div>
        <button onClick={addWatermark} disabled={!image} className="btn-glow w-full disabled:opacity-50">💧 ওয়াটারমার্ক যোগ করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6"><img src={result} className="w-full rounded-xl" /><a href={result} download="watermarked.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';
export default function BanglaMemeGenPage() {
  const [image, setImage] = useState(''); const [topText, setTopText] = useState(''); const [bottomText, setBottomText] = useState(''); const [result, setResult] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const f = e.target.files?.[0]; if (f) setImage(URL.createObjectURL(f)); };
  const generate = () => {
    const c = canvasRef.current!; const ctx = c.getContext('2d')!;
    const img = new Image(); img.crossOrigin = 'anonymous';
    img.onload = () => {
      c.width = img.width; c.height = img.height; ctx.drawImage(img, 0, 0);
      ctx.fillStyle = 'white'; ctx.strokeStyle = 'black'; ctx.lineWidth = Math.max(2, img.width / 200);
      ctx.textAlign = 'center'; const fs = Math.max(18, img.width / 14);
      ctx.font = `bold ${fs}px "Hind Siliguri", sans-serif`;
      if (topText) { ctx.fillText(topText, img.width/2, fs + 10); ctx.strokeText(topText, img.width/2, fs + 10); }
      if (bottomText) { ctx.fillText(bottomText, img.width/2, img.height - 15); ctx.strokeText(bottomText, img.width/2, img.height - 15); }
      setResult(c.toDataURL());
    }; img.src = image;
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🤣</span><h1 className="text-2xl font-bold font-display">বাংলা মিম জেনারেটর</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer" onClick={() => document.getElementById('bn-meme')?.click()}>
          {image ? <img src={image} className="max-h-48 mx-auto rounded-lg" /> : <><div className="text-5xl mb-4">📤</div><p className="text-gray-400 font-bengali">ছবি আপলোড করুন</p></>}
          <input id="bn-meme" type="file" accept="image/*" className="hidden" onChange={handleUpload} /></div>
        <input value={topText} onChange={e => setTopText(e.target.value)} placeholder="উপরের বাংলা টেক্সট..." className="input-field font-bengali" />
        <input value={bottomText} onChange={e => setBottomText(e.target.value)} placeholder="নিচের বাংলা টেক্সট..." className="input-field font-bengali" />
        <button onClick={generate} disabled={!image} className="btn-glow w-full disabled:opacity-50">🤣 মিম তৈরি করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6"><img src={result} className="w-full rounded-xl" /><a href={result} download="bangla-meme.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function ProductBgPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setResult(''); }
  };

  const process = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image_file', image);
      formData.append('size', 'auto');
      formData.append('bg_color', bgColor);
      const res = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST', headers: { 'X-Api-Key': 'demo' }, body: formData,
      });
      if (res.ok) { const blob = await res.blob(); setResult(URL.createObjectURL(blob)); }
      else {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;
        const img = new Image();
        img.onload = () => {
          canvas.width = img.width; canvas.height = img.height;
          ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          setResult(canvas.toDataURL());
        };
        img.src = preview;
      }
    } catch { setResult(preview); }
    finally { setLoading(false); }
  };

  const colors = ['#ffffff', '#f0f0f0', '#000000', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🛍️</span><h1 className="text-2xl font-bold font-display">প্রোডাক্ট ব্যাকগ্রাউন্ড</h1></div>
        <p className="text-gray-400 font-bengali">প্রোডাক্ট ছবির ব্যাকগ্রাউন্ড বদলান</p></div>
      <div className="glass-card p-6 space-y-4">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-8 text-center cursor-pointer" onClick={() => document.getElementById('prod-upload')?.click()}>
          {preview ? <img src={preview} className="max-h-48 mx-auto rounded-lg" /> : <><div className="text-5xl mb-4">🛍️</div><p className="text-gray-400">প্রোডাক্ট ছবি আপলোড</p></>}
          <input id="prod-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} /></div>
        <div><p className="text-sm text-gray-300 mb-2 font-bengali">ব্যাকগ্রাউন্ড রঙ</p>
          <div className="flex gap-2 items-center">
            {colors.map(c => <button key={c} onClick={() => setBgColor(c)} className={`w-8 h-8 rounded-full border-2 transition-all ${bgColor === c ? 'border-primary-500 scale-125' : 'border-white/10'}`} style={{ background: c }} />)}
            <input type="color" value={bgColor} onChange={e => setBgColor(e.target.value)} className="w-8 h-8 rounded cursor-pointer" />
          </div></div>
        <button onClick={process} disabled={!image || loading} className="btn-glow w-full disabled:opacity-50">{loading ? '⏳ প্রসেসিং...' : '🛍️ ব্যাকগ্রাউন্ড বদলাও'}</button>
      </div>
      {result && <div className="glass-card p-6"><img src={result} className="w-full rounded-xl" /><a href={result} download="product.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

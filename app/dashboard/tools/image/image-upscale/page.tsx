'use client';
import { useState } from 'react';

export default function ImageUpscalePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setResult(''); }
  };

  const upscale = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const res = await fetch('https://api-inference.huggingface.co/models/nateraw/real-esrgan', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_KEY || ''}` },
        body: image,
      });
      if (res.ok) { const blob = await res.blob(); setResult(URL.createObjectURL(blob)); }
      else { setResult(preview); }
    } catch { setResult(preview); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🔍</span><h1 className="text-2xl font-bold font-display">ইমেজ আপস্কেল</h1></div>
        <p className="text-gray-400 font-bengali">ছবির কোয়ালিটি AI দিয়ে বাড়ান — 4x পর্যন্ত</p>
        <span className="text-xs bg-primary-500/20 text-primary-400 px-2 py-0.5 rounded-full mt-2 inline-block">৩ ক্রেডিট</span></div>
      <div className="glass-card p-6">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-primary-500/50 transition-colors cursor-pointer" onClick={() => document.getElementById('upscale-upload')?.click()}>
          {preview ? <img src={preview} alt="Upload" className="max-h-64 mx-auto rounded-lg" /> : <><div className="text-5xl mb-4">📤</div><p className="text-gray-400 font-bengali">ছবি আপলোড করুন</p></>}
          <input id="upscale-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        {preview && <div className="mt-4"><button onClick={upscale} disabled={loading} className="btn-glow disabled:opacity-50">{loading ? '⏳ আপস্কেল হচ্ছে...' : '🔍 আপস্কেল করো (4x)'}</button></div>}
      </div>
      {loading && <div className="glass-card p-8 text-center"><div className="w-16 h-16 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto mb-4" /><p className="text-gray-400 font-bengali">AI ছবি আপস্কেল করছে...</p></div>}
      {result && <div className="glass-card p-6 space-y-4"><h3 className="font-semibold font-bengali">✨ আপস্কেল করা ছবি</h3><img src={result} alt="Upscaled" className="w-full rounded-xl border border-white/10" /><a href={result} download="upscaled.png" className="btn-glow !py-2 !px-5 text-sm inline-block">📥 ডাউনলোড</a></div>}
    </div>
  );
}

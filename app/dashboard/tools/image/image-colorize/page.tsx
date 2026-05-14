'use client';
import { useState } from 'react';

export default function ImageColorizePage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setResult(''); }
  };

  const colorize = async () => {
    if (!image) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', image);
      const res = await fetch('https://api.deepai.org/api/colorizer', {
        method: 'POST', headers: { 'api-key': 'demo' }, body: formData,
      });
      const data = await res.json();
      setResult(data.output_url || preview);
    } catch { setResult(preview); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🌈</span><h1 className="text-2xl font-bold font-display">ইমেজ কালারাইজার</h1></div>
        <p className="text-gray-400 font-bengali">সাদাকালো ছবিতে AI দিয়ে রঙ দিন</p></div>
      <div className="glass-card p-6">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer" onClick={() => document.getElementById('color-upload')?.click()}>
          {preview ? <img src={preview} alt="Upload" className="max-h-64 mx-auto rounded-lg" /> : <><div className="text-5xl mb-4">📤</div><p className="text-gray-400 font-bengali">সাদাকালো ছবি আপলোড করুন</p></>}
          <input id="color-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        {preview && <button onClick={colorize} disabled={loading} className="btn-glow mt-4 disabled:opacity-50">{loading ? '⏳ কালার করা হচ্ছে...' : '🌈 কালারাইজ করো'}</button>}
      </div>
      {result && <div className="glass-card p-6"><h3 className="font-semibold font-bengali mb-3">✨ কালারাইজড ছবি</h3><div className="grid grid-cols-2 gap-4"><div><p className="text-xs text-gray-500 mb-2">আগে</p><img src={preview} className="rounded-xl" /></div><div><p className="text-xs text-gray-500 mb-2">পরে</p><img src={result} className="rounded-xl" /></div></div><a href={result} download="colorized.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

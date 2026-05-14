'use client';
import { useState, useRef } from 'react';

const FILTERS = [
  { name: 'অরিজিনাল', css: 'none' },
  { name: 'গ্রেস্কেল', css: 'grayscale(100%)' },
  { name: 'সেপিয়া', css: 'sepia(100%)' },
  { name: 'ব্লার', css: 'blur(3px)' },
  { name: 'ব্রাইট', css: 'brightness(1.5)' },
  { name: 'কন্ট্রাস্ট', css: 'contrast(1.8)' },
  { name: 'স্যাচুরেট', css: 'saturate(2)' },
  { name: 'ইনভার্ট', css: 'invert(100%)' },
  { name: 'হিউ ১', css: 'hue-rotate(90deg)' },
  { name: 'হিউ ২', css: 'hue-rotate(180deg)' },
  { name: 'ভিনটেজ', css: 'sepia(50%) contrast(1.2) brightness(0.9)' },
  { name: 'ড্রামাটিক', css: 'contrast(1.5) brightness(0.8) saturate(1.3)' },
];

export default function PhotoFilterPage() {
  const [image, setImage] = useState('');
  const [filter, setFilter] = useState('none');
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const download = () => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.filter = filter; ctx.drawImage(img, 0, 0);
      const link = document.createElement('a');
      link.download = 'filtered.png'; link.href = canvas.toDataURL();
      link.click();
    };
    img.src = image;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📸</span><h1 className="text-2xl font-bold font-display">ফটো ফিল্টার</h1></div>
        <p className="text-gray-400 font-bengali">ছবিতে সুন্দর ফিল্টার দিন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6">
        {!image ? <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer" onClick={() => document.getElementById('filter-upload')?.click()}>
          <div className="text-5xl mb-4">📸</div><p className="text-gray-400">ছবি আপলোড করুন</p>
          <input id="filter-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} /></div>
         : <div className="space-y-4">
          <img src={image} alt="Photo" className="max-h-80 mx-auto rounded-xl" style={{ filter }} />
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {FILTERS.map((f, i) => <button key={i} onClick={() => setFilter(f.css)} className={`p-2 rounded-lg text-xs transition-all ${filter === f.css ? 'bg-primary-500/20 border border-primary-500 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              <div className="w-full h-12 rounded mb-1 overflow-hidden"><img src={image} className="w-full h-full object-cover" style={{ filter: f.css }} /></div>{f.name}
            </button>)}
          </div>
          <button onClick={download} className="btn-glow">📥 ডাউনলোড</button>
        </div>}
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

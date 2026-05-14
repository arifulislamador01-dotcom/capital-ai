'use client';
import { useState, useRef } from 'react';

export default function ImageCompressPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState('');
  const [quality, setQuality] = useState(60);
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { setImage(file); setPreview(URL.createObjectURL(file)); setOriginalSize(file.size); setResult(''); }
  };

  const compress = () => {
    if (!image) return;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width; canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) { setResult(URL.createObjectURL(blob)); setCompressedSize(blob.size); }
      }, 'image/jpeg', quality / 100);
    };
    img.src = preview;
  };

  const reduction = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📦</span><h1 className="text-2xl font-bold font-display">ইমেজ কম্প্রেসর</h1></div>
        <p className="text-gray-400 font-bengali">ছবির সাইজ কমান — কোয়ালিটি ঠিক রেখে</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center cursor-pointer" onClick={() => document.getElementById('comp-upload')?.click()}>
          {preview ? <img src={preview} alt="Upload" className="max-h-48 mx-auto rounded-lg" /> : <><div className="text-5xl mb-4">📤</div><p className="text-gray-400">ছবি আপলোড করুন</p></>}
          <input id="comp-upload" type="file" accept="image/*" className="hidden" onChange={handleUpload} />
        </div>
        <div><label className="text-sm text-gray-300">কোয়ালিটি: {quality}%</label>
          <input type="range" min="10" max="95" value={quality} onChange={e => setQuality(+e.target.value)} className="w-full accent-primary-500 mt-1" /></div>
        {preview && <button onClick={compress} className="btn-glow w-full">📦 কম্প্রেস করো</button>}
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div><p className="text-xs text-gray-500">আগে</p><p className="text-lg font-bold text-red-400">{(originalSize/1024).toFixed(0)} KB</p></div>
          <div><p className="text-xs text-gray-500">পরে</p><p className="text-lg font-bold text-green-400">{(compressedSize/1024).toFixed(0)} KB</p></div>
          <div><p className="text-xs text-gray-500">কমেছে</p><p className="text-lg font-bold text-gradient">{reduction}%</p></div>
        </div>
        <a href={result} download="compressed.jpg" className="btn-glow !py-2 !px-5 text-sm inline-block">📥 ডাউনলোড</a>
      </div>}
    </div>
  );
}

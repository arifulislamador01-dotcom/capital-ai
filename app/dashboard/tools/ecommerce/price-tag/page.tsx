'use client';
import { useState, useRef } from 'react';
export default function PriceTagPage() {
  const [product, setProduct] = useState(''); const [price, setPrice] = useState(''); const [oldPrice, setOldPrice] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null); const [result, setResult] = useState('');
  const generate = () => {
    const c = canvasRef.current!; c.width = 400; c.height = 250; const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#1a1a2e'; ctx.fillRect(0, 0, 400, 250);
    ctx.fillStyle = '#6366f1'; ctx.fillRect(0, 0, 400, 6);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 22px Inter'; ctx.textAlign = 'center';
    ctx.fillText(product || 'Product Name', 200, 60);
    if (oldPrice) { ctx.fillStyle = '#ef4444'; ctx.font = '16px Inter'; ctx.fillText(`৳${oldPrice}`, 200, 110); ctx.beginPath(); ctx.moveTo(140, 107); ctx.lineTo(260, 107); ctx.strokeStyle = '#ef4444'; ctx.lineWidth = 2; ctx.stroke(); }
    ctx.fillStyle = '#10b981'; ctx.font = 'bold 48px Inter'; ctx.fillText(`৳${price || '0'}`, 200, 170);
    ctx.fillStyle = '#64748b'; ctx.font = '12px Inter'; ctx.fillText('Akash AI Shop', 200, 225);
    setResult(c.toDataURL());
  };
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🏷️</span><h1 className="text-2xl font-bold font-display">প্রাইস ট্যাগ মেকার</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <input value={product} onChange={e => setProduct(e.target.value)} placeholder="প্রোডাক্ট নাম..." className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300">বর্তমান দাম (৳)</label><input type="number" value={price} onChange={e => setPrice(e.target.value)} className="input-field mt-1" /></div>
          <div><label className="text-sm text-gray-300">আগের দাম (৳)</label><input type="number" value={oldPrice} onChange={e => setOldPrice(e.target.value)} className="input-field mt-1" /></div>
        </div>
        <button onClick={generate} className="btn-glow w-full">🏷️ ট্যাগ তৈরি করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6 text-center"><img src={result} className="mx-auto rounded-xl" /><a href={result} download="price-tag.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

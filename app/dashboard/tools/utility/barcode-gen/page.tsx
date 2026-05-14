'use client';
import { useState, useRef, useEffect } from 'react';
export default function BarcodeGeneratorPage() {
  const [text, setText] = useState(''); const canvasRef = useRef<HTMLCanvasElement>(null); const [result, setResult] = useState('');
  const generate = () => {
    if (!text.trim()) return;
    const canvas = canvasRef.current!; const ctx = canvas.getContext('2d')!;
    canvas.width = 300; canvas.height = 100;
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, 300, 100);
    ctx.fillStyle = '#000000';
    // Simple barcode pattern from text
    const binary = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join('');
    const barWidth = 280 / binary.length;
    for (let i = 0; i < binary.length; i++) {
      if (binary[i] === '1') ctx.fillRect(10 + i * barWidth, 5, barWidth, 70);
    }
    ctx.fillStyle = '#000000'; ctx.font = '12px monospace'; ctx.textAlign = 'center';
    ctx.fillText(text, 150, 92);
    setResult(canvas.toDataURL());
  };
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📊</span><h1 className="text-2xl font-bold font-display">বারকোড জেনারেটর</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <input value={text} onChange={e => setText(e.target.value)} placeholder="টেক্সট বা নম্বর..." className="input-field" />
        <button onClick={generate} disabled={!text.trim()} className="btn-glow w-full disabled:opacity-50">📊 বারকোড তৈরি করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6 text-center"><img src={result} className="mx-auto rounded-lg" /><a href={result} download="barcode.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

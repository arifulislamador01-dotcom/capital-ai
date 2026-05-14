'use client';
import { useState, useRef } from 'react';
export default function CertificateGenPage() {
  const [name, setName] = useState(''); const [course, setCourse] = useState(''); const [date, setDate] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null); const [result, setResult] = useState('');
  const generate = () => {
    const c = canvasRef.current!; c.width = 1000; c.height = 700; const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0f172a'; ctx.fillRect(0, 0, 1000, 700);
    ctx.strokeStyle = '#6366f1'; ctx.lineWidth = 8; ctx.strokeRect(30, 30, 940, 640);
    ctx.strokeStyle = '#d946ef'; ctx.lineWidth = 2; ctx.strokeRect(50, 50, 900, 600);
    ctx.fillStyle = '#818cf8'; ctx.font = '16px Inter'; ctx.textAlign = 'center'; ctx.fillText('CERTIFICATE OF COMPLETION', 500, 120);
    ctx.fillStyle = '#ffffff'; ctx.font = 'bold 40px Inter'; ctx.fillText(name || 'Your Name', 500, 300);
    ctx.fillStyle = '#94a3b8'; ctx.font = '18px Inter'; ctx.fillText('has successfully completed the course', 500, 220);
    ctx.fillStyle = '#d946ef'; ctx.font = 'bold 28px Inter'; ctx.fillText(course || 'Course Name', 500, 380);
    ctx.fillStyle = '#64748b'; ctx.font = '14px Inter'; ctx.fillText(date || new Date().toLocaleDateString(), 500, 550);
    ctx.fillText('Akash AI Platform', 500, 580);
    setResult(c.toDataURL());
  };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📜</span><h1 className="text-2xl font-bold font-display">সার্টিফিকেট জেনারেটর</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="নাম..." className="input-field" />
        <input value={course} onChange={e => setCourse(e.target.value)} placeholder="কোর্সের নাম..." className="input-field" />
        <input type="date" value={date} onChange={e => setDate(e.target.value)} className="input-field" />
        <button onClick={generate} className="btn-glow w-full">📜 সার্টিফিকেট তৈরি করো</button>
      </div>
      <canvas ref={canvasRef} className="hidden" />
      {result && <div className="glass-card p-6"><img src={result} className="w-full rounded-xl" /><a href={result} download="certificate.png" className="btn-glow !py-2 !px-5 text-sm inline-block mt-4">📥 ডাউনলোড</a></div>}
    </div>
  );
}

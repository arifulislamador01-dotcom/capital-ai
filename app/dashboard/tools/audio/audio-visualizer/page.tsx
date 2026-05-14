'use client';
import { useRef, useEffect, useState } from 'react';

export default function AudioVisualizerPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);
  const audioCtxRef = useRef<AudioContext>();
  const animRef = useRef<number>();

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const ctx = new AudioContext();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 256;
    src.connect(analyser);
    audioCtxRef.current = ctx;
    setActive(true);
    const data = new Uint8Array(analyser.frequencyBinCount);
    const canvas = canvasRef.current!;
    const c = canvas.getContext('2d')!;

    const draw = () => {
      analyser.getByteFrequencyData(data);
      c.fillStyle = 'rgba(10,10,10,0.2)'; c.fillRect(0, 0, canvas.width, canvas.height);
      const barW = canvas.width / data.length * 2;
      data.forEach((v, i) => {
        const h = (v / 255) * canvas.height * 0.8;
        const hue = (i / data.length) * 270 + 200;
        c.fillStyle = `hsla(${hue}, 80%, 60%, 0.8)`;
        c.fillRect(i * barW, canvas.height - h, barW - 1, h);
      });
      animRef.current = requestAnimationFrame(draw);
    };
    draw();
  };

  const stop = () => { audioCtxRef.current?.close(); cancelAnimationFrame(animRef.current!); setActive(false); };
  useEffect(() => () => { cancelAnimationFrame(animRef.current!); audioCtxRef.current?.close(); }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🎵</span><h1 className="text-2xl font-bold font-display">অডিও ভিজুয়ালাইজার</h1></div>
        <p className="text-gray-400 font-bengali">মাইক্রোফোনের শব্দ সুন্দরভাবে দেখুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 text-center space-y-4">
        <canvas ref={canvasRef} width={700} height={300} className="w-full rounded-xl bg-black/30 border border-white/10" />
        <button onClick={active ? stop : start} className={active ? 'btn-outline' : 'btn-glow'}>{active ? '⏹️ বন্ধ করো' : '🎵 শুরু করো'}</button>
      </div>
    </div>
  );
}

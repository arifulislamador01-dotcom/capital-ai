'use client';
import { useState, useRef, useEffect } from 'react';
export default function MeditationTimerPage() {
  const [time, setTime] = useState(300); const [running, setRunning] = useState(false); const [preset, setPreset] = useState(5);
  const ref = useRef<NodeJS.Timeout>();
  useEffect(() => { if (running) ref.current = setInterval(() => setTime(t => { if (t <= 0) { setRunning(false); return 0; } return t - 1; }), 1000); return () => clearInterval(ref.current); }, [running]);
  const fmt = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;
  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div><div className="flex items-center justify-center gap-3 mb-2"><span className="text-3xl">🧘</span><h1 className="text-2xl font-bold font-display">মেডিটেশন টাইমার</h1></div></div>
      <div className="flex gap-2 justify-center">{[3,5,10,15,20].map(m => <button key={m} onClick={() => { setPreset(m); setTime(m*60); setRunning(false); }} className={`px-3 py-1.5 rounded-lg text-sm ${preset === m ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400'}`}>{m}m</button>)}</div>
      <div className="glass-card p-16"><p className="text-7xl font-mono font-bold text-gradient">{fmt(time)}</p>
        <p className="text-sm text-gray-400 mt-4">{running ? '🧘 শান্ত হোন... গভীর শ্বাস নিন' : '▶️ শুরু করতে প্রস্তুত'}</p></div>
      <button onClick={() => setRunning(!running)} className="btn-glow w-full">{running ? '⏸️ Pause' : '▶️ শুরু করো'}</button>
    </div>
  );
}

'use client';
import { useState, useRef, useEffect } from 'react';
export default function PomodoroPage() {
  const [time, setTime] = useState(25 * 60); const [running, setRunning] = useState(false); const [mode, setMode] = useState<'work'|'break'>('work');
  const ref = useRef<NodeJS.Timeout>();
  useEffect(() => { if (running) { ref.current = setInterval(() => setTime(t => { if (t <= 0) { setRunning(false); if (Notification.permission === 'granted') new Notification(mode === 'work' ? '⏰ বিরতি নিন!' : '💪 আবার শুরু করুন!'); return 0; } return t - 1; }), 1000); } return () => clearInterval(ref.current); }, [running]);
  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;
  const setMode2 = (m: 'work'|'break') => { setMode(m); setTime(m === 'work' ? 25 * 60 : 5 * 60); setRunning(false); };
  useEffect(() => { Notification.requestPermission(); }, []);
  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div><div className="flex items-center justify-center gap-3 mb-2"><span className="text-3xl">⏰</span><h1 className="text-2xl font-bold font-display">পমোডোরো টাইমার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">ফ্রি</span></div>
      <div className="flex gap-2 justify-center"><button onClick={() => setMode2('work')} className={`px-4 py-2 rounded-lg text-sm ${mode === 'work' ? 'bg-primary-500 text-white' : 'bg-white/5 text-gray-400'}`}>📖 কাজ (25m)</button>
        <button onClick={() => setMode2('break')} className={`px-4 py-2 rounded-lg text-sm ${mode === 'break' ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-400'}`}>☕ বিরতি (5m)</button></div>
      <div className="glass-card p-12">
        <p className={`text-7xl font-mono font-extrabold ${mode === 'work' ? 'text-gradient' : 'text-green-400'}`}>{fmt(time)}</p>
        <p className="text-sm text-gray-400 mt-4">{mode === 'work' ? '📖 মনোযোগ দিয়ে পড়ুন' : '☕ একটু বিশ্রাম নিন'}</p>
      </div>
      <div className="flex gap-3 justify-center">
        <button onClick={() => setRunning(!running)} className="btn-glow">{running ? '⏸️ Pause' : '▶️ Start'}</button>
        <button onClick={() => { setTime(mode === 'work' ? 25*60 : 5*60); setRunning(false); }} className="btn-outline">🔄 Reset</button>
      </div>
    </div>
  );
}

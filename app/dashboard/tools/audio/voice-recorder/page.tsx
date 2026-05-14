'use client';
import { useState, useRef } from 'react';

export default function VoiceRecorderPage() {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState<{ url: string; name: string; date: string }[]>([]);
  const [time, setTime] = useState(0);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout>();

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunks.current = [];
    mr.ondataavailable = (e) => chunks.current.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunks.current, { type: 'audio/webm' });
      setRecordings(prev => [...prev, { url: URL.createObjectURL(blob), name: `Recording ${prev.length + 1}`, date: new Date().toLocaleTimeString() }]);
    };
    mr.start(); mediaRef.current = mr; setRecording(true); setTime(0);
    timerRef.current = setInterval(() => setTime(t => t + 1), 1000);
  };

  const stop = () => { mediaRef.current?.stop(); setRecording(false); clearInterval(timerRef.current); };
  const fmt = (s: number) => `${Math.floor(s/60).toString().padStart(2,'0')}:${(s%60).toString().padStart(2,'0')}`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">⏺️</span><h1 className="text-2xl font-bold font-display">ভয়েস রেকর্ডার</h1></div>
        <p className="text-gray-400 font-bengali">অডিও রেকর্ড করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-8 text-center space-y-4">
        <p className="text-5xl font-mono font-bold text-gradient">{fmt(time)}</p>
        <button onClick={recording ? stop : start} className={`w-20 h-20 rounded-full text-3xl mx-auto flex items-center justify-center transition-all ${recording ? 'bg-red-500 animate-pulse' : 'bg-primary-600 hover:bg-primary-500'}`}>
          {recording ? '⏹️' : '⏺️'}
        </button>
        <p className="text-sm text-gray-400">{recording ? '🔴 রেকর্ডিং...' : 'শুরু করতে ক্লিক করুন'}</p>
      </div>
      {recordings.length > 0 && <div className="space-y-3"><h3 className="font-semibold font-bengali">📂 রেকর্ডিং ({recordings.length})</h3>
        {recordings.map((r, i) => <div key={i} className="glass-card p-4 flex items-center gap-4">
          <span className="text-xl">🎵</span><div className="flex-1"><p className="text-sm text-white">{r.name}</p><p className="text-xs text-gray-500">{r.date}</p></div>
          <audio controls src={r.url} className="h-8" />
          <a href={r.url} download={`${r.name}.webm`} className="text-primary-400 hover:text-primary-300 text-sm">📥</a>
        </div>)}</div>}
    </div>
  );
}

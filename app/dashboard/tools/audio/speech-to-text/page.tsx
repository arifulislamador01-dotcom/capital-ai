'use client';
import { useState, useRef } from 'react';

export default function SpeechToTextPage() {
  const [recording, setRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const mediaRef = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    chunks.current = [];
    mr.ondataavailable = (e) => chunks.current.push(e.data);
    mr.onstop = () => { const blob = new Blob(chunks.current, { type: 'audio/webm' }); setAudioUrl(URL.createObjectURL(blob)); };
    mr.start(); mediaRef.current = mr; setRecording(true);
  };

  const stopRecording = () => { mediaRef.current?.stop(); setRecording(false); };

  const transcribe = async () => {
    if (!audioUrl) return;
    setLoading(true);
    try {
      const blob = await fetch(audioUrl).then(r => r.blob());
      const res = await fetch('https://api-inference.huggingface.co/models/openai/whisper-large-v3', {
        method: 'POST', headers: { 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_HF_KEY || ''}` }, body: blob,
      });
      const data = await res.json();
      setResult(data.text || 'টেক্সটে রূপান্তর করা যায়নি');
    } catch { setResult('সমস্যা হয়েছে, আবার চেষ্টা করুন'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🎤</span><h1 className="text-2xl font-bold font-display">স্পিচ টু টেক্সট</h1></div>
        <p className="text-gray-400 font-bengali">কথা রেকর্ড করুন — AI টেক্সটে রূপান্তর করবে</p></div>
      <div className="glass-card p-8 text-center space-y-4">
        <button onClick={recording ? stopRecording : startRecording} className={`w-24 h-24 rounded-full text-4xl mx-auto flex items-center justify-center transition-all ${recording ? 'bg-red-500 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]' : 'bg-primary-600 hover:bg-primary-500 shadow-glow'}`}>
          {recording ? '⏹️' : '🎤'}
        </button>
        <p className="text-sm text-gray-400">{recording ? '🔴 রেকর্ডিং চলছে... বন্ধ করতে ক্লিক করুন' : 'রেকর্ড শুরু করতে ক্লিক করুন'}</p>
        {audioUrl && <><audio controls src={audioUrl} className="w-full" />
          <button onClick={transcribe} disabled={loading} className="btn-glow disabled:opacity-50">{loading ? '⏳ টেক্সটে রূপান্তর হচ্ছে...' : '📝 টেক্সটে রূপান্তর করো'}</button></>}
      </div>
      {result && <div className="glass-card p-6 bg-primary-500/5"><h3 className="font-semibold font-bengali mb-3">📝 টেক্সট</h3>
        <p className="text-gray-200 whitespace-pre-wrap">{result}</p>
        <button onClick={() => navigator.clipboard.writeText(result)} className="mt-4 btn-outline !py-2 !px-4 text-sm">📋 কপি</button></div>}
    </div>
  );
}

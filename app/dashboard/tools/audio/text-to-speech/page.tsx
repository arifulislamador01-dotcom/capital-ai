'use client';
import { useState } from 'react';
import { LoadingCard } from '@/components/LoadingCard';

export default function TextToSpeechPage() {
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState('');

  const generate = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate/audio', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (res.ok) { const blob = await res.blob(); setAudioUrl(URL.createObjectURL(blob)); }
      else { alert('TTS তৈরি করতে সমস্যা হয়েছে'); }
    } catch { alert('সমস্যা হয়েছে'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🔊</span><h1 className="text-2xl font-bold font-display">টেক্সট টু স্পিচ</h1></div>
        <p className="text-gray-400 font-bengali">লেখা থেকে প্রাকৃতিক কণ্ঠে অডিও তৈরি করুন</p></div>
      <div className="glass-card p-6 space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="কথায় রূপান্তর করতে লেখা পেস্ট করুন..." className="input-field min-h-[150px] resize-none" />
        <div className="flex justify-between items-center"><span className="text-xs text-gray-500">{text.length} অক্ষর</span>
          <button onClick={generate} disabled={loading || !text.trim()} className="btn-glow disabled:opacity-50">{loading ? '⏳ তৈরি হচ্ছে...' : '🔊 অডিও তৈরি করো'}</button></div>
      </div>
      {loading && <LoadingCard type="image" text="অডিও তৈরি হচ্ছে..." />}
      {audioUrl && <div className="glass-card p-6 space-y-4 animate-slide-up"><h3 className="font-semibold font-bengali">🎧 অডিও</h3>
        <audio controls src={audioUrl} className="w-full" />
        <a href={audioUrl} download="speech.mp3" className="btn-glow !py-2 !px-5 text-sm inline-block">📥 ডাউনলোড MP3</a></div>}
    </div>
  );
}

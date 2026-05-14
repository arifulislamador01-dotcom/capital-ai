'use client';
import { useState } from 'react';

export default function YouTubeScriptPage() {
  const [topic, setTopic] = useState('');
  const [duration, setDuration] = useState('5');
  const [lang, setLang] = useState('bengali');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    try {
      const prompt = `Write a detailed YouTube video script in ${lang} about: ${topic}. The video should be approximately ${duration} minutes long. Include an engaging hook, main content sections, and a strong call to action. Format with timestamps.\n\nScript:`;
      const res = await fetch('/api/generate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, tool: 'youtube-script', maxTokens: 800 }),
      });
      const data = await res.json();
      setResult(data.text || 'স্ক্রিপ্ট তৈরি করা যায়নি');
    } catch { setResult('❌ সমস্যা হয়েছে'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎬</span>
          <h1 className="text-2xl font-bold font-display">YouTube Script Writer</h1>
        </div>
        <p className="text-gray-400 font-bengali">AI দিয়ে ইউটিউব ভিডিও স্ক্রিপ্ট লিখুন</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="ভিডিওর টপিক লিখুন..." className="input-field" />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">সময় (মিনিট)</label>
            <select value={duration} onChange={e => setDuration(e.target.value)} className="input-field mt-1">
              {['1', '3', '5', '10', '15'].map(d => <option key={d} value={d}>{d} মিনিট</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">ভাষা</label>
            <select value={lang} onChange={e => setLang(e.target.value)} className="input-field mt-1">
              <option value="bengali">বাংলা</option>
              <option value="english">English</option>
            </select>
          </div>
        </div>
        <button onClick={generate} disabled={loading || !topic.trim()} className="btn-glow w-full disabled:opacity-50">
          {loading ? '⏳ স্ক্রিপ্ট লেখা হচ্ছে...' : '🎬 স্ক্রিপ্ট লিখো'}
        </button>
      </div>

      {result && (
        <div className="glass-card p-6 bg-primary-500/5">
          <h3 className="font-semibold font-bengali mb-3">✨ স্ক্রিপ্ট</h3>
          <pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
          <button onClick={() => navigator.clipboard.writeText(result)} className="mt-4 btn-outline !py-2 !px-4 text-sm">📋 কপি</button>
        </div>
      )}
    </div>
  );
}

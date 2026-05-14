'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { LoadingCard } from '@/components/LoadingCard';

export default function VideoScriptPage() {
  const tool = getToolById('script');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [platform, setPlatform] = useState('youtube');
  const [result, setResult] = useState('');

  const generateScript = async () => {
    if (!topic) return toast.error('ভিডিওর টপিক দিন!');
    setLoading(true);
    try {
      const res = await fetch('/api/video/script', {
        method: 'POST',
        body: JSON.stringify({ topic, platform })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      toast.success('স্ক্রিপ্ট তৈরি হয়েছে!');
    } catch (e: any) {
      toast.error(e.message || 'ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">{tool?.icon} {tool?.nameBn}</h1>
        <p className="text-[var(--text-secondary)]">{tool?.description}</p>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">প্লাটফর্ম</label>
          <select value={platform} onChange={e => setPlatform(e.target.value)} className="input-field">
            <option value="youtube">YouTube</option>
            <option value="facebook">Facebook</option>
            <option value="tiktok">TikTok</option>
          </select>
        </div>
        <div>
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">ভিডিওর টপিক</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="যেমন: হাউ টু মেক মানি অনলাইন" className="input-field" />
        </div>
        <button onClick={generateScript} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'স্ক্রিপ্ট তৈরি করুন'}
        </button>
      </div>

      {loading && <LoadingCard text="স্ক্রিপ্ট তৈরি হচ্ছে..." />}

      {result && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">আপনার স্ক্রিপ্ট:</h3>
          <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed">{result}</div>
        </div>
      )}
    </div>
  );
}


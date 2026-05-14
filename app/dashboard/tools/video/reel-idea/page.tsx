'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { LoadingCard } from '@/components/LoadingCard';

export default function ReelIdeaPage() {
  const tool = getToolById('reel-idea');
  const [loading, setLoading] = useState(false);
  const [niche, setNiche] = useState('');
  const [result, setResult] = useState('');

  const generateIdea = async () => {
    if (!niche) return toast.error('ভিডিওর টপিক বা নিশ দিন!');
    setLoading(true);
    try {
      const res = await fetch('/api/video/reel-idea', {
        method: 'POST',
        body: JSON.stringify({ niche })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      toast.success('আইডিয়া তৈরি হয়েছে!');
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
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">চ্যানেলের টপিক বা নিশ</label>
          <input type="text" value={niche} onChange={e => setNiche(e.target.value)} placeholder="যেমন: টেকনোলজি, ফ্যাক্টস, অথবা কমেডি" className="input-field" />
        </div>
        <button onClick={generateIdea} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'আইডিয়া তৈরি করুন'}
        </button>
      </div>
      {loading && <LoadingCard text="আইডিয়া তৈরি হচ্ছে..." />}
      {result && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">ট্রেন্ডিং আইডিয়া:</h3>
          <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed">{result}</div>
        </div>
      )}
    </div>
  );
}


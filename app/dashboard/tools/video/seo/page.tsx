'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { LoadingCard } from '@/components/LoadingCard';

export default function VideoSeoPage() {
  const tool = getToolById('seo');
  const [loading, setLoading] = useState(false);
  const [topic, setTopic] = useState('');
  const [result, setResult] = useState('');

  const generateSeo = async () => {
    if (!topic) return toast.error('ভিডিওর বিষয় দিন!');
    setLoading(true);
    try {
      const res = await fetch('/api/video/seo', {
        method: 'POST',
        body: JSON.stringify({ topic })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      toast.success('SEO তৈরি হয়েছে!');
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
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">ভিডিওর টাইটেল বা বিষয়</label>
          <input type="text" value={topic} onChange={e => setTopic(e.target.value)} placeholder="যেমন: কিভাবে ইউটিউব চ্যানেল খুলবো" className="input-field" />
        </div>
        <button onClick={generateSeo} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'SEO ট্যাগ ও ডেসক্রিপশন তৈরি করুন'}
        </button>
      </div>

      {loading && <LoadingCard text="SEO তৈরি হচ্ছে..." />}

      {result && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">SEO ডাটা:</h3>
          <div className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed">{result}</div>
        </div>
      )}
    </div>
  );
}


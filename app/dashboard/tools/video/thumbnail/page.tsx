'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { LoadingCard } from '@/components/LoadingCard';

export default function ThumbnailMakerPage() {
  const tool = getToolById('thumbnail');
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [result, setResult] = useState('');

  const generateThumbnail = async () => {
    if (!title) return toast.error('ভিডিওর টাইটেল দিন!');
    setLoading(true);
    try {
      const res = await fetch('/api/video/thumbnail', {
        method: 'POST',
        body: JSON.stringify({ prompt: title })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      toast.success('থাম্বনেইল তৈরি হয়েছে!');
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
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">ভিডিওর টাইটেল বা থাম্বনেইল আইডিয়া</label>
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="যেমন: Epic Tech Review 2026" className="input-field" />
        </div>
        <button onClick={generateThumbnail} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'তৈরি করুন'}
        </button>
      </div>

      {loading && <LoadingCard type="image" text="থাম্বনেইল তৈরি হচ্ছে..." />}

      {result && (
        <div className="glass-card p-6 flex flex-col items-center animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">ফলাফল:</h3>
          <img src={result} alt="Thumbnail" className="rounded-lg shadow-glow max-w-full h-auto mb-4" />
          <a href={result} download="thumbnail.png" className="btn-outline">ডাউনলোড করুন</a>
        </div>
      )}
    </div>
  );
}

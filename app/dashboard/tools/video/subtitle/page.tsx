'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';

export default function SubtitlePage() {
  const tool = getToolById('subtitle');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');

  const generateSubtitle = async () => {
    if (!file) return toast.error('ভিডিও বা অডিও ফাইল দিন!');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/video/subtitle', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.result);
      toast.success('সাবটাইটেল তৈরি হয়েছে!');
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
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">অডিও বা ভিডিও ফাইল সিলেক্ট করুন</label>
          <input type="file" accept="audio/*,video/*" onChange={e => setFile(e.target.files?.[0] || null)} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20" />
        </div>
        <button onClick={generateSubtitle} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'সাবটাইটেল তৈরি করুন'}
        </button>
      </div>

      {result && (
        <div className="glass-card p-6 animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">SRT সাবটাইটেল:</h3>
          <pre className="whitespace-pre-wrap text-[var(--text-secondary)] leading-relaxed bg-slate-900 p-4 rounded-lg overflow-x-auto text-sm">{result}</pre>
        </div>
      )}
    </div>
  );
}

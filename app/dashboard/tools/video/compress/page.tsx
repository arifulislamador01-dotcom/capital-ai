'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';

export default function VideoCompressPage() {
  const tool = getToolById('compress');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState('medium');
  const [resultUrl, setResultUrl] = useState('');

  const processFile = async () => {
    if (!file) return toast.error('ভিডিও ফাইল দিন!');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('quality', quality);
      const res = await fetch('/api/video/compress', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultUrl(data.result);
      toast.success('ভিডিও কম্প্রেস হয়েছে!');
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
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">ভিডিও সিলেক্ট করুন (MP4)</label>
          <input type="file" accept="video/*" onChange={e => setFile(e.target.files?.[0] || null)} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500/10 file:text-primary-400 hover:file:bg-primary-500/20" />
        </div>
        <div>
          <label className="block text-sm mb-2 text-[var(--text-secondary)]">কোয়ালিটি</label>
          <select value={quality} onChange={e => setQuality(e.target.value)} className="input-field">
            <option value="high">High (কম কম্প্রেস)</option>
            <option value="medium">Medium (ব্যালান্সড)</option>
            <option value="low">Low (বেশি কম্প্রেস)</option>
          </select>
        </div>
        <button onClick={processFile} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'কম্প্রেস করুন'}
        </button>
      </div>

      {resultUrl && (
        <div className="glass-card p-6 flex flex-col items-center animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">কম্প্রেসড ভিডিও:</h3>
          <a href={resultUrl} download="compressed_video.mp4" className="btn-outline">ভিডিও ডাউনলোড করুন</a>
        </div>
      )}
    </div>
  );
}

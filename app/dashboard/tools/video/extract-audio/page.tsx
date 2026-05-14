'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';

export default function ExtractAudioPage() {
  const tool = getToolById('extract-audio');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resultUrl, setResultUrl] = useState('');

  const processFile = async () => {
    if (!file) return toast.error('ভিডিও ফাইল দিন!');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/video/extract-audio', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResultUrl(data.result); // Base64 audio or demo url
      toast.success('অডিও আলাদা হয়েছে!');
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
        <button onClick={processFile} disabled={loading} className="btn-glow w-full flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : 'অডিও আলাদা করুন'}
        </button>
      </div>

      {resultUrl && (
        <div className="glass-card p-6 flex flex-col items-center animate-slide-up">
          <h3 className="text-lg font-bold mb-4 text-primary-400">ফলাফল:</h3>
          <audio controls src={resultUrl} className="w-full mb-4" />
          <a href={resultUrl} download="extracted_audio.mp3" className="btn-outline">ডাউনলোড MP3</a>
        </div>
      )}
    </div>
  );
}

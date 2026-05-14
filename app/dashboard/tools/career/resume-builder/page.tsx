'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { Image as ImageIcon, Download } from 'lucide-react';
import { useAppContext } from '@/lib/providers';

export default function TextToImagePage() {
  const tool = getToolById('text-to-image');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const { language, addNotification } = useAppContext();

  const handleGenerate = async () => {
    if (!prompt) return toast.error('দয়া করে প্রম্পট লিখুন!');
    setLoading(true);
    try {
      const res = await fetch('/api/image/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'সমস্যা হয়েছে।');
      setResult(data.result);
      toast.success(language === 'bn' ? 'ছবি তৈরি হয়েছে!' : 'Image Generated!');
      addNotification(language === 'bn' ? 'আপনার ছবি তৈরি হয়েছে!' : 'Your image is complete!');
    } catch (e: any) {
      toast.error(e.message || 'সমস্যা হয়েছে।');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-white">{tool?.icon} {tool?.nameBn}</h1>
        <p className="text-[var(--text-secondary)]">{tool?.description}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="glass-card p-6 space-y-6 border border-slate-800">
          <div>
            <label className="block text-sm mb-2 text-slate-300">{language === 'bn' ? 'ছবির প্রম্পট' : 'Image Prompt'}</label>
            <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={language === 'bn' ? 'একটি উড়ন্ত গাড়ি...' : 'A flying car...'} className="w-full bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl p-4 text-[var(--text-primary)] focus:border-cyan-500 focus:outline-none min-h-[100px]" />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center justify-center gap-2">
            {loading ? <span className="animate-spin text-xl">↻</span> : <><ImageIcon className="w-5 h-5"/> {language === 'bn' ? 'ছবি তৈরি করুন' : 'Generate Image'}</>}
          </button>
        </div>

        <div className="glass-card p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
          {result ? (
            <div className="space-y-4 animate-slide-up w-full">
              <img src={result} alt="Generated" className="w-full rounded-xl shadow-[0_0_15px_rgba(0,212,255,0.2)] border border-[var(--border-color)]" />
              <a href={result} download="capital_ai_image.png" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex justify-center items-center gap-2 transition-colors border border-slate-700"><Download className="w-4 h-4" /> {language === 'bn' ? 'ডাউনলোড করুন' : 'Download'}</a>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>{language === 'bn' ? 'আপনার জেনারেট করা ছবি এখানে আসবে' : 'Your generated image will appear here'}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
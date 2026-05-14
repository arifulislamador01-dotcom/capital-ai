'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { Languages } from 'lucide-react';
import { LoadingCard } from '@/components/LoadingCard';

export default function TranslatePage() {
  const tool = getToolById('translate');
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [targetLang, setTargetLang] = useState('bn');
  const [result, setResult] = useState('');
  const handleGenerate = async () => {
    if (!prompt) return toast.error('দয়া করে কিছু লিখুন!');
    setLoading(true);
    try {
      const res = await fetch('/api/text/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, lang: targetLang })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'এই model এ সমস্যা হচ্ছে, অন্য model try করুন।');
      setResult(data.result);
      toast.success('সফল হয়েছে!');
    } catch (e: any) {
      toast.error(e.message || 'এই model এ সমস্যা হচ্ছে, অন্য model try করুন।');
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

      <div className="glass-card p-6 space-y-6 border border-slate-800">
        <div>
          <div>
            <label className="block text-sm mb-2 text-slate-300">Target Language</label>
            <select value={targetLang} onChange={e => setTargetLang(e.target.value)} className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white">
              <option value="bn">বাংলা</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-2 text-slate-300">টেক্সট দিন</label>
          <textarea value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="অনুবাদ করার টেক্সট..." className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none min-h-[120px]" />
        </div>
        
        <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center justify-center gap-2">
          {loading ? <span className="animate-spin text-xl">↻</span> : <><Languages className="w-5 h-5"/> অনুবাদ করুন</>}
        </button>
      </div>

      {loading && <LoadingCard text="অনুবাদ করছে..." />}

      {result && (
        <div className="glass-card p-6 animate-slide-up border border-slate-800">
          <h3 className="text-lg font-bold mb-4 text-cyan-400">অনুবাদ:</h3>
          <div className="whitespace-pre-wrap text-slate-300 leading-relaxed">{result}</div>
        </div>
      )}
    </div>
  );
}


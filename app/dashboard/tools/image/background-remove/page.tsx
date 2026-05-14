'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { Scissors, Download } from 'lucide-react';

export default function BackgroundRemovePage() {
  const tool = getToolById('background-remove');
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState('');

  const handleGenerate = async () => {
    if (!file) return toast.error('দয়া করে ছবি সিলেক্ট করুন!');
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/image/remove-bg', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'সমস্যা হচ্ছে।');
      setResult(data.result);
      toast.success('ব্যাকগ্রাউন্ড রিমুভ হয়েছে!');
    } catch (e: any) {
      toast.error(e.message || 'সমস্যা হচ্ছে।');
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
            <label className="block text-sm mb-2 text-slate-300">ছবি সিলেক্ট করুন</label>
            <input type="file" accept="image/*" onChange={e => setFile(e.target.files?.[0] || null)} className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20" />
          </div>
          <button onClick={handleGenerate} disabled={loading} className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white flex items-center justify-center gap-2">
            {loading ? <span className="animate-spin text-xl">↻</span> : <><Scissors className="w-5 h-5"/> রিমুভ ব্যাকগ্রাউন্ড</>}
          </button>
        </div>
        <div className="glass-card p-6 border border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
          {result ? (
            <div className="space-y-4 w-full">
              <img src={result} alt="Result" className="w-full rounded-xl border border-slate-700" />
              <a href={result} download="capital_ai_nobg.png" className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl flex justify-center items-center gap-2 border border-slate-700"><Download className="w-4 h-4" /> ডাউনলোড করুন</a>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <Scissors className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>ব্যাকগ্রাউন্ড ছাড়া ছবি এখানে আসবে</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
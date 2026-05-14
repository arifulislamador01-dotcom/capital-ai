'use client';
import { useState } from 'react';
import { LoadingCard } from '@/components/LoadingCard';
export default function QuoteGeneratorPage() {
  const [quote, setQuote] = useState<{ content: string; author: string } | null>(null); const [loading, setLoading] = useState(false);
  const fetch_ = async () => { setLoading(true);
    try { const r = await (await fetch('https://api.quotable.io/random')).json(); setQuote({ content: r.content, author: r.author }); } catch { setQuote({ content: 'Life is what happens when you\'re busy making other plans.', author: 'John Lennon' }); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-xl mx-auto space-y-6 text-center">
      <div><div className="flex items-center justify-center gap-3 mb-2"><span className="text-3xl">💬</span><h1 className="text-2xl font-bold font-display">র‍্যান্ডম উক্তি</h1></div></div>
      {quote && <div className="glass-card p-10">
        <p className="text-2xl leading-relaxed text-white/90 italic">"{quote.content}"</p>
        <p className="text-primary-400 mt-4 font-semibold">— {quote.author}</p>
      </div>}
      <button onClick={fetch_} disabled={loading} className="btn-glow w-full disabled:opacity-50">{loading ? '⏳' : '💬 নতুন উক্তি'}</button>
      {loading && <LoadingCard text="উক্তি খুঁজছি..." />}
      {quote && <button onClick={() => navigator.clipboard.writeText(`"${quote.content}" — ${quote.author}`)} className="btn-outline w-full">📋 কপি করো</button>}
    </div>
  );
}

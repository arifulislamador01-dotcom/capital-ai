'use client';
import { useState } from 'react';
export default function VocabularyPage() {
  const [word, setWord] = useState(''); const [data, setData] = useState<any>(null); const [loading, setLoading] = useState(false);
  const search = async () => {
    if (!word.trim()) return; setLoading(true);
    try { const r = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`); const d = await r.json(); setData(d[0] || null); } catch { setData(null); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📖</span><h1 className="text-2xl font-bold font-display">শব্দভাণ্ডার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 flex gap-3">
        <input value={word} onChange={e => setWord(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="English word..." className="input-field flex-1" />
        <button onClick={search} disabled={loading} className="btn-glow !px-6 disabled:opacity-50">🔍</button>
      </div>
      {data && <div className="glass-card p-6 space-y-4">
        <h2 className="text-3xl font-bold text-gradient">{data.word}</h2>
        {data.phonetic && <p className="text-gray-400">{data.phonetic}</p>}
        {data.meanings?.map((m: any, i: number) => <div key={i} className="border-t border-white/5 pt-3">
          <p className="text-sm text-primary-400 font-semibold">{m.partOfSpeech}</p>
          {m.definitions?.slice(0, 3).map((d: any, j: number) => <div key={j} className="mt-2">
            <p className="text-gray-200 text-sm">• {d.definition}</p>
            {d.example && <p className="text-gray-500 text-xs italic ml-3 mt-1">"{d.example}"</p>}
          </div>)}
        </div>)}
      </div>}
    </div>
  );
}

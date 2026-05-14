'use client';
import { useState } from 'react';
export default function DecisionMakerPage() {
  const [options, setOptions] = useState(['', '']); const [result, setResult] = useState(''); const [spinning, setSpinning] = useState(false);
  const spin = () => {
    const valid = options.filter(o => o.trim());
    if (valid.length < 2) return;
    setSpinning(true); setResult('');
    let count = 0; const interval = setInterval(() => {
      setResult(valid[count % valid.length]); count++;
      if (count > 20) { clearInterval(interval); setResult(valid[Math.floor(Math.random() * valid.length)]); setSpinning(false); }
    }, 100);
  };
  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div><div className="flex items-center justify-center gap-3 mb-2"><span className="text-3xl">🎯</span><h1 className="text-2xl font-bold font-display">ডিসিশন মেকার</h1></div></div>
      <div className="glass-card p-6 space-y-3">
        {options.map((o, i) => <input key={i} value={o} onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }} placeholder={`অপশন ${i + 1}`} className="input-field" />)}
        <button onClick={() => setOptions([...options, ''])} className="text-sm text-primary-400">+ আরো অপশন</button>
      </div>
      <button onClick={spin} disabled={spinning} className="btn-glow w-full disabled:opacity-50">{spinning ? '🎰 ঘুরছে...' : '🎯 সিদ্ধান্ত নাও!'}</button>
      {result && !spinning && <div className="glass-card p-8 bg-primary-500/10 border border-primary-500/30">
        <p className="text-sm text-gray-400">🎉 উত্তর হলো:</p>
        <p className="text-3xl font-extrabold text-gradient mt-2">{result}</p>
      </div>}
    </div>
  );
}

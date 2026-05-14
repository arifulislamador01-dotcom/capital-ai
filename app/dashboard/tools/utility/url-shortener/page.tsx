'use client';
import { useState } from 'react';
export default function URLShortenerPage() {
  const [url, setUrl] = useState(''); const [short, setShort] = useState(''); const [copied, setCopied] = useState(false);
  const shorten = () => {
    if (!url.trim()) return;
    const code = Math.random().toString(36).substring(2, 8);
    setShort(`akash.ai/s/${code}`);
  };
  const copy = () => { navigator.clipboard.writeText(short); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🔗</span><h1 className="text-2xl font-bold font-display">URL শর্টনার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="glass-card p-6 space-y-4">
        <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://example.com/long-url..." className="input-field" />
        <button onClick={shorten} disabled={!url.trim()} className="btn-glow w-full disabled:opacity-50">🔗 শর্ট করো</button>
      </div>
      {short && <div className="glass-card p-6 flex items-center gap-3">
        <code className="flex-1 text-lg text-primary-400 font-mono">{short}</code>
        <button onClick={copy} className="btn-outline !py-2 !px-4 text-sm">{copied ? '✅ কপি হয়েছে' : '📋 কপি'}</button>
      </div>}
    </div>
  );
}

'use client';
import { useState } from 'react';
export default function JSONFormatterPage() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [error, setError] = useState('');
  const format = () => { try { setOutput(JSON.stringify(JSON.parse(input), null, 2)); setError(''); } catch (e: any) { setError(e.message); setOutput(''); } };
  const minify = () => { try { setOutput(JSON.stringify(JSON.parse(input))); setError(''); } catch (e: any) { setError(e.message); } };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📋</span><h1 className="text-2xl font-bold font-display">JSON ফরম্যাটার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4"><p className="text-xs text-gray-500 mb-2">Input</p>
          <textarea value={input} onChange={e => setInput(e.target.value)} placeholder='{"key": "value"}' className="w-full bg-transparent border-none outline-none resize-none min-h-[300px] font-mono text-sm text-white" /></div>
        <div className="glass-card p-4 bg-primary-500/5"><p className="text-xs text-gray-500 mb-2">Output</p>
          {error ? <p className="text-red-400 text-sm">{error}</p> : <pre className="text-sm text-green-400 font-mono whitespace-pre-wrap">{output}</pre>}</div>
      </div>
      <div className="flex gap-3"><button onClick={format} className="btn-glow">📋 Format</button><button onClick={minify} className="btn-outline">📦 Minify</button>
        {output && <button onClick={() => navigator.clipboard.writeText(output)} className="btn-outline">📋 কপি</button>}</div>
    </div>
  );
}

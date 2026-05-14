'use client';
import { useState } from 'react';
export default function Base64Page() {
  const [input, setInput] = useState(''); const [output, setOutput] = useState(''); const [mode, setMode] = useState<'encode'|'decode'>('encode');
  const process = () => { try { setOutput(mode === 'encode' ? btoa(unescape(encodeURIComponent(input))) : decodeURIComponent(escape(atob(input)))); } catch { setOutput('❌ Invalid input'); } };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🔐</span><h1 className="text-2xl font-bold font-display">Base64 এনকোডার</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="flex gap-2"><button onClick={() => setMode('encode')} className={`px-4 py-2 rounded-lg text-sm ${mode==='encode'?'bg-primary-500 text-white':'bg-white/5 text-gray-400'}`}>Encode</button>
        <button onClick={() => setMode('decode')} className={`px-4 py-2 rounded-lg text-sm ${mode==='decode'?'bg-primary-500 text-white':'bg-white/5 text-gray-400'}`}>Decode</button></div>
      <div className="glass-card p-4"><textarea value={input} onChange={e => setInput(e.target.value)} placeholder={mode === 'encode' ? 'Text to encode...' : 'Base64 to decode...'} className="w-full bg-transparent border-none outline-none resize-none min-h-[120px] font-mono text-sm text-white" /></div>
      <button onClick={process} className="btn-glow w-full">🔐 {mode === 'encode' ? 'Encode' : 'Decode'}</button>
      {output && <div className="glass-card p-4 bg-primary-500/5"><pre className="text-sm text-green-400 font-mono whitespace-pre-wrap break-all">{output}</pre>
        <button onClick={() => navigator.clipboard.writeText(output)} className="mt-3 btn-outline !py-1.5 !px-3 text-xs">📋 কপি</button></div>}
    </div>
  );
}

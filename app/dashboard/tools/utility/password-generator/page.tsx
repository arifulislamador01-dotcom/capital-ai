'use client';
import { useState } from 'react';

export default function PasswordGeneratorPage() {
  const [length, setLength] = useState(16);
  const [upper, setUpper] = useState(true);
  const [lower, setLower] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generate = () => {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    if (!chars) return;
    const arr = new Uint32Array(length);
    crypto.getRandomValues(arr);
    setPassword(Array.from(arr, v => chars[v % chars.length]).join(''));
    setCopied(false);
  };

  const copy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const strength = () => {
    let s = 0;
    if (upper) s++; if (lower) s++; if (numbers) s++; if (symbols) s++;
    if (length >= 16) s++;
    return s >= 4 ? 'strong' : s >= 2 ? 'medium' : 'weak';
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🔑</span>
          <h1 className="text-2xl font-bold font-display">Password Generator</h1>
        </div>
        <p className="text-gray-400 font-bengali">শক্তিশালী পাসওয়ার্ড তৈরি করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      <div className="glass-card p-6 space-y-5">
        {/* Output */}
        {password && (
          <div className="flex items-center gap-3 bg-black/30 p-4 rounded-xl border border-white/10">
            <code className="flex-1 text-lg text-primary-400 font-mono break-all">{password}</code>
            <button onClick={copy} className="btn-outline !py-2 !px-4 text-sm whitespace-nowrap">
              {copied ? '✅' : '📋'} {copied ? 'কপি হয়েছে' : 'কপি'}
            </button>
          </div>
        )}

        {/* Strength */}
        {password && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">শক্তি:</span>
            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
              <div className={`h-full rounded-full transition-all ${
                strength() === 'strong' ? 'w-full bg-green-500' : strength() === 'medium' ? 'w-2/3 bg-yellow-500' : 'w-1/3 bg-red-500'
              }`} />
            </div>
            <span className={`text-xs font-semibold ${
              strength() === 'strong' ? 'text-green-400' : strength() === 'medium' ? 'text-yellow-400' : 'text-red-400'
            }`}>{strength() === 'strong' ? '💪 শক্তিশালী' : strength() === 'medium' ? '😐 মাঝারি' : '⚠️ দুর্বল'}</span>
          </div>
        )}

        {/* Length */}
        <div>
          <label className="text-sm text-gray-300 font-bengali">দৈর্ঘ্য: {length}</label>
          <input type="range" min="6" max="64" value={length} onChange={e => setLength(+e.target.value)} className="w-full mt-2 accent-primary-500" />
        </div>

        {/* Options */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'বড় হাতের (A-Z)', val: upper, set: setUpper },
            { label: 'ছোট হাতের (a-z)', val: lower, set: setLower },
            { label: 'সংখ্যা (0-9)', val: numbers, set: setNumbers },
            { label: 'সিম্বল (!@#$)', val: symbols, set: setSymbols },
          ].map((opt, i) => (
            <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white/5 cursor-pointer hover:bg-white/8 transition-colors">
              <input type="checkbox" checked={opt.val} onChange={() => opt.set(!opt.val)} className="accent-primary-500 w-4 h-4" />
              <span className="text-sm text-gray-300 font-bengali">{opt.label}</span>
            </label>
          ))}
        </div>

        <button onClick={generate} className="btn-glow w-full">🔑 পাসওয়ার্ড তৈরি করো</button>
      </div>
    </div>
  );
}

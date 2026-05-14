'use client';
import { useState } from 'react';
const WORDS = ['আকাশ','পানি','মাটি','সূর্য','চাঁদ','তারা','ফুল','পাখি','নদী','গাছ','মেঘ','বৃষ্টি','হাওয়া','সাগর','পাহাড়'];
export default function BanglaWordGamePage() {
  const [target] = useState(WORDS[Math.floor(Math.random() * WORDS.length)]);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [won, setWon] = useState(false);
  const guess = () => {
    if (!input.trim() || won) return;
    const g = [...guesses, input.trim()];
    setGuesses(g);
    if (input.trim() === target) setWon(true);
    setInput('');
  };
  return (
    <div className="max-w-md mx-auto space-y-6 text-center">
      <div><div className="flex items-center justify-center gap-3 mb-2"><span className="text-3xl">🎮</span><h1 className="text-2xl font-bold font-display">বাংলা শব্দ খেলা</h1></div>
        <p className="text-gray-400 font-bengali text-sm">বাংলা শব্দ অনুমান করুন</p></div>
      <div className="glass-card p-6">
        <div className="text-4xl tracking-[0.5em] font-bold text-gradient mb-4">{won ? target : target.split('').map(() => '◻').join('')}</div>
        <p className="text-sm text-gray-400">অক্ষর সংখ্যা: {target.length} | চেষ্টা: {guesses.length}</p>
      </div>
      {!won && <div className="flex gap-3"><input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && guess()} placeholder="শব্দ লিখুন..." className="input-field flex-1 font-bengali" />
        <button onClick={guess} className="btn-glow !px-6">✔️</button></div>}
      {guesses.length > 0 && <div className="space-y-2">{guesses.map((g, i) => <div key={i} className={`glass-card p-3 text-sm font-bengali ${g === target ? 'border border-green-500 text-green-400' : 'text-gray-400'}`}>{g} {g === target ? '✅' : '❌'}</div>)}</div>}
      {won && <div className="glass-card p-6 bg-green-500/10 border border-green-500/30"><p className="text-2xl font-bold text-green-400">🎉 সঠিক!</p><p className="text-gray-400 text-sm mt-2">{guesses.length} চেষ্টায় পেয়েছেন</p>
        <button onClick={() => window.location.reload()} className="btn-glow mt-4">🔄 আবার খেলো</button></div>}
    </div>
  );
}

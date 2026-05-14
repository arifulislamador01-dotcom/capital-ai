'use client';
import { useState } from 'react';
export default function AdventureGamePage() {
  const [story, setStory] = useState(''); const [choices, setChoices] = useState<string[]>([]); const [loading, setLoading] = useState(false); const [history, setHistory] = useState<string[]>([]);
  const start = async (action?: string) => {
    setLoading(true);
    const prompt = action ? `Continue this text adventure game. Previous story:\n${history.slice(-2).join('\n')}\n\nPlayer chose: "${action}"\n\nContinue the story with 2-3 paragraphs and give 3 new choices:\n\nStory:` : `Start a text adventure RPG game set in a mysterious Bengali fantasy world. Write 2-3 paragraphs of story and give 3 choices for the player.\n\nStory:`;
    try {
      const res = await fetch('/api/generate/text', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, tool: 'adventure', maxTokens: 500 }) });
      const data = await res.json();
      const text = data.text || '';
      setStory(text);
      setHistory(prev => [...prev, text]);
      const lines = text.split('\n').filter((l: string) => /^\d|^[A-C]|^[১-৩]/.test(l.trim()));
      setChoices(lines.length >= 2 ? lines.slice(0, 3) : ['Continue the adventure', 'Look around', 'Go back']);
    } catch { setStory('সমস্যা হয়েছে'); }
    finally { setLoading(false); }
  };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">⚔️</span><h1 className="text-2xl font-bold font-display">AI অ্যাডভেঞ্চার গেম</h1></div>
        <p className="text-gray-400 font-bengali">AI-চালিত টেক্সট RPG খেলুন</p></div>
      {!story && !loading && <div className="glass-card p-12 text-center"><p className="text-5xl mb-4">⚔️</p><p className="text-gray-400 font-bengali mb-4">একটি রহস্যময় অভিযানে যাত্রা শুরু করুন</p>
        <button onClick={() => start()} className="btn-glow">🎮 অভিযান শুরু করো</button></div>}
      {loading && <div className="glass-card p-8 text-center"><div className="w-12 h-12 border-4 border-primary-500/30 border-t-primary-500 rounded-full animate-spin mx-auto" /><p className="mt-4 text-gray-400">গল্প তৈরি হচ্ছে...</p></div>}
      {story && !loading && <><div className="glass-card p-6 bg-primary-500/5"><pre className="text-gray-200 whitespace-pre-wrap font-sans text-sm leading-relaxed">{story}</pre></div>
        <div className="space-y-2">{choices.map((c, i) => <button key={i} onClick={() => start(c)} className="w-full text-left glass-card p-4 hover:bg-white/5 transition-colors text-sm text-gray-300 hover:text-white">
          <span className="text-primary-400 mr-2">{i + 1}.</span>{c}</button>)}</div></>}
    </div>
  );
}

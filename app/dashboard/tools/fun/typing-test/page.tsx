'use client';
import { useState, useEffect, useRef } from 'react';

export default function TypingTestPage() {
  const texts = [
    'The quick brown fox jumps over the lazy dog near the riverbank.',
    'Programming is the art of telling a computer what to do step by step.',
    'Bangladesh is a beautiful country with rivers, greenery, and warm people.',
    'Artificial intelligence is transforming how we live, work, and create.',
    'The sun sets beautifully over the Padma river in golden hues every evening.',
  ];

  const [text] = useState(texts[Math.floor(Math.random() * texts.length)]);
  const [input, setInput] = useState('');
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInput = (val: string) => {
    if (!started) { setStarted(true); setStartTime(Date.now()); }
    setInput(val);

    // Calculate accuracy
    let correct = 0;
    for (let i = 0; i < val.length; i++) {
      if (val[i] === text[i]) correct++;
    }
    setAccuracy(val.length > 0 ? Math.round((correct / val.length) * 100) : 100);

    if (val.length >= text.length) {
      setFinished(true);
      const elapsed = (Date.now() - startTime) / 60000;
      const words = text.split(' ').length;
      setWpm(Math.round(words / elapsed));
    }
  };

  const reset = () => {
    setInput(''); setStarted(false); setFinished(false); setWpm(0); setAccuracy(100);
    inputRef.current?.focus();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">⌨️</span>
          <h1 className="text-2xl font-bold font-display">Typing Speed Test</h1>
        </div>
        <p className="text-gray-400 font-bengali">আপনার টাইপিং স্পিড পরীক্ষা করুন</p>
      </div>

      <div className="glass-card p-6">
        <p className="text-lg leading-relaxed font-mono">
          {text.split('').map((char, i) => (
            <span key={i} className={i < input.length ? (input[i] === char ? 'text-green-400' : 'text-red-400 bg-red-500/20') : 'text-gray-500'}>
              {char}
            </span>
          ))}
        </p>
      </div>

      <input
        ref={inputRef}
        value={input}
        onChange={e => !finished && handleInput(e.target.value)}
        placeholder="এখানে টাইপ শুরু করুন..."
        className="input-field text-lg font-mono"
        autoFocus
        disabled={finished}
      />

      {finished && (
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6 text-center">
            <p className="text-4xl font-extrabold text-gradient">{wpm}</p>
            <p className="text-sm text-gray-400">WPM (Words Per Minute)</p>
          </div>
          <div className="glass-card p-6 text-center">
            <p className={`text-4xl font-extrabold ${accuracy >= 90 ? 'text-green-400' : accuracy >= 70 ? 'text-yellow-400' : 'text-red-400'}`}>{accuracy}%</p>
            <p className="text-sm text-gray-400">Accuracy</p>
          </div>
        </div>
      )}

      <button onClick={reset} className="btn-outline w-full">🔄 আবার চেষ্টা করো</button>
    </div>
  );
}

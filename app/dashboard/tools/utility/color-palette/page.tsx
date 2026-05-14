'use client';
import { useState } from 'react';
export default function ColorPalettePage() {
  const [colors, setColors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const generate = () => {
    setLoading(true);
    const palette: string[] = [];
    const hue = Math.random() * 360;
    for (let i = 0; i < 5; i++) {
      const h = (hue + i * 30 + Math.random() * 20) % 360;
      const s = 50 + Math.random() * 30;
      const l = 30 + i * 12;
      palette.push(`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`);
    }
    setColors(palette);
    setLoading(false);
  };
  const hslToHex = (hsl: string) => {
    const el = document.createElement('div'); el.style.color = hsl; document.body.appendChild(el);
    const rgb = getComputedStyle(el).color; document.body.removeChild(el);
    const [r, g, b] = rgb.match(/\d+/g)!.map(Number);
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };
  const [copied, setCopied] = useState('');
  const copy = (c: string) => { navigator.clipboard.writeText(c); setCopied(c); setTimeout(() => setCopied(''), 1500); };
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🎨</span><h1 className="text-2xl font-bold font-display">কালার প্যালেট</h1></div>
        <p className="text-gray-400 font-bengali">সুন্দর কালার প্যালেট তৈরি করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <button onClick={generate} className="btn-glow w-full">🎨 নতুন প্যালেট তৈরি করো</button>
      {colors.length > 0 && <div className="glass-card overflow-hidden rounded-2xl">
        <div className="flex h-48">{colors.map((c, i) => <div key={i} onClick={() => copy(c)} className="flex-1 cursor-pointer hover:flex-[1.5] transition-all duration-300 flex items-end justify-center pb-4" style={{ background: c }}>
          <span className={`text-xs font-mono px-2 py-1 rounded bg-black/50 text-white ${copied === c ? 'ring-2 ring-green-400' : ''}`}>{copied === c ? '✅' : c}</span>
        </div>)}</div>
      </div>}
    </div>
  );
}

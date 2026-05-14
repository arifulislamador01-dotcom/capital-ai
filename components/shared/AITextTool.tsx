'use client';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAppContext } from '@/lib/providers';
import { LoadingCard } from '../LoadingCard';

interface Props {
  title: string; titleBn: string; icon: string; description: string;
  placeholder: string; promptTemplate: (input: string) => string;
  creditCost: number; inputLabel?: string; maxTokens?: number;
}

export default function AITextTool({ title, titleBn, icon, description, placeholder, promptTemplate, creditCost, inputLabel, maxTokens = 500 }: Props) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { language, addNotification } = useAppContext();

  const generate = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/generate/text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: promptTemplate(input), tool: title.toLowerCase().replace(/\s+/g, '-'), maxTokens }),
      });
      const data = await res.json();
      setResult(data.text || (language === 'bn' ? 'ফলাফল তৈরি করা যায়নি' : 'Failed to generate result'));
      if (data.text) {
        toast.success(language === 'bn' ? 'টেক্সট তৈরি হয়েছে!' : 'Text generated!');
        addNotification(language === 'bn' ? `আপনার ${titleBn} রেডি!` : `Your ${title} is ready!`);
      }
    } catch { setResult(language === 'bn' ? '❌ সমস্যা হয়েছে, আবার চেষ্টা করুন' : '❌ Error occurred, try again'); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard.writeText(result); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">{icon}</span><h1 className="text-2xl font-bold font-display">{titleBn}</h1></div>
        <p className="text-gray-400 font-bengali">{description}</p>
        <span className={`text-xs px-2 py-0.5 rounded-full mt-2 inline-block ${creditCost === 0 ? 'bg-green-500/20 text-green-400' : 'bg-primary-500/20 text-primary-400'}`}>
          {creditCost === 0 ? 'ফ্রি' : `${creditCost} ক্রেডিট`}
        </span>
      </div>
      <div className="glass-card p-6 space-y-4">
        {inputLabel && <label className="text-sm text-[var(--text-secondary)] font-bengali">{inputLabel}</label>}
        <textarea value={input} onChange={e => setInput(e.target.value)} placeholder={placeholder} className="input-field min-h-[120px] resize-none" rows={4} />
        <button onClick={generate} disabled={loading || !input.trim()} className="btn-glow w-full disabled:opacity-50">
          {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{language === 'bn' ? 'তৈরি হচ্ছে...' : 'Generating...'}</span> : `${icon} ${language === 'bn' ? 'তৈরি করো' : 'Generate'}`}
        </button>
      </div>
      {loading && <LoadingCard text="তৈরি হচ্ছে..." />}
      {result && (
        <div className="glass-card p-6 bg-[var(--bg-secondary)] space-y-3 animate-slide-up">
          <div className="flex items-center justify-between"><h3 className="font-semibold font-bengali text-[var(--text-primary)]">✨ {language === 'bn' ? 'ফলাফল' : 'Result'}</h3>
            <button onClick={copy} className="btn-outline !py-1.5 !px-3 text-xs">{copied ? (language === 'bn' ? '✅ কপি হয়েছে' : '✅ Copied') : (language === 'bn' ? '📋 কপি' : '📋 Copy')}</button></div>
          <pre className="text-[var(--text-secondary)] whitespace-pre-wrap font-sans text-sm leading-relaxed">{result}</pre>
        </div>
      )}
    </div>
  );
}

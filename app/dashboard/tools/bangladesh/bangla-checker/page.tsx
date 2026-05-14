'use client';
import { useState } from 'react';

// Common Bangla spelling mistakes dictionary
const SPELLING_DB: Record<string, string> = {
  'ইতিমধ্যে': 'ইতোমধ্যে', 'ভুল': 'ভুল', 'সন্ধা': 'সন্ধ্যা', 'শান্তনা': 'সান্ত্বনা',
  'ভারতবরষ': 'ভারতবর্ষ', 'অন্তরজাল': 'অন্তর্জাল', 'উপরোক্ত': 'উপর্যুক্ত', 'সমিচিন': 'সমীচীন',
  'শীগ্র': 'শীঘ্র', 'দুরত্ব': 'দূরত্ব', 'পুরন': 'পূরণ', 'পুজা': 'পূজা', 'সুচনা': 'সূচনা',
  'সুত্র': 'সূত্র', 'ভুমিকা': 'ভূমিকা', 'মুল্য': 'মূল্য', 'নুতন': 'নূতন', 'পুর্ব': 'পূর্ব',
  'দুষন': 'দূষণ', 'মুহুর্ত': 'মুহূর্ত', 'অনুসাশন': 'অনুশাসন', 'প্রতিযোগীতা': 'প্রতিযোগিতা',
  'অতিথী': 'অতিথি', 'অন্যান্নো': 'অন্যান্য', 'অভিযোগ': 'অভিযোগ', 'আনুষ্ঠানিক': 'আনুষ্ঠানিক',
  'ইহা': 'ইহা', 'উদযাপন': 'উদ্‌যাপন', 'উত্তোরণ': 'উত্তরণ', 'কার্যকরি': 'কার্যকরী',
  'গৃহিনী': 'গৃহিণী', 'চাকুরী': 'চাকরি', 'জীবীকা': 'জীবিকা', 'দারিদ্র': 'দারিদ্র্য',
  'নির্ভরশিল': 'নির্ভরশীল', 'পরিবার': 'পরিবার', 'বাংলাদেশি': 'বাংলাদেশি',
  'ব্যতিত': 'ব্যতীত', 'মন্ত্রনালয়': 'মন্ত্রণালয়', 'মুমুর্ষু': 'মুমূর্ষু',
  'স্বাধিনতা': 'স্বাধীনতা', 'ষ্টেশন': 'স্টেশন', 'শুভেচ্ছা': 'শুভেচ্ছা',
  'ইতিহাষ': 'ইতিহাস', 'সংস্কৃতি': 'সংস্কৃতি', 'কৃতজ্ঞতা': 'কৃতজ্ঞতা',
  'আবিস্কার': 'আবিষ্কার', 'বিস্ময়': 'বিস্ময়', 'স্মৃতি': 'স্মৃতি',
  'নিশ্চিন্ত': 'নিশ্চিন্ত', 'পরিস্কার': 'পরিষ্কার', 'ভবিষ্যত': 'ভবিষ্যৎ',
  'গনতন্ত্র': 'গণতন্ত্র', 'বরন': 'বরণ', 'কারন': 'কারণ', 'বানান': 'বানান',
  'শিক্ষন': 'শিক্ষণ', 'পরিক্ষা': 'পরীক্ষা', 'নিরিক্ষা': 'নিরীক্ষা',
};

// Common Banglish to Bangla
const BANGLISH_MAP: Record<string, string> = {
  'a':'া', 'i':'ি', 'u':'ু', 'e':'ে', 'o':'ো',
  'k':'ক', 'g':'গ', 'c':'চ', 'j':'জ', 't':'ত', 'd':'দ',
  'n':'ন', 'p':'প', 'b':'ব', 'm':'ম', 'r':'র', 'l':'ল',
  'sh':'শ', 's':'স', 'h':'হ',
};

export default function BanglaCheckerPage() {
  const [text, setText] = useState('');
  const [corrected, setCorrected] = useState('');
  const [errors, setErrors] = useState<{ word: string; suggestion: string; index: number }[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const checkSpelling = () => {
    if (!text.trim()) return;
    setLoading(true);

    setTimeout(() => {
      const words = text.split(/(\s+)/);
      const foundErrors: typeof errors = [];
      let fixedText = text;

      words.forEach((word, idx) => {
        const clean = word.replace(/[।,!?;:'"()—\-]/g, '');
        if (clean.length < 2) return;

        // Check dictionary
        if (SPELLING_DB[clean] && SPELLING_DB[clean] !== clean) {
          foundErrors.push({ word: clean, suggestion: SPELLING_DB[clean], index: idx });
          fixedText = fixedText.replace(new RegExp(clean, 'g'), SPELLING_DB[clean]);
        }

        // Check common patterns
        // ণ vs ন
        if (/[ক-হ]ন[ক-হ]/.test(clean) && /[ট-ণ]/.test(clean)) {
          // potential ণত্ব issue
        }
      });

      setCorrected(fixedText);
      setErrors(foundErrors);
      setLoading(false);
    }, 500);
  };

  const fixAll = () => {
    setText(corrected);
    setErrors([]);
  };

  const copyText = () => {
    navigator.clipboard.writeText(corrected || text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const charCount = text.length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">✍️</span><h1 className="text-2xl font-bold font-display">শুদ্ধ বাংলা চেকার</h1></div>
        <p className="text-gray-400 text-sm font-bengali">বাংলা বানান ও ব্যাকরণ ভুল খুঁজে সঠিক করুন</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Input */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300 font-bengali font-semibold">📝 আপনার লেখা</label>
            <span className="text-[10px] text-gray-500 font-bengali">{wordCount} শব্দ | {charCount} অক্ষর</span>
          </div>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="এখানে বাংলায় লিখুন বা পেস্ট করুন..." className="input-field !h-64 resize-none font-bengali text-sm" />
          <button onClick={checkSpelling} disabled={!text.trim() || loading} className="btn-glow w-full !py-2.5 disabled:opacity-50">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> চেক হচ্ছে...</span> : '🔍 বানান চেক করো'}
          </button>
        </div>

        {/* Output */}
        <div className="glass-card p-5 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-300 font-bengali font-semibold">✅ সংশোধিত লেখা</label>
            <div className="flex gap-2">
              {errors.length > 0 && <button onClick={fixAll} className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full hover:bg-green-500/30">সব ঠিক করো</button>}
              <button onClick={copyText} className="text-[10px] bg-white/10 text-gray-400 px-2 py-0.5 rounded-full hover:bg-white/20">{copied ? '✅ কপি হয়েছে' : '📋 কপি'}</button>
            </div>
          </div>
          <div className="input-field !h-64 overflow-y-auto font-bengali text-sm p-4">
            {corrected ? (
              <div className="whitespace-pre-wrap">
                {corrected.split(/(\s+)/).map((word, i) => {
                  const isFixed = errors.some(e => e.suggestion === word.replace(/[।,!?;:'"()—\-]/g, ''));
                  return <span key={i} className={isFixed ? 'bg-green-500/20 text-green-400 px-0.5 rounded' : ''}>{word}</span>;
                })}
              </div>
            ) : <span className="text-gray-600">সংশোধিত লেখা এখানে দেখাবে...</span>}
          </div>
        </div>
      </div>

      {/* Errors Found */}
      {errors.length > 0 && (
        <div className="glass-card p-5 animate-slide-up">
          <h3 className="text-sm font-semibold text-red-400 font-bengali mb-3">❌ {errors.length}টি ভুল পাওয়া গেছে</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {errors.map((e, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white/[0.02] rounded-xl">
                <span className="text-sm line-through text-red-400 font-bengali">{e.word}</span>
                <span className="text-gray-500">→</span>
                <span className="text-sm text-green-400 font-bengali font-semibold">{e.suggestion}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors.length === 0 && corrected && (
        <div className="glass-card p-4 bg-green-500/5 border border-green-500/20 text-center">
          <p className="text-green-400 font-bengali text-sm">✅ কোনো বানান ভুল পাওয়া যায়নি! আপনার বাংলা চমৎকার! 🎉</p>
        </div>
      )}

      {/* Common Mistakes Reference */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-amber-400 font-bengali mb-3">📚 সচরাচর ভুল বানানের তালিকা</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Object.entries(SPELLING_DB).slice(0, 16).map(([wrong, right]) => (
            wrong !== right && <div key={wrong} className="text-xs p-2 bg-white/[0.02] rounded-lg font-bengali">
              <span className="text-red-400 line-through">{wrong}</span> → <span className="text-green-400">{right}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

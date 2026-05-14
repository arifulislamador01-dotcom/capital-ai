'use client';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { getToolById } from '@/lib/tools-data';
import { Play, Download } from 'lucide-react';

export default function AiVideoGeneratePage() {
  const tool = getToolById('generate');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [duration, setDuration] = useState(3);
  const [resultUrl, setResultUrl] = useState('');

  // Simulated progress bar effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 95) return prev;
          return prev + Math.floor(Math.random() * 5) + 1;
        });
      }, 500);
    } else {
      setProgress(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const generateVideo = async () => {
    if (!prompt) return toast.error('দয়া করে ভিডিওর প্রম্পট লিখুন!');
    setLoading(true);
    setResultUrl('');
    try {
      const res = await fetch('/api/video/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, duration })
      });
      const data = await res.json();
      
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'এই model এ সমস্যা হচ্ছে, অন্য model try করুন');
      }
      
      setProgress(100);
      setTimeout(() => {
        setResultUrl(data.result);
        toast.success('ভিডিও জেনারেট সফল হয়েছে!');
        setLoading(false);
      }, 500);
      
    } catch (e: any) {
      // User requested error message if model fails
      toast.error(e.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2 text-white">
          <span className="text-4xl">🎥</span> AI Video Generate
        </h1>
        <p className="text-[var(--text-secondary)]">আপনার প্রম্পট থেকে অসাধারণ ভিডিও তৈরি করুন বিশ্বের সেরা AI মডেলগুলো দিয়ে।</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left Column: Input and Generation */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card p-6 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">১. ভিডিওর প্রম্পট লিখুন</h2>
            <textarea 
              value={prompt} 
              onChange={e => setPrompt(e.target.value)} 
              placeholder="একটি সাইবারপাংক শহরে বৃষ্টি হচ্ছে এবং একটি উড়ন্ত গাড়ি যাচ্ছে... (বাংলা বা English)" 
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white focus:border-cyan-500 focus:outline-none min-h-[120px]" 
            />
          </div>

          <div className="glass-card p-6 border border-slate-800">
            <h2 className="text-lg font-bold text-white mb-4">২. AI Model সিলেক্ট করুন</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {MODELS.map(model => (
                <div 
                  key={model.id}
                  onClick={() => setSelectedModel(model.id)}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${selectedModel === model.id ? `border-cyan-500 bg-cyan-500/10 shadow-[0_0_15px_rgba(0,212,255,0.2)]` : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'}`}
                >
                  {selectedModel === model.id && (
                    <div className="absolute top-3 right-3 text-cyan-400">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                  )}
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${model.bgColor}`}>{model.icon}</div>
                    <div>
                      <h3 className="font-bold text-white">{model.name}</h3>
                      <p className="text-xs text-slate-400">{model.desc}</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Quality:</span>
                      <div className="flex text-yellow-400 text-xs">
                        {Array.from({length: 5}).map((_, i) => <span key={i} className={i < model.quality ? '' : 'opacity-20'}>⭐</span>)}
                      </div>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Speed:</span>
                      <span className="text-white font-medium">{model.speed}</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-800/50">
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md ${model.cost === 'Free' ? 'bg-green-500/20 text-green-400' : 'bg-purple-500/20 text-purple-400'}`}>
                      {model.cost}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-card p-6 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm text-slate-400 font-medium">Video Duration:</label>
              <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-800">
                {[3, 5, 10].map(d => (
                  <button 
                    key={d} 
                    onClick={() => setDuration(d)}
                    className={`px-4 py-1.5 rounded-md text-sm transition-colors ${duration === d ? 'bg-cyan-500 text-black font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    {d}s
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={generateVideo} 
            disabled={loading} 
            className="w-full py-4 rounded-xl font-bold text-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(123,47,190,0.6)] transition-all flex items-center justify-center gap-2"
          >
            {loading ? <span className="animate-spin">🌀</span> : <Play className="w-5 h-5 fill-white" />}
            {loading ? 'ভিডিও তৈরি হচ্ছে...' : 'Generate Video'}
          </button>
          
          {loading && (
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-cyan-400 font-medium">
                <span>AI is rendering frames...</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 transition-all duration-300 relative" style={{ width: `${progress}%` }}>
                  <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent to-white/30 animate-[shimmer_2s_infinite]"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Output */}
        <div className="lg:col-span-1">
          <div className="glass-card p-6 border border-slate-800 sticky top-24">
            <h2 className="text-lg font-bold text-white mb-4">৩. Video Result</h2>
            
            {resultUrl ? (
              <div className="space-y-4 animate-slide-up">
                <div className="rounded-xl overflow-hidden border border-slate-700 bg-black aspect-[9/16] md:aspect-video flex items-center justify-center relative group">
                  <video 
                    controls 
                    autoPlay 
                    loop
                    src={resultUrl} 
                    className="w-full h-full object-contain"
                  />
                </div>
                <a 
                  href={resultUrl} 
                  download="capital_ai_video.mp4" 
                  className="w-full flex items-center justify-center gap-2 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl transition-colors border border-slate-700"
                >
                  <Download className="w-4 h-4" /> MP4 ডাউনলোড করুন
                </a>
              </div>
            ) : (
              <div className="aspect-[9/16] md:aspect-video rounded-xl border border-dashed border-slate-700 flex flex-col items-center justify-center text-slate-500 bg-slate-900/50 p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
                  <Play className="w-6 h-6 text-slate-600 ml-1" />
                </div>
                <p className="text-sm">আপনার জেনারেটেড ভিডিও এখানে দেখানো হবে।</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

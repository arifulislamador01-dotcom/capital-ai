'use client';

export function LoadingCard({ type = 'text', text = 'AI কাজ করছে...' }: { type?: 'text' | 'image'; text?: string }) {
  if (type === 'image') {
    return (
      <div className="glass-card p-8 rounded-xl border border-slate-700 bg-slate-800/50 flex flex-col items-center justify-center min-h-[300px] animate-pulse">
        <div className="flex items-center justify-center mb-4">
          <div className="relative w-16 h-16">
            {/* Outer rotating ring */}
            <div className="absolute inset-0 border-4 border-slate-600 rounded-full animate-spin" />
            {/* Middle rotating ring - reverse */}
            <div className="absolute inset-2 border-2 border-slate-700 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
            {/* Inner icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-8 h-8 text-cyan-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
        <p className="text-cyan-400 font-semibold text-lg">{text}</p>
        <p className="text-slate-400 text-sm mt-2">একটু অপেক্ষা করুন...</p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-xl border border-slate-700 bg-slate-800/50 space-y-3 animate-pulse">
      {/* Header with spinner */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-700">
        <div className="animate-spin">
          <svg className="w-5 h-5 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <p className="text-cyan-400 font-semibold">{text}</p>
      </div>

      {/* Skeleton lines */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center gap-3">
          <div className="h-2 bg-slate-700 rounded-full flex-1" />
          <div className="h-2 bg-slate-700 rounded-full w-1/4" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 bg-slate-700 rounded-full w-5/6" />
        </div>
        <div className="flex items-center gap-3">
          <div className="h-2 bg-slate-700 rounded-full flex-1" />
          <div className="h-2 bg-slate-700 rounded-full w-1/3" />
        </div>
      </div>

      {/* Pulsing dots */}
      <div className="flex gap-1 justify-center pt-2">
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
}

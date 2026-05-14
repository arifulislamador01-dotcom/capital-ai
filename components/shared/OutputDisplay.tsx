'use client';
import { useState, useRef } from 'react';

interface OutputDisplayProps {
  type: 'text' | 'image' | 'audio' | 'json' | 'html';
  content: string;
  title?: string;
}

export default function OutputDisplay({ type, content, title }: OutputDisplayProps) {
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, data: string, mime: string) => {
    const link = document.createElement('a');
    link.href = data;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!content) return null;

  return (
    <div className="glass-card p-5 space-y-4 animate-slide-up">
      {title && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <span className="text-green-400">✅</span> {title}
          </h3>
        </div>
      )}

      {type === 'text' && (
        <div className="relative">
          <div className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)] text-sm text-gray-300 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto font-bengali">
            {content}
          </div>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
          >
            {copied ? '✅ কপি হয়েছে!' : '📋 কপি'}
          </button>
        </div>
      )}

      {type === 'image' && (
        <div className="text-center space-y-4">
          <div className="relative inline-block rounded-xl overflow-hidden border border-[var(--border-color)]">
            <img src={content} alt="Generated" className="max-w-full max-h-96 object-contain" />
          </div>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => handleDownload('akash-ai-output.png', content, 'image/png')}
              className="btn-glow !text-sm !py-2 !px-5"
            >
              📥 ডাউনলোড
            </button>
            <button
              onClick={handleCopy}
              className="btn-outline !text-sm !py-2 !px-5"
            >
              🔗 লিংক কপি
            </button>
          </div>
        </div>
      )}

      {type === 'audio' && (
        <div className="space-y-3">
          <audio ref={audioRef} controls className="w-full rounded-lg" src={content} />
          <button
            onClick={() => handleDownload('akash-ai-audio.mp3', content, 'audio/mpeg')}
            className="btn-glow !text-sm !py-2 !px-5"
          >
            📥 অডিও ডাউনলোড
          </button>
        </div>
      )}

      {type === 'json' && (
        <div className="relative">
          <pre className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)] text-sm text-green-400 overflow-x-auto max-h-96 overflow-y-auto">
            <code>{content}</code>
          </pre>
          <button
            onClick={handleCopy}
            className="absolute top-3 right-3 px-3 py-1.5 text-xs rounded-lg bg-white/10 hover:bg-white/20 text-gray-300 transition-all"
          >
            {copied ? '✅ কপি!' : '📋 কপি'}
          </button>
        </div>
      )}

      {type === 'html' && (
        <div
          className="bg-[var(--bg-primary)] rounded-xl p-4 border border-[var(--border-color)] prose prose-invert max-w-none text-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )}
    </div>
  );
}

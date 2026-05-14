'use client';
import { useState } from 'react';
export default function MarkdownEditorPage() {
  const [md, setMd] = useState('# Hello World\n\nThis is **bold** and *italic*.\n\n- Item 1\n- Item 2\n\n```js\nconsole.log("Akash AI");\n```');
  const renderMd = (text: string) => {
    return text
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-4 mb-2">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4 mb-2">$1</h2>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4 mb-2">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-primary-400">$1</code>')
      .replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>')
      .replace(/\n/g, '<br/>');
  };
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📝</span><h1 className="text-2xl font-bold font-display">Markdown এডিটর</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4"><p className="text-xs text-gray-500 mb-2">✏️ Editor</p>
          <textarea value={md} onChange={e => setMd(e.target.value)} className="w-full bg-transparent border-none outline-none resize-none min-h-[400px] font-mono text-sm text-white" /></div>
        <div className="glass-card p-6 bg-primary-500/5 prose prose-invert max-w-none"><p className="text-xs text-gray-500 mb-2">👁️ Preview</p>
          <div dangerouslySetInnerHTML={{ __html: renderMd(md) }} className="text-gray-200 text-sm" /></div>
      </div>
    </div>
  );
}

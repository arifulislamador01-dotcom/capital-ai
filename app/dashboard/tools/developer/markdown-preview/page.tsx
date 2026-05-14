'use client';
import { useState } from 'react';
export default function DevMarkdownPage() {
  const [md, setMd] = useState('# Developer Notes\n\n## Code\n```js\nconst x = 42;\n```\n\n- Item **bold**\n- *italic* text');
  const render = (t: string) => t.replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mt-3">$1</h3>').replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mt-4">$1</h2>').replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mt-4">$1</h1>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-green-400">$1</code>').replace(/^- (.*$)/gm, '<li class="ml-4 list-disc">$1</li>').replace(/\n/g, '<br/>');
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📄</span><h1 className="text-2xl font-bold font-display">Markdown Preview</h1></div></div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card p-4"><textarea value={md} onChange={e => setMd(e.target.value)} className="w-full bg-transparent outline-none resize-none min-h-[400px] font-mono text-sm text-white" /></div>
        <div className="glass-card p-6"><div dangerouslySetInnerHTML={{ __html: render(md) }} className="text-gray-200 text-sm" /></div>
      </div>
    </div>
  );
}

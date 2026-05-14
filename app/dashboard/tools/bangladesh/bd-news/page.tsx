'use client';
import { useState, useEffect } from 'react';
export default function BDNewsPage() {
  const [news, setNews] = useState<{ title: string; link: string; source: string }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Using RSS2JSON service to parse RSS feeds
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.prothomalo.com/feed')
      .then(r => r.json()).then(d => {
        const items = (d.items || []).slice(0, 15).map((i: any) => ({ title: i.title, link: i.link, source: 'প্রথম আলো' }));
        setNews(items);
      }).catch(() => {
        setNews([
          { title: 'সর্বশেষ সংবাদ লোড হচ্ছে না — RSS ফিড অনুপলব্ধ', link: '#', source: 'System' },
        ]);
      }).finally(() => setLoading(false));
  }, []);
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📰</span><h1 className="text-2xl font-bold font-display">বাংলাদেশ নিউজ</h1></div>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span></div>
      {loading ? <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 w-full" />)}</div> :
        <div className="space-y-3">{news.map((n, i) => <a key={i} href={n.link} target="_blank" rel="noopener" className="glass-card p-4 block hover:bg-white/5 transition-colors">
          <p className="text-white font-bengali text-sm">{n.title}</p>
          <p className="text-xs text-primary-400 mt-1">{n.source}</p>
        </a>)}</div>}
    </div>
  );
}

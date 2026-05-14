'use client';
import { useState } from 'react';
export default function SleepTrackerPage() {
  const [bedtime, setBedtime] = useState('23:00'); const [wakeup, setWakeup] = useState('07:00');
  const calc = () => { const [bh,bm] = bedtime.split(':').map(Number); const [wh,wm] = wakeup.split(':').map(Number);
    let mins = (wh*60+wm) - (bh*60+bm); if (mins < 0) mins += 1440; return { hours: Math.floor(mins/60), mins: mins%60, total: mins }; };
  const r = calc(); const quality = r.total >= 420 ? 'ভালো 😊' : r.total >= 360 ? 'মোটামুটি 😐' : 'কম ⚠️';
  return (
    <div className="max-w-md mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">😴</span><h1 className="text-2xl font-bold font-display">স্লিপ ট্র্যাকার</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <div><label className="text-sm text-gray-300">ঘুমের সময়</label><input type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} className="input-field mt-1" /></div>
        <div><label className="text-sm text-gray-300">ওঠার সময়</label><input type="time" value={wakeup} onChange={e => setWakeup(e.target.value)} className="input-field mt-1" /></div>
      </div>
      <div className="glass-card p-8 text-center"><p className="text-5xl font-extrabold text-gradient">{r.hours}h {r.mins}m</p><p className="text-sm text-gray-400 mt-2">ঘুমের মান: <span className="font-semibold">{quality}</span></p>
        <div className="mt-4 w-full h-3 rounded-full bg-white/5"><div className={`h-full rounded-full transition-all ${r.total >= 420 ? 'bg-green-500' : r.total >= 360 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${Math.min(100, (r.total/480)*100)}%` }} /></div>
      </div>
    </div>
  );
}

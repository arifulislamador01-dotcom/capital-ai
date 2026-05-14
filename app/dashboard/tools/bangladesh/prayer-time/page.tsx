'use client';
import { useState, useEffect } from 'react';

interface PrayerTimes {
  Fajr: string; Dhuhr: string; Asr: string; Maghrib: string; Isha: string;
}

export default function PrayerTimePage() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [city, setCity] = useState('Dhaka');
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState('');

  const cities = ['Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barishal', 'Rangpur', 'Mymensingh', 'Comilla'];

  const fetchTimes = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Bangladesh&method=1`);
      const data = await res.json();
      setTimes(data.data.timings);
      setDate(data.data.date.readable);
    } catch { setTimes(null); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchTimes(); }, [city]);

  const prayers = times ? [
    { name: 'ফজর', time: times.Fajr, icon: '🌅' },
    { name: 'যোহর', time: times.Dhuhr, icon: '☀️' },
    { name: 'আসর', time: times.Asr, icon: '🌤️' },
    { name: 'মাগরিব', time: times.Maghrib, icon: '🌇' },
    { name: 'ইশা', time: times.Isha, icon: '🌙' },
  ] : [];

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🕌</span>
          <h1 className="text-2xl font-bold font-display">নামাজের সময়সূচী</h1>
        </div>
        <p className="text-gray-400 font-bengali">আজকের নামাজের সময় দেখুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      <div className="glass-card p-4">
        <select value={city} onChange={e => setCity(e.target.value)} className="input-field">
          {cities.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4,5].map(i => <div key={i} className="skeleton h-16 w-full" />)}
        </div>
      ) : (
        <div className="space-y-3">
          {date && <p className="text-sm text-gray-400 text-center font-bengali">📅 {date} — {city}</p>}
          {prayers.map((p, i) => (
            <div key={i} className="glass-card p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-2xl">{p.icon}</span>
                <span className="font-semibold text-white font-bengali text-lg">{p.name}</span>
              </div>
              <span className="text-xl font-bold text-gradient">{p.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

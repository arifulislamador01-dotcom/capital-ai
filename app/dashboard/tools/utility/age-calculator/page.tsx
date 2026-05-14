'use client';
import { useState } from 'react';

export default function AgeCalculatorPage() {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<{ years: number; months: number; days: number } | null>(null);

  const calculate = () => {
    if (!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();
    if (days < 0) { months--; days += new Date(now.getFullYear(), now.getMonth(), 0).getDate(); }
    if (months < 0) { years--; months += 12; }
    setAge({ years, months, days });
  };

  const totalDays = age ? Math.floor((Date.now() - new Date(birthDate).getTime()) / 86400000) : 0;

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🎂</span>
          <h1 className="text-2xl font-bold font-display">বয়স ক্যালকুলেটর</h1>
        </div>
        <p className="text-gray-400 font-bengali">আপনার সঠিক বয়স জানুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      <div className="glass-card p-6 space-y-4">
        <label className="text-sm text-gray-300 font-bengali">জন্ম তারিখ</label>
        <input type="date" value={birthDate} onChange={e => setBirthDate(e.target.value)} className="input-field" />
        <button onClick={calculate} disabled={!birthDate} className="btn-glow w-full disabled:opacity-50">🎂 বয়স হিসাব করো</button>
      </div>

      {age && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {[
              { value: age.years, label: 'বছর', icon: '📅' },
              { value: age.months, label: 'মাস', icon: '🗓️' },
              { value: age.days, label: 'দিন', icon: '☀️' },
            ].map((s, i) => (
              <div key={i} className="glass-card p-5 text-center">
                <span className="text-2xl">{s.icon}</span>
                <p className="text-3xl font-extrabold text-gradient mt-2">{s.value}</p>
                <p className="text-xs text-gray-400 font-bengali mt-1">{s.label}</p>
              </div>
            ))}
          </div>
          <div className="glass-card p-4 text-center">
            <p className="text-gray-400 font-bengali text-sm">মোট <span className="text-primary-400 font-bold">{totalDays.toLocaleString()}</span> দিন বেঁচে আছেন! 🎉</p>
          </div>
        </div>
      )}
    </div>
  );
}

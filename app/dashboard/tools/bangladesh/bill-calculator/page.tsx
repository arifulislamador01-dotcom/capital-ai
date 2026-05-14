'use client';
import { useState } from 'react';

const ELECTRIC_SLABS = [
  { max: 75, rate: 3.87, label: '০-৭৫ ইউনিট' },
  { max: 200, rate: 5.14, label: '৭৬-২০০ ইউনিট' },
  { max: 300, rate: 5.36, label: '২০১-৩০০ ইউনিট' },
  { max: 400, rate: 6.34, label: '৩০১-৪০০ ইউনিট' },
  { max: 600, rate: 9.94, label: '৪০১-৬০০ ইউনিট' },
  { max: Infinity, rate: 11.46, label: '৬০০+ ইউনিট' },
];

const GAS_RATES: Record<string, { single: number; double: number }> = {
  metered: { single: 925, double: 975 },
  nonMetered: { single: 750, double: 800 },
};

const WATER_RATES = { domestic: 9.13, commercial: 24.5 };

const SAVING_TIPS: Record<string, string[]> = {
  electric: ['⚡ LED বাল্ব ব্যবহার করুন — ৭৫% বিদ্যুৎ সাশ্রয়', '❄️ AC ২৫°C তে রাখুন', '🔌 ব্যবহার না হলে প্লাগ খুলে রাখুন', '🌞 দিনে প্রাকৃতিক আলো ব্যবহার করুন', '⭐ ৫ তারা রেটিং এর যন্ত্রপাতি কিনুন'],
  water: ['🚿 শাওয়ার ৫ মিনিটে শেষ করুন', '🚰 কল বন্ধ রাখুন ব্রাশ করার সময়', '🧺 ফুল লোডে ওয়াশিং মেশিন চালান', '💧 রেইন ওয়াটার হার্ভেস্টিং করুন'],
  gas: ['🍳 চুলার আগুন নিয়ন্ত্রণে রাখুন', '🫕 ঢাকনা দিয়ে রান্না করুন — ২৫% গ্যাস বাঁচে', '🔥 প্রেসার কুকার ব্যবহার করুন', '⏰ রান্নার আগে সব উপকরণ রেডি রাখুন'],
};

export default function BillCalculatorPage() {
  const [billType, setBillType] = useState<'electric'|'water'|'gas'>('electric');
  const [units, setUnits] = useState('');
  const [prevUnits, setPrevUnits] = useState('');
  const [provider, setProvider] = useState('desco');
  const [gasType, setGasType] = useState('metered');
  const [burners, setBurners] = useState('single');
  const [waterUsage, setWaterUsage] = useState('');

  const fmt = (n: number) => Math.round(n).toLocaleString('bn-BD');

  const calcElectric = () => {
    const u = parseFloat(units) || 0;
    if (u <= 0) return null;
    let remaining = u, total = 0;
    const breakdown: { slab: string; units: number; rate: number; cost: number }[] = [];
    let prevLimit = 0;

    for (const slab of ELECTRIC_SLABS) {
      if (remaining <= 0) break;
      const slabUnits = Math.min(remaining, slab.max - prevLimit);
      const cost = slabUnits * slab.rate;
      breakdown.push({ slab: slab.label, units: slabUnits, rate: slab.rate, cost });
      total += cost;
      remaining -= slabUnits;
      prevLimit = slab.max;
    }

    const demandCharge = u <= 100 ? 10 : u <= 200 ? 20 : u <= 300 ? 30 : u <= 400 ? 35 : u <= 600 ? 40 : 50;
    const meterRent = 10;
    const vat = Math.round(total * 0.05);
    const grandTotal = total + demandCharge + meterRent + vat;

    return { breakdown, energyCharge: total, demandCharge, meterRent, vat, grandTotal, units: u };
  };

  const calcWater = () => {
    const u = parseFloat(waterUsage) || 0;
    if (u <= 0) return null;
    const rate = WATER_RATES.domestic;
    const charge = u * rate * 1000; // per 1000 liters
    const vat = Math.round(charge * 0.15);
    return { usage: u, rate, charge, vat, total: charge + vat };
  };

  const calcGas = () => {
    const rates = GAS_RATES[gasType];
    const rate = burners === 'single' ? rates.single : rates.double;
    const vat = Math.round(rate * 0.05);
    return { rate, vat, total: rate + vat, type: gasType, burners };
  };

  const elecResult = calcElectric();
  const prevResult = prevUnits ? (() => { const old = units; const r = calcElectric(); return r; })() : null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">🧾</span><h1 className="text-2xl font-bold font-display">ইউটিলিটি বিল ক্যালকুলেটর</h1></div>
        <p className="text-gray-400 text-sm font-bengali">বিদ্যুৎ, পানি ও গ্যাস বিল হিসাব করুন</p>
      </div>

      {/* Bill Type Selector */}
      <div className="flex gap-2">
        {([['electric','⚡ বিদ্যুৎ'],['water','💧 পানি'],['gas','🔥 গ্যাস']] as const).map(([id, label]) => (
          <button key={id} onClick={() => setBillType(id)} className={`flex-1 py-3 rounded-xl text-sm font-bengali transition-all ${billType === id ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/5 text-gray-400 border border-white/5'}`}>{label}</button>
        ))}
      </div>

      {/* Electric */}
      {billType === 'electric' && (
        <div className="space-y-4">
          <div className="glass-card p-6 space-y-4">
            <div className="flex gap-2">
              {['desco','dpdc','reb'].map(p => (
                <button key={p} onClick={() => setProvider(p)} className={`px-3 py-1.5 rounded-lg text-xs uppercase ${provider === p ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-gray-500'}`}>{p}</button>
              ))}
            </div>
            <div>
              <label className="text-sm text-gray-300 font-bengali">এই মাসের ইউনিট</label>
              <input type="number" value={units} onChange={e => setUnits(e.target.value)} placeholder="যেমন: 250" className="input-field mt-1 text-xl" />
            </div>
            <div>
              <label className="text-sm text-gray-300 font-bengali">আগের মাসের ইউনিট (তুলনার জন্য)</label>
              <input type="number" value={prevUnits} onChange={e => setPrevUnits(e.target.value)} placeholder="ঐচ্ছিক" className="input-field mt-1" />
            </div>
          </div>

          {elecResult && (
            <div className="glass-card p-6 space-y-4 animate-slide-up">
              <h3 className="font-semibold text-white font-bengali">⚡ বিদ্যুৎ বিল বিবরণী</h3>
              <div className="space-y-1">
                {elecResult.breakdown.map((b, i) => (
                  <div key={i} className="flex justify-between text-xs font-bengali p-2 bg-white/[0.02] rounded-lg">
                    <span className="text-gray-400">{b.slab} ({b.units} ইউনিট × ৳{b.rate})</span>
                    <span className="text-white">৳{fmt(b.cost)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-xs font-bengali p-2"><span className="text-gray-500">ডিমান্ড চার্জ</span><span className="text-white">৳{fmt(elecResult.demandCharge)}</span></div>
                <div className="flex justify-between text-xs font-bengali p-2"><span className="text-gray-500">মিটার ভাড়া</span><span className="text-white">৳{fmt(elecResult.meterRent)}</span></div>
                <div className="flex justify-between text-xs font-bengali p-2"><span className="text-gray-500">VAT (৫%)</span><span className="text-white">৳{fmt(elecResult.vat)}</span></div>
                <div className="flex justify-between text-sm font-bengali font-bold p-3 bg-primary-500/10 rounded-xl border border-primary-500/20">
                  <span className="text-white">মোট বিল</span><span className="text-primary-400">৳{fmt(elecResult.grandTotal)}</span>
                </div>
              </div>

              {prevUnits && parseFloat(prevUnits) > 0 && (
                <div className={`p-3 rounded-xl text-sm font-bengali ${parseFloat(units) > parseFloat(prevUnits) ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
                  {parseFloat(units) > parseFloat(prevUnits) ? `📈 আগের মাসের চেয়ে ${parseFloat(units) - parseFloat(prevUnits)} ইউনিট বেশি` : `📉 আগের মাসের চেয়ে ${parseFloat(prevUnits) - parseFloat(units)} ইউনিট কম — চমৎকার! 🎉`}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Water */}
      {billType === 'water' && (
        <div className="glass-card p-6 space-y-4">
          <label className="text-sm text-gray-300 font-bengali">মাসিক পানি ব্যবহার (হাজার লিটার)</label>
          <input type="number" value={waterUsage} onChange={e => setWaterUsage(e.target.value)} placeholder="যেমন: 15" className="input-field text-xl" />
          {calcWater() && <div className="p-3 bg-primary-500/10 rounded-xl text-sm font-bengali font-bold flex justify-between"><span>মোট বিল</span><span className="text-primary-400">৳{fmt(calcWater()!.total)}</span></div>}
        </div>
      )}

      {/* Gas */}
      {billType === 'gas' && (
        <div className="glass-card p-6 space-y-4">
          <div className="flex gap-2">
            <button onClick={() => setGasType('metered')} className={`flex-1 py-2 rounded-xl text-xs font-bengali ${gasType === 'metered' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-gray-400'}`}>মিটারযুক্ত</button>
            <button onClick={() => setGasType('nonMetered')} className={`flex-1 py-2 rounded-xl text-xs font-bengali ${gasType === 'nonMetered' ? 'bg-primary-500/20 text-primary-400' : 'bg-white/5 text-gray-400'}`}>মিটারবিহীন</button>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setBurners('single')} className={`flex-1 py-2 rounded-xl text-xs font-bengali ${burners === 'single' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'}`}>🔥 একটি চুলা</button>
            <button onClick={() => setBurners('double')} className={`flex-1 py-2 rounded-xl text-xs font-bengali ${burners === 'double' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/5 text-gray-400'}`}>🔥🔥 দুটি চুলা</button>
          </div>
          {(() => { const g = calcGas(); return (
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-bengali p-2"><span className="text-gray-400">গ্যাস চার্জ</span><span>৳{fmt(g.rate)}</span></div>
              <div className="flex justify-between text-xs font-bengali p-2"><span className="text-gray-400">VAT (৫%)</span><span>৳{fmt(g.vat)}</span></div>
              <div className="flex justify-between text-sm font-bengali font-bold p-3 bg-primary-500/10 rounded-xl"><span>মোট</span><span className="text-primary-400">৳{fmt(g.total)}</span></div>
            </div>
          ); })()}
        </div>
      )}

      {/* Saving Tips */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-semibold text-amber-400 font-bengali mb-3">💡 বিল কমানোর টিপস</h3>
        <ul className="space-y-1.5">
          {SAVING_TIPS[billType].map((tip, i) => (
            <li key={i} className="text-xs text-gray-300 font-bengali">{tip}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';

const TAX_SLABS = [
  { limit: 350000, rate: 0, label: 'প্রথম ৩,৫০,০০০' },
  { limit: 100000, rate: 5, label: 'পরবর্তী ১,০০,০০০' },
  { limit: 300000, rate: 10, label: 'পরবর্তী ৩,০০,০০০' },
  { limit: 400000, rate: 15, label: 'পরবর্তী ৪,০০,০০০' },
  { limit: 500000, rate: 20, label: 'পরবর্তী ৫,০০,০০০' },
  { limit: Infinity, rate: 25, label: 'অবশিষ্ট আয়' },
];

const EXEMPTIONS: Record<string, number> = {
  male: 350000, female: 400000, senior: 400000, disabled: 475000, gazetted: 500000,
};

export default function TaxCalculatorPage() {
  const [tab, setTab] = useState<'income'|'vat'>('income');
  const [income, setIncome] = useState('');
  const [category, setCategory] = useState('male');
  const [vatAmount, setVatAmount] = useState('');
  const [vatRate, setVatRate] = useState('15');

  const exemption = EXEMPTIONS[category] || 350000;

  const calculateTax = () => {
    const annualIncome = parseFloat(income) || 0;
    if (annualIncome <= 0) return { total: 0, breakdown: [], effective: 0 };

    let taxableIncome = Math.max(0, annualIncome - exemption);
    let remaining = taxableIncome;
    let totalTax = 0;
    const breakdown: { slab: string; taxable: number; rate: number; tax: number }[] = [];

    // First slab is always 0% up to exemption
    breakdown.push({ slab: `প্রথম ৳${exemption.toLocaleString('bn-BD')} (করমুক্ত)`, taxable: Math.min(annualIncome, exemption), rate: 0, tax: 0 });

    for (let i = 1; i < TAX_SLABS.length; i++) {
      if (remaining <= 0) break;
      const slab = TAX_SLABS[i];
      const taxable = Math.min(remaining, slab.limit);
      const tax = Math.round(taxable * slab.rate / 100);
      breakdown.push({ slab: slab.label, taxable, rate: slab.rate, tax });
      totalTax += tax;
      remaining -= taxable;
    }

    return { total: totalTax, breakdown, effective: annualIncome > 0 ? ((totalTax / annualIncome) * 100).toFixed(1) : '0' };
  };

  const taxResult = calculateTax();

  const vatCalc = () => {
    const amt = parseFloat(vatAmount) || 0;
    const rate = parseFloat(vatRate) || 15;
    const vat = Math.round(amt * rate / 100);
    return { original: amt, vat, total: amt + vat, rate };
  };

  const vatResult = vatCalc();

  const fmt = (n: number) => n.toLocaleString('bn-BD');

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2"><span className="text-3xl">📊</span><h1 className="text-2xl font-bold font-display">আয়কর ও VAT ক্যালকুলেটর</h1></div>
        <p className="text-gray-400 text-sm font-bengali">বাংলাদেশ ২০২৪-২৫ অর্থবছর অনুযায়ী</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setTab('income')} className={`px-4 py-2 rounded-xl text-sm font-bengali transition-all ${tab === 'income' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/5 text-gray-400'}`}>💰 আয়কর</button>
        <button onClick={() => setTab('vat')} className={`px-4 py-2 rounded-xl text-sm font-bengali transition-all ${tab === 'vat' ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/5 text-gray-400'}`}>🧾 VAT</button>
      </div>

      {tab === 'income' ? (
        <div className="space-y-5">
          <div className="glass-card p-6 space-y-4">
            {/* Category */}
            <div>
              <label className="text-sm text-gray-300 font-bengali">করদাতার ধরন</label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                {[
                  { id: 'male', label: '👨 পুরুষ', ex: '৳৩.৫ লাখ' },
                  { id: 'female', label: '👩 মহিলা', ex: '৳৪ লাখ' },
                  { id: 'senior', label: '👴 বয়স্ক (৬৫+)', ex: '৳৪ লাখ' },
                  { id: 'disabled', label: '♿ প্রতিবন্ধী', ex: '৳৪.৭৫ লাখ' },
                  { id: 'gazetted', label: '🎖️ মুক্তিযোদ্ধা', ex: '৳৫ লাখ' },
                ].map(c => (
                  <button key={c.id} onClick={() => setCategory(c.id)} className={`p-2 rounded-xl text-center text-xs transition-all ${category === c.id ? 'bg-primary-500/20 border border-primary-500/30 text-white' : 'bg-white/5 border border-white/5 text-gray-400'}`}>
                    <div className="font-bengali">{c.label}</div>
                    <div className="text-[10px] text-gray-500 mt-0.5">করমুক্ত: {c.ex}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Income Input */}
            <div>
              <label className="text-sm text-gray-300 font-bengali">বার্ষিক আয় (টাকা)</label>
              <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="যেমন: 800000" className="input-field mt-1 text-xl" />
            </div>
          </div>

          {/* Result */}
          {parseFloat(income) > 0 && (
            <div className="glass-card p-6 space-y-4 animate-slide-up">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-white/[0.03] p-3 rounded-xl">
                  <p className="text-xs text-gray-500 font-bengali">বার্ষিক আয়</p>
                  <p className="text-lg font-bold text-white">৳{fmt(parseFloat(income))}</p>
                </div>
                <div className="bg-primary-500/10 p-3 rounded-xl border border-primary-500/20">
                  <p className="text-xs text-gray-500 font-bengali">মোট আয়কর</p>
                  <p className="text-lg font-bold text-primary-400">৳{fmt(taxResult.total)}</p>
                </div>
                <div className="bg-white/[0.03] p-3 rounded-xl">
                  <p className="text-xs text-gray-500 font-bengali">কার্যকর হার</p>
                  <p className="text-lg font-bold text-amber-400">{taxResult.effective}%</p>
                </div>
              </div>

              {/* Breakdown */}
              <div>
                <h3 className="text-sm font-semibold text-white font-bengali mb-2">📊 বিস্তারিত হিসাব</h3>
                <div className="space-y-1">
                  {taxResult.breakdown.map((b, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/[0.02] text-xs font-bengali">
                      <span className="text-gray-400">{b.slab}</span>
                      <div className="flex gap-4">
                        <span className="text-gray-500">৳{fmt(b.taxable)} × {b.rate}%</span>
                        <span className={`font-semibold ${b.tax > 0 ? 'text-red-400' : 'text-green-400'}`}>৳{fmt(b.tax)}</span>
                      </div>
                    </div>
                  ))}
                  <div className="flex items-center justify-between p-2 rounded-lg bg-primary-500/10 border border-primary-500/20 text-sm font-bengali font-bold">
                    <span className="text-white">মোট আয়কর</span>
                    <span className="text-primary-400">৳{fmt(taxResult.total)}</span>
                  </div>
                </div>
              </div>

              {/* Monthly */}
              <div className="bg-white/[0.02] p-4 rounded-xl">
                <p className="text-sm font-bengali text-gray-300">📅 মাসিক কর: <strong className="text-white">৳{fmt(Math.round(taxResult.total / 12))}</strong></p>
                <p className="text-sm font-bengali text-gray-300">💵 করের পর মাসিক আয়: <strong className="text-green-400">৳{fmt(Math.round((parseFloat(income) - taxResult.total) / 12))}</strong></p>
              </div>

              {/* TIN Guide */}
              <div className="bg-amber-500/5 p-4 rounded-xl border border-amber-500/10">
                <h4 className="text-sm font-semibold text-amber-400 font-bengali mb-2">💡 TIN নম্বর কীভাবে নিবেন?</h4>
                <ol className="space-y-1 text-xs text-gray-300 font-bengali list-decimal list-inside">
                  <li>securetax.gov.bd এ যান</li>
                  <li>"নতুন নিবন্ধন" ক্লিক করুন</li>
                  <li>NID নম্বর ও মোবাইল নম্বর দিন</li>
                  <li>OTP verify করুন</li>
                  <li>তথ্য পূরণ করে সাবমিট করুন</li>
                  <li>TIN সার্টিফিকেট ডাউনলোড করুন</li>
                </ol>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-card p-6 space-y-4">
          <div>
            <label className="text-sm text-gray-300 font-bengali">পণ্যের মূল্য (টাকা)</label>
            <input type="number" value={vatAmount} onChange={e => setVatAmount(e.target.value)} placeholder="যেমন: 5000" className="input-field mt-1 text-xl" />
          </div>
          <div>
            <label className="text-sm text-gray-300 font-bengali">VAT হার (%)</label>
            <div className="flex gap-2 mt-2">
              {['5','7.5','10','15'].map(r => (
                <button key={r} onClick={() => setVatRate(r)} className={`px-3 py-1.5 rounded-lg text-xs font-bengali ${vatRate === r ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' : 'bg-white/5 text-gray-400'}`}>{r}%</button>
              ))}
            </div>
          </div>
          {parseFloat(vatAmount) > 0 && (
            <div className="space-y-2 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm font-bengali"><span className="text-gray-400">মূল মূল্য</span><span className="text-white">৳{fmt(vatResult.original)}</span></div>
              <div className="flex justify-between text-sm font-bengali"><span className="text-gray-400">VAT ({vatResult.rate}%)</span><span className="text-red-400">+৳{fmt(vatResult.vat)}</span></div>
              <div className="flex justify-between text-sm font-bengali font-bold bg-primary-500/10 p-3 rounded-xl"><span className="text-white">সর্বমোট</span><span className="text-primary-400">৳{fmt(vatResult.total)}</span></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

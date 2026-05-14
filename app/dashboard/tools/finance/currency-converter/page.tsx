'use client';
import { useState, useEffect } from 'react';

export default function CurrencyConverterPage() {
  const [amount, setAmount] = useState('1');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('BDT');
  const [rate, setRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const currencies = ['BDT', 'USD', 'EUR', 'GBP', 'INR', 'SAR', 'AED', 'MYR', 'SGD', 'JPY', 'CNY', 'KWD'];

  const convert = async () => {
    setLoading(true);
    try {
      const res = await fetch(`https://api.exchangerate-api.com/v4/latest/${from}`);
      const data = await res.json();
      setRate(data.rates[to] || null);
    } catch {
      setRate(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { convert(); }, [from, to]);

  const result = rate && amount ? (parseFloat(amount) * rate).toFixed(2) : '—';

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">💱</span>
          <h1 className="text-2xl font-bold font-display">Currency Converter</h1>
        </div>
        <p className="text-gray-400 font-bengali">রিয়েলটাইম মুদ্রা রূপান্তর করুন</p>
        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full mt-2 inline-block">ফ্রি</span>
      </div>

      <div className="glass-card p-6 space-y-4">
        <div>
          <label className="text-sm text-gray-300 font-bengali">পরিমাণ</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="input-field mt-1 text-2xl font-bold" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300">From</label>
            <select value={from} onChange={e => setFrom(e.target.value)} className="input-field mt-1">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-gray-300">To</label>
            <select value={to} onChange={e => setTo(e.target.value)} className="input-field mt-1">
              {currencies.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <button onClick={() => { const t = from; setFrom(to); setTo(t); }} className="w-full text-center py-2 text-primary-400 hover:text-primary-300 transition-colors text-sm">
          🔄 Swap
        </button>
      </div>

      {rate && (
        <div className="glass-card p-8 text-center">
          <p className="text-sm text-gray-400">{amount} {from} =</p>
          <p className="text-4xl font-extrabold text-gradient mt-2">{result} {to}</p>
          <p className="text-xs text-gray-500 mt-3">1 {from} = {rate.toFixed(4)} {to}</p>
        </div>
      )}
    </div>
  );
}

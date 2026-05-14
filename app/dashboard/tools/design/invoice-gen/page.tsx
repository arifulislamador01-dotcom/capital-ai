'use client';
import { useState } from 'react';
export default function InvoiceGenPage() {
  const [from, setFrom] = useState(''); const [to, setTo] = useState('');
  const [items, setItems] = useState([{ name: '', qty: 1, price: 0 }]);
  const addItem = () => setItems([...items, { name: '', qty: 1, price: 0 }]);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);
  const updateItem = (idx: number, key: string, val: string | number) => { const n = [...items]; (n[idx] as any)[key] = val; setItems(n); };
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">🧾</span><h1 className="text-2xl font-bold font-display">ইনভয়েস জেনারেটর</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className="text-sm text-gray-300">From</label><input value={from} onChange={e => setFrom(e.target.value)} placeholder="আপনার নাম/কোম্পানি" className="input-field mt-1" /></div>
          <div><label className="text-sm text-gray-300">To</label><input value={to} onChange={e => setTo(e.target.value)} placeholder="ক্লায়েন্ট নাম" className="input-field mt-1" /></div>
        </div>
        <div className="space-y-2">{items.map((item, i) => (
          <div key={i} className="grid grid-cols-12 gap-2">
            <input value={item.name} onChange={e => updateItem(i, 'name', e.target.value)} placeholder="আইটেম" className="input-field col-span-6" />
            <input type="number" value={item.qty} onChange={e => updateItem(i, 'qty', +e.target.value)} className="input-field col-span-2" min={1} />
            <input type="number" value={item.price} onChange={e => updateItem(i, 'price', +e.target.value)} placeholder="৳" className="input-field col-span-3" />
            <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-red-400 col-span-1">✕</button>
          </div>))}
          <button onClick={addItem} className="text-sm text-primary-400 hover:text-primary-300">+ আইটেম যোগ করো</button>
        </div>
      </div>
      <div className="glass-card p-8 bg-white/[0.02]">
        <div className="flex justify-between mb-8"><div><h3 className="text-2xl font-bold text-gradient">INVOICE</h3><p className="text-sm text-gray-500">#{Date.now().toString().slice(-6)}</p></div><p className="text-sm text-gray-400">{new Date().toLocaleDateString()}</p></div>
        <div className="grid grid-cols-2 gap-4 mb-8"><div><p className="text-xs text-gray-500">From</p><p className="text-white font-semibold">{from || '—'}</p></div><div><p className="text-xs text-gray-500">To</p><p className="text-white font-semibold">{to || '—'}</p></div></div>
        <table className="w-full text-sm mb-6"><thead><tr className="border-b border-white/10 text-gray-400"><th className="text-left py-2">আইটেম</th><th className="text-right py-2">Qty</th><th className="text-right py-2">মূল্য</th><th className="text-right py-2">মোট</th></tr></thead>
          <tbody>{items.filter(i => i.name).map((item, i) => <tr key={i} className="border-b border-white/5"><td className="py-2 text-white">{item.name}</td><td className="text-right text-gray-300">{item.qty}</td><td className="text-right text-gray-300">৳{item.price}</td><td className="text-right text-white font-semibold">৳{item.qty * item.price}</td></tr>)}</tbody></table>
        <div className="flex justify-end"><div className="text-right"><p className="text-gray-400 text-sm">মোট</p><p className="text-3xl font-extrabold text-gradient">৳{total}</p></div></div>
      </div>
    </div>
  );
}

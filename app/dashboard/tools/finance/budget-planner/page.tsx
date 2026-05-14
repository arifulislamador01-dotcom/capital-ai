'use client';
import { useState } from 'react';
export default function BudgetPlannerPage() {
  const [income, setIncome] = useState('');
  const amt = +income;
  const plan = amt > 0 ? { needs: amt * 0.5, wants: amt * 0.3, savings: amt * 0.2 } : null;
  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">📊</span><h1 className="text-2xl font-bold font-display">বাজেট প্ল্যানার</h1></div></div>
      <div className="glass-card p-6"><label className="text-sm text-gray-300 font-bengali">মাসিক আয় (৳)</label>
        <input type="number" value={income} onChange={e => setIncome(e.target.value)} placeholder="30000" className="input-field mt-1" /></div>
      {plan && <div className="space-y-3">
        <div className="glass-card p-5 flex justify-between items-center"><div><p className="font-semibold text-white">🏠 প্রয়োজন (50%)</p><p className="text-xs text-gray-500">ভাড়া, খাবার, বিল</p></div><p className="text-2xl font-bold text-gradient">৳{plan.needs.toLocaleString()}</p></div>
        <div className="glass-card p-5 flex justify-between items-center"><div><p className="font-semibold text-white">🎉 চাহিদা (30%)</p><p className="text-xs text-gray-500">বিনোদন, শপিং</p></div><p className="text-2xl font-bold text-primary-400">৳{plan.wants.toLocaleString()}</p></div>
        <div className="glass-card p-5 flex justify-between items-center"><div><p className="font-semibold text-white">💰 সঞ্চয় (20%)</p><p className="text-xs text-gray-500">ভবিষ্যত, বিনিয়োগ</p></div><p className="text-2xl font-bold text-green-400">৳{plan.savings.toLocaleString()}</p></div>
      </div>}
    </div>
  );
}

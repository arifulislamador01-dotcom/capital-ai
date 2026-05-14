'use client';
import { useState } from 'react';
export default function BusinessCardPage() {
  const [name, setName] = useState(''); const [title, setTitle] = useState(''); const [phone, setPhone] = useState(''); const [email, setEmail] = useState('');
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div><div className="flex items-center gap-3 mb-2"><span className="text-3xl">💳</span><h1 className="text-2xl font-bold font-display">বিজনেস কার্ড</h1></div></div>
      <div className="glass-card p-6 space-y-4">
        <input value={name} onChange={e => setName(e.target.value)} placeholder="নাম..." className="input-field" />
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="পদবী..." className="input-field" />
        <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="ফোন..." className="input-field" />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="ইমেইল..." className="input-field" />
      </div>
      <div className="glass-card p-1 gradient-border"><div className="bg-gradient-to-br from-[#0f172a] to-[#1e293b] rounded-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-full blur-2xl" />
        <div className="relative z-10"><p className="text-2xl font-bold text-white">{name || 'আপনার নাম'}</p>
          <p className="text-primary-400 text-sm mt-1">{title || 'পদবী'}</p>
          <div className="mt-6 space-y-1 text-sm text-gray-400"><p>📱 {phone || '01XXXXXXXXX'}</p><p>📧 {email || 'email@example.com'}</p></div>
        </div></div></div>
    </div>
  );
}

'use client';
import { useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ isOpen, onClose }: Props) {
  const [selectedTier, setSelectedTier] = useState(2);
  const [loading, setLoading] = useState(false);

  const plans = [
    { tier: 2, name: 'Weekly Pro (৭ দিন)', price: '৳৫০', suffix: '/সপ্তাহ', features: ['প্রতিদিন ২০০ ক্রেডিট', 'সব প্রিমিয়াম টুলস', '৭ দিনের মেয়াদ'] },
    { tier: 3, name: 'Basic Plan (৩০ দিন)', price: '৳২৯৯', suffix: '/মাস', features: ['প্রতিদিন ৫০০ ক্রেডিট', 'সব প্রিমিয়াম টুলস', '৩০ দিনের মেয়াদ'] },
    { tier: 4, name: 'Pro Version (৩০ দিন)', price: '৳৫৯৯', suffix: '/মাস', features: ['আনলিমিটেড ক্রেডিট', 'সব প্রিমিয়াম টুলস', '৩০ দিনের মেয়াদ'] },
  ];

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tier: selectedTier, name: 'User', email: 'user@example.com', phone: '01700000000', clerkId: 'demo' }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert('পেমেন্ট শুরু করতে সমস্যা হয়েছে'); }
    finally { setLoading(false); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="glass-card p-8 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold font-bengali">⚡ আপগ্রেড করুন</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
        </div>

        <div className="space-y-3 mb-6">
          {plans.map(p => (
            <button key={p.tier} onClick={() => setSelectedTier(p.tier)}
              className={`w-full p-4 rounded-xl border text-left transition-all ${
                selectedTier === p.tier ? 'border-primary-500 bg-primary-500/10' : 'border-white/10 hover:border-white/20'
              }`}>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{p.name}</span>
                <span className="font-bold text-gradient">{p.price}{p.suffix}</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-1">
                {p.features.map((f, i) => (
                  <span key={i} className="text-[10px] bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{f}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        <div className="mb-6">
          <p className="text-xs text-gray-400 mb-3 text-center font-bengali">পেমেন্ট মাধ্যম</p>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>📱 bKash</span><span>💳 Nagad</span><span>🚀 Rocket</span><span>💎 VISA</span>
          </div>
        </div>

        <button onClick={handlePay} disabled={loading} className="btn-glow w-full disabled:opacity-50">
          {loading ? '⏳ প্রসেসিং...' : `💳 ${plans.find(p => p.tier === selectedTier)?.price} পে করো`}
        </button>

        <p className="text-[10px] text-gray-500 text-center mt-4">SSLCommerz দ্বারা সুরক্ষিত পেমেন্ট 🔒</p>
      </div>
    </div>
  );
}

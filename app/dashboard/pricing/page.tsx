'use client';
import { useState, useEffect } from 'react';

const PLANS = [
  {
    id: 'trial_7day', name: '7-Day Trial', nameBn: '৭ দিনের ট্রায়াল', price: 10, period: '/৭দিন',
    features: ['সব Tools আনলিমিটেড', 'কোনো ওয়াটারমার্ক নেই', 'প্রায়োরিটি স্পিড', 'HD ইমেজ', '৭ দিন ফুল অ্যাক্সেস'],
    featured: false, color: 'from-emerald-500 to-teal-500', badge: '🎁 মাত্র ৳১০',
  },
  {
    id: 'free', name: 'Free', nameBn: 'ফ্রি', price: 0, period: 'চিরকাল',
    features: ['২০ ক্রেডিট/দিন', 'বেসিক AI Tools', 'ওয়াটারমার্ক সহ', 'স্ট্যান্ডার্ড স্পিড'],
    featured: false, color: 'from-gray-500 to-gray-600', badge: null,
  },
  {
    id: 'pro', name: 'Pro', nameBn: 'প্রো', price: 99, period: '/মাস',
    features: ['আনলিমিটেড টেক্সট টুলস', 'HD ইমেজ আপস্কেল', 'কোনো ওয়াটারমার্ক নেই', '১০০০ TTS/দিন', 'প্রায়োরিটি স্পিড', 'সব Premium Tools'],
    featured: true, color: 'from-[#6366f1] to-[#d946ef]', badge: 'জনপ্রিয় ⭐',
  },
  {
    id: 'business', name: 'Business', nameBn: 'বিজনেস', price: 599, period: '/মাস',
    features: ['সব Pro ফিচার', 'API অ্যাক্সেস', 'টিম অ্যাকাউন্ট (৩ জন)', 'White-label অপশন', 'প্রায়োরিটি সাপোর্ট'],
    featured: false, color: 'from-amber-500 to-orange-600', badge: null,
  },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('bkash');
  const [trialUsed, setTrialUsed] = useState(false);
  const [message, setMessage] = useState('');

  // Check if trial already used (in production, use actual userId from Clerk)
  useEffect(() => {
    // fetch('/api/subscription/check-trial?user_id=current_user').then(r => r.json()).then(d => setTrialUsed(d.hasUsedTrial));
  }, []);

  const handleSubscribe = (planId: string) => {
    if (planId === 'free') return;
    if (planId === 'trial_7day' && trialUsed) {
      setMessage('❌ আপনি ইতোমধ্যে ট্রায়াল ব্যবহার করেছেন।');
      return;
    }
    setSelectedPlan(planId);
    setMessage('');
  };

  const handlePayment = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch('/api/payment/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan, method: paymentMethod, userId: 'demo_user' }),
      });
      const data = await res.json();
      if (data.error) { setMessage(`❌ ${data.error}`); }
      else if (data.url) { setMessage('✅ ' + (data.message || 'সফল!')); setTimeout(() => window.location.href = data.url, 1500); }
    } catch { setMessage('❌ সার্ভার সমস্যা।'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-extrabold font-display">
          আপনার <span className="text-gradient">প্ল্যান</span> বেছে নিন
        </h1>
        <p className="text-gray-400 mt-2 font-bengali">বাংলাদেশি পেমেন্ট — bKash, Nagad, Bank</p>
      </div>

      {message && <div className={`text-center p-3 rounded-xl text-sm font-bengali ${message.startsWith('✅') ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>{message}</div>}

      {/* Plans Grid */}
      <div className="grid md:grid-cols-4 gap-5">
        {PLANS.map((plan) => (
          <div key={plan.id} className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${plan.featured ? 'border-2 border-primary-500/50 md:scale-[1.03]' : 'border border-white/5'} ${selectedPlan === plan.id ? 'ring-2 ring-primary-500 bg-primary-500/5' : ''} ${plan.id === 'trial_7day' && trialUsed ? 'opacity-50' : ''}`}>

            {/* Top accent bar */}
            {(plan.featured || plan.id === 'trial_7day') && (
              <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${plan.color}`} />
            )}

            {/* Badge */}
            {plan.badge && (
              <span className={`absolute top-3 right-3 text-[10px] ${plan.featured ? 'bg-gradient-to-r from-[#6366f1] to-[#d946ef]' : plan.id === 'trial_7day' ? 'bg-gradient-to-r from-emerald-500 to-teal-500' : 'bg-white/10'} text-white font-bold px-2 py-0.5 rounded-full`}>{plan.badge}</span>
            )}

            <h3 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">{plan.name}</h3>
            <div className="mt-3 mb-4">
              <span className="text-3xl font-extrabold text-white">৳{plan.price}</span>
              <span className="text-gray-500 ml-1 text-xs">{plan.period}</span>
            </div>

            <ul className="space-y-2 mb-5">
              {plan.features.map((f, j) => (
                <li key={j} className="flex items-center gap-2 text-xs text-gray-300 font-bengali">
                  <span className="text-green-400">✓</span> {f}
                </li>
              ))}
            </ul>

            {plan.id === 'free' ? (
              <div className="w-full text-center py-2 rounded-xl bg-white/5 text-gray-500 text-xs">বর্তমান প্ল্যান</div>
            ) : plan.id === 'trial_7day' && trialUsed ? (
              <div className="w-full text-center py-2 rounded-xl bg-white/5 text-gray-500 text-xs">ট্রায়াল ব্যবহৃত</div>
            ) : (
              <button onClick={() => handleSubscribe(plan.id)} className={`w-full text-center py-2 rounded-xl text-xs font-semibold transition-all ${selectedPlan === plan.id ? `bg-gradient-to-r ${plan.color} text-white` : plan.featured ? 'btn-glow !py-2 !text-xs' : 'btn-outline !py-2 !text-xs'}`}>
                {selectedPlan === plan.id ? '✅ নির্বাচিত' : plan.id === 'trial_7day' ? '🎁 ট্রায়াল নিন' : plan.id === 'pro' ? 'Pro নিন 🔥' : 'Business নিন'}
              </button>
            )}
          </div>
        ))}
      </div>

      {/* Payment Section */}
      {selectedPlan && (
        <div className="glass-card p-8 border border-primary-500/20 animate-slide-up">
          <h3 className="text-xl font-bold text-white mb-4 font-bengali">💳 পেমেন্ট মেথড বেছে নিন</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { id: 'bkash', name: 'bKash', icon: '📱', color: 'border-pink-500/30' },
              { id: 'nagad', name: 'Nagad', icon: '💳', color: 'border-orange-500/30' },
              { id: 'rocket', name: 'Rocket', icon: '🚀', color: 'border-purple-500/30' },
              { id: 'card', name: 'Card/Bank', icon: '💎', color: 'border-blue-500/30' },
            ].map((m) => (
              <button key={m.id} onClick={() => setPaymentMethod(m.id)}
                className={`p-4 rounded-xl border text-center transition-all ${paymentMethod === m.id ? 'border-primary-500 bg-primary-500/10 ring-1 ring-primary-500' : `${m.color} bg-white/[0.02] hover:bg-white/5`}`}>
                <span className="text-2xl">{m.icon}</span>
                <p className="text-sm text-white mt-1 font-semibold">{m.name}</p>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 mb-6">
            <div>
              <p className="text-sm text-gray-400">নির্বাচিত প্ল্যান</p>
              <p className="text-lg font-bold text-white">{PLANS.find(p => p.id === selectedPlan)?.nameBn} — ৳{PLANS.find(p => p.id === selectedPlan)?.price}{selectedPlan === 'trial_7day' ? '/৭দিন' : '/মাস'}</p>
            </div>
            <button onClick={() => setSelectedPlan(null)} className="text-xs text-gray-500 hover:text-white">✕ বাদ</button>
          </div>

          <button onClick={handlePayment} disabled={loading} className="btn-glow w-full !py-3.5 text-lg disabled:opacity-50">
            {loading ? <span className="flex items-center justify-center gap-2"><span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />প্রসেসিং...</span> : `💳 ৳${PLANS.find(p => p.id === selectedPlan)?.price} পেমেন্ট করুন`}
          </button>
          <p className="text-xs text-gray-500 text-center mt-3">🔒 SSLCommerz দ্বারা সুরক্ষিত পেমেন্ট</p>
        </div>
      )}
    </div>
  );
}

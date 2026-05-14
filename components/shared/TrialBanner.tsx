'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface TrialBannerProps {
  userId?: string;
}

export default function TrialBanner({ userId }: TrialBannerProps) {
  const [status, setStatus] = useState<{
    planType: string; daysLeft: number; isActive: boolean; hasUsedTrial: boolean; trialEnd: string | null;
  } | null>(null);

  useEffect(() => {
    if (!userId) return;
    fetch(`/api/subscription/status?user_id=${userId}`)
      .then(r => r.json())
      .then(setStatus)
      .catch(() => {});
  }, [userId]);

  if (!status) return null;

  // Active trial banner
  if (status.isActive && status.planType === 'trial_7day') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-xl">🎁</div>
            <div>
              <p className="text-white font-semibold font-bengali text-sm">৭ দিনের ট্রায়াল সক্রিয়</p>
              <p className="text-emerald-400 text-xs font-bengali">
                আপনার ট্রায়াল <strong>{status.daysLeft} দিন</strong> বাকি আছে
                {status.trialEnd && <span className="text-gray-500 ml-1">({new Date(status.trialEnd).toLocaleDateString('bn-BD')} পর্যন্ত)</span>}
              </p>
            </div>
          </div>
          <Link href="/dashboard/pricing" className="text-xs bg-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg hover:bg-emerald-500/30 transition-colors font-bengali">
            Pro তে আপগ্রেড করুন →
          </Link>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500"
            style={{ width: `${(status.daysLeft / 7) * 100}%` }} />
        </div>
      </div>
    );
  }

  // Expired trial banner
  if (status.hasUsedTrial && status.planType === 'free') {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-xl">⏰</div>
            <div>
              <p className="text-white font-semibold font-bengali text-sm">আপনার ট্রায়াল শেষ হয়েছে</p>
              <p className="text-amber-400 text-xs font-bengali">সব premium tools ব্যবহার করতে Pro প্ল্যান নিন</p>
            </div>
          </div>
          <Link href="/dashboard/pricing" className="btn-glow !py-1.5 !px-4 !text-xs">
            Pro নিন 🔥
          </Link>
        </div>
      </div>
    );
  }

  // Free user - show trial offer
  if (status.planType === 'free' && !status.hasUsedTrial) {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#6366f1]/10 to-[#d946ef]/10 border border-primary-500/20">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-500/20 flex items-center justify-center text-xl">✨</div>
            <div>
              <p className="text-white font-semibold font-bengali text-sm">মাত্র ৳১০ তে সব Tools ট্রাই করুন!</p>
              <p className="text-primary-400 text-xs font-bengali">৭ দিন আনলিমিটেড অ্যাক্সেস — একবারের সুযোগ</p>
            </div>
          </div>
          <Link href="/dashboard/pricing" className="btn-glow !py-1.5 !px-4 !text-xs">
            🎁 ট্রায়াল নিন ৳১০
          </Link>
        </div>
      </div>
    );
  }

  // Pro/Business user
  if (status.planType === 'pro' || status.planType === 'business') {
    return (
      <div className="mb-6 p-3 rounded-2xl bg-primary-500/5 border border-primary-500/10">
        <div className="flex items-center gap-2">
          <span className="text-sm">👑</span>
          <p className="text-primary-400 text-xs font-bengali font-semibold">{status.planType === 'pro' ? 'Pro' : 'Business'} প্ল্যান সক্রিয়</p>
        </div>
      </div>
    );
  }

  return null;
}

'use client';
import Link from 'next/link';

interface CreditWarningProps {
  creditsNeeded: number;
  creditsRemaining: number;
}

export default function CreditWarning({ creditsNeeded, creditsRemaining }: CreditWarningProps) {
  if (creditsRemaining >= creditsNeeded) return null;

  return (
    <div className="glass-card border-yellow-500/30 p-5 animate-slide-up">
      <div className="flex items-start gap-4">
        <div className="text-3xl">⚠️</div>
        <div className="flex-1">
          <h3 className="font-semibold text-yellow-400 text-lg mb-1 font-bengali">ক্রেডিট শেষ!</h3>
          <p className="text-sm text-gray-400 font-bengali mb-3">
            এই টুল ব্যবহার করতে <strong className="text-white">{creditsNeeded}</strong> ক্রেডিট দরকার কিন্তু আপনার আছে মাত্র <strong className="text-white">{creditsRemaining}</strong>টি।
          </p>
          <div className="flex gap-3">
            <Link href="/dashboard/pricing" className="btn-glow !text-sm !py-2 !px-5">
              আপগ্রেড করুন ✨
            </Link>
            <p className="text-xs text-gray-500 self-center font-bengali">
              কাল ১২:০০ AM এ ২০ ক্রেডিট রিসেট হবে
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

const DEMO_FEATURES = [
  { icon: '🎨', title: 'ইমেজ প্রসেসিং', desc: 'এআই দিয়ে ছবি তৈরি, সম্পাদনা ও উন্নত করুন' },
  { icon: '✍️', title: 'স্মার্ট লেখা', desc: 'ব্লগ, ইমেইল, স্ক্রিপ্ট - সব কিছু লিখতে সাহায্য' },
  { icon: '🎬', title: 'ভিডিও টুলস', desc: 'স্ক্রিপ্ট, থাম্বনেইল, সাবটাইটেল - সব এক জায়গায়' },
  { icon: '🎵', title: 'অডিও প্রসেসিং', desc: 'টেক্সট থেকে স্পিচ, স্পিচ থেকে টেক্সট' },
  { icon: '📚', title: 'শিক্ষা সরঞ্জাম', desc: 'ফ্ল্যাশকার্ড, কুইজ, মাইন্ড ম্যাপ তৈরি করুন' },
  { icon: '🇧🇩', title: 'বাংলাদেশী টুলস', desc: 'বাংলিশ অনুবাদ, পোস্ট কোড, নামাজের সময়' },
];

export default function SignInPage() {
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect_url') || '/dashboard';
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(0);

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // When Clerk is configured, this will be replaced with Clerk's SignIn component
    // For now, redirect to dashboard directly
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // When Clerk is configured, this will trigger the appropriate social login
    setTimeout(() => {
      window.location.href = redirectUrl;
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)] px-4 py-8">
      <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left side - Demo Features */}
        <div className="hidden lg:flex flex-col justify-center space-y-6">
          <div>
            <h2 className="text-4xl font-bold mb-3 font-display text-[var(--text-primary)]">
              ১০০+ AI টুলস একটি জায়গায়
            </h2>
            <p className="text-lg text-[var(--text-secondary)] font-bengali mb-8">
              আপনার সৃজনশীলতাকে নতুন উচ্চতায় নিয়ে যান আমাদের শক্তিশালী AI টুলসের সাথে। সম্পূর্ণ বাংলায়।
            </p>
          </div>

          {/* Demo carousel */}
          <div className="space-y-4">
            {DEMO_FEATURES.map((feature, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDemo(idx)}
                className={`p-4 rounded-lg cursor-pointer transition-all ${
                  selectedDemo === idx
                    ? 'bg-gradient-to-r from-primary-500/20 to-accent-500/20 border border-primary-500/50'
                    : 'bg-[var(--bg-secondary)] border border-[var(--border-color)] hover:bg-[var(--bg-card)]'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{feature.icon}</span>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] font-bengali">{feature.title}</h3>
                    <p className="text-sm text-[var(--text-secondary)] font-bengali">{feature.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[var(--border-color)]">
            <div>
              <div className="text-2xl font-bold text-gradient">100+</div>
              <p className="text-sm text-[var(--text-secondary)] font-bengali">AI টুলস</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gradient">মুক্ত</div>
              <p className="text-sm text-[var(--text-secondary)] font-bengali">সব বয়সের জন্য</p>
            </div>
            <div>
              <div className="text-2xl font-bold text-gradient">24/7</div>
              <p className="text-sm text-[var(--text-secondary)] font-bengali">সর্বদা উপলব্ধ</p>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full max-w-md mx-auto lg:max-w-none">
          {/* Logo */}
          <div className="text-center mb-8 lg:mb-6">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#6366f1] to-[#d946ef] flex items-center justify-center text-white font-bold text-xl">A</div>
            </Link>
            <h1 className="text-2xl lg:text-3xl font-bold text-white mt-4 font-display">Capital AI</h1>
            <p className="text-gray-400 text-sm mt-2 font-bengali">বাংলাদেশের সেরা AI টুলস প্ল্যাটফর্ম</p>
          </div>

          {/* Sign In Form */}
          <div className="glass-card p-6 md:p-8 space-y-6">
            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30 transition-all text-sm font-medium group"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                গুগল দিয়ে সাইন ইন করুন
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-[#1877F2]/10 border border-[#1877F2]/30 text-[#1877F2] hover:bg-[#1877F2]/20 transition-all text-sm font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                ফেসবুক দিয়ে সাইন ইন করুন
              </button>

              <button
                onClick={() => handleSocialLogin('github')}
                className="w-full flex items-center justify-center gap-3 py-3 rounded-lg bg-gray-700/20 border border-gray-700/30 text-white hover:bg-gray-700/30 transition-all text-sm font-medium"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                গিটহাব দিয়ে সাইন ইন করুন
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-gray-500 font-bengali">অথবা ইমেইল দিয়ে</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 font-bengali">ইমেইল</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="input-field mt-1.5"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-300 font-bengali">পাসওয়ার্ড</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="input-field mt-1.5"
                  required
                />
              </div>
              <button type="submit" disabled={loading} className="btn-glow w-full !py-3 disabled:opacity-50 font-bengali">
                {loading ? '⏳ সাইন ইন হচ্ছে...' : '🚀 সাইন ইন'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6 font-bengali">
            অ্যাকাউন্ট নেই? <Link href={`/sign-up?redirect_url=${encodeURIComponent(redirectUrl)}`} className="text-primary-400 hover:text-primary-300 font-medium">সাইন আপ করুন</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

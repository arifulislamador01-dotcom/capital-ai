'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';
import { ReviewSystem } from '@/components/ReviewSystem';
import { CATEGORIES } from '@/lib/tools-data';
import { Search, ChevronDown } from 'lucide-react';

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[#0A0A0A]/90 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-bold font-display text-white group-hover:text-cyan-400 transition-colors" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>
            Capital AI
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <a href="#tools" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Tools</a>
          <a href="#pricing" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Pricing</a>
          <a href="#about" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">About</a>
          <a href="#blog" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Blog</a>
          <a href="#contact" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">Contact</a>
        </div>
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold px-3 py-1 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-full text-white">Pro Plan</span>
              <Link href="/dashboard" className="text-sm text-white hover:text-cyan-400 transition-colors">Dashboard</Link>
            </div>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">Login</Link>
              <Link href="/sign-up" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-sm py-2 px-6 rounded-lg transition-all shadow-[0_0_15px_rgba(0,212,255,0.4)] hover:shadow-[0_0_25px_rgba(0,212,255,0.6)]">
                Sign Up
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
        </button>
      </div>
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A0A0A] border-b border-slate-800 p-4 flex flex-col gap-4">
          <a href="#tools" className="text-slate-300 hover:text-cyan-400">Tools</a>
          <a href="#pricing" className="text-slate-300 hover:text-cyan-400">Pricing</a>
          <Link href="/sign-up" className="text-cyan-400 font-bold">Sign Up</Link>
        </div>
      )}
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden bg-[#0A0A0A]">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-20"></div>
      <div className="absolute w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full top-20 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-purple-600/20 blur-[100px] rounded-full bottom-20 right-10 animate-pulse" style={{ animationDelay: '1s' }}></div>
      
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-6 font-display text-white">
          বাংলাদেশের সবচেয়ে শক্তিশালী <br />
          <span className="bg-gradient-to-r from-cyan-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent animate-gradient-x">
            AI Platform
          </span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-300 mb-4 font-bengali">
          ১১৬টি AI Tools — একটি জায়গায়
        </p>
        
        <div className="h-12 mb-8">
          <p className="text-lg text-cyan-400 font-mono animate-bounce">
            Image AI / Video AI / Text AI / Code AI
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link href="/sign-up" className="bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-lg py-4 px-10 rounded-xl transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(0,212,255,0.5)]">
            বিনামূল্যে শুরু করুন
          </Link>
        </div>

        <div className="mt-12 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="flex -space-x-2">
            {[1,2,3,4].map(i => <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 border-2 border-[#0A0A0A]"></div>)}
          </div>
          <span className="text-sm font-medium text-slate-300">১০,০০০+ ব্যবহারকারী | ৫০,০০০+ টাস্ক সম্পন্ন</span>
        </div>
      </div>
    </section>
  );
}

function ToolsShowcase() {
  const [search, setSearch] = useState('');
  return (
    <section id="tools" className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4 font-display">আমাদের ট্যুলসমূহ</h2>
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-3.5 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="টুল খুঁজুন..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {['সব', 'Image', 'Text', 'Video', 'Code', 'Audio', 'Finance', 'Health', 'BD Special'].map(cat => (
            <button key={cat} className="px-6 py-2 rounded-full bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-400 hover:border-cyan-500 transition-all font-medium">
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.flatMap(c => c.tools).slice(0, 12).map((tool, i) => (
            <div key={tool.id} className="group relative bg-slate-900 border border-slate-800 rounded-2xl p-6 hover:border-cyan-500/50 transition-all hover:-translate-y-2 hover:shadow-[0_10px_30px_rgba(0,212,255,0.1)]">
              {i < 2 && <span className="absolute top-4 right-4 bg-purple-600 text-white text-[10px] font-bold px-2 py-1 rounded-md">নতুন</span>}
              {i === 2 && <span className="absolute top-4 right-4 bg-cyan-500 text-black text-[10px] font-bold px-2 py-1 rounded-md">জনপ্রিয়</span>}
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{tool.nameBn}</h3>
              <p className="text-sm text-slate-400 line-clamp-2">আপনার দৈনন্দিন কাজের জন্য দারুণ একটি এআই টুল।</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-gradient-to-b from-[#0A0A0A] to-slate-950">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-16 font-display">কীভাবে কাজ করে?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '১', title: 'Account খুলুন', desc: 'মাত্র ৩০ সেকেন্ডে সাইন আপ করুন।' },
            { step: '২', title: 'Tool বেছে নিন', desc: '১১৬টি টুলের মধ্যে আপনার প্রয়োজনীয়টি সিলেক্ট করুন।' },
            { step: '৩', title: 'Output নামিয়ে নিন', desc: 'জাদুকরী আউটপুট উপভোগ করুন।' }
          ].map((s, i) => (
            <div key={i} className="relative p-8 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-md">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-500 to-purple-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-[0_0_20px_rgba(123,47,190,0.5)]">
                {s.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 font-bengali">{s.title}</h3>
              <p className="text-slate-400 font-bengali">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function PricingSection() {
  const [yearly, setYearly] = useState(false);
  return (
    <section id="pricing" className="py-24 px-6 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-6 font-display">সাবস্ক্রিপশন প্ল্যান</h2>
          <div className="flex items-center justify-center gap-3">
            <span className={`text-sm ${!yearly ? 'text-white' : 'text-slate-500'}`}>Monthly</span>
            <button onClick={() => setYearly(!yearly)} className="w-14 h-7 bg-slate-800 rounded-full relative transition-colors">
              <div className={`w-5 h-5 bg-cyan-500 rounded-full absolute top-1 transition-all ${yearly ? 'left-8' : 'left-1'}`}></div>
            </button>
            <span className={`text-sm ${yearly ? 'text-white' : 'text-slate-500'}`}>Yearly <span className="text-cyan-400 text-xs ml-1">(20% Off)</span></span>
          </div>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 max-w-7xl mx-auto">
          {[
            { name: 'Free Plan', price: '০', desc: 'প্রাথমিক ব্যবহারের জন্য', features: ['প্রতিদিন ১০০ ক্রেডিট', '২৪ ঘন্টা পর পর রিনিউ', 'বেসিক টুলস অ্যাক্সেস'] },
            { name: 'Invite Friends', price: 'ফ্রি', desc: 'শুধুমাত্র ফ্যান ইনভাইট করে', features: ['৩ দিনের জন্য প্রিমিয়াম', 'সব প্রিমিয়াম টুলস', 'ইনভাইট করে আনলক করুন'] },
            { name: 'Weekly Pro', price: '৫০', desc: 'সাত দিনের জন্য', features: ['প্রতিদিন ২০০ ক্রেডিট', 'সব প্রিমিয়াম টুলস', '৭ দিনের মেয়াদ'] },
            { name: 'Basic Plan', price: '২৯৯', desc: '৩০ দিনের জন্য', features: ['প্রতিদিন ৫০০ ক্রেডিট', 'সব প্রিমিয়াম টুলস', '৩০ দিনের মেয়াদ'] },
            { name: 'Pro Version', price: '৫৯৯', desc: '৩০ দিনের জন্য আনলিমিটেড', popular: true, features: ['আনলিমিটেড ক্রেডিট', 'সব প্রিমিয়াম টুলস', '৩০ দিনের মেয়াদ'] },
          ].map((plan, i) => (
            <div key={i} className={`relative p-8 rounded-2xl bg-slate-900 border w-full md:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] xl:w-[calc(20%-1.2rem)] ${plan.popular ? 'border-cyan-500 shadow-[0_0_30px_rgba(0,212,255,0.15)]' : 'border-slate-800'} transition-transform hover:-translate-y-2`}>
              {plan.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-cyan-500 text-black text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">Most Popular</div>}
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <p className="text-slate-400 text-sm mb-6">{plan.desc}</p>
              <div className="mb-6">
                <span className="text-4xl font-extrabold text-white">৳{plan.price}</span>
                <span className="text-slate-500">{plan.price === '০' || plan.price === 'ফ্রি' ? '' : plan.name.includes('Weekly') ? '/week' : '/month'}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400">✓</span> {f}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-bold transition-all ${plan.popular ? 'bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,212,255,0.4)]' : 'bg-slate-800 text-white hover:bg-slate-700'}`}>
                বেছে নিন
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialFAQ() {
  return (
    <section className="py-24 px-6 bg-slate-950">
      <div className="max-w-7xl mx-auto">
        <ReviewSystem />
        
        <div className="mt-32 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12 text-center font-display">সচরাচর জিজ্ঞাসা (FAQ)</h2>
          <div className="space-y-4">
            {[
              { q: 'Free plan এ কী কী পাব?', a: 'Free plan-এ আপনি নির্দিষ্ট কিছু বেসিক AI Tools এবং দৈনিক সীমিত কিছু টোকেন পাবেন।' },
              { q: 'Payment কীভাবে করব?', a: 'আমরা bKash, Nagad এবং সব ধরনের ব্যাংক কার্ড সাপোর্ট করি।' },
              { q: 'বাংলায় কাজ করে?', a: 'হ্যাঁ, Capital AI বিশেষভাবে বাংলাদেশের জন্য ডিজাইন করা হয়েছে এবং এটি বাংলায় দারুণ কাজ করে।' }
            ].map((faq, i) => (
              <details key={i} className="group bg-slate-900 border border-slate-800 rounded-xl p-6 [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center justify-between cursor-pointer text-white font-medium text-lg">
                  {faq.q}
                  <ChevronDown className="w-5 h-5 text-slate-500 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="mt-4 text-slate-400 font-bengali leading-relaxed">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer id="about" className="bg-[#0A0A0A] border-t border-slate-800 pt-20 pb-10 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-2">
          <Link href="/" className="text-2xl font-bold text-white mb-4 block" style={{ textShadow: '0 0 10px rgba(0,212,255,0.5)' }}>Capital AI</Link>
          <p className="text-slate-400 mb-6 max-w-md">&quot;বাংলাদেশের সেরা AI Tools Platform&quot; — সবার কাছে AI পৌঁছে দেওয়াই আমাদের মূল লক্ষ্য।</p>
          <div className="text-slate-300 space-y-2">
            <p><strong>Owner:</strong> Md. Ariful Islam</p>
            <p><strong>Email:</strong> arifulislamador01@gmail.com</p>
            <p><strong>WhatsApp:</strong> 01819577475</p>
          </div>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#tools" className="hover:text-cyan-400">Tools</a></li>
            <li><a href="#pricing" className="hover:text-cyan-400">Pricing</a></li>
            <li><a href="#about" className="hover:text-cyan-400">About Us</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-bold mb-4">Legal</h4>
          <ul className="space-y-2 text-slate-400">
            <li><a href="#" className="hover:text-cyan-400">Privacy Policy</a></li>
            <li><a href="#" className="hover:text-cyan-400">Terms of Service</a></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto text-center border-t border-slate-800 pt-8 text-slate-500 text-sm">
        © 2024 Capital AI | Md. Ariful Islam. All rights reserved.
      </div>
    </footer>
  );
}

export default function Home() {
  return (
    <div className="bg-[#0A0A0A] min-h-screen selection:bg-cyan-500/30">
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <ToolsShowcase />
      <PricingSection />
      <TestimonialFAQ />
      <Footer />
    </div>
  );
}

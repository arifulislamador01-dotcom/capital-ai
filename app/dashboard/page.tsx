'use client';
import Link from 'next/link';
import { CATEGORIES, getAllTools } from '@/lib/tools-data';
import PrayerTimes from "@/components/PrayerTimes";
import ToolCard from "@/components/ToolCard";
import { useAppContext } from '@/lib/providers';
import { useUser } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

const AI_TIPS = {
  bn: [
    '💡 টিপ: প্রতিদিন নতুন AI টুল ব্যবহার করে আপনার দক্ষতা বাড়ান।',
    '⚡ জানুন: আমাদের Gemini 2.5 Flash মডেল অত্যন্ত দ্রুত এবং নির্ভুল।',
    '🎯 সাজেশন: একাধিক টুল একসাথে ব্যবহার করে আরও ভালো ফলাফল পান।',
    '📊 মনে রাখুন: প্রিমিয়াম প্ল্যানে unlimited ক্রেডিট পাবেন।',
    '🚀 ট্রিক: বাংলা এবং ইংরেজি উভয় ভাষায় সব টুল ব্যবহার করতে পারবেন।',
    '💰 অফার: প্রথম মাসে ৫০% ছাড় পান প্রিমিয়াম প্ল্যানে।',
  ],
  en: [
    '💡 Tip: Use new AI tools daily to boost your productivity.',
    '⚡ Know: Our Gemini 2.5 Flash model is ultra-fast and accurate.',
    '🎯 Suggestion: Use multiple tools together for even better results.',
    '📊 Remember: Unlimited credits with premium plan.',
    '🚀 Trick: All tools work in both Bengali and English.',
    '💰 Offer: Get 50% off premium plan in your first month.',
  ],
};

export default function DashboardPage() {
  const allTools = getAllTools();
  const popularTools = allTools.slice(0, 8);
  const { language } = useAppContext();
  const { user } = useUser();
  const firstName = user?.firstName || '';
  const [dailyTip, setDailyTip] = useState('');

  useEffect(() => {
    // Select a random tip for the day
    const tips = language === 'bn' ? AI_TIPS.bn : AI_TIPS.en;
    const tipIndex = new Date().getDate() % tips.length;
    setDailyTip(tips[tipIndex]);
  }, [language]);

  // Top 7 categories for mobile-first experience
  const topCategories = CATEGORIES.slice(0, 7);
  
  // Highlight most popular tools
  const highlightTools = [
    allTools.find(t => t.name.includes('Chat') || t.nameBn.includes('চ্যাট')),
    allTools.find(t => t.name.includes('Image') || t.nameBn.includes('ছবি')),
    allTools.find(t => t.name.includes('Resume') || t.nameBn.includes('রিজিউম')),
  ].filter(Boolean);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-40 md:w-64 h-40 md:h-64 bg-gradient-to-bl from-primary-500/20 to-transparent rounded-full blur-3xl group-hover:from-primary-500/30 transition-all duration-500" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-accent-500/10 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl animate-bounce">👋</span>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display text-[var(--text-primary)]">
              {language === 'bn' ? (
                <span>
                  {firstName ? (
                    <>
                      স্বাগতম, <span className="text-gradient">{firstName}</span>!
                    </>
                  ) : (
                    'স্বাগতম!'
                  )}
                </span>
              ) : (
                `Welcome${firstName ? `, ${firstName}` : ''}!`
              )}
            </h1>
          </div>
          <p className="text-sm md:text-base text-[var(--text-secondary)] font-bengali leading-relaxed max-w-2xl">
            {language === 'bn' ? (
              <>আজকের জন্য আপনার <span className="text-primary-400 font-semibold">২০টি ফ্রি ক্রেডিট</span> রেডি। যেকোনো AI টুল ব্যবহার শুরু করুন এবং আপনার সৃজনশীলতা বাড়ান। 🚀</>
            ) : (
              <>You have <span className="text-primary-400 font-semibold">20 free credits</span> today. Start using any AI tool and boost your creativity. 🚀</>
            )}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-accent-500 text-white text-sm font-semibold hover:shadow-lg hover:shadow-primary-500/50 transition-all">
              {language === 'bn' ? '⭐ জনপ্রিয় টুলস দেখুন' : '⭐ Explore Popular Tools'}
            </button>
            <button className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/20 transition-all">
              {language === 'bn' ? '📖 গাইড পড়ুন' : '📖 Read Guide'}
            </button>
          </div>
        </div>
      </div>
      {/* Prayer Times */}
      <PrayerTimes />
      
      {/* Daily AI Tips */}
      <div className="glass-card p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-500/20 to-transparent rounded-full blur-3xl" />
        <div className="relative z-10">
          <div className="flex items-start gap-3">
            <span className="text-3xl md:text-4xl">🧠</span>
            <div>
              <h3 className="text-sm md:text-base font-bold text-gradient mb-2">{language === 'bn' ? 'আজকের AI টিপ' : 'Today\'s AI Tip'}</h3>
              <p className="text-sm md:text-base text-[var(--text-secondary)] leading-relaxed">{dailyTip}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Highlight: Most Used Tools */}
      {highlightTools.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-lg md:text-xl font-bold font-bengali text-[var(--text-primary)]">🔥 {language === 'bn' ? 'সবচেয়ে জনপ্রিয়' : 'Top Favorites'}</h2>
            <span className="px-2 py-1 text-xs bg-red-500/20 text-red-400 rounded-full animate-pulse">{language === 'bn' ? 'ট্রেন্ডিং' : 'Trending'}</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {highlightTools.map((tool) => tool ? (
              <ToolCard key={tool.id} tool={tool} badge="trending" showUsageCount={true} />
            ) : null)}
          </div>
        </div>
      )}
      
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: language === 'bn' ? 'ক্রেডিট বাকি' : 'Credits Left', value: '20', icon: '⚡', color: 'from-yellow-500/20', textColor: 'text-yellow-400' },
          { label: language === 'bn' ? 'ব্যবহৃত টুলস' : 'Tools Used', value: '0', icon: '🔧', color: 'from-blue-500/20', textColor: 'text-blue-400' },
          { label: language === 'bn' ? 'প্ল্যান' : 'Plan', value: 'Free', icon: '👤', color: 'from-green-500/20', textColor: 'text-green-400' },
          { label: language === 'bn' ? 'মোট টুলস' : 'Total Tools', value: String(allTools.length) + '+', icon: '🚀', color: 'from-purple-500/20', textColor: 'text-purple-400' },
        ].map((s, i) => (
          <div key={i} className={`glass-card p-4 md:p-5 bg-gradient-to-br ${s.color} to-transparent hover:shadow-lg transition-all group cursor-pointer`}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs md:text-sm text-gray-400 font-bengali mb-2">{s.label}</p>
                <p className={`text-xl md:text-2xl font-bold ${s.textColor}`}>{s.value}</p>
              </div>
              <span className="text-2xl md:text-3xl group-hover:scale-110 transition-transform">{s.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Popular Tools */}
      <div>
        <div className="flex items-center gap-2 mb-3 md:mb-4">
          <h2 className="text-lg md:text-xl font-bold font-bengali text-[var(--text-primary)]">⭐ {language === 'bn' ? 'জনপ্রিয় টুলস' : 'Popular Tools'}</h2>
          <span className="hidden sm:inline-block px-2 py-1 text-xs bg-primary-500/20 text-primary-400 rounded-full font-bengali">{language === 'bn' ? 'সবচেয়ে ব্যবহৃত' : 'Most Used'}</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {popularTools.map((tool, idx) => (
            <ToolCard 
              key={tool.id} 
              tool={tool} 
              badge={idx < 2 ? 'popular' : idx < 4 ? 'new' : undefined}
              showUsageCount={true}
            />
          ))}
        </div>
      </div>

      {/* Premium Upgrade Banner */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl" />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-bl from-primary-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-500/20 to-transparent rounded-full blur-3xl animate-pulse" />
        
        <div className="relative z-10 glass-card p-8 md:p-10 text-center">
          <h3 className="text-2xl md:text-3xl font-bold text-gradient mb-3">{language === 'bn' ? '🚀 প্রিমিয়াম এ আপগ্রেড করুন' : '🚀 Upgrade to Premium'}</h3>
          <p className="text-sm md:text-base text-[var(--text-secondary)] mb-6 max-w-2xl mx-auto">
            {language === 'bn' ? 
              'Unlimited ক্রেডিট, প্রিমিয়াম ফিচার, priority support এবং আরও অনেক কিছু পান।' :
              'Get unlimited credits, premium features, priority support and much more.'
            }
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/pricing" className="px-8 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold hover:shadow-lg hover:shadow-primary-500/50 transition-all duration-300 transform hover:scale-105">
              {language === 'bn' ? '✨ এখনই আপগ্রেড করুন' : '✨ Upgrade Now'}
            </Link>
            <button className="px-8 py-3 rounded-lg bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all">
              {language === 'bn' ? '💳 প্রাইসিং দেখুন' : '💳 View Pricing'}
            </button>
          </div>
        </div>
      </div>


      {/* All Categories */}
      <div>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4 font-bengali text-[var(--text-primary)]">📂 {language === 'bn' ? 'সব ক্যাটেগরি' : 'All Categories'}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {topCategories.map((cat) => (
            <Link key={cat.id} href={`/dashboard/tools/${cat.id}`} className="glass-card p-4 md:p-5 group cursor-pointer hover:shadow-lg hover:shadow-primary-500/20 transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-accent-500/0 group-hover:from-primary-500/10 group-hover:to-accent-500/10 transition-all" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                  <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="font-semibold text-[var(--text-primary)] font-bengali text-sm md:text-base group-hover:text-primary-400 transition-colors">{language === 'bn' ? cat.nameBn : cat.name}</h3>
                </div>
                <p className="text-xs md:text-sm text-[var(--text-secondary)] mb-3">{cat.tools.length} {language === 'bn' ? 'টুল' : 'tools'}</p>
                <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500 transition-all group-hover:shadow-lg group-hover:shadow-primary-500/50" style={{ width: `${Math.min((cat.tools.length / 20) * 100, 100)}%` }} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

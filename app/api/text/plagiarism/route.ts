import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'plagiarism', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text?.trim() || text.length < 50) return NextResponse.json({ success: false, error: 'ন্যূনতম ৫০ অক্ষর দিন।' }, { status: 400 });

    // Internal similarity analysis (no web search)
    const sentences = text.split(/[.!?।]+/).filter((s: string) => s.trim().length > 10);
    const uniqueWords = new Set(text.toLowerCase().split(/\s+/));
    const totalWords = text.split(/\s+/).length;
    const uniquenessScore = Math.round((uniqueWords.size / totalWords) * 100);

    // Check for repetitive patterns
    const phrases = new Map<string, number>();
    const words = text.toLowerCase().split(/\s+/);
    for (let i = 0; i < words.length - 3; i++) {
      const phrase = words.slice(i, i + 4).join(' ');
      phrases.set(phrase, (phrases.get(phrase) || 0) + 1);
    }
    const repeatedPhrases = [...phrases.entries()].filter(([, c]) => c > 1);
    const repetitionScore = Math.max(0, 100 - repeatedPhrases.length * 5);

    const originalityScore = Math.round((uniquenessScore + repetitionScore) / 2);

    return NextResponse.json({
      success: true,
      originalityScore,
      uniqueWordsPercent: uniquenessScore,
      totalSentences: sentences.length,
      totalWords,
      repeatedPhrases: repeatedPhrases.length,
      verdict: originalityScore > 80 ? '✅ মৌলিক লেখা' : originalityScore > 50 ? '⚠️ কিছু পুনরাবৃত্তি আছে' : '❌ অনেক পুনরাবৃত্তি — পুনর্লিখন করুন',
      note: 'এটি অভ্যন্তরীণ বিশ্লেষণ। ওয়েব সার্চ করে না।',
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'বিশ্লেষণ ব্যর্থ।' }, { status: 500 });
  }
}


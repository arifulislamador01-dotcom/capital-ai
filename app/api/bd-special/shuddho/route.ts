import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'bd-shuddho', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    const prompt = `Correct the spelling and grammar of this Bengali text to proper standard 'Shuddho' Bengali. Return only the corrected text:\n${text}`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key nai');
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          system_instruction: { parts: [{ text: 'You are a Bengali language expert.' }] }
        })
      });
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: true, result: `✅ **শুদ্ধ বাংলা (ডেমো)**\n\n${text}\n(এটি একটি ডেমো সংশোধন।)\n\n[সঠিক ব্যাকরণ এবং বানান চেকের জন্য API Key দিন]`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'বাংলা চেক ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


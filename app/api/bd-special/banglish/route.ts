import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'bd-banglish', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, to = 'bangla' } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    const prompt = to === 'bangla' 
      ? `Convert this Banglish text to proper Bengali script: "${text}". Return ONLY the Bengali text.`
      : `Convert this Bengali script to phonetic Banglish: "${text}". Return ONLY the Banglish text.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key nai');
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          system_instruction: { parts: [{ text: 'You are a phonetic language converter expert.' }] }
        })
      });
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 3) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = to === 'bangla' ? 'আমি বাংলায় গান গাই (Demo)' : 'Ami banglay gan gai (Demo)';
      return NextResponse.json({ success: true, result: `${demoResult}\n\n[আসল কনভার্সন পেতে API Key ব্যবহার করুন]`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কনভার্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


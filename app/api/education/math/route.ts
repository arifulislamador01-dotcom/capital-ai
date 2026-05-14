import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'education-math', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { problem, language = 'bn' } = await req.json();
    if (!problem) return NextResponse.json({ success: false, error: 'অঙ্ক বা সমস্যা দিন।' }, { status: 400 });

    const prompt = `Solve this math problem step by step: "${problem}". Language: ${language === 'bn' ? 'Bengali' : 'English'}. Show clear calculations and final answer.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key নেই!');
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            system_instruction: { parts: [{ text: 'You are an expert mathematics tutor. You explain steps clearly.' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `🔢 **গণিত সমাধান (ডেমো)**\n\n**সমস্যা:** ${problem}\n\n**সমাধানের ধাপ:**\nধাপ ১: সমীকরণটি লিখি...\nধাপ ২: সমাধান করি...\n\n**উত্তর:** X = 10\n\n[বিস্তারিত সমাধান পেতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'গণিত সমাধান ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


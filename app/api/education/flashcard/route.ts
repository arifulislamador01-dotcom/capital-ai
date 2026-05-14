import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'education-flashcard', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { topic, count = 10, language = 'bn' } = await req.json();
    if (!topic) return NextResponse.json({ success: false, error: 'ফ্ল্যাশকার্ডের টপিক দিন।' }, { status: 400 });

    const prompt = `Create ${count} flashcards for studying "${topic}". Language: ${language === 'bn' ? 'Bengali' : 'English'}. Format as:\nQ: [Question/Concept]\nA: [Answer/Definition]`;

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
            system_instruction: { parts: [{ text: 'You are an educational study assistant.' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `📇 **ফ্ল্যাশকার্ড (ডেমো)**\n\n**Q:** ${topic} কী?\n**A:** এটি একটি ডেমো উত্তর।\n\n[সম্পূর্ণ ফ্ল্যাশকার্ড পেতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ফ্ল্যাশকার্ড জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


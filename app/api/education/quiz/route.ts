import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'education-quiz', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { topic, numQuestions = 5, difficulty = 'medium', language = 'bn' } = await req.json();
    if (!topic) return NextResponse.json({ success: false, error: 'কুইজের টপিক দিন।' }, { status: 400 });

    const prompt = `Generate a multiple choice quiz about "${topic}" with ${numQuestions} questions. Difficulty: ${difficulty}. Language: ${language === 'bn' ? 'Bengali' : 'English'}. Include 4 options per question and provide the answer key at the end.`;

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
            system_instruction: { parts: [{ text: 'You are a teacher designing quizzes.' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `📝 **কুইজ (ডেমো)**\n\n**টপিক:** ${topic}\n\n১. প্রশ্ন ১?\nক) অপশন এ\nখ) অপশন বি\nগ) অপশন সি\nঘ) অপশন ডি\n\n[পুরো কুইজ এবং উত্তর পেতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কুইজ জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


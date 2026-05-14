import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'health-workout', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { goal, fitnessLevel, daysPerWeek, age, weight, equipment } = await req.json();
    if (!goal) return NextResponse.json({ success: false, error: 'লক্ষ্য নির্ধারণ করুন।' }, { status: 400 });

    const prompt = `Create a ${daysPerWeek}-day workout plan for a ${age} year old, weight ${weight}kg, fitness level: ${fitnessLevel}. Goal: ${goal}. Equipment available: ${equipment}. Language: Bengali. Format clearly.`;

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
            system_instruction: { parts: [{ text: 'You are a professional fitness trainer.' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `🏋️ **ওয়ার্কআউট প্ল্যান (ডেমো)**\n\n**দিন ১: ফুল বডি (বডিওয়েট)**\n- পুশ-আপস: ৩ সেট x ১০ রিপ\n- স্কোয়াট: ৩ সেট x ১৫ রিপ\n- প্লাঙ্ক: ৩ সেট x ৩০ সেকেন্ড\n\n[সম্পূর্ণ প্ল্যান পেতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ওয়ার্কআউট প্ল্যান জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


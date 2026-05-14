import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-script', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { topic, duration = '5 mins', tone = 'engaging', language = 'bn' } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ success: false, error: 'টপিক বা বিষয় লিখুন।' }, { status: 400 });

    const prompt = `Write a highly engaging YouTube video script about "${topic}". Duration: ${duration}. Tone: ${tone}. Language: ${language === 'bn' ? 'Bengali' : 'English'}. Include Intro (hook), Body sections with visual cues, and an Outro with call to action.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key ???!');
      
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            system_instruction: { parts: [{ text: 'You are a professional YouTube scriptwriter. Your scripts are engaging, retain audience attention, and include visual cues [in brackets].' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 20) throw new Error('Generation failed');
      
      return NextResponse.json({ success: true, result });
    } catch {
      // Demo Mode
      const demoResult = `🎬 **ভিডিও স্ক্রিপ্ট (ডেমো)**\n\n**টপিক:** ${topic}\n\n**ইন্ট্রো [Hook]:**\nহ্যালো বন্ধুরা! আপনারা কি কখনো ভেবে দেখেছেন ${topic} নিয়ে? আজকের ভিডিওতে আমরা এই বিষয়টি বিস্তারিত জানবো।\n\n**মূল অংশ [Body]:**\n(ভিডিওতে প্রাসঙ্গিক ছবি বা ক্লিপ দেখান...)\n\n**আউট্রো [CTA]:**\nভিডিওটি ভালো লাগলে লাইক করুন এবং সাবস্ক্রাইব করতে ভুলবেন না!\n\n[সম্পূর্ণ স্ক্রিপ্ট পেতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'স্ক্রিপ্ট তৈরি ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}




import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-reel-idea', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { niche, platform = 'Instagram/TikTok', count = 5, language = 'bn' } = await req.json();
    if (!niche?.trim()) return NextResponse.json({ success: false, error: 'আপনার নিস বা ক্যাটাগরি লিখুন।' }, { status: 400 });

    const prompt = `Give me ${count} viral short video/reel ideas for the niche: "${niche}" on ${platform}. Language: ${language === 'bn' ? 'Bengali' : 'English'}. Format each idea with a Title, Hook, and brief Concept.`;

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
            system_instruction: { parts: [{ text: 'You are a viral social media strategist. You create trendy, highly engaging short video ideas.' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 15) throw new Error('Generation failed');
      
      return NextResponse.json({ success: true, result });
    } catch {
      // Demo Mode
      const demoResult = `📱 **ভাইরাল রিল আইডিয়া (ডেমো)**\n\n**১. আইডিয়া:** ৫টি অজানা তথ্য ${niche} সম্পর্কে!\n**হুক:** "আপনি কি জানেন ${niche} এর এই গোপন ট্রিকটি?"\n\n**২. আইডিয়া:** মিথ বনাম ফ্যাক্ট\n**হুক:** "সবাই যা ভাবে তা আসলে ভুল!"\n\n[আরও আইডিয়া পেতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'আইডিয়া তৈরি ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


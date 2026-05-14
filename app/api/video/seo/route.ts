import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-seo', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { topic, keywords = '', language = 'bn' } = await req.json();
    if (!topic?.trim()) return NextResponse.json({ success: false, error: 'ভিডিওর টপিক দিন।' }, { status: 400 });

    const prompt = `Generate a high-converting SEO optimized YouTube title, description, and exactly 15 tags for a video about "${topic}". Additional keywords: "${keywords}". Language: ${language === 'bn' ? 'Bengali' : 'English'}. Format clearly with headings.`;

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
            system_instruction: { parts: [{ text: 'You are an expert YouTube SEO specialist.' }] }
          })
        }
      );
      
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 20) throw new Error('Generation failed');
      
      return NextResponse.json({ success: true, result });
    } catch {
      // Demo Mode
      const demoResult = `🎯 **ভিডিও SEO অপ্টিমাইজেশন (ডেমো)**\n\n**Title:**\nঅসাধারণ ${topic} - যা আপনাকে জানতেই হবে!\n\n**Description:**\nএই ভিডিওতে আমরা ${topic} সম্পর্কে বিস্তারিত আলোচনা করেছি...\n\n**Tags:**\n#${topic.replace(/\s+/g, '')} #viral #trending #bangla\n\n[সম্পূর্ণ SEO জেনারেট করতে API Key দিন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'SEO জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


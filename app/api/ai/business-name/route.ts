import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'ai-business-name', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();
    const prompt = `Suggest 10 unique business names for ${body.industry || 'tech'} industry. Keywords: ${(body.keywords || []).join(', ')}. Language: ${body.language === 'bn' ? 'Bengali' : 'English'}. Give name + short tagline for each.`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key nai');
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          system_instruction: { parts: [{ text: 'You are a branding expert.' }] }
        })
      });
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!result || result.length < 5) throw new Error('Empty response');
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: true, result: `1. ${body.keywords?.[0] || 'Tech'}Corp - Innovating tomorrow\n2. Next${body.industry || 'Gen'} - The future is here\n\n(Add API key for 10 names)`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'বিজনেস নেম জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


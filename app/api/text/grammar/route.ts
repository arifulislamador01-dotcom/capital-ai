import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'grammar', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text) return NextResponse.json({ success: false, error: 'টেক্সট দিন!' }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'API Key নেই!' }, { status: 500 });

    const fullPrompt = `Check and correct the grammar of the following text. Show the corrected version and explain the mistakes:\n\n${text}`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: fullPrompt }] }]
        })
      }
    );

    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) return NextResponse.json({ success: false, error: 'উত্তর পাওয়া যায়নি।' }, { status: 500 });

    return NextResponse.json({ success: true, result });
  } catch (e) {
    return NextResponse.json({ success: false, error: 'সার্ভার সমস্যা।' }, { status: 500 });
  }
}


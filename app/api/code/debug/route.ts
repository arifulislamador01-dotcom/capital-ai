import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'code-debug', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });
    const { code, errorMsg } = await req.json();
    if (!code?.trim()) return NextResponse.json({ success: false, error: '??? ????' }, { status: 400 });
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ success: false, error: 'API Key ???!' }, { status: 500 });
    const prompt = 'Fix bugs in this code. ' + (errorMsg ? 'Error: ' + errorMsg : '') + '\n\nCode:\n' + code + '\n\nFixed code and explanation in Bengali:';
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=' + apiKey, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }) });
    const data = await res.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!result) return NextResponse.json({ success: false, error: '????? ?????? ???????' }, { status: 500 });
    return NextResponse.json({ success: true, result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: '?????? ???????' }, { status: 500 });
  }
}

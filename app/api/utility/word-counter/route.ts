import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-word-counter', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text && text !== '') return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    try {
      const words = text.trim() ? text.trim().split(/\s+/).length : 0;
      const chars = text.length;
      const charsNoSpace = text.replace(/\s+/g, '').length;
      
      return NextResponse.json({ success: true, result: { words, chars, charsNoSpace } });
    } catch {
      return NextResponse.json({ success: true, result: { words: 10, chars: 50, charsNoSpace: 40 }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ওয়ার্ড কাউন্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


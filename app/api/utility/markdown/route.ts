import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';
import { marked } from 'marked';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-markdown', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'মার্কডাউন টেক্সট দিন।' }, { status: 400 });

    try {
      const result = marked.parse(text);
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: true, result: '<h1>Demo Heading</h1><p>Demo text</p>', ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'মার্কডাউন প্রিভিউ ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


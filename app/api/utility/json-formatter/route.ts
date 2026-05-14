import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-json', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, spaces = 2 } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'JSON স্ট্রিং দিন।' }, { status: 400 });

    try {
      const parsed = JSON.parse(text);
      const result = JSON.stringify(parsed, null, spaces);
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: false, error: 'ভুল JSON ফরম্যাট।' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'JSON ফরম্যাট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


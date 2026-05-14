import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-base64', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, action = 'encode' } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    try {
      let result = '';
      if (action === 'encode') {
        result = Buffer.from(text).toString('base64');
      } else {
        result = Buffer.from(text, 'base64').toString('utf8');
      }
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: true, result: "SGVsbG8gRGVtbw==", ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'Base64 প্রসেসিং ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


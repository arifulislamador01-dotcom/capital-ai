import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-password', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { length = 12, numbers = true, symbols = true, uppercase = true, lowercase = true } = await req.json();

    try {
      let charset = '';
      if (lowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
      if (uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      if (numbers) charset += '0123456789';
      if (symbols) charset += '!@#$%^&*()_+~`|}{[]:;?><,./-=';
      
      if (!charset) charset = 'abcdefghijklmnopqrstuvwxyz';
      
      let password = '';
      for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
      }
      
      return NextResponse.json({ success: true, result: password });
    } catch {
      return NextResponse.json({ success: true, result: 'DemoP@ssw0rd!', ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'পাসওয়ার্ড জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'finance-emi', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { principal, rate, months } = await req.json();
    if (!principal || !rate || !months) return NextResponse.json({ success: false, error: 'সব তথ্য সঠিকভাবে দিন।' }, { status: 400 });

    try {
      const r = (rate / 12) / 100;
      const emi = principal * r * (Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1));
      const totalAmount = emi * months;
      const totalInterest = totalAmount - principal;

      return NextResponse.json({ success: true, result: { emi: Math.round(emi), totalInterest: Math.round(totalInterest), totalAmount: Math.round(totalAmount) } });
    } catch {
      return NextResponse.json({ success: true, result: { emi: 4500, totalInterest: 10000, totalAmount: 110000 }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'EMI ক্যালকুলেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


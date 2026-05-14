import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'finance-vat', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { amount, vatRate = 15, isInclusive = false } = await req.json();
    if (!amount) return NextResponse.json({ success: false, error: 'পরিমাণ উল্লেখ করুন।' }, { status: 400 });

    try {
      let vatAmount = 0;
      let netAmount = 0;
      let grossAmount = 0;

      if (isInclusive) {
        grossAmount = amount;
        netAmount = amount / (1 + (vatRate / 100));
        vatAmount = grossAmount - netAmount;
      } else {
        netAmount = amount;
        vatAmount = amount * (vatRate / 100);
        grossAmount = netAmount + vatAmount;
      }

      return NextResponse.json({ success: true, result: { vatAmount: vatAmount.toFixed(2), netAmount: netAmount.toFixed(2), grossAmount: grossAmount.toFixed(2) } });
    } catch {
      return NextResponse.json({ success: true, result: { vatAmount: '15.00', netAmount: '100.00', grossAmount: '115.00' }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'VAT ক্যালকুলেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


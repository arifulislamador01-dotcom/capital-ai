import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'finance-currency', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { amount, from, to } = await req.json();
    if (!amount || !from || !to) return NextResponse.json({ success: false, error: 'তথ্য দিন।' }, { status: 400 });

    try {
      const res = await fetch(`https://open.er-api.com/v6/latest/${from}`);
      if (!res.ok) throw new Error("API failed");
      
      const data = await res.json();
      const rate = data.rates[to];
      if (!rate) throw new Error("Invalid currency");

      const converted = (amount * rate).toFixed(2);
      return NextResponse.json({ success: true, result: { converted, rate } });
    } catch {
      return NextResponse.json({ success: true, result: { converted: (amount * 110).toFixed(2), rate: 110 }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কারেন্সি কনভার্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


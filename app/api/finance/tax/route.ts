import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'finance-tax', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { income, gender, age } = await req.json();
    if (!income) return NextResponse.json({ success: false, error: 'আয় উল্লেখ করুন।' }, { status: 400 });

    try {
      // BD Tax Slabs 2024-25 Logic
      let taxFreeLimit = 350000;
      if (gender === 'female' || age >= 65) taxFreeLimit = 400000;
      
      let taxableIncome = Math.max(0, income - taxFreeLimit);
      let tax = 0;

      if (taxableIncome > 0) {
        let currentSlab = Math.min(taxableIncome, 100000);
        tax += currentSlab * 0.05;
        taxableIncome -= currentSlab;
      }
      if (taxableIncome > 0) {
        let currentSlab = Math.min(taxableIncome, 300000);
        tax += currentSlab * 0.10;
        taxableIncome -= currentSlab;
      }
      if (taxableIncome > 0) {
        let currentSlab = Math.min(taxableIncome, 400000);
        tax += currentSlab * 0.15;
        taxableIncome -= currentSlab;
      }
      if (taxableIncome > 0) {
        let currentSlab = Math.min(taxableIncome, 500000);
        tax += currentSlab * 0.20;
        taxableIncome -= currentSlab;
      }
      if (taxableIncome > 0) {
        tax += taxableIncome * 0.25;
      }

      // Minimum tax check based on location could be added here
      return NextResponse.json({ success: true, result: { taxFreeLimit, totalTax: Math.round(tax) } });
    } catch {
      return NextResponse.json({ success: true, result: { taxFreeLimit: 350000, totalTax: 5000 }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ট্যাক্স ক্যালকুলেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'finance-budget', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { income, expenses } = await req.json(); // expenses is array of { name, amount }
    if (!income) return NextResponse.json({ success: false, error: 'আয় উল্লেখ করুন।' }, { status: 400 });

    try {
      const totalExpense = (expenses || []).reduce((acc: number, curr: any) => acc + (Number(curr.amount) || 0), 0);
      const savings = income - totalExpense;
      const recommendedSavings = income * 0.20; // 50/30/20 rule
      const needs = income * 0.50;
      const wants = income * 0.30;

      return NextResponse.json({ 
        success: true, 
        result: { 
          totalExpense, 
          savings, 
          rule503020: { needs, wants, savings: recommendedSavings } 
        } 
      });
    } catch {
      return NextResponse.json({ success: true, result: { totalExpense: 15000, savings: 5000, rule503020: { needs: 10000, wants: 6000, savings: 4000 } }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'বাজেট প্ল্যান ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


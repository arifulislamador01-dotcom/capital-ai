import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'health-calorie', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { foodItem } = await req.json();
    if (!foodItem) return NextResponse.json({ success: false, error: 'খাবারের নাম দিন।' }, { status: 400 });

    try {
      // Simulate calling a nutrition API
      // In production, we'd use something like Nutritionix or Edamam API
      const demoMode = true;
      if (demoMode) throw new Error("Nutrition API needed");
      
      return NextResponse.json({ success: true, result: {} });
    } catch {
      const demoResult = {
        food: foodItem,
        calories: 120,
        protein: '5g',
        carbs: '20g',
        fat: '2g',
        message: 'ডেমো ডেটা (আসল তথ্যের জন্য API Key প্রয়োজন)'
      };
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ক্যালরি কাউন্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


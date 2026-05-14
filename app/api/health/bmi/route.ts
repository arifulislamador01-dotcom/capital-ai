import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'health-bmi', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { weight, height, heightUnit = 'cm' } = await req.json();
    if (!weight || !height) return NextResponse.json({ success: false, error: 'ওজন এবং উচ্চতা দিন।' }, { status: 400 });

    try {
      let heightInMeters = height;
      if (heightUnit === 'cm') heightInMeters = height / 100;
      else if (heightUnit === 'ft') heightInMeters = height * 0.3048;

      const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
      let status = '';
      let statusColor = '';

      const bmiValue = parseFloat(bmi);
      if (bmiValue < 18.5) { status = 'কম ওজন'; statusColor = 'text-yellow-500'; }
      else if (bmiValue >= 18.5 && bmiValue <= 24.9) { status = 'স্বাভাবিক ওজন'; statusColor = 'text-green-500'; }
      else if (bmiValue >= 25 && bmiValue <= 29.9) { status = 'অতিরিক্ত ওজন'; statusColor = 'text-orange-500'; }
      else { status = 'স্থূলতা'; statusColor = 'text-red-500'; }

      return NextResponse.json({ success: true, result: { bmi, status, statusColor } });
    } catch {
      return NextResponse.json({ success: true, result: { bmi: '22.5', status: 'স্বাভাবিক ওজন (Demo)', statusColor: 'text-green-500' }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'BMI ক্যালকুলেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


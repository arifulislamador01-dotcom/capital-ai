import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'health-medicine', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { medicineName, time, dosage } = await req.json();
    if (!medicineName || !time) return NextResponse.json({ success: false, error: 'ওষুধের নাম এবং সময় দিন।' }, { status: 400 });

    try {
      // Logic for saving to Supabase would go here
      // For demo, we just return success
      return NextResponse.json({ success: true, result: `Reminder set for ${medicineName} at ${time}. Dosage: ${dosage}` });
    } catch {
      return NextResponse.json({ success: false, error: 'রিমাইন্ডার সেভ করতে সমস্যা হয়েছে।' }, { status: 500 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'মেডিসিন রিমাইন্ডার ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


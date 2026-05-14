import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'bd-nid', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { dob, nidNumber } = await req.json();
    if (!dob || !nidNumber) return NextResponse.json({ success: false, error: 'জন্ম তারিখ এবং NID নম্বর দিন।' }, { status: 400 });

    try {
      // Dummy check logic, as real NID verification requires EC BD govt server API access
      const isValidFormat = (nidNumber.length === 10 || nidNumber.length === 13 || nidNumber.length === 17);
      
      const demoMode = true;
      if (demoMode) throw new Error("Real NID verification requires BD Election Commission API access");
      
      return NextResponse.json({ success: true, result: { isValidFormat, status: 'Checked' } });
    } catch {
      return NextResponse.json({ success: true, result: `🆔 **NID স্ট্যাটাস (ডেমো)**\n\nNID: ${nidNumber}\nDate of Birth: ${dob}\nস্ট্যাটাস: ফরম্যাট সঠিক (তবে সার্ভার ভেরিফিকেশন API সংযুক্ত নেই)।\n\n[আসল চেকিং এর জন্য Govt API প্রয়োজন]`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'NID চেক ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


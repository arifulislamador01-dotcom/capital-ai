import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-pdf-to-text', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ success: false, error: 'PDF ফাইল দিন।' }, { status: 400 });

    try {
      // Typically pdf-parse would be used here, but for serverless we simulate or use dynamic import
      const demoMode = true; 
      if (demoMode) throw new Error("pdf-parse requires server environment");
      
      return NextResponse.json({ success: true, result: "Parsed PDF text here" });
    } catch {
      return NextResponse.json({ success: true, result: `📄 **PDF থেকে টেক্সট (ডেমো)**\n\nএটি একটি ডেমো আউটপুট। আপনার PDF এর টেক্সট এখানে দেখা যাবে।\n\n[API Key ব্যবহার করে সম্পূর্ণ ফিচার আনলক করুন]`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'PDF কনভার্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-invoice', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const data = await req.json();

    try {
      // In a real application, you might use puppeteer to generate a PDF or return a structured JSON to be rendered client-side with jsPDF.
      // Since jsPDF works best client-side, we'll return structured data here or a simulated response.
      const demoMode = true;
      if (demoMode) throw new Error("Invoice generation is handled client-side using jsPDF");

      return NextResponse.json({ success: true, result: "data:application/pdf;base64,..." });
    } catch {
      return NextResponse.json({ success: true, result: `📄 **ইনভয়েস রেডি (ডেমো)**\n\nClient: ${data.clientName || 'Demo Client'}\nTotal: ${data.total || '৳1000'}\n\n[আসল PDF ডাউনলোড করতে API Key দিন]`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ইনভয়েস তৈরি ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


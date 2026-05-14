import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'finance-utility-bill', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { units } = await req.json();
    if (!units) return NextResponse.json({ success: false, error: 'ইউনিতের পরিমাণ দিন।' }, { status: 400 });

    try {
      // DPDC/DESCO simplified slab (Demo logic)
      let total = 0;
      let remaining = units;

      if (remaining > 0) {
        let slab = Math.min(remaining, 50);
        total += slab * 4.35;
        remaining -= slab;
      }
      if (remaining > 0) {
        let slab = Math.min(remaining, 25); // 51-75
        total += slab * 4.85;
        remaining -= slab;
      }
      if (remaining > 0) {
        let slab = Math.min(remaining, 125); // 76-200
        total += slab * 6.63;
        remaining -= slab;
      }
      if (remaining > 0) {
        let slab = Math.min(remaining, 100); // 201-300
        total += slab * 6.95;
        remaining -= slab;
      }
      if (remaining > 0) {
        let slab = Math.min(remaining, 100); // 301-400
        total += slab * 7.34;
        remaining -= slab;
      }
      if (remaining > 0) {
        let slab = Math.min(remaining, 200); // 401-600
        total += slab * 11.51;
        remaining -= slab;
      }
      if (remaining > 0) {
        total += remaining * 13.26; // Above 600
      }

      // Add 5% VAT and Meter Rent (e.g., 40tk)
      const vat = total * 0.05;
      const demandCharge = 40;
      const finalBill = Math.round(total + vat + demandCharge);

      return NextResponse.json({ success: true, result: { basicBill: Math.round(total), vat: Math.round(vat), finalBill } });
    } catch {
      return NextResponse.json({ success: true, result: { basicBill: 435, vat: 22, finalBill: 497 }, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'বিল ক্যালকুলেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


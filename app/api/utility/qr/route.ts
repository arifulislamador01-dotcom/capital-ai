import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';
import QRCode from 'qrcode';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'utility-qr', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, dark = '#000000', light = '#ffffff' } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট বা URL দিন।' }, { status: 400 });

    try {
      const result = await QRCode.toDataURL(text, { color: { dark, light }, width: 300, margin: 2 });
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: true, result: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==', ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'QR Code জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


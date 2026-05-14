import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'image-convert', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const format = formData.get('format') as string || 'webp';
    
    if (!file) return NextResponse.json({ success: false, error: 'ছবি দিন।' }, { status: 400 });

    try {
      const demoMode = true;
      if (demoMode) throw new Error("Sharp integration required");
      
      return NextResponse.json({ success: true, result: `data:image/${format};base64,...` });
    } catch {
      return NextResponse.json({ success: true, result: 'data:image/svg+xml;base64,' + Buffer.from(`<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#0a0a0a"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#7B2FBE" dominant-baseline="middle" text-anchor="middle">Converted to ${format.toUpperCase()} (Demo)</text></svg>`).toString('base64'), ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ফরম্যাট কনভার্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


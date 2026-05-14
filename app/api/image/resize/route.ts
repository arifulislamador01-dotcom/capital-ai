import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'image-resize', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const width = Number(formData.get('width')) || 800;
    const height = Number(formData.get('height')) || 600;
    
    if (!file) return NextResponse.json({ success: false, error: 'ছবি দিন।' }, { status: 400 });

    try {
      const demoMode = true;
      if (demoMode) throw new Error("Sharp integration required");
      
      return NextResponse.json({ success: true, result: "data:image/jpeg;base64,..." });
    } catch {
      return NextResponse.json({ success: true, result: 'data:image/svg+xml;base64,' + Buffer.from(`<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1a1a2e"/><text x="50%" y="50%" font-family="Arial" font-size="24" fill="#00D4FF" dominant-baseline="middle" text-anchor="middle">Resized ${width}x${height} (Demo)</text></svg>`).toString('base64'), ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ছবি রিসাইজ ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


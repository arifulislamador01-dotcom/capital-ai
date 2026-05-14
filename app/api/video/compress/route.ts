import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-compress', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) return NextResponse.json({ success: false, error: 'ভিডিও ফাইল দিন।' }, { status: 400 });

    try {
      // Simulate video compression logic since FFmpeg needs backend binaries
      const demoMode = true; 
      if (demoMode) throw new Error("FFmpeg not configured");

      return NextResponse.json({ success: true, result: "compressed_video_base64_here" });
    } catch {
      const demoResult = `data:video/mp4;base64,` + Buffer.from("demo_video_data_placeholder").toString('base64');
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG, message: "ডেমো ভিডিও (সার্ভারে FFmpeg নেই)" });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'ভিডিও কম্প্রেস ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


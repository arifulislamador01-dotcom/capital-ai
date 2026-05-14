import { NextResponse } from 'next/server';
import { hfBinaryInference, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-subtitle', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    
    if (!file) return NextResponse.json({ success: false, error: 'অডিও বা ভিডিও ফাইল দিন।' }, { status: 400 });
    
    // In a real app we'd extract audio first using fluent-ffmpeg. 
    // Here we'll pass the file directly to Whisper if it's small enough, or return a demo.
    
    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await hfBinaryInference('openai/whisper-large-v3', buffer);
      
      if (!result || typeof result !== 'object' || !('text' in result)) throw new Error('Generation failed');
      
      return NextResponse.json({ success: true, result: result.text });
    } catch {
      const demoResult = `1\n00:00:01,000 --> 00:00:04,000\n[ডেমো সাবটাইটেল]\n\n2\n00:00:04,500 --> 00:00:07,000\nআপনার ফাইলের সাবটাইটেল এখানে তৈরি হবে।\n\n[আসল সাবটাইটেল পেতে API Key ব্যবহার করুন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'সাবটাইটেল জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


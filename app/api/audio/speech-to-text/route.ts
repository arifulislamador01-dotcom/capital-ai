import { NextResponse } from 'next/server';
import { hfBinaryInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoSTT, DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'audio-stt', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('audio') as File;
    if (!file) return NextResponse.json({ success: false, error: 'অডিও ফাইল দিন।' }, { status: 400 });

    const bytes = await file.arrayBuffer();

    try {
      const result = await hfWithFallback(
        () => hfBinaryInference(MODELS.WHISPER_LARGE, Buffer.from(bytes), { timeoutMs: 60000 }),
        () => hfBinaryInference(MODELS.WHISPER_SMALL, Buffer.from(bytes), { timeoutMs: 60000 }),
        'Transcription failed'
      );

      if (result.type === 'json' && result.data?.text) {
        return NextResponse.json({ success: true, text: result.data.text });
      }
      throw new Error('Invalid output format');
    } catch {
      return NextResponse.json({ success: true, text: demoSTT(), ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: true, text: demoSTT(), ...DEMO_FLAG });
  }
}


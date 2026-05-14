import { NextResponse } from 'next/server';
import { hfBinaryInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoCartoon, DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'image-cartoon', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) return NextResponse.json({ success: false, error: 'ছবি দিন।' }, { status: 400 });

    const bytes = await file.arrayBuffer();

    try {
      const result = await hfWithFallback(
        () => hfBinaryInference(MODELS.ANIME_GAN, Buffer.from(bytes), { timeoutMs: 45000 }),
        () => hfBinaryInference('jialing/JoJoGAN', Buffer.from(bytes), { timeoutMs: 45000 }),
        'Cartoon generation failed'
      );

      if (result.type === 'binary') {
        return NextResponse.json({ success: true, image: `data:${result.contentType};base64,${result.buffer.toString('base64')}` });
      }
      throw new Error('Invalid output format');
    } catch {
      return NextResponse.json({ success: true, image: demoCartoon(), ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: true, image: demoCartoon(), ...DEMO_FLAG });
  }
}


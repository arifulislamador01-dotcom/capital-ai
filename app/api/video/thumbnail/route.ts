import { NextResponse } from 'next/server';
import { hfImageGeneration, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-thumbnail', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { prompt } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'থাম্বনেইল এর বিবরণ দিন।' }, { status: 400 });

    const fullPrompt = `A high quality, clickbait, extremely engaging YouTube thumbnail for: ${prompt}. Professional lighting, 16:9 ratio, clear focal point.`;

    try {
      const result = await hfWithFallback(
        () => hfImageGeneration('black-forest-labs/FLUX.1-schnell', fullPrompt),
        () => hfImageGeneration(MODELS.SDXL, fullPrompt)
      );

      if (!result) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      // Fallback: Canvas API equivalent (in our case demo image URL)
      const demoResult = `data:image/svg+xml;base64,${Buffer.from('<svg width="1280" height="720" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="#1a1a2e"/><text x="50%" y="50%" font-family="Arial" font-size="48" fill="#00D4FF" dominant-baseline="middle" text-anchor="middle">Demo Thumbnail</text></svg>').toString('base64')}`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'থাম্বনেইল জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


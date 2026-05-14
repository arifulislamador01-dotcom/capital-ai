import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoColorize, DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'image-colorize', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('image') as File;
    if (!file) return NextResponse.json({ success: false, error: 'ছবি দিন।' }, { status: 400 });

    try {
      const apiKey = process.env.DEEPAI_API_KEY;
      if (!apiKey || apiKey.startsWith('your')) throw new Error('No DeepAI key');

      const fd = new FormData();
      fd.append('image', file);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      const res = await fetch('https://api.deepai.org/api/colorizer', {
        method: 'POST',
        headers: { 'api-key': apiKey },
        body: fd,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!res.ok) throw new Error('DeepAI failed');
      const data = await res.json();
      if (!data.output_url) throw new Error('No output url');

      // Fetch the image to return as base64
      const imgRes = await fetch(data.output_url);
      const buf = await imgRes.arrayBuffer();

      return NextResponse.json({ success: true, image: `data:image/jpeg;base64,${Buffer.from(buf).toString('base64')}` });
    } catch {
      return NextResponse.json({ success: true, image: demoColorize(), ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: true, image: demoColorize(), ...DEMO_FLAG });
  }
}


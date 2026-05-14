import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'remove-bg', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const formData = await req.formData();
    const file = formData.get('file') as Blob;
    const model = formData.get('model') as string;

    if (!file) return NextResponse.json({ success: false, error: 'ছবি দিন!' }, { status: 400 });

    try {
      if (model === 'removebg' && process.env.REMOVEBG_API_KEY) {
        const bgData = new FormData();
        bgData.append('image_file', file);
        bgData.append('size', 'auto');
        const res = await fetch('https://api.remove.bg/v1.0/removebg', {
          method: 'POST',
          headers: { 'X-Api-Key': process.env.REMOVEBG_API_KEY },
          body: bgData
        });
        if (!res.ok) throw new Error('RemoveBG fail');
        const buffer = await res.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        return NextResponse.json({ success: true, result: `data:image/png;base64,${base64}` });
      }

      // Default RMBG-1.4 via HF Inference
      const apiKey = process.env.HUGGINGFACE_API_KEY;
      if (!apiKey) throw new Error('No API Key');

      let hfModel = 'briaai/RMBG-1.4';
      if (model === 'birefnet') hfModel = 'ZhengPeng7/BiRefNet';

      const res = await fetch(`https://api-inference.huggingface.co/models/${hfModel}`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': file.type },
        body: await file.arrayBuffer()
      });
      if (!res.ok) throw new Error('HF API failure');
      
      const buffer = await res.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      return NextResponse.json({ success: true, result: `data:image/png;base64,${base64}` });

    } catch (e) {
      if (!process.env.HUGGINGFACE_API_KEY) {
        return NextResponse.json({ success: true, result: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=500&q=80", ...DEMO_FLAG });
      }
      return NextResponse.json({ success: false, error: 'এই model এ সমস্যা হচ্ছে, অন্য model try করুন।' }, { status: 400 });
    }
  } catch (e) {
    return NextResponse.json({ success: false, error: 'সার্ভার সমস্যা।' }, { status: 500 });
  }
}


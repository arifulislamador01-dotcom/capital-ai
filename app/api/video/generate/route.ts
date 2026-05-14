import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';
import { hfBinaryInference } from '@/lib/huggingface';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'video-generate', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { prompt, model, duration = 3 } = await req.json();
    if (!prompt) return NextResponse.json({ success: false, error: 'প্রম্পট দিন!' }, { status: 400 });

    try {
      // 1. HuggingFace Model (damo-vilab/text-to-video-ms-1.7b)
      if (model === 'hf') {
        const hasHfKey = process.env.HUGGINGFACE_API_KEY || process.env.HUGGINGFACE_API_TOKEN;
        if (!hasHfKey) throw new Error('HF Key Missing');
        
        // This is a placeholder call. Real inference might require long polling.
        // We throw error to trigger the specific fallback message if it fails.
        throw new Error('HF Model failed'); 
      }

      // 2. Replicate Models (Kling, HaiLuo, Wan)
      const replicateToken = process.env.REPLICATE_API_TOKEN;
      if (!replicateToken) throw new Error('Replicate Key Missing');

      let version = '';
      if (model === 'kling') version = 'kling-v2'; // Placeholder version
      else if (model === 'hailuo') version = 'hailuo-v2.3'; // Placeholder version
      else if (model === 'wan') version = 'wan-2.7'; // Placeholder version

      const res = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${replicateToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          version,
          input: { prompt, length: duration }
        })
      });

      if (!res.ok) throw new Error('Replicate API failed');
      const data = await res.json();
      
      return NextResponse.json({ success: true, result: data.output });
      
    } catch (apiError) {
      // No Auto Fallback. If keys are missing, return Demo Video so UI can be tested.
      // But if it genuinely failed while keys exist, return the exact error.
      const isKeyMissing = !process.env.REPLICATE_API_TOKEN && model !== 'hf';
      
      if (isKeyMissing) {
        // Return a beautiful demo video placeholder from a public source
        return NextResponse.json({ 
          success: true, 
          result: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          ...DEMO_FLAG 
        });
      }

      // NO AUTO FALLBACK
      return NextResponse.json({ success: false, error: 'এই model এ সমস্যা হচ্ছে, অন্য model try করুন।' }, { status: 400 });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'সার্ভার সমস্যা। দয়া করে আবার চেষ্টা করুন।' }, { status: 500 });
  }
}


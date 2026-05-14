import { NextResponse } from 'next/server';
import { hfTextInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'text-banglish', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    try {
      const data = await hfWithFallback(
        async () => {
          const r = await hfTextInference(MODELS.BANGLA_T5, text);
          if (!r[0]?.translation_text) throw new Error('No conversion');
          return r[0].translation_text;
        },
        async () => {
          // Fallback to Mistral
          const r = await hfTextInference(MODELS.MISTRAL, `<s>[INST] Convert this Banglish text to proper Bengali. Return ONLY the Bengali text. Text: ${text} [/INST]`);
          if (!r[0]?.generated_text) throw new Error('No conversion');
          return r[0].generated_text.replace(/^\[\/INST\]\s*/g, '').trim();
        },
        'Banglish conversion failed'
      );
      return NextResponse.json({ success: true, text: data });
    } catch {
      return NextResponse.json({ success: true, text: `[ডেমো বাংলা] ${text}`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: true, text: `[ডেমো বাংলা]`, ...DEMO_FLAG });
  }
}


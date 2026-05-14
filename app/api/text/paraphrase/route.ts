import { NextResponse } from 'next/server';
import { hfTextInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoParaphrase, DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'text-paraphrase', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, tone = 'casual' } = await req.json();
    if (!text?.trim() || text.length < 10) return NextResponse.json({ success: false, error: 'ন্যূনতম ১০ অক্ষর দিন।' }, { status: 400 });

    try {
      const data = await hfWithFallback(
        async () => {
          const r = await hfTextInference(MODELS.T5_PARAPHRASE, `paraphrase: ${text}`);
          if (!r[0]?.generated_text) throw new Error('No paraphrase');
          return r[0].generated_text;
        },
        async () => {
          // Fallback to Mistral
          const r = await hfTextInference(MODELS.MISTRAL, `<s>[INST] Paraphrase this text in a ${tone} tone. Return ONLY the paraphrased text. Text: ${text} [/INST]`);
          if (!r[0]?.generated_text) throw new Error('No paraphrase');
          return r[0].generated_text.replace(/^\[\/INST\]\s*/g, '').trim();
        },
        'Paraphrase failed'
      );
      return NextResponse.json({ success: true, text: data });
    } catch {
      return NextResponse.json({ success: true, text: demoParaphrase(text), ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: true, text: demoParaphrase('এটি একটি উদাহরণ।'), ...DEMO_FLAG });
  }
}


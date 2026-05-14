import { NextResponse } from 'next/server';
import { hfTextInference, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'keywords', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text, count = 10 } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    const results = await hfTextInference(MODELS.KEYWORDS, text, { retries: 1 });
    const keywords = (Array.isArray(results) ? results : [results])
      .flat()
      .filter((r: any) => r.word || r.token_str)
      .map((r: any) => ({ word: r.word || r.token_str, score: ((r.score || 0) * 100).toFixed(1) }))
      .slice(0, count);

    return NextResponse.json({ success: true, keywords, total: keywords.length });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'কীওয়ার্ড বের করা যায়নি।' }, { status: 500 });
  }
}


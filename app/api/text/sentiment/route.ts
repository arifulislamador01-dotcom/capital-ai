import { NextResponse } from 'next/server';
import { hfTextInference, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'sentiment', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { text } = await req.json();
    if (!text?.trim()) return NextResponse.json({ success: false, error: 'টেক্সট দিন।' }, { status: 400 });

    const results = await hfTextInference(MODELS.SENTIMENT, text, { retries: 1 });
    const labels: Record<string, string> = { LABEL_0: 'নেতিবাচক 😞', LABEL_1: 'নিরপেক্ষ 😐', LABEL_2: 'ইতিবাচক 😊' };

    const scores = Array.isArray(results[0]) ? results[0] : results;
    const sorted = scores.sort((a: any, b: any) => (b.score || 0) - (a.score || 0));
    const top = sorted[0];

    return NextResponse.json({
      success: true,
      sentiment: labels[top?.label] || top?.label || 'Unknown',
      confidence: ((top?.score || 0) * 100).toFixed(1) + '%',
      all: sorted.map((s: any) => ({ label: labels[s.label] || s.label, score: ((s.score || 0) * 100).toFixed(1) + '%' })),
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message || 'বিশ্লেষণ ব্যর্থ।' }, { status: 500 });
  }
}


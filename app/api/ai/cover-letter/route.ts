import { NextResponse } from 'next/server';
import { hfChat } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'ai-cover-letter', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();
    const prompt = `Write a compelling cover letter for "${body.job_title}" at "${body.company}". Skills: ${(body.skills || []).join(', ')}. Experience: ${body.experience || 'Not specified'}. Language: ${body.language === 'bn' ? 'Bengali' : 'English'}.`;

    try {
      const result = await hfChat(prompt, { systemPrompt: 'You are a career advisor. Write professional cover letters.', maxTokens: 1500 });
      if (!result || result.length < 5) throw new Error('Empty response');
      return NextResponse.json({ success: true, result });
    } catch {
      return NextResponse.json({ success: true, result: `Dear Hiring Manager at ${body.company},\n\nI am writing to apply for the ${body.job_title} position...\n\n(Demo cover letter - add API key)`, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কভার লেটার জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


import { NextResponse } from 'next/server';
import { hfTextInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'code-debug', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { code, errorMsg } = await req.json();
    if (!code?.trim()) return NextResponse.json({ success: false, error: 'ডিবাগ করার জন্য কোড দিন।' }, { status: 400 });

    const prompt = `Find and fix the bugs in this code. ${errorMsg ? `The error message is: ${errorMsg}` : ''}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nFixed Code and Explanation:`;

    try {
      const result = await hfWithFallback(
        () => hfTextInference(MODELS.CODE_LLAMA, prompt, { maxTokens: 1024 }),
        () => hfTextInference('codellama/CodeLlama-7b-Instruct-hf', prompt, { maxTokens: 512 })
      );

      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `🐞 **কোড ডিবাগ (ডেমো মোড)**\n\n**সমস্যা:** সম্ভাব্য Syntax Error বা Null Reference হতে পারে।\n\n**সমাধান:**\n\`\`\`javascript\n// এখানে ফিক্সড কোড থাকবে\nconsole.log('Fixed demo code');\n\`\`\`\n\n[সঠিক ডিবাগ পেতে API Key ব্যবহার করুন]`;
      return NextResponse.json(Object.assign({ success: true, result: demoResult }, DEMO_FLAG));
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কোড ডিবাগ ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


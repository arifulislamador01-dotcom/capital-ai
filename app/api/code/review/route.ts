import { NextResponse } from 'next/server';
import { hfTextInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'code-review', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { code } = await req.json();
    if (!code?.trim()) return NextResponse.json({ success: false, error: 'রিভিউ করার জন্য কোড দিন।' }, { status: 400 });

    const prompt = `Review the following code for best practices, security, and performance. Provide feedback in a clear list:\n\n\`\`\`\n${code}\n\`\`\`\n\nCode Review:`;

    try {
      const result = await hfWithFallback(
        () => hfTextInference('codellama/CodeLlama-34b-Instruct-hf', prompt, { maxTokens: 1024 }),
        () => hfTextInference(MODELS.CODE_LLAMA, prompt, { maxTokens: 512 })
      );

      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `🔍 **কোড রিভিউ (ডেমো মোড)**\n\n১. ভ্যারিয়েবল নামকরণ আরও স্পষ্ট করা যেতে পারে।\n২. ফাংশনে Error Handling যোগ করা প্রয়োজন।\n৩. পারফরম্যান্স অপ্টিমাইজেশনের সুযোগ রয়েছে।\n\n[আসল রিভিউ পেতে API Key ব্যবহার করুন]`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কোড রিভিউ ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


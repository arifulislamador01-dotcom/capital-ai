import { NextResponse } from 'next/server';
import { hfTextInference, hfWithFallback, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'code-generate', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { prompt, language = 'javascript' } = await req.json();
    if (!prompt?.trim()) return NextResponse.json({ success: false, error: 'কোডের বিবরণ দিন।' }, { status: 400 });

    const fullPrompt = `// Language: ${language}\n// Task: ${prompt}\n\n`;

    try {
      // bigcode/starcoder2-15b via HF Text Inference
      const result = await hfWithFallback(
        () => hfTextInference('bigcode/starcoder2-15b', fullPrompt, { maxTokens: 1024 }),
        () => hfTextInference(MODELS.CODE_LLAMA, fullPrompt, { maxTokens: 512 })
      );

      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `// 💻 কোড জেনারেট (ডেমো মোড)\n// Task: ${prompt}\n\nfunction demoTask() {\n  console.log("This is a demo code generation.");\n  // API Key যুক্ত করলে আসল কোড জেনারেট হবে।\n}\n\ndemoTask();`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কোড জেনারেট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


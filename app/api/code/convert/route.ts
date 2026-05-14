import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'code-convert', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { code, sourceLang, targetLang } = await req.json();
    if (!code?.trim() || !targetLang) return NextResponse.json({ success: false, error: 'Code ebong Target bhasha din.' }, { status: 400 });

    const prompt = `Convert the following ${sourceLang || 'code'} to ${targetLang}. Return ONLY the valid ${targetLang} code, without any markdown formatting wrappers if possible.\n\nCode:\n${code}`;

    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('API Key nai');
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          system_instruction: { parts: [{ text: `You are an expert programmer. Convert code exactly to ${targetLang} without changing the logic.` }] }
        })
      });
      const data = await res.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!result || result.length < 5) throw new Error('Generation failed');
      return NextResponse.json({ success: true, result });
    } catch {
      const demoResult = `// 🔄 কোড কনভার্ট (ডেমো মোড)\n// Translated to ${targetLang}\n\nfunction example() {\n  console.log("Converted code will appear here.");\n}\n\n// API Key ব্যবহার করলে আসল কোড পাবেন।`;
      return NextResponse.json({ success: true, result: demoResult, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'কোড কনভার্ট ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


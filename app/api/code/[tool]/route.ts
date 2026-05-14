import { NextResponse } from 'next/server';
import { hfChat, MODELS } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoCode, DEMO_FLAG } from '@/lib/demo-responses';

const CODE_TOOLS: Record<string, { system: string; build: (b: any) => string; demo: (b: any) => string }> = {
  generate: {
    system: 'You are an expert programmer. Output ONLY code with comments. No explanations outside code blocks.',
    build: (b) => `Write ${b.language || 'JavaScript'} code for: ${b.description}. Include comments. Output only the code.`,
    demo: (b) => demoCode(b.language, b.description),
  },
  review: {
    system: 'You are a senior code reviewer. Find bugs, security issues, and suggest improvements.',
    build: (b) => `Review this ${b.language || ''} code and list issues:\n\`\`\`\n${b.code}\n\`\`\``,
    demo: (b) => `// Code Review (Demo)\n// Issues found: None\n// Add API key for real review.`,
  },
  debug: {
    system: 'You are a debugging expert. Find and fix bugs.',
    build: (b) => `Debug this ${b.language || ''} code. Error: ${b.error_message || 'Unknown'}\n\`\`\`\n${b.code}\n\`\`\`\nShow fixed code and explain the bug.`,
    demo: (b) => `// Fixed Code (Demo)\n${b.code}\n// Note: Add API key for real debugging.`,
  },
  convert: {
    system: 'You are a polyglot programmer. Convert code between languages accurately.',
    build: (b) => `Convert this ${b.from_lang} code to ${b.to_lang}:\n\`\`\`${b.from_lang}\n${b.code}\n\`\`\`\nOutput only the converted code.`,
    demo: (b) => `// Converted to ${b.to_lang} (Demo)\n// Add API key to convert real code`,
  },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/code/')[1]?.replace(/\/$/, '');
    const tool = CODE_TOOLS[toolId];
    if (!tool) return NextResponse.json({ success: false, error: 'Unknown code tool' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `code-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();

    try {
      const result = await hfChat(tool.build(body), { systemPrompt: tool.system, maxTokens: 2048, model: MODELS.MIXTRAL });
      if (!result || result.length < 5) throw new Error('Empty output');
      return NextResponse.json({ success: true, result, tool: toolId });
    } catch {
      return NextResponse.json({ success: true, result: tool.demo(body), tool: toolId, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

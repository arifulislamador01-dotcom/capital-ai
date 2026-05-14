import { NextResponse } from 'next/server';
import { hfChat } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { demoStory, demoEmail, DEMO_FLAG } from '@/lib/demo-responses';

const TOOLS: Record<string, { system: string; buildPrompt: (b: any) => string; demo: (b: any) => string }> = {
  story: {
    system: 'You are a creative storyteller. Write engaging stories in the requested language.',
    buildPrompt: (b) => `Write a ${b.length || 'medium'} ${b.genre || 'adventure'} story. Characters: ${b.characters || 'any'}. Plot: ${b.plot || 'exciting journey'}. Language: ${b.language === 'bn' ? 'Bengali' : 'English'}.`,
    demo: (b) => demoStory(b.genre),
  },
  poem: {
    system: 'You are a poet. Write beautiful poems.',
    buildPrompt: (b) => `Write a ${b.style || 'modern'} poem about "${b.topic}". Language: ${b.language === 'bn' ? 'Bengali' : 'English'}.`,
    demo: (b) => `[ডেমো কবিতা]\n${b.topic} নিয়ে কবিতা...\n\n(সম্পূর্ণ কবিতা পেতে API key দিন)`,
  },
  email: {
    system: 'You are a professional email writer.',
    buildPrompt: (b) => `Write a ${b.tone || 'professional'} ${b.type || 'formal'} email. Key points: ${(b.points || []).join(', ')}. Language: ${b.language === 'bn' ? 'Bengali' : 'English'}.`,
    demo: (b) => demoEmail(b.type),
  },
  caption: {
    system: 'You are a social media expert.',
    buildPrompt: (b) => `Write 3 ${b.tone || 'engaging'} captions for ${b.platform || 'Instagram'} about "${b.topic}". ${b.hashtags ? 'Include hashtags.' : ''}`,
    demo: (b) => `📸 ক্যাপশন ১: ${b.topic} নিয়ে অসাধারণ কিছু! #demo\n📸 ক্যাপশন ২: আরও একটি ক্যাপশন... #test\n\n(সম্পূর্ণ পেতে API key দিন)`,
  },
  resume: {
    system: 'You are a professional resume writer. Output clean HTML.',
    buildPrompt: (b) => `Create a professional resume for: Name: ${b.name}. Experience: ${JSON.stringify(b.experience || [])}. Skills: ${(b.skills || []).join(', ')}. Education: ${JSON.stringify(b.education || [])}. Output as clean HTML with inline styles.`,
    demo: (b) => `<h1>${b.name || 'Your Name'}</h1><p>Demo Resume Content</p><p>Add API key for full HTML resume.</p>`,
  },
  'cover-letter': {
    system: 'You are a career advisor.',
    buildPrompt: (b) => `Write a compelling cover letter for "${b.job_title}" at "${b.company}". Skills: ${(b.skills || []).join(', ')}. Experience: ${b.experience || 'Not specified'}.`,
    demo: (b) => `Dear Hiring Manager at ${b.company},\n\nI am writing to apply for the ${b.job_title} position...\n\n(Demo cover letter - add API key)`,
  },
  'business-name': {
    system: 'You are a branding expert.',
    buildPrompt: (b) => `Suggest 10 unique business names for ${b.industry || 'tech'} industry. Keywords: ${(b.keywords || []).join(', ')}. Language: ${b.language === 'bn' ? 'Bengali' : 'English'}. Give name + short tagline for each.`,
    demo: (b) => `1. ${b.keywords?.[0] || 'Tech'}Corp - Innovating tomorrow\n2. Next${b.industry || 'Gen'} - The future is here\n\n(Add API key for 10 names)`,
  },
  slogan: {
    system: 'You are a marketing copywriter.',
    buildPrompt: (b) => `Create 10 catchy slogans for "${b.brand_name}" in ${b.industry || 'general'} industry. Tone: ${b.tone || 'professional'}.`,
    demo: (b) => `1. ${b.brand_name}: Your trusted partner\n2. Excellence in every step\n\n(Add API key for more)`,
  },
  'product-desc': {
    system: 'You are an e-commerce copywriter.',
    buildPrompt: (b) => `Write a compelling product description for "${b.product_name}". Features: ${(b.features || []).join(', ')}. Platform: ${b.platform || 'website'}. Include bullet points.`,
    demo: (b) => `**${b.product_name}**\nAn amazing product with great features.\n- Feature 1\n- Feature 2\n\n(Demo mode - add API key)`,
  },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/ai/')[1]?.replace(/\/$/, '');
    const tool = TOOLS[toolId];
    if (!tool) return NextResponse.json({ success: false, error: 'Unknown tool' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `ai-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();
    const prompt = tool.buildPrompt(body);

    try {
      const result = await hfChat(prompt, { systemPrompt: tool.system, maxTokens: 1500 });
      if (!result || result.length < 5) throw new Error('Empty response');
      return NextResponse.json({ success: true, result, tool: toolId });
    } catch {
      return NextResponse.json({ success: true, result: tool.demo(body), tool: toolId, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

const EDU_TOOLS: Record<string, (b: any) => string> = {
  assignment: (b) => `Write a ${b.word_limit || 500}-word assignment on "${b.topic}" for class ${b.class_level || '10'}. Language: ${b.language === 'bn' ? 'Bengali' : 'English'}. Include introduction, body, conclusion.`,
  math: (b) => `Solve this math problem step by step: ${b.problem}. ${b.show_steps ? 'Show every step clearly.' : ''} Explain in simple Bengali.`,
  quiz: (b) => `Create ${b.count || 5} multiple-choice quiz questions about "${b.topic}". Difficulty: ${b.difficulty || 'medium'}. Language: ${b.language === 'bn' ? 'Bengali' : 'English'}. Format: Question, A/B/C/D options, Correct answer.`,
  flashcard: (b) => `Create ${b.count || 10} flashcards about "${b.topic}". Language: ${b.language === 'bn' ? 'Bengali' : 'English'}. Format each as: Front (question/term) | Back (answer/definition).`,
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/education/')[1]?.replace(/\/$/, '');
    const promptFn = EDU_TOOLS[toolId || ''];
    if (!promptFn) return NextResponse.json({ success: false, error: 'Unknown' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `edu-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: promptFn(body) }] }],
        system_instruction: { parts: [{ text: 'You are an expert educator. Provide accurate, well-structured educational content.' }] }
      })
    });
    if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
    const data = await response.json();
    const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return NextResponse.json({ success: true, result, tool: toolId });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}


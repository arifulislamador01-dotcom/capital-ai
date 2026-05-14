import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

const HEALTH_TOOLS: Record<string, { needsAI: boolean; calc?: (b: any) => any; prompt?: (b: any) => string }> = {
  bmi: {
    needsAI: false,
    calc: (b) => {
      const w = parseFloat(b.weight) || 0;
      const h = (parseFloat(b.height) || 170) / 100;
      const bmi = +(w / (h * h)).toFixed(1);
      const cat = bmi < 18.5 ? 'কম ওজন' : bmi < 25 ? 'স্বাভাবিক ✅' : bmi < 30 ? 'অতিরিক্ত ওজন ⚠️' : 'স্থূলতা ❌';
      const ideal = { min: +(18.5 * h * h).toFixed(1), max: +(24.9 * h * h).toFixed(1) };
      return { bmi, category: cat, idealWeight: ideal, height: b.height, weight: w };
    },
  },
  calorie: {
    needsAI: false,
    calc: (b) => {
      const items = b.food_items || [];
      // Basic calorie database (per 100g)
      const db: Record<string, number> = { rice: 130, chicken: 239, egg: 155, fish: 206, bread: 265, milk: 42, banana: 89, apple: 52, potato: 77, dal: 116, beef: 250, mutton: 294, vegetables: 65, oil: 884, sugar: 387 };
      const breakdown = items.map((item: string) => {
        const cal = db[item.toLowerCase()] || 100;
        return { item, calories: cal, per: '100g' };
      });
      const total = breakdown.reduce((s: number, i: any) => s + i.calories, 0);
      return { breakdown, total, items: items.length };
    },
  },
  'diet-plan': { needsAI: true, prompt: (b) => `Create a 7-day diet plan in Bengali. Goal: ${b.goal || 'weight loss'}. Weight: ${b.weight}kg. Height: ${b.height}cm. Allergies: ${(b.allergies || []).join(', ') || 'none'}. Include breakfast, lunch, dinner, snacks.` },
  workout: { needsAI: true, prompt: (b) => `Create a weekly workout plan in Bengali. Goal: ${b.goal || 'fitness'}. Level: ${b.fitness_level || 'beginner'}. Duration: ${b.duration || '30'} min. Equipment: ${b.equipment || 'none'}. Format as a table.` },
  medicine: {
    needsAI: false,
    calc: (b) => {
      const meds = (b.medicines || []).map((m: any) => ({ name: m.name || m, times: m.times || b.reminder_times || ['সকাল ৮টা', 'রাত ১০টা'], dosage: m.dosage || '1 tablet' }));
      return { reminders: meds, total: meds.length, note: 'ডাক্তারের পরামর্শ ছাড়া ওষুধ খাবেন না।' };
    },
  },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/health/')[1]?.replace(/\/$/, '');
    const tool = HEALTH_TOOLS[toolId || ''];
    if (!tool) return NextResponse.json({ success: false, error: 'Unknown health tool' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `health-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();

    if (tool.needsAI && tool.prompt) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY not set');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: tool.prompt(body) }] }],
          system_instruction: { parts: [{ text: 'You are a health advisor. Respond in Bengali. Always add disclaimer.' }] }
        })
      });
      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
      const data = await response.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return NextResponse.json({ success: true, result, disclaimer: '⚕️ এটি AI পরামর্শ। ডাক্তারের সাথে পরামর্শ করুন।' });
    }

    if (tool.calc) {
      return NextResponse.json({ success: true, ...tool.calc(body) });
    }

    return NextResponse.json({ success: false, error: 'Tool config error' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}



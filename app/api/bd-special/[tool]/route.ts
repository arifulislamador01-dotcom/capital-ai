import { NextResponse } from 'next/server';
import { hfChat, hfTextInference } from '@/lib/huggingface';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

const BD_TOOLS: Record<string, (b: any, req: Request) => Promise<any>> = {
  'nid-helper': async (b) => {
    const result = await hfChat(
      `NID দিয়ে ${b.service_type || 'সব'} সরকারি সেবা সম্পর্কে বিস্তারিত বলো। প্রয়োজনীয় কাগজপত্র সহ।${b.query ? ` প্রশ্ন: ${b.query}` : ''}`,
      { systemPrompt: 'You are a Bangladesh government services expert. Always respond in Bengali.', maxTokens: 1500 }
    );
    return { result };
  },

  'bangla-checker': async (b) => {
    const common: Record<string, string> = {
      'ইতিমধ্যে':'ইতোমধ্যে','পুজা':'পূজা','সুচনা':'সূচনা','দুরত্ব':'দূরত্ব','কারন':'কারণ',
      'পরিক্ষা':'পরীক্ষা','পুর্ব':'পূর্ব','চাকুরী':'চাকরি','স্বাধিনতা':'স্বাধীনতা','পরিস্কার':'পরিষ্কার',
      'গনতন্ত্র':'গণতন্ত্র','শিক্ষন':'শিক্ষণ','মুল্য':'মূল্য','আবিস্কার':'আবিষ্কার','ভবিষ্যত':'ভবিষ্যৎ',
    };
    let corrected = b.text || '';
    const errors: { wrong: string; right: string }[] = [];
    for (const [wrong, right] of Object.entries(common)) {
      if (corrected.includes(wrong)) { errors.push({ wrong, right }); corrected = corrected.replace(new RegExp(wrong, 'g'), right); }
    }
    return { corrected, errors, errorCount: errors.length, original: b.text };
  },

  'banglish-converter': async (b) => {
    const result = await hfChat(
      `Convert this Banglish to proper Bengali: "${b.text}". Output ONLY the Bengali text.`,
      { systemPrompt: 'You convert Banglish/Romanized Bengali to proper Bengali script. Output only the converted text.', maxTokens: 500, temperature: 0.3 }
    );
    return { bangla: result, original: b.text };
  },

  'bd-news': async () => {
    // Fetch RSS feeds
    const feeds = [
      { name: 'Prothom Alo', url: 'https://www.prothomalo.com/feed' },
      { name: 'Daily Star', url: 'https://www.thedailystar.net/frontpage/rss.xml' },
    ];
    const news: any[] = [];
    for (const feed of feeds) {
      try {
        const res = await fetch(feed.url, { next: { revalidate: 300 } });
        const xml = await res.text();
        // Basic XML parse for items
        const items = xml.match(/<item>[\s\S]*?<\/item>/g) || [];
        for (const item of items.slice(0, 5)) {
          const title = item.match(/<title><!\[CDATA\[(.*?)\]\]>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || '';
          const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
          if (title) news.push({ title, link, source: feed.name });
        }
      } catch {}
    }
    return { news: news.slice(0, 15), total: news.length, fetchedAt: new Date().toISOString() };
  },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/bd-special/')[1]?.replace(/\/$/, '');
    const handler = BD_TOOLS[toolId || ''];
    if (!handler) return NextResponse.json({ success: false, error: 'Unknown tool' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `bd-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json().catch(() => ({}));
    const result = await handler(body, req);
    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

// Also support GET for bd-news
export async function GET(req: Request) {
  return POST(req);
}

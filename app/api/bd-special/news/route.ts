import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';
import { DEMO_FLAG } from '@/lib/demo-responses';
import Parser from 'rss-parser';

const parser = new Parser();

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, 'bd-news', plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const { source = 'prothom_alo' } = await req.json();

    try {
      let feedUrl = '';
      if (source === 'prothom_alo') feedUrl = 'https://www.prothomalo.com/feed';
      else if (source === 'daily_star') feedUrl = 'https://www.thedailystar.net/feed/rss.xml';
      else feedUrl = 'https://www.prothomalo.com/feed';

      const feed = await parser.parseURL(feedUrl);
      const items = feed.items.slice(0, 10).map(item => ({
        title: item.title,
        link: item.link,
        pubDate: item.pubDate,
        contentSnippet: item.contentSnippet?.slice(0, 150) + '...'
      }));

      return NextResponse.json({ success: true, result: items });
    } catch {
      const demoItems = [
        { title: "খবরের শিরোনাম ১ (ডেমো)", link: "#", pubDate: new Date().toISOString(), contentSnippet: "খবরের বিস্তারিত অংশ..." },
        { title: "খবরের শিরোনাম ২ (ডেমো)", link: "#", pubDate: new Date().toISOString(), contentSnippet: "খবরের বিস্তারিত অংশ..." }
      ];
      return NextResponse.json({ success: true, result: demoItems, ...DEMO_FLAG });
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, error: 'খবর লোড ব্যর্থ হয়েছে।' }, { status: 500 });
  }
}


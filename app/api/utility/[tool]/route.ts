import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

const HANDLERS: Record<string, (body: any) => any> = {
  password: (b) => {
    const len = Math.min(Math.max(b.length || 16, 8), 128);
    const chars = { upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', lower: 'abcdefghijklmnopqrstuvwxyz', numbers: '0123456789', symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?' };
    let pool = chars.lower;
    if (b.uppercase !== false) pool += chars.upper;
    if (b.numbers !== false) pool += chars.numbers;
    if (b.symbols !== false) pool += chars.symbols;
    let pw = '';
    for (let i = 0; i < len; i++) pw += pool[Math.floor(Math.random() * pool.length)];
    const strength = len >= 16 && b.symbols !== false ? 'শক্তিশালী 💪' : len >= 12 ? 'ভালো 👍' : 'মাঝারি ⚠️';
    return { password: pw, length: len, strength };
  },

  'lorem-ipsum': (b) => {
    const bnWords = ['বাংলাদেশ','আকাশ','নদী','সূর্য','চাঁদ','তারা','ফুল','পাখি','গান','বৃষ্টি','মেঘ','বাতাস','সমুদ্র','পাহাড়','গাছ','মাছ','ধান','সোনা','রূপা','হীরা','মুক্তা','স্বপ্ন','আলো','ছায়া','রং','সুর','কথা','গল্প','প্রেম','দেশ'];
    const enWords = ['Lorem','ipsum','dolor','sit','amet','consectetur','adipiscing','elit','sed','do','eiusmod','tempor','incididunt','ut','labore','et','dolore','magna','aliqua'];
    const words = b.language === 'bn' ? bnWords : enWords;
    const paras = [];
    for (let p = 0; p < (b.paragraphs || 3); p++) {
      let para = '';
      for (let s = 0; s < 5; s++) {
        const sentLen = 8 + Math.floor(Math.random() * 10);
        const sent = Array.from({ length: sentLen }, () => words[Math.floor(Math.random() * words.length)]).join(' ');
        para += (s === 0 ? sent.charAt(0).toUpperCase() + sent.slice(1) : sent) + (b.language === 'bn' ? '। ' : '. ');
      }
      paras.push(para.trim());
    }
    return { text: paras.join('\n\n'), paragraphs: paras.length };
  },

  base64: (b) => {
    if (b.action === 'encode') return { result: Buffer.from(b.text || '').toString('base64'), action: 'encoded' };
    if (b.action === 'decode') return { result: Buffer.from(b.text || '', 'base64').toString('utf-8'), action: 'decoded' };
    return { error: 'action: encode বা decode দিন।' };
  },

  'json-format': (b) => {
    try {
      const parsed = JSON.parse(b.json_string || b.text || '{}');
      return { formatted: JSON.stringify(parsed, null, 2), valid: true, keys: Object.keys(parsed).length };
    } catch (e: any) {
      return { formatted: null, valid: false, error: `JSON ভুল: ${e.message}` };
    }
  },

  markdown: (b) => {
    const md = b.markdown_text || b.text || '';
    // Basic MD → HTML
    let html = md
      .replace(/^### (.+)$/gm, '<h3>$1</h3>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')
      .replace(/`(.+?)`/g, '<code>$1</code>').replace(/\n/g, '<br>');
    return { html, charCount: md.length };
  },

  invoice: (b) => {
    const items = b.items || [];
    const subtotal = items.reduce((s: number, i: any) => s + (i.qty || 1) * (i.price || 0), 0);
    const tax = Math.round(subtotal * ((b.tax || 15) / 100));
    return { company: b.company, items, subtotal, tax, taxRate: b.tax || 15, total: subtotal + tax, currency: b.currency || 'BDT' };
  },

  'color-palette': (b) => {
    const hsl = (h: number, s: number, l: number) => `hsl(${h},${s}%,${l}%)`;
    const base = Math.floor(Math.random() * 360);
    const palettes = {
      analogous: [0, 30, 60, 90, 120].map(d => hsl((base + d) % 360, 70, 55)),
      complementary: [0, 180, 30, 210, 60].map(d => hsl((base + d) % 360, 65, 50)),
      triadic: [0, 120, 240, 60, 300].map(d => hsl((base + d) % 360, 60, 50)),
    };
    return { palette: palettes.analogous, allPalettes: palettes, baseHue: base };
  },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const parts = url.pathname.split('/api/utility/');
    const toolId = parts[1]?.replace(/\/$/, '');
    const handler = HANDLERS[toolId || ''];
    if (!handler) return NextResponse.json({ success: false, error: 'Unknown utility' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `util-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();
    const result = handler(body);
    return NextResponse.json({ success: true, ...result });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}

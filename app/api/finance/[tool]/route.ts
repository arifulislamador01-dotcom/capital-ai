import { NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { getUserId, checkUserPlan } from '@/lib/auth';

const FINANCE_TOOLS: Record<string, { needsAI: boolean; calc?: (b: any) => any; prompt?: (b: any) => string }> = {
  tax: {
    needsAI: false,
    calc: (b) => {
      let income = parseFloat(b.income) || 0;
      const exemptions: Record<string, number> = { male: 350000, female: 400000, senior: 400000, disabled: 475000, gazetted: 500000 };
      const exempt = exemptions[b.gender || 'male'] || 350000;
      let taxable = Math.max(0, income - exempt);
      const slabs = [{ l: 100000, r: 5 }, { l: 300000, r: 10 }, { l: 400000, r: 15 }, { l: 500000, r: 20 }, { l: Infinity, r: 25 }];
      let tax = 0; const breakdown = [{ slab: `করমুক্ত (৳${exempt.toLocaleString()})`, amount: Math.min(income, exempt), rate: 0, tax: 0 }];
      for (const s of slabs) { if (taxable <= 0) break; const t = Math.min(taxable, s.l); const tx = Math.round(t * s.r / 100); breakdown.push({ slab: `${s.r}%`, amount: t, rate: s.r, tax: tx }); tax += tx; taxable -= t; }
      return { totalTax: tax, breakdown, effective: income > 0 ? +((tax / income) * 100).toFixed(1) : 0, monthly: Math.round(tax / 12) };
    },
  },
  vat: { needsAI: false, calc: (b) => { const amt = parseFloat(b.amount) || 0; const rate = parseFloat(b.rate) || 15; const vat = Math.round(amt * rate / 100); return { original: amt, vat, total: amt + vat, rate }; } },
  bill: {
    needsAI: false,
    calc: (b) => {
      const u = parseFloat(b.units) || 0;
      const slabs = [{ m: 75, r: 3.87 }, { m: 200, r: 5.14 }, { m: 300, r: 5.36 }, { m: 400, r: 6.34 }, { m: 600, r: 9.94 }, { m: Infinity, r: 11.46 }];
      let rem = u, total = 0, prev = 0;
      const bd: any[] = [];
      for (const s of slabs) { if (rem <= 0) break; const units = Math.min(rem, s.m - prev); const cost = units * s.r; bd.push({ units, rate: s.r, cost: Math.round(cost) }); total += cost; rem -= units; prev = s.m; }
      const vat = Math.round(total * 0.05);
      return { breakdown: bd, energy: Math.round(total), vat, demand: 30, total: Math.round(total + vat + 30) };
    },
  },
  budget: { needsAI: true, prompt: (b) => `Bengali-তে একটি মাসিক বাজেট প্ল্যান দাও। আয়: ৳${b.income}। খরচ: ${JSON.stringify(b.expenses || [])}। সঞ্চয় লক্ষ্য: ৳${b.savings_goal || '5000'}। 50/30/20 rule ব্যবহার করো।` },
  emi: {
    needsAI: false,
    calc: (b) => {
      const P = parseFloat(b.principal) || 0;
      const annualRate = parseFloat(b.rate) || 10;
      const months = parseInt(b.tenure) || 12;
      const r = annualRate / 12 / 100;
      const emi = r > 0 ? Math.round(P * r * Math.pow(1 + r, months) / (Math.pow(1 + r, months) - 1)) : Math.round(P / months);
      return { emi, totalPayment: emi * months, totalInterest: emi * months - P, principal: P, rate: annualRate, months };
    },
  },
  currency: {
    needsAI: false,
    calc: async (b) => {
      try {
        const res = await fetch(`https://open.er-api.com/v6/latest/${b.from || 'BDT'}`);
        const data = await res.json();
        const rate = data.rates?.[b.to || 'USD'] || 1;
        return { amount: b.amount, from: b.from || 'BDT', to: b.to || 'USD', rate, converted: +((b.amount || 1) * rate).toFixed(2) };
      } catch { return { error: 'রেট পাওয়া যায়নি।' }; }
    },
  },
};

export async function POST(req: Request) {
  try {
    const url = new URL(req.url);
    const toolId = url.pathname.split('/api/finance/')[1]?.replace(/\/$/, '');
    const tool = FINANCE_TOOLS[toolId || ''];
    if (!tool) return NextResponse.json({ success: false, error: 'Unknown' }, { status: 400 });

    const userId = getUserId(req);
    const plan = await checkUserPlan(req);
    const rl = await checkRateLimit(userId, `fin-${toolId}`, plan.planType);
    if (!rl.allowed) return NextResponse.json({ success: false, error: rl.errorBn }, { status: 429 });

    const body = await req.json();
    if (tool.needsAI && tool.prompt) {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) throw new Error('GEMINI_API_KEY not set');
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: tool.prompt(body) }] }]
        })
      });
      if (!response.ok) throw new Error(`Gemini API error: ${response.statusText}`);
      const data = await response.json();
      const result = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      return NextResponse.json({ success: true, result });
    }
    if (tool.calc) {
      const result = await Promise.resolve(tool.calc(body));
      return NextResponse.json({ success: true, ...result });
    }
    return NextResponse.json({ success: false, error: 'Config error' }, { status: 500 });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}


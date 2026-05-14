import { NextResponse } from 'next/server';

import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const plan = url.searchParams.get('plan');
  return NextResponse.redirect(new URL(`/dashboard?payment=success&plan=${plan}`, req.url));
}

export async function POST(req: Request) {
  const formData = await req.formData();
  const clerkId = formData.get('value_a')?.toString();
  const tierStr = formData.get('value_b')?.toString();
  const tier = tierStr ? parseInt(tierStr) : 2;

  if (clerkId) {
    let dailyLimit = 200;
    if (tier === 3) dailyLimit = 500;
    if (tier >= 4) dailyLimit = 999999;
    await supabaseAdmin
      .from('users')
      .update({
        is_premium: true,
        tier: tier,
        credits_remaining: dailyLimit,
        credits_reset_at: new Date().toISOString(),
      })
      .eq('clerk_id', clerkId);
  }

  return NextResponse.redirect(new URL(`/dashboard?payment=success&tier=${tier}`, req.url));
}


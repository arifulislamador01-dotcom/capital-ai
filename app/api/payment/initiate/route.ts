import { NextRequest, NextResponse } from 'next/server';
import { initiatePayment, PLANS } from '@/lib/sslcommerz';

export async function POST(req: NextRequest) {
  try {
    const { tier, name, email, phone, clerkId } = await req.json();
    const plan = PLANS[tier as keyof typeof PLANS];
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    const result = await initiatePayment({
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      customerName: name || 'User',
      customerEmail: email || '',
      customerPhone: phone || '',
      clerkId: clerkId || '',
      tier,
    });

    if (result.GatewayPageURL) {
      return NextResponse.json({ url: result.GatewayPageURL });
    }
    return NextResponse.json({ error: 'Payment init failed' }, { status: 500 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


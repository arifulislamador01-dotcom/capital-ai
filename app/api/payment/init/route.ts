import { NextResponse } from 'next/server';
import { hasUsedTrial, activateTrial, activatePlan } from '@/lib/subscription';

export async function POST(req: Request) {
  try {
    const { plan, method, userId } = await req.json();

    const prices: Record<string, number> = { trial_7day: 10, pro: 99, business: 599 };
    const amount = prices[plan];
    if (!amount) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    // One-time trial check
    if (plan === 'trial_7day' && userId) {
      const used = await hasUsedTrial(userId);
      if (used) return NextResponse.json({ error: 'আপনি ইতোমধ্যে ট্রায়াল ব্যবহার করেছেন। Pro প্ল্যান নিন!' }, { status: 400 });
    }

    const tranId = `AKASH_${plan}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    // SSLCommerz init payload
    const payload = {
      store_id: process.env.SSLCOMMERZ_STORE_ID || 'demo',
      store_passwd: process.env.SSLCOMMERZ_STORE_PASS || 'demo',
      total_amount: amount,
      currency: 'BDT',
      tran_id: tranId,
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/success?plan=${plan}&user_id=${userId || ''}`,
      fail_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/payment/fail`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard/pricing`,
      cus_name: 'Akash AI User',
      cus_email: 'user@akashai.com',
      cus_phone: '01700000000',
      product_name: `Akash AI ${plan} Plan`,
      product_category: 'SaaS Subscription',
      shipping_method: 'NO',
      product_profile: 'non-physical-goods',
    };

    // Production: uncomment SSLCommerz integration
    // const sslRes = await fetch('https://sandbox.sslcommerz.com/gwprocess/v4/api.php', {
    //   method: 'POST', body: new URLSearchParams(payload as any),
    // });
    // const sslData = await sslRes.json();
    // return NextResponse.json({ url: sslData.GatewayPageURL, tranId });

    // Demo mode: activate directly
    if (userId) {
      try {
        if (plan === 'trial_7day') {
          await activateTrial(userId, tranId);
        } else {
          await activatePlan(userId, plan, tranId);
        }
      } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 400 });
      }
    }

    return NextResponse.json({
      url: `/dashboard?payment=success&plan=${plan}`,
      tranId,
      message: plan === 'trial_7day' ? '৭ দিনের ট্রায়াল সক্রিয় হয়েছে!' : `${plan} প্ল্যান সক্রিয় হয়েছে!`,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Payment init failed' }, { status: 500 });
  }
}


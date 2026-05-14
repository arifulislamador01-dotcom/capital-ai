const STORE_ID = process.env.SSLCOMMERZ_STORE_ID!;
const STORE_PASS = process.env.SSLCOMMERZ_STORE_PASSWORD!;
const IS_LIVE = process.env.SSLCOMMERZ_IS_LIVE === 'true';
const BASE = IS_LIVE ? 'https://securepay.sslcommerz.com' : 'https://sandbox.sslcommerz.com';

export const PLANS = {
  1: { name: 'Invite Friends', price: 0, currency: 'BDT' },
  2: { name: 'Weekly Pro', price: 50, currency: 'BDT' },
  3: { name: 'Basic Plan', price: 299, currency: 'BDT' },
  4: { name: 'Pro Version', price: 599, currency: 'BDT' },
} as const;

export async function initiatePayment(data: {
  planName: string; amount: number; currency: string;
  customerName: string; customerEmail: string; customerPhone: string;
  clerkId: string; tier: number;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const form = new URLSearchParams({
    store_id: STORE_ID, store_passwd: STORE_PASS,
    total_amount: data.amount.toString(), currency: data.currency || 'BDT',
    tran_id: `AKASH_${Date.now()}_${data.clerkId}`,
    success_url: `${siteUrl}/api/payment/success`,
    fail_url: `${siteUrl}/api/payment/fail`,
    cancel_url: `${siteUrl}/api/payment/fail`,
    cus_name: data.customerName, cus_email: data.customerEmail,
    cus_phone: data.customerPhone, cus_add1: 'Bangladesh',
    cus_city: 'Dhaka', cus_country: 'Bangladesh',
    product_name: `Akash AI ${data.planName}`,
    product_category: 'Software Subscription',
    product_profile: 'non-physical-goods',
    shipping_method: 'NO', num_of_item: '1',
    value_a: data.clerkId, value_b: data.tier.toString(),
  });
  const res = await fetch(`${BASE}/gwprocess/v4/api.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: form.toString(),
  });
  if (!res.ok) throw new Error('SSLCommerz API failed');
  return res.json();
}

export async function validatePayment(valId: string): Promise<boolean> {
  const res = await fetch(
    `${BASE}/validator/api/validationserverAPI.php?val_id=${valId}&store_id=${STORE_ID}&store_passwd=${STORE_PASS}&format=json`
  );
  if (!res.ok) return false;
  const r = await res.json();
  return r.status === 'VALID' || r.status === 'VALIDATED';
}

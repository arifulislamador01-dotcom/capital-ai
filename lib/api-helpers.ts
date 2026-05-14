import { NextResponse } from 'next/server';

// Rate limit store (in-memory, use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

const LIMITS = {
  free: { maxPerMinute: 5, maxPerDay: 20 },
  trial_7day: { maxPerMinute: 20, maxPerDay: 500 },
  pro: { maxPerMinute: 30, maxPerDay: -1 },
  business: { maxPerMinute: 60, maxPerDay: -1 },
};

export function rateLimit(userId: string, tier: keyof typeof LIMITS = 'free'): { allowed: boolean; remaining: number } {
  const key = `${userId}_${Math.floor(Date.now() / 60000)}`; // per-minute key
  const limit = LIMITS[tier];
  const current = rateLimitMap.get(key);

  if (!current) {
    rateLimitMap.set(key, { count: 1, resetAt: Date.now() + 60000 });
    return { allowed: true, remaining: limit.maxPerMinute - 1 };
  }

  if (current.count >= limit.maxPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  current.count++;
  return { allowed: true, remaining: limit.maxPerMinute - current.count };
}

// Timeout wrapper for fetch calls
export async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timeout);
  }
}

// Hugging Face inference helper
export async function huggingFaceInference(model: string, inputs: any, options: Record<string, any> = {}): Promise<any> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  if (!apiKey) throw new Error('HUGGINGFACE_API_KEY not set');

  const res = await fetchWithTimeout(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inputs, ...options }),
    },
    30000
  );

  if (!res.ok) {
    const err = await res.text();
    // Model loading - retry once after delay
    if (res.status === 503) {
      await new Promise(r => setTimeout(r, 5000));
      const retry = await fetchWithTimeout(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs, ...options }),
        },
        30000
      );
      if (!retry.ok) throw new Error(`Model loading: ${err}`);
      return retry;
    }
    throw new Error(`HuggingFace error (${res.status}): ${err}`);
  }
  return res;
}

// Standard error response
export function errorResponse(message: string, status = 500) {
  return NextResponse.json({
    success: false,
    error: message,
    errorBn: getErrorBn(message),
  }, { status });
}

// Standard success response
export function successResponse(data: any) {
  return NextResponse.json({ success: true, ...data });
}

// Bangla error messages
function getErrorBn(error: string): string {
  if (error.includes('rate limit') || error.includes('Too many')) return 'অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।';
  if (error.includes('API key') || error.includes('not set')) return 'API কনফিগারেশন সমস্যা। অ্যাডমিনকে জানান।';
  if (error.includes('timeout') || error.includes('abort')) return 'রিকোয়েস্ট টাইমআউট। আবার চেষ্টা করুন।';
  if (error.includes('loading')) return 'AI মডেল লোড হচ্ছে, ১০ সেকেন্ড পর আবার চেষ্টা করুন।';
  if (error.includes('Invalid') || error.includes('required')) return 'সঠিক ইনপুট দিন।';
  return 'কিছু সমস্যা হয়েছে। আবার চেষ্টা করুন।';
}

// Validate required fields
export function validateFields(body: any, required: string[]): string | null {
  for (const field of required) {
    if (!body[field] || (typeof body[field] === 'string' && !body[field].trim())) {
      return `${field} is required`;
    }
  }
  return null;
}

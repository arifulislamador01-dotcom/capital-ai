import { supabaseAdmin } from './supabase';

// Plan-based rate limits
const PLAN_LIMITS: Record<string, { perDay: number; perMinute: number; priority: boolean }> = {
  free:       { perDay: 10,  perMinute: 3,  priority: false },
  trial_7day: { perDay: -1,  perMinute: 20, priority: false },  // -1 = unlimited
  pro_99:     { perDay: 100, perMinute: 15, priority: false },
  pro_299:    { perDay: -1,  perMinute: 30, priority: false },
  pro_599:    { perDay: -1,  perMinute: 60, priority: true },
};

// In-memory fallback (when Supabase is not connected)
const memoryStore = new Map<string, { count: number; date: string; minuteCount: number; minuteStart: number }>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: string;
  errorBn?: string;
}

/**
 * Check rate limit for a user + tool combination
 * Stores usage in Supabase (usage_logs table) or in-memory fallback
 */
export async function checkRateLimit(
  userId: string | null,
  toolName: string,
  planType: string = 'free'
): Promise<RateLimitResult> {
  const uid = userId || 'anon_' + Math.random().toString(36).slice(2, 6);
  const plan = PLAN_LIMITS[planType] || PLAN_LIMITS.free;
  const today = new Date().toISOString().split('T')[0];

  // Per-minute check (in-memory, always)
  const minuteKey = `${uid}:${toolName}:min`;
  const now = Date.now();
  const minuteData = memoryStore.get(minuteKey);

  if (minuteData && now - minuteData.minuteStart < 60000) {
    if (minuteData.minuteCount >= plan.perMinute) {
      return {
        allowed: false, remaining: 0, limit: plan.perMinute,
        resetAt: new Date(minuteData.minuteStart + 60000).toISOString(),
        errorBn: 'অনুগ্রহ করে ১ মিনিট অপেক্ষা করুন।',
      };
    }
    minuteData.minuteCount++;
  } else {
    memoryStore.set(minuteKey, { count: 0, date: today, minuteCount: 1, minuteStart: now });
  }

  // Unlimited daily? Skip daily check
  if (plan.perDay === -1) {
    return { allowed: true, remaining: -1, limit: -1, resetAt: '' };
  }

  // Per-day check
  try {
    // Try Supabase first
    const { data, error } = await supabaseAdmin
      .from('usage_logs')
      .select('count')
      .eq('user_id', uid)
      .eq('tool_name', toolName)
      .eq('date', today)
      .single();

    if (error && error.code !== 'PGRST116') {
      // Table doesn't exist or other error — fallback to memory
      return checkRateLimitMemory(uid, toolName, plan.perDay, today);
    }

    const currentCount = data?.count || 0;

    if (currentCount >= plan.perDay) {
      return {
        allowed: false, remaining: 0, limit: plan.perDay,
        resetAt: `${today}T23:59:59Z`,
        errorBn: `দৈনিক সীমা (${plan.perDay}) শেষ। আপগ্রেড করুন।`,
      };
    }

    // Increment usage
    if (data) {
      await supabaseAdmin
        .from('usage_logs')
        .update({ count: currentCount + 1 })
        .eq('user_id', uid)
        .eq('tool_name', toolName)
        .eq('date', today);
    } else {
      await supabaseAdmin
        .from('usage_logs')
        .insert({ user_id: uid, tool_name: toolName, date: today, count: 1 });
    }

    return {
      allowed: true, remaining: plan.perDay - currentCount - 1,
      limit: plan.perDay, resetAt: `${today}T23:59:59Z`,
    };
  } catch {
    // Supabase not available — use memory
    return checkRateLimitMemory(uid, toolName, plan.perDay, today);
  }
}

// In-memory fallback
function checkRateLimitMemory(userId: string, toolName: string, dailyLimit: number, today: string): RateLimitResult {
  const key = `${userId}:${toolName}:day`;
  const data = memoryStore.get(key);

  if (data && data.date === today) {
    if (data.count >= dailyLimit) {
      return {
        allowed: false, remaining: 0, limit: dailyLimit,
        resetAt: `${today}T23:59:59Z`,
        errorBn: `দৈনিক সীমা (${dailyLimit}) শেষ। আপগ্রেড করুন।`,
      };
    }
    data.count++;
    return { allowed: true, remaining: dailyLimit - data.count, limit: dailyLimit, resetAt: `${today}T23:59:59Z` };
  }

  memoryStore.set(key, { count: 1, date: today, minuteCount: 0, minuteStart: 0 });
  return { allowed: true, remaining: dailyLimit - 1, limit: dailyLimit, resetAt: `${today}T23:59:59Z` };
}

// SQL for usage_logs table (run in Supabase)
export const USAGE_LOGS_SQL = `
CREATE TABLE IF NOT EXISTS usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tool_name, date)
);
CREATE INDEX IF NOT EXISTS idx_usage_logs_user ON usage_logs(user_id, date);
`;

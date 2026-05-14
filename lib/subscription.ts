import { supabaseAdmin } from './supabase';

export interface Subscription {
  id: string;
  user_id: string;
  plan_type: string;
  price: number;
  duration_days: number | null;
  status: string;
  trial_start: string | null;
  trial_end: string | null;
  has_used_trial: boolean;
  transaction_id: string | null;
  created_at: string;
}

// Check if user has active subscription
export async function getActiveSubscription(userId: string): Promise<Subscription | null> {
  const { data } = await supabaseAdmin
    .from('subscriptions')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  return data as Subscription | null;
}

// Check if user already used trial
export async function hasUsedTrial(userId: string): Promise<boolean> {
  const { data } = await supabaseAdmin
    .from('users')
    .select('has_used_trial')
    .eq('clerk_id', userId)
    .single();
  return data?.has_used_trial === true;
}

// Activate 7-day trial
export async function activateTrial(userId: string, transactionId: string): Promise<Subscription | null> {
  const alreadyUsed = await hasUsedTrial(userId);
  if (alreadyUsed) throw new Error('Trial already used');

  const now = new Date();
  const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  // Create subscription record
  const { data: sub, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: 'trial_7day',
      price: 10,
      duration_days: 7,
      status: 'active',
      trial_start: now.toISOString(),
      trial_end: trialEnd.toISOString(),
      has_used_trial: true,
      transaction_id: transactionId,
    })
    .select()
    .single();

  if (error) throw error;

  // Update user record
  await supabaseAdmin
    .from('users')
    .update({
      subscription_type: 'trial_7day',
      is_premium: true,
      tier: 1,
      trial_start: now.toISOString(),
      trial_end: trialEnd.toISOString(),
      has_used_trial: true,
    })
    .eq('clerk_id', userId);

  return sub as Subscription;
}

// Activate Pro/Business plan
export async function activatePlan(userId: string, planType: string, transactionId: string): Promise<Subscription | null> {
  const now = new Date();
  const endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
  const prices: Record<string, number> = { pro: 99, business: 599 };

  const { data: sub, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      plan_type: planType,
      price: prices[planType] || 0,
      duration_days: 30,
      status: 'active',
      trial_start: now.toISOString(),
      trial_end: endDate.toISOString(),
      transaction_id: transactionId,
    })
    .select()
    .single();

  if (error) throw error;

  await supabaseAdmin
    .from('users')
    .update({
      subscription_type: planType,
      is_premium: true,
      tier: planType === 'business' ? 2 : 1,
      expires_at: endDate.toISOString(),
    })
    .eq('clerk_id', userId);

  return sub as Subscription;
}

// Check and expire trials (called by middleware/cron)
export async function checkAndExpireTrials(userId: string): Promise<{ expired: boolean; daysLeft: number }> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('subscription_type, trial_end')
    .eq('clerk_id', userId)
    .single();

  if (!user || user.subscription_type !== 'trial_7day' || !user.trial_end) {
    return { expired: false, daysLeft: 0 };
  }

  const trialEnd = new Date(user.trial_end);
  const now = new Date();
  const daysLeft = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  if (daysLeft <= 0) {
    // Expire the trial
    await supabaseAdmin
      .from('users')
      .update({ subscription_type: 'free', is_premium: false, tier: 0 })
      .eq('clerk_id', userId);

    await supabaseAdmin
      .from('subscriptions')
      .update({ status: 'expired' })
      .eq('user_id', userId)
      .eq('plan_type', 'trial_7day')
      .eq('status', 'active');

    return { expired: true, daysLeft: 0 };
  }

  return { expired: false, daysLeft };
}

// Get trial status for dashboard display
export async function getTrialStatus(userId: string): Promise<{
  planType: string;
  daysLeft: number;
  isActive: boolean;
  hasUsedTrial: boolean;
  trialEnd: string | null;
}> {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('subscription_type, trial_end, has_used_trial')
    .eq('clerk_id', userId)
    .single();

  if (!user) return { planType: 'free', daysLeft: 0, isActive: false, hasUsedTrial: false, trialEnd: null };

  const isTrialActive = user.subscription_type === 'trial_7day' && user.trial_end;
  let daysLeft = 0;

  if (isTrialActive) {
    const end = new Date(user.trial_end);
    daysLeft = Math.max(0, Math.ceil((end.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
  }

  return {
    planType: user.subscription_type || 'free',
    daysLeft,
    isActive: isTrialActive && daysLeft > 0,
    hasUsedTrial: user.has_used_trial || false,
    trialEnd: user.trial_end || null,
  };
}

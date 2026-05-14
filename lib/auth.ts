import { supabaseAdmin } from './supabase';

export interface UserPlan {
  userId: string;
  planType: string;    // 'free' | 'trial_7day' | 'pro_99' | 'pro_299' | 'pro_599'
  isPremium: boolean;
  isTrialActive: boolean;
  trialDaysLeft: number;
  features: {
    unlimitedTools: boolean;
    priorityQueue: boolean;
    apiAccess: boolean;
    noWatermark: boolean;
    hdOutput: boolean;
  };
}

/**
 * Get user plan from request headers or Supabase
 */
export async function checkUserPlan(req: Request): Promise<UserPlan> {
  const userId = req.headers.get('x-user-id') || req.headers.get('x-clerk-user-id') || null;

  const defaultFree: UserPlan = {
    userId: userId || 'anon',
    planType: 'free',
    isPremium: false,
    isTrialActive: false,
    trialDaysLeft: 0,
    features: {
      unlimitedTools: false, priorityQueue: false,
      apiAccess: false, noWatermark: false, hdOutput: false,
    },
  };

  if (!userId) return defaultFree;

  try {
    const { data: user, error } = await supabaseAdmin
      .from('users')
      .select('subscription_type, is_premium, trial_end, has_used_trial, tier')
      .eq('clerk_id', userId)
      .single();

    if (error || !user) return defaultFree;

    const subType = user.subscription_type || 'free';
    let isTrialActive = false;
    let trialDaysLeft = 0;

    if (subType === 'trial_7day' && user.trial_end) {
      const end = new Date(user.trial_end);
      const now = new Date();
      trialDaysLeft = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
      isTrialActive = trialDaysLeft > 0;

      // Auto-expire if trial is over
      if (!isTrialActive) {
        await supabaseAdmin
          .from('users')
          .update({ subscription_type: 'free', is_premium: false, tier: 0 })
          .eq('clerk_id', userId);
        return defaultFree;
      }
    }

    const planMap: Record<string, string> = {
      free: 'free', trial_7day: 'trial_7day',
      pro: 'pro_99', pro_99: 'pro_99',
      pro_299: 'pro_299', business: 'pro_599', pro_599: 'pro_599',
    };

    const planType = planMap[subType] || 'free';
    const isPremium = user.is_premium || planType !== 'free';

    return {
      userId,
      planType,
      isPremium,
      isTrialActive,
      trialDaysLeft,
      features: {
        unlimitedTools: isPremium,
        priorityQueue: planType === 'pro_599',
        apiAccess: planType === 'pro_299' || planType === 'pro_599',
        noWatermark: isPremium,
        hdOutput: isPremium,
      },
    };
  } catch {
    return defaultFree;
  }
}

/**
 * Quick helper to extract userId from request
 */
export function getUserId(req: Request): string {
  return req.headers.get('x-user-id') || req.headers.get('x-clerk-user-id') || 'anon';
}

/**
 * Check if user has access to a specific premium feature
 */
export async function hasFeatureAccess(req: Request, feature: keyof UserPlan['features']): Promise<boolean> {
  const plan = await checkUserPlan(req);
  return plan.features[feature] || false;
}

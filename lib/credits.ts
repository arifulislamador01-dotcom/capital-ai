import { supabaseAdmin } from './supabase';

// Credit costs per tool type
export const CREDIT_COSTS: Record<string, number> = {
  // Text tools (1 credit)
  'summarize': 1,
  'paraphrase': 1,
  'grammar-check': 1,
  'translate': 1,
  'vocabulary': 1,
  
  // AI generation (2 credits)
  'chatbot': 2,
  'story-generator': 2,
  'email-writer': 2,
  'caption-generator': 2,
  'hashtag-generator': 2,
  'poem-generator': 2,
  'product-description': 2,
  'business-name': 2,
  'blog-outline': 2,
  'youtube-script': 2,
  'tiktok-script': 2,
  'twitter-thread': 2,
  'instagram-bio': 2,
  'ad-copy': 2,
  'cover-letter': 2,
  'interview-qa': 2,
  'linkedin-bio': 2,
  'flashcard': 2,
  'quiz-generator': 2,
  'workout-planner': 2,
  'symptom-checker': 2,
  'code-explainer': 2,
  'podcast-script': 2,
  'content-calendar': 2,
  'privacy-policy': 2,
  'terms-of-service': 2,
  'nda-template': 2,
  'meeting-minutes': 2,
  'review-response': 2,
  'darkhast-writer': 2,
  'banglish-converter': 2,
  'joke-generator': 2,
  'would-you-rather': 2,
  'personality-quiz': 2,
  'adventure-game': 2,
  'meme-text': 2,
  
  // Image generation (3 credits)
  'text-to-image': 3,
  'background-remove': 3,
  'image-upscale': 3,
  'image-colorize': 3,
  'product-background': 3,
  
  // HD/Premium quality (5 credits)
  'hd-upscale': 5,
  'text-to-speech': 5,
  'speech-to-text': 5,
  'resume-builder': 5,
  
  // Free tools (0 credits)
  'image-compress': 0,
  'photo-filter': 0,
  'watermark': 0,
  'avatar-generator': 0,
  'qr-code': 0,
  'barcode': 0,
  'password-generator': 0,
  'json-formatter': 0,
  'base64': 0,
  'markdown-editor': 0,
  'unit-converter': 0,
  'age-calculator': 0,
  'bmi-calculator': 0,
  'emi-calculator': 0,
  'tax-calculator': 0,
  'sip-calculator': 0,
  'discount-calculator': 0,
  'pomodoro-timer': 0,
  'meditation-timer': 0,
  'water-tracker': 0,
  'sleep-tracker': 0,
  'voice-recorder': 0,
  'audio-visualizer': 0,
  'typing-test': 0,
  'decision-maker': 0,
  'currency-converter': 0,
  'crypto-tracker': 0,
  'gold-tracker': 0,
  'prayer-time': 0,
  'bus-route': 0,
  'post-code': 0,
  'color-palette': 0,
  'stock-photos': 0,
  'shipping-calculator': 0,
};

export type ToolCategory = 'text' | 'image' | 'audio' | 'premium' | 'free';

export function getToolCost(toolName: string): number {
  return CREDIT_COSTS[toolName] ?? 2; // Default 2 credits for unknown tools
}

export function getToolCategory(toolName: string): ToolCategory {
  const cost = getToolCost(toolName);
  if (cost === 0) return 'free';
  if (cost === 1) return 'text';
  if (cost === 3) return 'image';
  if (cost >= 5) return 'premium';
  return 'text';
}

// Check if user has enough credits and deduct
export async function checkAndDeductCredits(
  clerkId: string,
  toolName: string
): Promise<{ success: boolean; remaining: number; error?: string }> {
  const cost = getToolCost(toolName);
  
  // Free tools always pass
  if (cost === 0) {
    return { success: true, remaining: -1 };
  }

  // Get user
  const { data: user, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('clerk_id', clerkId)
    .single();

  if (fetchError || !user) {
    return { success: false, remaining: 0, error: 'User not found' };
  }

  // Reset credits if needed (daily reset)
  const resetAt = new Date(user.credits_reset_at);
  const now = new Date();
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  if (resetAt < todayMidnight) {
    let dailyLimit = 100; // Free plan
    if (user.is_premium) {
      if (user.tier === 1) dailyLimit = 200; // Invite friends (3 days)
      if (user.tier === 2) dailyLimit = 200; // Weekly pro (7 days)
      if (user.tier === 3) dailyLimit = 500; // Basic plan (30 days)
      if (user.tier >= 4) dailyLimit = 999999; // Pro version (unlimited)
    }

    await supabaseAdmin
      .from('users')
      .update({
        credits_remaining: dailyLimit,
        credits_reset_at: now.toISOString(),
      })
      .eq('clerk_id', clerkId);
    
    user.credits_remaining = dailyLimit;
  }

  // Premium users: unlimited if tier >= 4
  if (user.is_premium && user.tier >= 4) {
    // Log usage but don't deduct
    await supabaseAdmin.from('tool_usage').insert({
      user_id: user.id,
      tool_name: toolName,
      credits_used: cost,
    });
    return { success: true, remaining: 999999 };
  }

  // Check if enough credits
  if (user.credits_remaining < cost) {
    return {
      success: false,
      remaining: user.credits_remaining,
      error: `Not enough credits. Need ${cost}, have ${user.credits_remaining}`,
    };
  }

  // Deduct credits
  const newRemaining = user.credits_remaining - cost;
  const { error: updateError } = await supabaseAdmin
    .from('users')
    .update({ credits_remaining: newRemaining })
    .eq('clerk_id', clerkId);

  if (updateError) {
    return { success: false, remaining: user.credits_remaining, error: 'Failed to deduct credits' };
  }

  // Log usage
  await supabaseAdmin.from('tool_usage').insert({
    user_id: user.id,
    tool_name: toolName,
    credits_used: cost,
  });

  return { success: true, remaining: newRemaining };
}

// Get user's credit info
export async function getCreditInfo(clerkId: string) {
  const { data: user } = await supabaseAdmin
    .from('users')
    .select('credits_remaining, is_premium, tier, credits_reset_at')
    .eq('clerk_id', clerkId)
    .single();

  if (!user) return null;

  return {
    remaining: user.credits_remaining,
    isPremium: user.is_premium,
    tier: user.tier,
    resetsAt: user.credits_reset_at,
  };
}

-- =============================================
-- Akash AI: Subscriptions & Trial System
-- Run this in Supabase SQL Editor
-- =============================================

-- 1. Create subscriptions table
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,                    -- clerk_id
  plan_type TEXT NOT NULL DEFAULT 'free',   -- 'free', 'trial_7day', 'pro', 'business'
  price INTEGER NOT NULL DEFAULT 0,
  duration_days INTEGER,                    -- NULL for recurring, 7 for trial
  status TEXT NOT NULL DEFAULT 'active',    -- 'active', 'expired', 'cancelled'
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  has_used_trial BOOLEAN NOT NULL DEFAULT FALSE,
  payment_method TEXT,                      -- 'bkash', 'nagad', 'rocket', 'card'
  transaction_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast lookups
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- 3. Update users table to include subscription fields
ALTER TABLE users ADD COLUMN IF NOT EXISTS subscription_type TEXT DEFAULT 'free';
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_start TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;
ALTER TABLE users ADD COLUMN IF NOT EXISTS has_used_trial BOOLEAN DEFAULT FALSE;

-- 4. Function to auto-expire trials
CREATE OR REPLACE FUNCTION expire_trials()
RETURNS void AS $$
BEGIN
  -- Expire trial subscriptions where trial_end has passed
  UPDATE subscriptions
  SET status = 'expired', updated_at = NOW()
  WHERE plan_type = 'trial_7day'
    AND status = 'active'
    AND trial_end < NOW();

  -- Reset users whose trial expired back to free
  UPDATE users
  SET subscription_type = 'free',
      is_premium = FALSE,
      tier = 0
  WHERE subscription_type = 'trial_7day'
    AND trial_end < NOW();
END;
$$ LANGUAGE plpgsql;

-- 5. Plans reference table
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  name_bn TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration_days INTEGER,
  features JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO plans (id, name, name_bn, price, duration_days, features) VALUES
  ('free', 'Free', 'ফ্রি', 0, NULL, '{"credits_per_day": 20, "watermark": true, "speed": "standard"}'),
  ('trial_7day', '7 Day Trial', '৭ দিনের ট্রায়াল', 10, 7, '{"credits_per_day": -1, "watermark": false, "speed": "priority", "all_tools": true}'),
  ('pro', 'Pro', 'প্রো', 99, 30, '{"credits_per_day": -1, "watermark": false, "speed": "priority", "all_tools": true}'),
  ('business', 'Business', 'বিজনেস', 599, 30, '{"credits_per_day": -1, "watermark": false, "speed": "priority", "all_tools": true, "api_access": true, "team": 3}')
ON CONFLICT (id) DO NOTHING;

-- 6. RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (true);
CREATE POLICY "Service can manage subscriptions" ON subscriptions FOR ALL USING (true);
CREATE POLICY "Anyone can view plans" ON plans FOR SELECT USING (true);

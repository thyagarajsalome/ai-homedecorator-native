-- Migration: Simplify database schema and drop referral/daily-streak tracking

-- 1. Drop public.referrals table
DROP TABLE IF EXISTS public.referrals CASCADE;

-- 2. Drop daily_streak and last_login_date columns from public.user_profiles
ALTER TABLE public.user_profiles 
DROP COLUMN IF EXISTS daily_streak,
DROP COLUMN IF EXISTS last_login_date;

-- 3. Change default generation_credits value to 2
ALTER TABLE public.user_profiles 
ALTER COLUMN generation_credits SET DEFAULT 2;

-- 4. Re-create a simplified trigger function public.handle_new_user()
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, generation_credits)
  VALUES (new.id, 2);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Drop the claim_daily_login function if it exists
DROP FUNCTION IF EXISTS public.claim_daily_login();

-- Migration: Enforce Pay-and-Use model with 0 initial free credits
-- 1. Change default generation_credits to 0 on public.user_profiles
ALTER TABLE public.user_profiles 
ALTER COLUMN generation_credits SET DEFAULT 0;

-- 2. Update public.handle_new_user() trigger to initialize new users with 0 credits
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, generation_credits)
  VALUES (new.id, 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

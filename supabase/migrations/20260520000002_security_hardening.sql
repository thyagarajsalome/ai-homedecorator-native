-- Security Hardening Migration

-- 1. Update handle_new_user to prevent self-referral and cap inviter rewards at 2 referrals
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_referral_code text;
  v_inviter_id uuid;
  v_referral_count int;
BEGIN
  -- Extract referral code from user metadata
  v_referral_code := new.raw_user_meta_data->>'referral_code';
  
  -- If a referral code was provided, try to find the inviter
  IF v_referral_code IS NOT NULL AND v_referral_code != '' THEN
    -- Look up the inviter by matching the first 8 characters of their ID
    SELECT id INTO v_inviter_id 
    FROM public.user_profiles 
    WHERE left(id::text, 8) = upper(v_referral_code) 
    LIMIT 1;
    
    -- If an inviter was found AND it's not the new user themselves (self-referral prevention)
    IF v_inviter_id IS NOT NULL AND v_inviter_id != new.id THEN
      -- Count existing successful referrals for this inviter
      SELECT COUNT(*) INTO v_referral_count
      FROM public.referrals
      WHERE inviter_id = v_inviter_id;

      -- 1. Create the new user with 6 credits (3 standard + 3 bonus)
      INSERT INTO public.user_profiles (id, generation_credits)
      VALUES (new.id, 6);
      
      -- 2. Reward the inviter with 3 extra credits ONLY IF they have fewer than 2 referrals (cap at 2 referrals)
      IF v_referral_count < 2 THEN
        UPDATE public.user_profiles 
        SET generation_credits = generation_credits + 3 
        WHERE id = v_inviter_id;
      END IF;
      
      -- 3. Record the referral connection
      INSERT INTO public.referrals (inviter_id, invitee_id) 
      VALUES (v_inviter_id, new.id);
      
      RETURN new;
    END IF;
  END IF;

  -- Default fallback if no valid referral code was found
  INSERT INTO public.user_profiles (id, generation_credits)
  VALUES (new.id, 3);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Create secure RPC function to deduct credits
CREATE OR REPLACE FUNCTION public.secure_deduct_credits(cost_amount INT)
RETURNS json AS $$
DECLARE
  v_credits int;
BEGIN
  -- Check if user is authenticated
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;
  
  -- Check for valid deduction amount
  IF cost_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid cost amount';
  END IF;

  -- Get current credits
  SELECT generation_credits INTO v_credits
  FROM public.user_profiles
  WHERE id = auth.uid();
  
  IF v_credits IS NULL OR v_credits < cost_amount THEN
    RAISE EXCEPTION 'Insufficient credits';
  END IF;
  
  -- Deduct credits
  UPDATE public.user_profiles
  SET generation_credits = generation_credits - cost_amount
  WHERE id = auth.uid();
  
  RETURN json_build_object(
    'success', true,
    'current_credits', v_credits - cost_amount
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Harden RLS policies: Drop direct update policy on user_profiles
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;

-- 4. Harden RLS policies: Drop direct insert policy on referrals (referrals are created by trigger only)
DROP POLICY IF EXISTS "Users can insert referrals" ON public.referrals;

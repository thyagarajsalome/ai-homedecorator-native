-- Migration: Update new user trigger to handle referral codes

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  v_referral_code text;
  v_inviter_id uuid;
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
    
    -- If an inviter was found
    IF v_inviter_id IS NOT NULL THEN
      -- 1. Create the new user with 6 credits (3 standard + 3 bonus)
      INSERT INTO public.user_profiles (id, generation_credits)
      VALUES (new.id, 6);
      
      -- 2. Reward the inviter with 3 extra credits
      UPDATE public.user_profiles 
      SET generation_credits = generation_credits + 3 
      WHERE id = v_inviter_id;
      
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

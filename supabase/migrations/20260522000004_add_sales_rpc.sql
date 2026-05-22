-- Migration: Add secure function to allow users to add credits on purchase
-- This function runs as SECURITY DEFINER to bypass update restrictions on user_profiles.

CREATE OR REPLACE FUNCTION public.secure_add_credits(credit_amount INT)
RETURNS json AS $$
DECLARE
  v_credits int;
BEGIN
  -- Validate inputs
  IF credit_amount <= 0 THEN
    RAISE EXCEPTION 'Invalid credit amount. Must be greater than 0.';
  END IF;

  -- Add credits for the currently authenticated user
  UPDATE public.user_profiles
  SET generation_credits = generation_credits + credit_amount
  WHERE id = auth.uid()
  RETURNING generation_credits INTO v_credits;

  -- Verify user profile exists
  IF NOT FOUND THEN
    RAISE EXCEPTION 'User profile not found.';
  END IF;

  RETURN json_build_object(
    'success', true,
    'current_credits', v_credits
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

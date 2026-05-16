-- Ensure user_profiles table exists
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    generation_credits INT DEFAULT 3,
    daily_streak INT DEFAULT 0,
    last_login_date TIMESTAMP WITH TIME ZONE
);

-- Add columns just in case the table already existed but was missing them
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS daily_streak INT DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_login_date TIMESTAMP WITH TIME ZONE;

-- Enable RLS on user_profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" 
    ON public.user_profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = id);

-- Create a trigger to automatically create a user_profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.user_profiles (id, generation_credits)
  VALUES (new.id, 3); -- Give 3 free credits on signup
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop the trigger if it exists to avoid errors, then recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create Referrals Table
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inviter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    invitee_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    UNIQUE(invitee_id) -- A user can only be invited once
);

-- Enable RLS on Referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own referrals" 
    ON public.referrals FOR SELECT 
    USING (auth.uid() = inviter_id OR auth.uid() = invitee_id);

CREATE POLICY "Users can insert referrals" 
    ON public.referrals FOR INSERT 
    WITH CHECK (auth.uid() = invitee_id);

-- Create Public Gallery Table
CREATE TABLE IF NOT EXISTS public.public_gallery (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    original_image_url TEXT NOT NULL,
    generated_image_url TEXT NOT NULL,
    prompt TEXT,
    room_type TEXT,
    likes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS on Public Gallery
ALTER TABLE public.public_gallery ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view the public gallery" 
    ON public.public_gallery FOR SELECT 
    USING (true);

CREATE POLICY "Users can add their own images to the gallery" 
    ON public.public_gallery FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own images from the gallery" 
    ON public.public_gallery FOR DELETE 
    USING (auth.uid() = user_id);

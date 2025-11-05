-- Reset all existing accounts to require onboarding
-- This ensures all users (existing and new) go through the onboarding process

-- Update all existing profiles to require onboarding
UPDATE profiles 
SET 
  onboarding_completed = false,
  onboarding_progress = NULL,
  updated_at = NOW()
WHERE onboarding_completed = true OR onboarding_completed IS NULL;

-- Ensure the default value for new profiles is false
ALTER TABLE profiles 
ALTER COLUMN onboarding_completed SET DEFAULT false;

-- Add a comment to document this change
COMMENT ON COLUMN profiles.onboarding_completed IS 'Tracks whether user has completed the onboarding process. Defaults to false for all new users.';
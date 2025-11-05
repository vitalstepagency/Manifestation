-- Add onboarding progress field to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS onboarding_progress JSONB DEFAULT '{"currentStep": 0, "completedSteps": [], "data": {}}'::jsonb;

-- Update existing users to have proper onboarding progress structure
UPDATE profiles 
SET onboarding_progress = '{"currentStep": 0, "completedSteps": [], "data": {}}'::jsonb 
WHERE onboarding_progress IS NULL;

-- Add comment to explain the structure
COMMENT ON COLUMN profiles.onboarding_progress IS 'Tracks user onboarding progress: currentStep (number), completedSteps (array), data (object with form data)';
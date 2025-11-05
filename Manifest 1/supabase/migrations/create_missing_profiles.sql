-- Create profiles for existing auth users who don't have profiles
INSERT INTO public.profiles (id, email, full_name, onboarding_completed, onboarding_progress)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'full_name', ''),
  false,
  '{"currentStep": 0, "completedSteps": [], "data": {}}'::jsonb
FROM auth.users au
LEFT JOIN public.profiles p ON au.id = p.id
WHERE p.id IS NULL;
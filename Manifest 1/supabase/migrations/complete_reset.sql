-- Complete database reset - clear everything and create fresh admin account

-- Delete all data from tables (in correct order to avoid foreign key constraints)
DELETE FROM progress_entries;
DELETE FROM journal_entries;
DELETE FROM habits;
DELETE FROM non_negotiables;
DELETE FROM profiles;

-- Delete all auth users (this will cascade to profiles due to foreign key)
-- Note: This requires service role permissions
DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Get all users from auth.users
    FOR user_record IN SELECT id FROM auth.users LOOP
        -- Delete each user (this will trigger cascading deletes)
        DELETE FROM auth.users WHERE id = user_record.id;
    END LOOP;
END $$;

-- Create fresh admin account
-- Insert into auth.users first
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'admin@manifest.app',
    crypt('admin123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Create corresponding profile for admin
INSERT INTO profiles (
    id,
    email,
    full_name,
    onboarding_completed,
    created_at,
    updated_at
) 
SELECT 
    id,
    'admin@manifest.app',
    'Admin User',
    true,
    NOW(),
    NOW()
FROM auth.users 
WHERE email = 'admin@manifest.app';
-- 🚨 COMPLETE DATABASE FIX
-- Run this ENTIRE script in Supabase SQL Editor to fix all table mismatches

-- =============================================================================
-- 1. FIX PROFILES TABLE
-- =============================================================================

-- Drop and recreate with correct schema
DROP TABLE IF EXISTS profiles CASCADE;

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,  -- Keep for compatibility
  manifestation_goal TEXT,
  current_streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  timezone TEXT DEFAULT 'UTC',
  preferences JSONB DEFAULT '{}',
  archetype TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE,
  onboarding_progress JSONB,
  email TEXT,
  full_name TEXT,
  dream TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create your profile
INSERT INTO profiles (id, user_id, email, full_name, archetype, manifestation_goal, onboarding_completed)
VALUES (
  '3c29450b-ddbd-4932-8cb2-29a520afdaab',
  '3c29450b-ddbd-4932-8cb2-29a520afdaab',
  'test@example.com',
  'Test User',
  'visionary',
  'I will make $100,000.',
  TRUE
)
ON CONFLICT (id) DO UPDATE SET
  archetype = EXCLUDED.archetype,
  manifestation_goal = EXCLUDED.manifestation_goal,
  onboarding_completed = EXCLUDED.onboarding_completed;

-- =============================================================================
-- 2. FIX NON_NEGOTIABLES TABLE
-- =============================================================================

DROP TABLE IF EXISTS non_negotiables CASCADE;

CREATE TABLE non_negotiables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT '⭐',
  is_completed BOOLEAN DEFAULT FALSE,
  completion_date TEXT,
  priority_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE non_negotiables ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own non_negotiables"
  ON non_negotiables FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own non_negotiables"
  ON non_negotiables FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own non_negotiables"
  ON non_negotiables FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own non_negotiables"
  ON non_negotiables FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- 3. FIX HABITS TABLE
-- =============================================================================

DROP TABLE IF EXISTS habits CASCADE;

CREATE TABLE habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('building', 'breaking')),
  category TEXT,
  description TEXT,
  streak_count INTEGER DEFAULT 0,
  is_completed_today BOOLEAN DEFAULT FALSE,
  completionDates TEXT[],
  isActive BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own habits"
  ON habits FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits"
  ON habits FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits"
  ON habits FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits"
  ON habits FOR DELETE
  USING (auth.uid() = user_id);

-- =============================================================================
-- 4. FIX MANIFESTATION_NODES TABLE
-- =============================================================================

DROP TABLE IF EXISTS manifestation_nodes CASCADE;

CREATE TABLE manifestation_nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Core dream data
  type TEXT NOT NULL CHECK (type IN ('dream', 'goal', 'milestone', 'habit')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('vehicle', 'home', 'travel', 'wealth', 'love', 'health', 'other')),

  -- 3D positioning
  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  position_z REAL NOT NULL DEFAULT 0,

  -- Visual customization (matches code exactly)
  color TEXT NOT NULL DEFAULT '#fbbf24',
  size REAL NOT NULL DEFAULT 0.8,
  glow REAL NOT NULL DEFAULT 0.8,
  image_url TEXT,

  -- Progress tracking
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Connections to other nodes
  connections TEXT[] DEFAULT '{}',

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_manifestation_nodes_user_id ON manifestation_nodes(user_id);
CREATE INDEX idx_manifestation_nodes_created_at ON manifestation_nodes(created_at DESC);
CREATE INDEX idx_manifestation_nodes_is_active ON manifestation_nodes(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_manifestation_nodes_category ON manifestation_nodes(category);

-- Enable RLS
ALTER TABLE manifestation_nodes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own manifestation nodes"
  ON manifestation_nodes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own manifestation nodes"
  ON manifestation_nodes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own manifestation nodes"
  ON manifestation_nodes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own manifestation nodes"
  ON manifestation_nodes FOR DELETE
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL PRIVILEGES ON manifestation_nodes TO authenticated;

-- =============================================================================
-- 5. CREATE HELPER FUNCTIONS
-- =============================================================================

-- Function for updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_habits_updated_at ON habits;
CREATE TRIGGER update_habits_updated_at
  BEFORE UPDATE ON habits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_manifestation_nodes_updated_at ON manifestation_nodes;
CREATE TRIGGER update_manifestation_nodes_updated_at
  BEFORE UPDATE ON manifestation_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================================
-- 6. VERIFY EVERYTHING
-- =============================================================================

-- Check profiles columns
SELECT 'PROFILES TABLE:' as table_name;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles'
ORDER BY ordinal_position;

-- Check your profile exists
SELECT 'YOUR PROFILE:' as record;
SELECT id, email, archetype, manifestation_goal, onboarding_completed
FROM profiles
WHERE id = '3c29450b-ddbd-4932-8cb2-29a520afdaab';

-- Check manifestation_nodes columns
SELECT 'MANIFESTATION_NODES TABLE:' as table_name;
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'manifestation_nodes'
ORDER BY ordinal_position;

SELECT '✅ ALL TABLES FIXED!' as status;

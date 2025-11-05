-- 🚨 FIX: Drop the wrong table and recreate with correct schema
-- This matches the TypeScript code exactly

-- Drop the incorrectly created table
DROP TABLE IF EXISTS manifestation_nodes CASCADE;

-- Create manifestation_nodes table with CORRECT field names
CREATE TABLE manifestation_nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,

  -- Core dream data
  type TEXT NOT NULL CHECK (type IN ('dream', 'goal', 'milestone', 'habit')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('vehicle', 'home', 'travel', 'wealth', 'love', 'health', 'other')),

  -- 3D positioning (must persist for consistent layout across sessions)
  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  position_z REAL NOT NULL DEFAULT 0,

  -- Visual customization (matches React Three Fiber properties & code)
  color TEXT NOT NULL DEFAULT '#fbbf24',
  size REAL NOT NULL DEFAULT 0.8,
  glow REAL NOT NULL DEFAULT 0.8,
  image_url TEXT,

  -- Progress tracking (0-100%)
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),

  -- Connections to other nodes (stored as array of UUIDs)
  connections TEXT[] DEFAULT '{}',

  -- Metadata
  is_active BOOLEAN DEFAULT TRUE,
  achieved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_manifestation_nodes_user_id ON manifestation_nodes(user_id);
CREATE INDEX idx_manifestation_nodes_created_at ON manifestation_nodes(created_at DESC);
CREATE INDEX idx_manifestation_nodes_is_active ON manifestation_nodes(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_manifestation_nodes_category ON manifestation_nodes(category);

-- Enable Row Level Security
ALTER TABLE manifestation_nodes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
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

-- Grant permissions to authenticated users
GRANT ALL PRIVILEGES ON manifestation_nodes TO authenticated;

-- Create function for updated_at trigger (if it doesn't exist)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_manifestation_nodes_updated_at ON manifestation_nodes;
CREATE TRIGGER update_manifestation_nodes_updated_at
  BEFORE UPDATE ON manifestation_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Verify the table was created with correct columns
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'manifestation_nodes'
ORDER BY ordinal_position;

/*
Expected output:
id              | uuid
user_id         | uuid
type            | text
title           | text
description     | text
category        | text
position_x      | real
position_y      | real
position_z      | real
color           | text      ← NOT color_hex
size            | real      ← NOT missing
glow            | real      ← NOT glow_intensity
image_url       | text
progress        | integer
connections     | ARRAY
is_active       | boolean
achieved_at     | timestamp with time zone
created_at      | timestamp with time zone
updated_at      | timestamp with time zone
*/

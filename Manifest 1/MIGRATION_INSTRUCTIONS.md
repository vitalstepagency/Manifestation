# 🚨 CRITICAL: Run This Migration Before Testing Universe Feature

## The Problem
The Portal → Universe navigation will appear frozen if the database table doesn't exist yet. You'll see a toast notification: **"Database not set up. Please run migration first."**

## The Solution
Run the migration to create the `manifestation_nodes` table.

---

## METHOD 1: Supabase Dashboard (Easiest)

1. Go to your Supabase project: https://supabase.com/dashboard
2. Select your Manifest project
3. Click **"SQL Editor"** in the left sidebar
4. Click **"New Query"**
5. Copy the ENTIRE contents of `supabase/migrations/create_manifestation_nodes.sql`
6. Paste into the SQL Editor
7. Click **"Run"** (or press Ctrl+Enter)

**Expected Success Message:**
```
Success. No rows returned
```

---

## METHOD 2: Supabase CLI (If Installed)

```bash
# Navigate to your project directory
cd "C:\Users\Dylan\OneDrive\Desktop\Manifest\Manifest 1"

# Push all pending migrations
supabase db push

# Or run the specific migration
supabase migration up
```

---

## METHOD 3: Manual SQL Execution

If you prefer to run just the table creation without the full migration file:

```sql
-- Run this in Supabase SQL Editor
CREATE TABLE manifestation_nodes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,

  type TEXT NOT NULL CHECK (type IN ('dream', 'goal', 'milestone', 'habit')),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('vehicle', 'home', 'travel', 'wealth', 'love', 'health', 'other')),

  position_x REAL NOT NULL DEFAULT 0,
  position_y REAL NOT NULL DEFAULT 0,
  position_z REAL NOT NULL DEFAULT 0,

  color TEXT NOT NULL DEFAULT '#fbbf24',
  size REAL NOT NULL DEFAULT 0.8,
  glow REAL NOT NULL DEFAULT 0.8,
  image_url TEXT,

  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  connections TEXT[] DEFAULT '{}',

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

-- Permissions
GRANT ALL PRIVILEGES ON manifestation_nodes TO authenticated;

-- Trigger for updated_at
CREATE TRIGGER update_manifestation_nodes_updated_at
  BEFORE UPDATE ON manifestation_nodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## How to Verify Migration Worked

### Check in Supabase Dashboard:
1. Go to **Table Editor** in Supabase
2. Look for `manifestation_nodes` in the table list
3. You should see the table with all columns

### Check in Browser Console:
1. Open your app: http://localhost:5174
2. Complete onboarding and go through the portal animation
3. Open DevTools (F12) → Console tab
4. Look for these logs:
```
🔍 Loading manifestation nodes from database...
✅ Manifestation nodes loaded successfully: 0
🌟 Creating main goal node from onboarding: [your goal]
✅ Main goal created successfully
```

### If Migration Worked:
- Portal animation completes → Universe page loads
- You see your main goal as a golden sphere in the center
- You can add dreams using the template buttons
- Dreams persist when you refresh the page

### If Migration Failed:
- You'll see a toast: "Database not set up. Please run migration first."
- Console shows: `🚨 DATABASE TABLE NOT FOUND! Run the migration first.`
- Universe page loads but is empty

---

## Troubleshooting

### Error: "relation 'manifestation_nodes' does not exist"
**Solution:** The migration hasn't been run yet. Follow METHOD 1 above.

### Error: "permission denied for table manifestation_nodes"
**Solution:** Check RLS policies. Run the policy creation SQL from METHOD 3.

### Error: "column 'user_id' does not exist"
**Solution:** The profiles table might not exist. Check your database schema.

### Still stuck?
1. Check Supabase logs in Dashboard → Logs
2. Verify your `profiles` table exists
3. Make sure the `update_updated_at_column()` function exists (from initial schema)

---

## After Migration: What Works

✅ **Portal → Universe navigation** - Smooth transition, no freezing
✅ **Main goal creation** - Auto-creates from onboarding
✅ **Add dreams** - Click template buttons to add dreams
✅ **Persistence** - Refresh page, dreams are still there
✅ **3D Universe** - See all dreams as glowing spheres
✅ **Loading states** - Spinner while loading from DB
✅ **Error handling** - Clear error messages if something fails

---

## Next Steps After Migration

Once the migration is successful:
1. Complete the onboarding flow
2. Watch the butterfly portal animation
3. Universe should load with your main goal
4. Add 2-3 dreams using the template buttons
5. Refresh the page - dreams should persist!

If everything works, you're ready for the next phase:
- Build DreamDetailPanel (click a dream to see details)
- Build DreamEditModal (edit dream title, progress, color)
- Add confetti animation when progress hits 100%

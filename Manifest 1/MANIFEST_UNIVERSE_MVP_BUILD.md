# 🚀 MANIFEST UNIVERSE MVP - COMPLETE BUILD SPECIFICATION

**ACTIVATE PLAN MODE** - This is a complex multi-system feature requiring database, state management, UI components, and integration work.

---

## 🎯 MISSION: Complete Manifestation Universe MVP

**Context:** I'm building Manifest - a manifestation engine that combines social competition, gamification, and visual goal tracking. We've completed onboarding and have a working 3D Universe where users can add dream spheres. Now we need to connect the Universe to the core app functionality AND make the Universe visually stunning so we can launch the MVP.

**Current State:**

- ✅ Onboarding flow complete (archetype, manifestation goal, Sacred Three, habits)
- ✅ 3D Universe renders with colored spheres
- ✅ Users can add dreams via template buttons
- ✅ Dreams persist to database (manifestation_nodes table)
- ✅ Dreams survive page refresh
- ❌ Dreams are NOT connected to habits/goals
- ❌ Universe is basic (just colored circles)
- ❌ No way to track progress on dreams
- ❌ No dashboard showing daily tasks
- ❌ Sacred Three from onboarding not displayed anywhere
- ❌ Habits from onboarding not trackable

---

## 💎 THE MANIFEST PHILOSOPHY (CRITICAL - READ THIS)

**Manifest is NOT a productivity app. It's a social competitive game where discipline happens as a side effect.**

**The Core Truth:**

- People are lazy and will ignore notifications
- Traditional "do your tasks" apps fail within 2 weeks
- Users need to WANT to open the app (like Instagram), not feel obligated
- Habits should complete as a byproduct of competition/entertainment, not guilt

**For MVP, we're building the FOUNDATION:**

- Phase 1 (MVP): Core functionality + visually stunning Universe that makes users WANT to check it
- Phase 2 (Post-launch): Social features, leaderboards, challenges, competition

**Design Principle:**
The Universe must be SO visually compelling that users open it just to look at it, even before we add social features. Think: "I want to show this to people" level of impressive.

---

## 📋 MVP SCOPE: What We MUST Build

### **GOAL:** Launch-ready app where users can:

1. ✅ See their 3 daily non-negotiables (Sacred Three) on Dashboard
2. ✅ Complete habits daily and mark them done
3. ✅ See progress toward their dreams in Universe
4. ✅ Have habits automatically update dream progress
5. ✅ Feel accomplishment when completing daily tasks
6. ✅ **Universe looks STUNNING - not just colored circles**
7. ✅ **Dreams feel alive, not static**
8. ✅ **User wants to check Universe daily just to see it**

**OUT OF SCOPE for MVP:**

- Social features (feed, leaderboards, challenges) - Phase 2
- Advanced AI insights - Phase 2
- Full image uploads for dreams - Phase 2 (but we add visual improvements now)
- Detailed analytics - Phase 2
- Advanced gamification - Phase 2

---

# PART 1: ENHANCED UNIVERSE VISUAL EXPERIENCE

## 🌌 CRITICAL: Universe Must Be Visually STUNNING

**Problem:** Current Universe is just colored spheres. Not impressive enough to make users want to check it daily.

**Solution:** Transform the Universe into a living, breathing, evolving space that feels magical.

---

## 🎨 UNIVERSE VISUAL ENHANCEMENTS (MVP)

### 1. **Enhanced Dream Sphere Appearance**

**Current:** Flat colored spheres
**New:** Multi-layered visual masterpiece

**Sphere Design:**

```
Each dream sphere should have:
- Gradient glow (color based on category)
- Pulsing animation (intensity based on progress)
- Particle effects around sphere (subtle, not overwhelming)
- Inner glow that pulses like a heartbeat
- Outer ring/halo that rotates slowly
- Text label that appears on hover (smooth fade in)
- Size scales with progress (0% = smaller, 100% = larger)
```

**Implementation Details:**

```typescript
// Dream sphere material
<meshStandardMaterial
  color={dream.color}
  emissive={dream.color}
  emissiveIntensity={0.5 + (dream.progress / 100) * 0.5}
  metalness={0.8}
  roughness={0.2}
/>

// Add bloom post-processing for glow effect
// Add particle system around each sphere
// Add rotation animation to outer ring
```

**Visual Hierarchy:**

- Main manifestation goal: LARGEST sphere, gold, center position, brightest glow
- Active dreams (>0% progress): Medium size, bright colors
- New dreams (0% progress): Smaller, dimmer, awaiting attention

---

### 2. **Dynamic Background & Environment**

**Current:** Black void
**New:** Living space environment

**Background Layers:**

```
1. Starfield (distant, slow-moving stars)
2. Nebula clouds (subtle purple/blue gradients, very slow drift)
3. Grid floor (optional, subtle tech aesthetic)
4. Ambient particles (tiny specs of light floating)
```

**Day/Night Cycle:**

```
Morning (6am-12pm): Brighter, warm colors, energetic
Afternoon (12pm-6pm): Neutral, balanced
Evening (6pm-12am): Darker, cool colors, calming
Night (12am-6am): Deep space, contemplative
```

**Implementation:**

```typescript
// Use React Three Fiber Environment
<Environment preset="night" />

// Add Stars component
<Stars
  radius={100}
  depth={50}
  count={5000}
  factor={4}
  saturation={0}
  fade
  speed={0.5}
/>

// Add fog for depth
<fog attach="fog" args={['#000000', 30, 100]} />
```

---

### 3. **Energy Connections Between Dreams**

**Current:** Basic lines
**New:** Animated energy flows

**Connection Visualization:**

```
- Flowing particles along connection line
- Pulsing glow when habit is completed
- Color matches source dream
- Intensity based on connection strength
- Animated flow direction (from habit to dream)
```

**Special Connection - Main Goal:**

```
All dreams should connect to main manifestation goal (center)
Connection glows brighter when that dream makes progress
Creates a visual web of interconnected dreams
```

**Implementation:**

```typescript
// Use custom shader for flowing energy
// Animate particles along bezier curve
// Trigger pulse animation on habit completion
```

---

### 4. **Camera & Movement Enhancements**

**Current:** Static orbit controls
**New:** Cinematic camera experience

**Camera Behaviors:**

```
On Enter:
- Smooth zoom in from distance
- Orbit around universe once (showcase)
- Focus on main goal briefly
- Release to user control

On Idle (no interaction for 30 seconds):
- Gentle auto-orbit
- Slowly zoom in/out (breathing effect)
- Focus on different dreams sequentially

On Dream Select:
- Smooth camera transition to selected dream
- Zoom in close
- Other dreams fade to 30% opacity
- Detail panel slides in from right
```

**Implementation:**

```typescript
// Use @react-three/drei's CameraControls
import { CameraControls } from "@react-three/drei";

// Animate camera on interactions
cameraControls.moveTo(x, y, z, true); // smooth = true
```

---

### 5. **Progress-Based Visual Evolution**

**Dreams should LOOK different as progress increases:**

```
0-24% Progress: Small, dim, waiting
- Sphere size: 1.0
- Glow: Subtle
- Particles: Few
- Animation: Slow pulse

25-49% Progress: Growing, brighter
- Sphere size: 1.3
- Glow: Medium
- Particles: More
- Animation: Medium pulse
- Unlock: Inner core glow

50-74% Progress: Strong, vibrant
- Sphere size: 1.6
- Glow: Bright
- Particles: Many
- Animation: Fast pulse
- Unlock: Outer ring appears

75-99% Progress: Radiant, powerful
- Sphere size: 1.9
- Glow: Intense
- Particles: Abundant
- Animation: Rapid pulse
- Unlock: Energy waves emanate

100% Progress: ACHIEVED - Transformation
- Sphere becomes GOLDEN
- Continuous bright glow
- Particle explosion (one time)
- Crown icon appears above
- Plays achievement sound
- Stays in universe as trophy
```

---

### 6. **Interactive Visual Feedback**

**Hover State:**

```
- Sphere grows 1.2x
- Glow increases 2x
- Particle speed increases
- Label fades in with smooth animation
- Connected dreams highlight
- Connection lines glow
```

**Click State:**

```
- Camera zooms to dream
- Detail panel appears (slide from right)
- Other dreams fade to background
- Selected dream pulses with attention-seeking animation
- Background darkens slightly (focus effect)
```

**Complete Habit (connected to dream):**

```
- Energy burst from user's current location
- Energy flows along connection line
- Reaches dream sphere
- Sphere pulses bright
- Progress bar animates upward
- Particle explosion at sphere
- New percentage displays with count-up animation
```

---

### 7. **Welcome Flow - First Time Experience**

**When user first enters Universe after onboarding:**

```
1. Fade in from black (1 second)

2. Distant view of universe
   - Camera far away
   - All dreams visible as small lights in distance
   - Starfield background

3. Welcome message appears
   "Welcome to Your Universe"
   "This is where dreams become reality"
   (2 seconds)

4. Camera flies forward (cinematic)
   - Smooth approach to universe
   - Stars blur past
   - Music swell (optional)
   (3 seconds)

5. Arrive at main goal
   - Main golden sphere in center
   - Camera orbits once around it
   - Text appears: [User's manifestation goal]
   (4 seconds)

6. Dreams appear one by one
   - Fade in with particle effect
   - Take positions around main goal
   - Connections draw between them
   (3 seconds)

7. Instructions overlay
   "Click any dream to see details"
   "Add more dreams below"
   [Begin Your Journey] button

8. Release to user control
   - Orbital controls enabled
   - UI elements fade in (add dream buttons)
```

**Total: ~15 second cinematic intro (skippable after first time)**

---

### 8. **UI Integration with 3D Space**

**Overlay Elements:**

```
Top Left:
- Universe title
- Back to Dashboard button

Top Right:
- Progress summary: "3 dreams • 18% average"
- Current streak indicator
- Quick stats

Bottom Center:
- Add Dream buttons (template grid)
- Currently visible by default

Bottom Left:
- Mini-map (optional) - shows all dreams from bird's eye
- Camera reset button
- View mode toggle (free cam / guided)

Bottom Right:
- Settings
- Tutorial button (replay welcome)
- Performance mode toggle
```

**Design:**

- Glass-morphism panels (blur, transparency)
- Minimal, non-intrusive
- Fade out when idle
- Smooth animations

---

### 9. **Performance Optimizations**

**CRITICAL - Must run at 60 FPS even with many dreams:**

```typescript
// Use instancing for particles
import { Instances, Instance } from "@react-three/drei";

// LOD (Level of Detail) for distant dreams
// Simple spheres when far, detailed when close

// Limit particle count per dream
// Max 100 particles per dream, adjust based on distance

// Use useFrame wisely
// Don't update every dream every frame
// Batch updates, stagger animations

// Lazy load detail panel
// Don't render until needed

// Optimize shadows
// Only main goal casts shadows
```

---

### 10. **Sound Design (Optional but Impactful)**

**Subtle audio cues:**

```
- Ambient space hum (very quiet background)
- Sphere hover: Soft chime
- Dream click: Satisfying pop
- Habit complete: Satisfying "ding" + woosh (energy flow)
- Achievement: Fanfare (short, 1 second)
- Background music: Optional, ambient, non-intrusive
```

**Implementation:**

- Use Web Audio API or Howler.js
- Volume control in settings
- Option to disable completely
- Preload critical sounds

---

## 🎨 VISUAL STYLE GUIDE

**Color Palette (from existing Manifest design):**

```
Main Goal: Gold (#FFD700) - warm, achievable
Vehicle: Red (#ef4444) - passion, speed
Home: Orange (#f59e0b) - warmth, foundation
Travel: Blue (#3b82f6) - adventure, freedom
Wealth: Green (#10b981) - growth, prosperity
Love: Pink (#ec4899) - connection, heart
Health: Purple (#8b5cf6) - vitality, strength
```

**Animation Principles:**

```
1. Smooth - All transitions use easing (ease-out, ease-in-out)
2. Fast - Nothing takes longer than 0.5 seconds (except cinematic intro)
3. Satisfying - Animations feel "juicy" (slight overshoot, bounce)
4. Purposeful - Every animation communicates meaning
5. Performant - Never drop below 60 FPS
```

**Spacing & Layout:**

```
- Dreams arranged in circular/spherical layout around main goal
- Minimum distance between dreams: 3 units
- Maximum distance from center: 15 units
- Use golden ratio for positioning (aesthetic)
```

---

# PART 2: DASHBOARD & CORE FUNCTIONALITY

## 📋 DASHBOARD - THE DAILY COMMAND CENTER

**User Story:**
"When I open Manifest after onboarding, I see my Dashboard with today's 3 Sacred Tasks, my habits, and a compelling preview of my Universe that makes me want to enter it."

---

### 1. Dashboard Page (src/pages/Dashboard.tsx)

**Layout:**

```
┌─────────────────────────────────────────────┐
│  Good Morning, [Name] 🌅                     │
│  [Archetype]: [Energy level emoji]           │
│  Streak: 12 days 🔥                          │
├─────────────────────────────────────────────┤
│                                              │
│  🎯 Today's Sacred Three                     │
│  ────────────────────────────────────        │
│  ☐ [Non-negotiable 1]     [Complete ✓]      │
│  ☐ [Non-negotiable 2]     [Complete ✓]      │
│  ☐ [Non-negotiable 3]     [Complete ✓]      │
│                                              │
│  Progress: 0/3 | +30 XP for Perfect Day      │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  💪 Building Habits                          │
│  ────────────────────────────────────        │
│  ☐ [Habit 1] - 7 day streak 🔥               │
│     Connected to: 🚗 Tesla (+0.5%)           │
│     [Complete] [•••]                         │
│                                              │
│  🚫 Breaking Habits                          │
│  ────────────────────────────────────        │
│  ☐ [Habit 2] - 3 days clean ✨               │
│     [Mark Avoided] [•••]                     │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  🌌 Your Universe                            │
│  ┌─────────────────────────────┐            │
│  │                              │            │
│  │  [Animated 3D preview]       │            │
│  │  (Rotating, glowing dreams)  │            │
│  │                              │            │
│  └─────────────────────────────┘            │
│                                              │
│  3 dreams • 18% average progress             │
│  Main Goal: "I will make $100,000" - 23%    │
│                                              │
│  [Enter Universe →]                          │
│                                              │
├─────────────────────────────────────────────┤
│                                              │
│  📊 This Week                                │
│  Perfect Days: 5/7 ⭐⭐⭐⭐⭐□□                │
│  Total XP: 250 | Level 3                     │
│  Best Streak: 18 days                        │
│                                              │
└─────────────────────────────────────────────┘
```

**Key Features:**

- Personalized greeting (time-based: morning/afternoon/evening)
- Load user's non_negotiables from database (from onboarding)
- Load user's habits from database (from onboarding)
- Display current streak and best streak
- Show which dreams are connected to each habit
- "Complete" button for each task triggers celebration
- Visual progress indicator (0/3, 1/3, 2/3, 3/3)
- Confetti + "Perfect Day!" message when 3/3 complete
- **Animated Universe preview** (actual 3D mini version, not static image)
- Quick stats for motivation

**Universe Preview Component:**

```typescript
// Small 3D canvas showing user's universe
// Slow auto-rotation
// Dreams glow and pulse
// Click anywhere to enter full Universe
// Max 200x200px canvas
// Lower quality/particle count for performance
```

---

### 2. Habit Completion System

**Database Updates Needed:**

```sql
-- Add completion tracking to habits
ALTER TABLE habits ADD COLUMN IF NOT EXISTS completed_dates TIMESTAMPTZ[];
ALTER TABLE habits ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMPTZ;
ALTER TABLE habits ADD COLUMN IF NOT EXISTS is_completed_today BOOLEAN DEFAULT false;

-- Add completion tracking to non_negotiables
ALTER TABLE non_negotiables ADD COLUMN IF NOT EXISTS completed_dates TIMESTAMPTZ[];
ALTER TABLE non_negotiables ADD COLUMN IF NOT EXISTS last_completed_at TIMESTAMPTZ;
ALTER TABLE non_negotiables ADD COLUMN IF NOT EXISTS is_completed_today BOOLEAN DEFAULT false;

-- Add daily reset tracking
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_reset_date DATE DEFAULT CURRENT_DATE;
```

**Zustand Store Functions:**

```typescript
// src/store/useManifestStore.ts

completeNonNegotiable: async (id: string) => {
  // 1. Mark as completed in database
  const { data, error } = await supabase
    .from('non_negotiables')
    .update({
      is_completed_today: true,
      last_completed_at: new Date().toISOString(),
      completed_dates: sql`array_append(completed_dates, now())`
    })
    .eq('id', id)
    .select();

  // 2. Update local state (optimistic)
  set((state) => ({
    nonNegotiables: state.nonNegotiables.map(nn =>
      nn.id === id ? { ...nn, is_completed_today: true } : nn
    )
  }));

  // 3. Check if all 3 done → trigger "Perfect Day"
  const allComplete = checkAllNonNegotiablesComplete();
  if (allComplete) {
    await triggerPerfectDay();
  }

  // 4. Update streak
  await updateStreak();

  // 5. Return success with celebration data
  return { success: true, perfectDay: allComplete };
},

completeHabit: async (id: string) => {
  // 1. Mark as completed
  await supabase
    .from('habits')
    .update({
      is_completed_today: true,
      last_completed_at: new Date().toISOString(),
      streak_count: sql`streak_count + 1`
    })
    .eq('id', id);

  // 2. Update connected dreams' progress
  await updateConnectedDreamsProgress(id);

  // 3. Update local state
  set((state) => ({
    habits: state.habits.map(h =>
      h.id === id ? { ...h, is_completed_today: true, streak_count: h.streak_count + 1 } : h
    )
  }));

  // 4. Return success
  return { success: true };
},

resetDailyTasks: async () => {
  const userId = get().user?.id;
  if (!userId) return;

  // Reset all is_completed_today flags
  await supabase
    .from('non_negotiables')
    .update({ is_completed_today: false })
    .eq('user_id', userId);

  await supabase
    .from('habits')
    .update({ is_completed_today: false })
    .eq('user_id', userId);

  // Update last reset date
  await supabase
    .from('profiles')
    .update({ last_reset_date: new Date().toISOString() })
    .eq('id', userId);

  // Update local state
  set((state) => ({
    nonNegotiables: state.nonNegotiables.map(nn => ({
      ...nn,
      is_completed_today: false
    })),
    habits: state.habits.map(h => ({
      ...h,
      is_completed_today: false
    }))
  }));
}
```

---

### 3. Streak Calculation Logic

**Requirements:**

- Current streak = consecutive days with all Sacred Three completed
- Best streak = highest ever achieved
- Streak breaks if any day is missed (with 24-hour grace period)
- Streak displays with fire emoji 🔥

**Implementation:**

```typescript
// src/utils/streakCalculator.ts

export function calculateStreak(completedDates: Date[]): number {
  if (!completedDates || completedDates.length === 0) return 0;

  // Sort dates descending (most recent first)
  const sorted = completedDates
    .map((d) => new Date(d))
    .sort((a, b) => b.getTime() - a.getTime());

  // Check if most recent completion was today or yesterday
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const mostRecent = sorted[0];
  mostRecent.setHours(0, 0, 0, 0);

  // If most recent is not today or yesterday, streak is broken
  if (mostRecent < yesterday) return 0;

  // Count consecutive days backward from most recent
  let streak = 1;
  let currentDate = new Date(mostRecent);

  for (let i = 1; i < sorted.length; i++) {
    const prevDate = new Date(sorted[i]);
    prevDate.setHours(0, 0, 0, 0);

    currentDate.setDate(currentDate.getDate() - 1);

    if (prevDate.getTime() === currentDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export async function updateStreak(userId: string): Promise<void> {
  // Get user's non_negotiables
  const { data: nonNegotiables } = await supabase
    .from("non_negotiables")
    .select("is_completed_today, completed_dates")
    .eq("user_id", userId);

  // Check if all 3 completed today
  const allCompleteToday = nonNegotiables?.every((nn) => nn.is_completed_today);

  if (allCompleteToday) {
    // Calculate new streak from completed_dates
    // This would need the actual dates array from one of the non-negotiables
    // For simplicity, increment current_streak
    const { data: profile } = await supabase
      .from("profiles")
      .select("current_streak, best_streak")
      .eq("id", userId)
      .single();

    const newStreak = (profile?.current_streak || 0) + 1;
    const newBest = Math.max(newStreak, profile?.best_streak || 0);

    await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
        best_streak: newBest,
      })
      .eq("id", userId);
  } else {
    // Check if yesterday was completed - if not, break streak
    const { data: profile } = await supabase
      .from("profiles")
      .select("last_reset_date, current_streak")
      .eq("id", userId)
      .single();

    const lastReset = new Date(profile?.last_reset_date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);
    lastReset.setHours(0, 0, 0, 0);

    // If last reset was before yesterday, streak is broken
    if (lastReset < yesterday && profile?.current_streak > 0) {
      await supabase
        .from("profiles")
        .update({ current_streak: 0 })
        .eq("id", userId);
    }
  }
}
```

---

## 📋 HABIT-DREAM CONNECTIONS

### 4. Connect Habits to Dreams

**Database Schema** (already exists):

- `manifestation_nodes.connected_habit_ids` (UUID array)

**UI Flows:**

**From Dashboard:**

```typescript
// Click [•••] menu on habit card
// → Modal: "Connect Habit to Dreams"
// → Show list of user's dreams with checkboxes
// → User selects dream(s)
// → Save to manifestation_nodes.connected_habit_ids
```

**From Universe Detail Panel:**

```typescript
// Click on dream sphere
// → Detail panel opens
// → Shows "Connected Habits" section
// → [+ Connect Habit] button
// → Modal shows available habits
// → User selects, saves connection
```

**Component: ConnectHabitModal.tsx**

```typescript
// src/components/universe/ConnectHabitModal.tsx

interface Props {
  habitId?: string; // If connecting from habit
  dreamId?: string; // If connecting from dream
  onClose: () => void;
  onConnect: (habitId: string, dreamId: string) => void;
}

// Modal shows either:
// - List of dreams (if habitId provided)
// - List of habits (if dreamId provided)
// User selects, clicks Connect
// Updates manifestation_nodes.connected_habit_ids array
```

---

### 5. Automatic Progress Calculation

**Formula for MVP:**

```typescript
// Simple formula:
// Each habit completion = +X% progress on connected dreams
// X = (100 / estimated_days_to_complete) or fixed increment

// Example:
// Main Goal: Complete all Sacred Three = +1% per day
// Side Dreams: Each connected habit = +0.5% per completion

async function updateConnectedDreamsProgress(habitId: string) {
  // 1. Find all dreams connected to this habit
  const { data: dreams } = await supabase
    .from("manifestation_nodes")
    .select("*")
    .contains("connected_habit_ids", [habitId]);

  // 2. For each dream, increase progress
  for (const dream of dreams || []) {
    const increment = dream.type === "main-goal" ? 1.0 : 0.5;
    const newProgress = Math.min(100, dream.current_progress + increment);

    await supabase
      .from("manifestation_nodes")
      .update({ current_progress: newProgress })
      .eq("id", dream.id);

    // 3. If reached 100%, trigger achievement
    if (newProgress >= 100 && dream.current_progress < 100) {
      await triggerDreamAchievement(dream.id);
    }
  }
}

async function triggerDreamAchievement(dreamId: string) {
  // 1. Update achieved_at timestamp
  await supabase
    .from("manifestation_nodes")
    .update({ achieved_at: new Date().toISOString() })
    .eq("id", dreamId);

  // 2. Award XP
  await supabase.rpc("increment_xp", { user_id: userId, amount: 500 });

  // 3. Trigger celebration (confetti, sound, notification)
  // 4. Create achievement entry
  // 5. Transform sphere visual to "achieved" state (golden crown)
}
```

---

### 6. Dream Detail Panel

**Component:** `src/components/universe/DreamDetailPanel.tsx`

**Triggered by:** Clicking dream sphere in Universe

**Layout:**

```
┌──────────────────────────────────────┐
│  ← Back                     [Edit] [X]│
├──────────────────────────────────────┤
│  🚗 Dream Tesla Model S               │
│  Category: Vehicle                    │
│                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 23%    │
│  +0.5% from last habit completion     │
│                                       │
│  📝 Description                       │
│  My reward for $100K revenue milestone│
│  [Edit Description]                   │
│                                       │
│  🎯 Target Date: December 2025        │
│  💰 Target Amount: $85,000            │
│  📈 Current: $19,550 saved            │
│  [Update Progress Manually]           │
│                                       │
│  ⚡ Connected Habits (2)               │
│  ✓ Morning sales calls (12-day) 🔥    │
│     Last completed: 2 hours ago       │
│  ✓ Client follow-ups (5-day) 🔥       │
│     Last completed: Yesterday         │
│  [+ Connect More Habits]              │
│                                       │
│  📊 Progress History (Last 30 Days)   │
│  [Simple sparkline chart]             │
│  Best day: +2.5% (3 habits completed) │
│                                       │
│  🎯 Milestones (Future Feature)       │
│  "Coming soon: Break your dream into  │
│   smaller milestones"                 │
│                                       │
│  [Move Dream Position] [Delete Dream] │
└──────────────────────────────────────┘
```

**Features:**

- Real-time progress display
- Show recent progress changes
- Edit all dream properties
- Manual progress adjustment (slider)
- Connect/disconnect habits
- Simple progress chart
- Delete with confirmation

**Edit Mode:**

```typescript
// Click [Edit] → Fields become editable
// Title: text input
// Description: textarea
// Target date: date picker
// Target amount: number input
// Color: color picker (preset swatches)
// [Save] [Cancel] buttons
```

---

## 📋 INTEGRATION & POLISH

### 7. Daily Reset Logic

**Requirement:** Tasks reset at midnight in user's timezone

**Implementation:**

```typescript
// src/utils/dailyReset.ts

export function checkDailyReset(): void {
  const lastResetDate = localStorage.getItem("last_reset_date");
  const today = new Date().toDateString();

  if (lastResetDate !== today) {
    // Reset needed
    resetDailyTasks();
    localStorage.setItem("last_reset_date", today);
  }
}

// Call in App.tsx on mount
useEffect(() => {
  if (user) {
    checkDailyReset();

    // Also set interval to check every hour
    const interval = setInterval(() => {
      checkDailyReset();
    }, 3600000); // 1 hour

    return () => clearInterval(interval);
  }
}, [user]);
```

---

### 8. Celebration Animations

**Triggers & Animations:**

**1. Single Habit Complete:**

```typescript
// Small success animation
- Checkmark appears with bounce
- +5 XP badge floats up and fades
- Soft "ding" sound
- Habit card pulses green briefly
- If connected to dream: Energy flow animation triggers
```

**2. Perfect Day (3/3 Sacred Three):**

```typescript
// Major celebration
- Confetti explosion (react-confetti)
- "PERFECT DAY!" banner appears
- +30 XP with count-up animation
- Streak increments with fire emoji animation
- Fanfare sound (1 second)
- All habit cards glow gold briefly
- Toast: "You're unstoppable! 🔥"
```

**3. Dream Milestone (25%, 50%, 75%):**

```typescript
// Progress celebration
- Progress bar glows
- Particle burst at milestone marker
- Toast: "25% to Dream Tesla! Keep going!"
- +10 XP bonus
```

**4. Dream Achievement (100%):**

```typescript
// Ultimate celebration
- Camera flies to achieved dream in Universe
- Dream transforms to golden sphere
- Crown icon appears above
- Massive particle explosion
- Prolonged confetti (3 seconds)
- Sound: Epic fanfare
- Modal: "DREAM ACHIEVED!" with details
- +500 XP
- Achievement badge unlocked
- Share prompt: "Share your win?"
```

**Implementation:**

```typescript
// Use react-confetti for confetti
import Confetti from 'react-confetti'

// Use GSAP for number count-ups
gsap.to(element, {
  textContent: targetNumber,
  duration: 1,
  snap: { textContent: 1 },
  ease: "power1.out"
})

// Use Framer Motion for smooth transitions
<motion.div
  initial={{ scale: 0, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
  exit={{ scale: 0, opacity: 0 }}
  transition={{ type: "spring", duration: 0.5 }}
>
```

---

### 9. Navigation & Routing

**App Routes:**

```typescript
// src/App.tsx

<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/onboarding" element={<Onboarding />} />

  {/* Protected routes */}
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
  />

  <Route
    path="/universe"
    element={
      <ProtectedRoute>
        <ManifestationUniverse />
      </ProtectedRoute>
    }
  />

  {/* Future routes */}
  <Route path="/habits" element={<ComingSoon />} />
  <Route path="/analytics" element={<ComingSoon />} />
  <Route path="/journal" element={<ComingSoon />} />
  <Route path="/settings" element={<Settings />} />
</Routes>
```

**Navigation Flow:**

```
1. User completes onboarding
   → Navigate to /dashboard (NOT /universe)

2. Dashboard = Home base
   - This is where users land every day
   - Check daily tasks
   - See quick stats
   - Decide to enter Universe

3. Universe = Immersive experience
   - Visual exploration
   - Deep dive into dreams
   - Periodic visits (not daily default)

4. User can navigate freely between Dashboard and Universe
   - Dashboard has "Enter Universe" button
   - Universe has "Back to Dashboard" button
```

---

## ✅ ACCEPTANCE CRITERIA

**Must work perfectly for MVP launch:**

### Dashboard:

- ✅ Displays user's Sacred Three from onboarding
- ✅ Displays building/breaking habits from onboarding
- ✅ Shows current streak with fire emoji
- ✅ Shows best streak
- ✅ Complete button works instantly
- ✅ Progress counter updates (0/3 → 1/3 → 2/3 → 3/3)
- ✅ Perfect Day celebration triggers at 3/3
- ✅ Animated Universe preview (actual 3D mini canvas)
- ✅ Enter Universe button navigates smoothly

### Habit Completion:

- ✅ Click Complete → Task marks done immediately
- ✅ Checkmark appears with animation
- ✅ Streak updates if applicable
- ✅ XP awarded and displayed
- ✅ Database persists completion
- ✅ Connected dreams show progress increase
- ✅ Cannot complete same task twice in one day

### Universe Visuals:

- ✅ Dreams render as enhanced spheres (not flat circles)
- ✅ Spheres have glow, particles, pulsing animation
- ✅ Main goal is largest and golden
- ✅ Starfield background with nebula
- ✅ Energy connections between dreams
- ✅ Progress-based visual evolution (size, glow)
- ✅ Smooth camera movements
- ✅ Cinematic welcome flow on first visit
- ✅ Hover state enhances dream appearance
- ✅ Click opens detail panel smoothly
- ✅ Runs at 60 FPS with up to 10 dreams

### Habit-Dream Connections:

- ✅ Can connect habits to dreams from both Dashboard and Universe
- ✅ Connections save to database
- ✅ Habit completion triggers progress increase on connected dreams
- ✅ Dream detail panel shows connected habits
- ✅ Can disconnect habits

### Dream Detail Panel:

- ✅ Opens when clicking dream sphere
- ✅ Shows all dream information
- ✅ Edit mode works (title, description, dates)
- ✅ Manual progress adjustment works
- ✅ Connect/disconnect habits works
- ✅ Delete dream works (with confirmation)
- ✅ Close button returns to Universe view

### Daily Reset:

- ✅ All tasks reset at midnight (user's timezone)
- ✅ Streak continues if yesterday was perfect
- ✅ Streak breaks if yesterday was missed
- ✅ User sees fresh slate next day
- ✅ Works correctly across page refreshes

### Performance:

- ✅ Dashboard loads in <1 second
- ✅ Task completion feels instant (<100ms)
- ✅ Universe loads in <2 seconds
- ✅ Universe maintains 60 FPS
- ✅ Animations are smooth
- ✅ No janky scrolling or lag

### Mobile:

- ✅ Dashboard responsive on mobile
- ✅ Universe touch controls work (pinch, rotate)
- ✅ Detail panel works on small screens
- ✅ All buttons are touch-friendly (min 44px)
- ✅ Text is readable on mobile

---

## 🎨 DESIGN SYSTEM

**Colors (from existing Manifest):**

```css
/* Primary */
--gold: #ffd700;
--purple: #8b5cf6;
--pink: #ec4899;

/* Dream Categories */
--vehicle: #ef4444;
--home: #f59e0b;
--travel: #3b82f6;
--wealth: #10b981;
--love: #ec4899;
--health: #8b5cf6;

/* UI */
--bg-dark: #0a0a0f;
--glass: rgba(255, 255, 255, 0.1);
--glass-border: rgba(255, 255, 255, 0.2);
```

**Typography:**

```css
/* Headings */
font-family: 'Inter', sans-serif;
font-weight: 700;

/* Body */
font-family: 'Inter', sans-serif;
font-weight: 400;

/* Sizes */
h1: 2.5rem / 40px
h2: 2rem / 32px
h3: 1.5rem / 24px
body: 1rem / 16px
small: 0.875rem / 14px
```

**Spacing:**

```
Base unit: 4px
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
```

**Animations:**

```css
/* Timing */
fast: 150ms
normal: 300ms
slow: 500ms

/* Easing */
ease-out: cubic-bezier(0.33, 1, 0.68, 1)
ease-in-out: cubic-bezier(0.65, 0, 0.35, 1)
spring: cubic-bezier(0.34, 1.56, 0.64, 1)
```

---

## 📂 FILE STRUCTURE

**New Files to Create:**

```
src/
├── pages/
│   └── Dashboard.tsx (update or create)
│
├── components/
│   ├── dashboard/
│   │   ├── SacredThreeCard.tsx
│   │   ├── HabitsCard.tsx
│   │   ├── UniversePreviewCard.tsx
│   │   ├── WeeklyStatsCard.tsx
│   │   └── StreakDisplay.tsx
│   │
│   ├── universe/
│   │   ├── EnhancedDreamSphere.tsx (update existing)
│   │   ├── DreamDetailPanel.tsx
│   │   ├── ConnectHabitModal.tsx
│   │   ├── StarfieldBackground.tsx
│   │   ├── EnergyConnection.tsx (update existing)
│   │   └── CinematicIntro.tsx
│   │
│   └── shared/
│       ├── ConfettiCelebration.tsx
│       ├── ProgressBar.tsx
│       └── XPBadge.tsx
│
├── utils/
│   ├── streakCalculator.ts
│   ├── dailyReset.ts
│   ├── progressCalculator.ts
│   └── celebrationTriggers.ts
│
└── hooks/
    ├── useDailyReset.ts
    └── useHabitCompletion.ts
```

**Files to Modify:**

```
src/
├── store/
│   └── useManifestStore.ts (add habit completion actions)
│
├── pages/
│   └── ManifestationUniverse.tsx (add visual enhancements, detail panel)
│
└── App.tsx (add daily reset check, update routing)
```

**Database Migrations:**

```
supabase/migrations/
└── [timestamp]_add_habit_tracking_fields.sql
```

---

## 🚀 EXECUTION APPROACH

### Step 1: Present Implementation Plan

**Before coding anything, show me:**

- Detailed file structure
- Component architecture diagram
- Data flow diagram (user action → state → database → UI)
- Technical challenges identified
- Solutions for each challenge
- Time estimate for each phase

### Step 2: Execute in Phases with Todos

**Phase 1: Enhanced Universe Visuals (Days 1-2)**

- Upgrade dream sphere appearance
- Add starfield background
- Implement progress-based visual evolution
- Add camera animations
- Build cinematic intro
- Test performance (must be 60 FPS)

**Phase 2: Dashboard & Habit Completion (Days 3-4)**

- Build Dashboard layout
- Implement Sacred Three display
- Add habit completion logic
- Connect to database
- Add streak calculation
- Build Universe preview component

**Phase 3: Habit-Dream Connections (Days 5-6)**

- Build connection modal
- Implement automatic progress updates
- Build dream detail panel
- Add edit functionality
- Test all connection flows

**Phase 4: Polish & Integration (Day 7)**

- Add celebration animations
- Implement daily reset
- Final performance optimization
- Mobile testing and fixes
- Cross-browser testing

### Step 3: Test Thoroughly

**After each phase:**

- Verify acceptance criteria met
- Test edge cases
- Check performance
- Get my approval before continuing

---

## 💡 TECHNICAL NOTES

**State Management:**

- Use existing Zustand store
- Add habit completion actions
- Implement optimistic updates (UI first, DB sync after)

**Database:**

- Use existing Supabase tables
- Add fields as needed (migrations provided)
- Maintain RLS policies
- Use transactions for critical operations

**Animations:**

- Framer Motion for UI components
- GSAP for complex animations
- React Three Fiber for 3D
- Keep all animations under 0.5s (except cinematic intro)

**Performance:**

- Use React.memo for expensive components
- Implement virtualization if needed
- Lazy load detail panel
- Optimize 3D rendering (LOD, instancing)
- Test on low-end devices

**Error Handling:**

- Try-catch all async operations
- Show user-friendly error messages
- Log errors to console for debugging
- Never let errors crash the app
- Provide retry mechanisms

**Testing Checklist:**

- [ ] Dashboard loads with correct data
- [ ] Can complete habits and see updates
- [ ] Streak calculation works correctly
- [ ] Universe loads with enhanced visuals
- [ ] Can connect habits to dreams
- [ ] Progress updates when habits complete
- [ ] Detail panel opens and edits work
- [ ] Daily reset works at midnight
- [ ] Celebrations trigger correctly
- [ ] Performance is 60 FPS
- [ ] Mobile works perfectly
- [ ] All data persists on refresh

---

## 🎯 REMEMBER THE VISION

**We're building the FOUNDATION for something extraordinary.**

**Current Goal (MVP):**

- Visually stunning Universe that users WANT to show off
- Functional habit tracking that WORKS
- Progress system that MOTIVATES
- Daily engagement that feels SATISFYING

**Future Phases (Post-MVP):**

- Social feed & global dream sharing
- Leaderboards & competitive challenges
- AI pattern recognition & insights
- Advanced gamification (guilds, battles)
- Image uploads for dreams
- Full analytics dashboard

**Build it solid. Build it beautiful. Build it to scale.**

This is Manifest. This changes lives. Act like it. 🚀

---

## 🔥 FINAL NOTES

**Quality Standards:**

- Apple-level polish on every interaction
- Google-level intelligence in the system
- Runs flawlessly on any device
- Zero learning curve
- Users literally cannot imagine life without it after Day 1

**Success Metrics:**

- Dashboard engagement: Users check daily
- Universe visits: 3-5 times per week
- Habit completion rate: >80%
- User retention: >90% after 30 days
- Performance: 60 FPS always

**If you need clarification on anything, ASK before coding.**

**If you see a better way to implement something, SUGGEST it.**

**If you hit a technical limitation, TELL ME immediately.**

Let's build something fucking exceptional. 🔥

---

**START BY:** Creating your detailed implementation plan. Show me the architecture, data flows, and your approach to each phase. Then we execute with precision.

Ready? Let's SHIP this MVP. 🚀

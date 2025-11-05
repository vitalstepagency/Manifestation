# 🧪 TEST GUIDE - Manifest Transformation Ceremony

**Date:** January 2, 2025
**Server:** http://localhost:5173
**Purpose:** Test the onboarding ceremony and dashboard awakening experience

---

## 🚀 QUICK START

### 1. Access the App

**URL:** http://localhost:5173

The development server is running. Open this URL in your browser.

### 2. Test Account Credentials

You can create a new test account or use these approaches:

**Option A: Create New Account**
- Click "Sign Up"
- Email: `test@manifest.com` (or any email)
- Password: `test123456`
- **Note:** Email verification is bypassed for test accounts

**Option B: Sign In to Existing Account**
- If you already have an account, use those credentials
- The app will check your `onboarding_completed` status

---

## 📋 COMPLETE CEREMONY TESTING FLOW

### **SCREEN 1: Portal/Landing Page**

**What to Test:**
- Page loads without errors
- Background gradient displays (purple/pink)
- "Begin Transformation" button visible

**What to Look For:**
- Clean, centered layout
- Responsive design on mobile/tablet
- No console errors

**Expected Time:** 10-30 seconds (user reading)

---

### **SCREEN 2: Archetype Selection**

**What to Test:**
- 6 archetype cards display:
  - Builder 🏗️
  - Optimizer ⚡
  - Phoenix 🔥
  - Accelerator 🚀
  - Visionary 👁️
  - Emperor 👑
- Click each archetype to see descriptions
- Select one archetype

**What to Look For:**
- Hover effects on cards
- Selected state highlights the chosen archetype
- Description changes based on selection
- "Continue" button activates after selection

**Debug Tip:** Check browser console for archetype selection event tracking

**Expected Time:** 30-60 seconds

---

### **SCREEN 3: Manifestation Goal Input**

**What to Test:**
- Text input for manifestation goal
- Type a goal like: "Launch my SaaS startup and get 100 customers"
- Watch **FloatingKeywordOrbs** component appear

**What to Look For:**
- ✅ Orbs appear as you type (after ~10 characters)
- ✅ Orbs show correct keywords (launch, saas, startup, customers)
- ✅ Orbs have emojis matching emotional words (🚀 for startup, 💰 for money, etc.)
- ✅ Orbs gently float up and down
- ✅ Connection lines draw between orbs
- ✅ Orbs arranged in constellation pattern (golden angle spiral)

**Reduced Motion Test:**
- Open browser DevTools → Settings → Emulate CSS media feature
- Set `prefers-reduced-motion: reduce`
- Refresh page and navigate to this screen
- Orbs should fade in without floating animation

**Debug Tips:**
- Open DevTools Console
- Type: `localStorage.getItem('manifest_onboarding_progress')`
- Should show current progress with manifestation goal

**Expected Time:** 60-120 seconds

---

### **SCREEN 4: "Say It Out Loud" Commitment**

**What to Test:**
- Your manifestation goal displays prominently in a card
- Archetype-specific prompt appears (e.g., "Say it like you're about to build it")
- Click "Say It Out Loud 📣" button
- 3-second ceremony countdown begins

**What to Look For:**
- ✅ Goal card glows during ceremony (purple/pink glow)
- ✅ Circular progress indicator counts down from 3
- ✅ Subtle chime sound plays at start (if audio enabled)
- ✅ "Speak your truth..." message appears
- ✅ Completion: Checkmark animates in, "It Is Spoken" message
- ✅ Second chime plays at completion

**Audio Test:**
- Ensure browser allows audio playback (click anywhere first if needed)
- Check browser console for audio errors
- Volume should be subtle (0.2-0.3)

**Expected Time:** 15-30 seconds (includes 3-second countdown)

---

### **SCREEN 5: Countdown Ceremony**

**What to Test:**
- Full-screen takeover with gradient background
- Click "Begin Transformation ✨"
- **Optional:** Preparation phase shows centering messages
- 10-second countdown: 10 → 9 → 8 → ... → 1 → 0

**What to Look For:**
- ✅ Numbers scale and rotate dramatically (text-9xl)
- ✅ Pulse rings emanate from center
- ✅ Background glow pulses
- ✅ Linear progress bar drains from 100% → 0%
- ✅ Motivational text changes at 7, 3, and 0
- ✅ Tick sound on each number (volume: 0.15)
- ✅ 528Hz frequency plays (BARELY audible, felt more than heard)
- ✅ Portal opening animation at zero (spinning rings)

**Performance Test:**
- Open DevTools → Performance tab → Record
- Run through countdown
- Check FPS stays above 30fps (target: 60fps)

**Reduced Motion Test:**
- Numbers should fade instead of rotating
- No pulse rings
- Simplified animations

**Expected Time:** 15-20 seconds (10-second countdown + 5-second preparation)

---

### **SCREEN 6: Portal Transition (PHASE 3 - NOT BUILT YET)**

**Current Status:** 🚧 This component is planned for Phase 3

**What SHOULD Happen (Future):**
- Letters of manifestation goal explode into 200+ particles
- Spinning vortex animation
- Dashboard elements reform from particles
- 3-second animation at 60fps

**Current Behavior:**
- May show a basic transition or skip directly to First Achievement

---

### **SCREEN 7: First Achievement - "The Initiator"**

**What to Test:**
- Achievement modal appears automatically (500ms delay)
- "The Initiator" 🌟 achievement displays
- +100 XP badge shows
- Click "Claim Achievement 🎉"

**What to Look For:**
- ✅ 50 confetti particles fall from top (2.5-second animation)
- ✅ Achievement card scales and rotates in
- ✅ Yellow/orange glow pulses behind card
- ✅ Achievement chime plays at unlock
- ✅ Confetti pop sound plays at claim
- ✅ XP flies up 150px and fades when claimed
- ✅ "✓ Claimed!" message appears
- ✅ Second confetti burst on claim

**Confetti Test:**
- Count particles (should be ~50)
- Check for 8 different colors
- Mix of circles and squares
- Random rotation

**Expected Time:** 10-20 seconds

---

### **SCREEN 8: Dashboard Entry (Incomplete)**

**Current Status:** Dashboard exists but lacks Phase 4 "Awakening" features

**What to Look For:**
- You should land on the dashboard
- Onboarding status should be marked complete
- Basic dashboard elements visible

---

## 🎨 VISUAL TESTING CHECKLIST

### Colors & Gradients
- [ ] Purple/pink gradients render correctly
- [ ] Keyword orb colors match emotions (see emotional words list)
- [ ] Achievement card has yellow border
- [ ] Confetti uses vibrant colors

### Animations
- [ ] All animations use spring physics (bouncy, natural)
- [ ] No linear tweens or robotic movement
- [ ] 60fps target on desktop (check DevTools Performance)
- [ ] 30fps minimum on mobile

### Typography
- [ ] Text-2xl → text-5xl → text-9xl scale correctly
- [ ] Font weights (regular, semibold, bold) display
- [ ] Line heights prevent text clipping

### Responsive Design
- [ ] Test on desktop (1920x1080)
- [ ] Test on tablet (768x1024)
- [ ] Test on mobile (375x667)
- [ ] All ceremony steps work on mobile

---

## 🔊 AUDIO TESTING

### Audio Initialization
**Important:** Browsers require user interaction before playing audio.

**How to Enable:**
1. Click anywhere on the page first
2. Audio manager initializes on first click
3. Check console: `audioManager initialized`

### Audio Tracks to Test
- [ ] **528Hz Frequency** - BARELY audible, felt more than heard (volume: 0.05)
- [ ] **Achievement Chime** - Clear but subtle (volume: 0.3-0.4)
- [ ] **Habit Click** - Very quiet tick (volume: 0.15)
- [ ] **Confetti Pop** - Satisfying pop (volume: 0.5)

### Mute/Unmute Test
Open DevTools Console:
```javascript
// Mute all audio
window.audioManager?.mute()

// Unmute
window.audioManager?.unmute()

// Check if 528Hz is playing
window.audioManager?.oscillator
```

---

## 🐛 DEBUG TIPS

### Check Onboarding Progress
```javascript
// In browser console
const progress = localStorage.getItem('manifest_onboarding_progress')
console.log(JSON.parse(progress))
```

**Expected Structure:**
```json
{
  "currentScreen": "victory",
  "currentScreenIndex": 7,
  "completedScreens": ["portal", "archetype", "manifestation", ...],
  "percentComplete": 100,
  "archetype": "builder",
  "manifestationGoal": "Launch my SaaS startup",
  "goalKeywords": ["launch", "saas", "startup"],
  "startedAt": "2025-01-02T...",
  "lastSavedAt": "2025-01-02T..."
}
```

### Check Analytics Events
```javascript
// View tracked events
const events = localStorage.getItem('manifest_analytics_events')
console.log(JSON.parse(events))
```

**Expected Events:**
- `onboarding_started`
- `onboarding_screen_view` (for each screen)
- `archetype_selected`
- `say_it_out_loud_completed`
- `countdown_started`
- `countdown_completed`
- `achievement_unlocked`
- `first_achievement_claimed`
- `onboarding_completed`

### Check Store State
```javascript
// View Zustand store
const store = localStorage.getItem('manifest-store')
console.log(JSON.parse(store))
```

### Reset Onboarding (for Re-testing)
```javascript
// Clear onboarding progress
localStorage.removeItem('manifest_onboarding_progress')

// Clear analytics
localStorage.removeItem('manifest_analytics_events')

// Clear store
localStorage.removeItem('manifest-store')

// Reload page
location.reload()
```

---

## ⚠️ KNOWN ISSUES & INCOMPLETE FEATURES

### TypeScript Warnings
**Status:** Non-blocking
**Description:** Some TypeScript type mismatches in:
- CountdownCeremony pulse ring variants
- FirstAchievement confetti physics
- Audio manager fadeIn/fadeOut optional fields
- Database type fields (onboarding_progress structure)

**Impact:** Does not prevent app from running in development mode.

### Portal Transition (Phase 3)
**Status:** Not yet built
**Workaround:** You may see a basic transition or skip directly to First Achievement modal.

### Dashboard Awakening (Phase 4)
**Status:** Not yet built
**Features Missing:**
- Personalized hero card
- Energy check modal on first entry
- First task card with generated action
- Tutorial highlights
- Perfect day progress

**Current Behavior:** Basic dashboard loads without ceremony.

### Audio Files
**Status:** Using Web Audio synthesis
**Description:**
- 528Hz is synthesized (works correctly)
- Other sounds (chimes, confetti, etc.) reference `/audio/*.mp3` files that may not exist
- Audio errors logged to console but don't break app

**Workaround:** Audio gracefully fails if files missing. 528Hz still works.

### Mobile Performance
**Status:** Not optimized yet
**Target:** 60fps on iPhone 12 Pro
**Current:** May drop below 30fps on lower-end devices during:
- Keyword orb animations (8 orbs floating)
- Countdown ceremony (pulse rings)
- Confetti explosion (50 particles)

**Test on:**
- Chrome DevTools → Mobile emulation
- Physical device if available

---

## 📊 PERFORMANCE BENCHMARKS

### Target Metrics
| Metric | Target | Acceptable | Critical |
|--------|--------|-----------|-----------|
| Keyword Orbs FPS | 60fps | 45fps | 30fps |
| Countdown FPS | 60fps | 50fps | 40fps |
| Confetti FPS | 60fps | 45fps | 30fps |
| Screen Transition | < 300ms | < 500ms | < 1000ms |
| First Paint | < 1.5s | < 3s | < 5s |

### How to Measure
1. Open DevTools → Performance
2. Start recording
3. Navigate through ceremony
4. Stop recording
5. Check FPS graph (aim for green line at 60fps)

---

## 🎯 WHAT TO EXPERIENCE

### The Full Transformation Flow

**1. Anticipation Building** (Portal → Archetype → Manifestation)
- User feels guided, not rushed
- Each screen validates their journey
- Keyword orbs make goal feel real

**2. Commitment Peak** (Say It Out Loud)
- Psychological anchor created
- Vocalization = 10x stronger commitment
- User has made a declaration

**3. Climax** (10-Second Countdown)
- Anticipation at maximum
- 528Hz creates subtle energy shift
- User is primed for transformation

**4. Reward** (First Achievement)
- Dopamine hit validates decision
- Positive reinforcement loop begins
- User wants to earn more achievements

**Outcome:** User feels they've experienced something SPECIAL, not just "filled out a form."

---

## 🔧 TROUBLESHOOTING

### Issue: "Onboarding doesn't start"
**Solution:**
- Check if `isOnboardingComplete` is true in store
- Reset localStorage (see Debug Tips above)
- Sign out and sign back in

### Issue: "Keyword orbs don't appear"
**Solution:**
- Type at least 10 characters
- Check browser console for errors
- Ensure manifestation goal has meaningful words (not stopwords)

### Issue: "Audio doesn't play"
**Solution:**
- Click anywhere on page first (browser requirement)
- Check browser console for audio errors
- Verify audio context initialized: `window.audioManager`
- Check browser audio permissions

### Issue: "Animations are choppy"
**Solution:**
- Close other browser tabs
- Disable browser extensions
- Check CPU usage in Task Manager
- Enable hardware acceleration in browser settings

### Issue: "Achievement modal doesn't appear"
**Solution:**
- Check console for JavaScript errors
- Verify `trackAchievementUnlocked` was called
- Look for modal backdrop in DOM inspector

### Issue: "Reduced motion doesn't work"
**Solution:**
- Check OS-level reduced motion setting:
  - Windows: Settings → Accessibility → Visual effects → Animation effects
  - Mac: System Preferences → Accessibility → Display → Reduce motion
- Or emulate in DevTools (see Screen 3 testing)

---

## 📝 TESTING CHECKLIST SUMMARY

### Phase 1-2 Components (Built)
- [ ] FloatingKeywordOrbs - Keyword extraction and visualization
- [ ] SayItOutLoud - Commitment ceremony
- [ ] CountdownCeremony - 10-second dramatic countdown
- [ ] FirstAchievement - "The Initiator" with confetti

### Core Utilities (Built)
- [ ] keywordExtraction - TF-IDF algorithm
- [ ] animationPresets - 40+ Framer Motion variants
- [ ] firstActionGenerator - Archetype-specific tasks
- [ ] analyticsTracker - Event tracking (30+ events)
- [ ] audioManager - 528Hz frequency + sound library

### Hooks (Built)
- [ ] useOnboardingProgress - Auto-save with failsafe
- [ ] useReducedMotion - Accessibility

### Database Integration
- [ ] Progress saves to localStorage
- [ ] Progress syncs to Supabase (if user logged in)
- [ ] Onboarding completion marks in database
- [ ] Welcome back message on resume

---

## 🎉 SUCCESS CRITERIA

**You'll know the ceremony is working when:**

1. ✅ You feel emotionally engaged (not just filling out a form)
2. ✅ Keyword orbs make your goal feel tangible and real
3. ✅ The "Say It Out Loud" moment creates a sense of commitment
4. ✅ The 10-second countdown builds genuine anticipation
5. ✅ The First Achievement gives you a dopamine hit
6. ✅ You want to continue using the app immediately
7. ✅ You'd recommend this onboarding to others

**If you felt even 5 of these 7, the ceremony is working.** 🚀

---

## 📞 FEEDBACK & ISSUES

**Console Logs:** Check browser DevTools Console for:
- ✅ `[Analytics]` - Event tracking logs
- ✅ `[AudioManager]` - Audio initialization/playback
- ❌ Red errors - Report any you find

**Performance Issues:** Record screen with DevTools Performance tab open and note:
- Which screen had issues
- What device/browser
- FPS during the issue

**Suggestions:** Note any "friction points" where you felt:
- Confused about what to do next
- Rushed or too slow
- Disconnected from the experience

---

**HAPPY TESTING! Your feedback will make Manifest inevitable in people's lives.** ✨🚀

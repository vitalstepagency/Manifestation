import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  AppState,
  AppActions,
  TimeContext,
  Habit,
  NonNegotiable,
  ProgressEntry,
  JournalEntry,
  User,
  Profile,
} from "../types";
import { db } from "../lib/supabase";

// Helper function to get time context
const getTimeContext = (): TimeContext => {
  const hour = new Date().getHours();

  if (hour >= 6 && hour < 12) {
    return {
      period: "morning",
      greeting: "Rise and Manifest",
      message: "Fresh start, energy check, day planning",
    };
  } else if (hour >= 12 && hour < 17) {
    return {
      period: "afternoon",
      greeting: "Keep Pushing Forward",
      message: "Progress check, motivation boost",
    };
  } else {
    return {
      period: "evening",
      greeting: "Finish Strong Today",
      message: "Reflection, tomorrow prep, wind down",
    };
  }
};

// Helper function to generate motivational message based on streak
const getMotivationalMessage = (streak: number): string => {
  if (streak === 0) return "Let's begin your transformation";
  if (streak < 7) return "Building momentum";
  if (streak < 30) return "You're unstoppable";
  if (streak < 100) return "Legendary discipline";
  return "Master of your destiny";
};

type ManifestStore = AppState & AppActions;

export const useManifestStore = create<ManifestStore>()(
  persist(
    (set, get) => ({
      // Initial State
      user: null,
      profile: null,
      habits: [],
      nonNegotiables: [],
      progressEntries: [],
      journalEntries: [],
      manifestationNodes: [],
      selectedNodeId: null,
      isLoadingNodes: false,
      currentEnergyLevel: null,
      isOnboardingComplete: false,
      timeContext: getTimeContext(),

      // User Actions
      setUser: (user: User | null) => set({ user }),

      setProfile: (profile: Profile | null) => set({ profile }),

      // Clear all state on logout
      clearState: () => {
        console.log("🧹 clearState - Resetting store to initial state");
        set({
          user: null,
          profile: null,
          habits: [],
          nonNegotiables: [],
          progressEntries: [],
          journalEntries: [],
          manifestationNodes: [],
          selectedNodeId: null,
          isLoadingNodes: false,
          currentEnergyLevel: null,
          isOnboardingComplete: false,
          timeContext: getTimeContext(),
        });
      },

      // Habit Actions
      setHabits: (habits: Habit[]) => set({ habits }),

      addHabit: (habitData) => {
        const newHabit: Habit = {
          ...habitData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },

      updateHabit: (id: string, updates: Partial<Habit>) => {
        set((state) => ({
          habits: state.habits.map((habit) =>
            habit.id === id
              ? { ...habit, ...updates, updated_at: new Date().toISOString() }
              : habit
          ),
        }));
      },

      deleteHabit: (id: string) => {
        set((state) => ({
          habits: state.habits.filter((habit) => habit.id !== id),
        }));
      },

      // Non-Negotiables Actions
      setNonNegotiables: (nonNegotiables: NonNegotiable[]) =>
        set({ nonNegotiables }),

      addNonNegotiable: (nonNegotiableData) => {
        const newNonNegotiable: NonNegotiable = {
          ...nonNegotiableData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          nonNegotiables: [...state.nonNegotiables, newNonNegotiable],
        }));
      },

      updateNonNegotiable: (id: string, updates: Partial<NonNegotiable>) => {
        set((state) => ({
          nonNegotiables: state.nonNegotiables.map((item) =>
            item.id === id ? { ...item, ...updates } : item
          ),
        }));
      },

      // Manifestation Nodes Actions
      setManifestationNodes: (nodes) => set({ manifestationNodes: nodes }),

      loadManifestationNodes: async () => {
        const { user } = get();
        if (!user) {
          console.warn("⚠️ loadManifestationNodes: No user found");
          return;
        }

        try {
          set({ isLoadingNodes: true });
          console.log("🔄 Loading manifestation nodes for user:", user.id);

          const { data, error } = await db.manifestationNodes.getAll(user.id);

          if (error) {
            console.error("❌ Failed to load manifestation nodes:", error);
            throw error;
          }

          console.log(`✅ Loaded ${data?.length || 0} manifestation nodes`);
          set({
            manifestationNodes: data || [],
            isLoadingNodes: false,
          });
        } catch (error) {
          console.error("❌ Error loading manifestation nodes:", error);
          set({ isLoadingNodes: false });
          throw error;
        }
      },

      addManifestationNode: async (nodeData) => {
        const { user } = get();
        if (!user) {
          console.error("❌ addManifestationNode: No user found");
          throw new Error("No user found");
        }

        // Create temporary node with optimistic ID for instant UI update
        const tempId = `temp-${Date.now()}-${Math.random()}`;
        const optimisticNode = {
          ...nodeData,
          id: tempId,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Update UI IMMEDIATELY (optimistic update)
        set((state) => ({
          manifestationNodes: [...state.manifestationNodes, { ...optimisticNode, is_active: true }],
        }));

        // Sync to database in background
        try {
          console.log("➕ Adding manifestation node:", nodeData.title);
          const { data, error } = await db.manifestationNodes.create(
            user.id,
            { ...nodeData, is_active: true } as any
          );

          if (error) {
            console.error("❌ Failed to add manifestation node:", error);
            // Rollback optimistic update on error
            set((state) => ({
              manifestationNodes: state.manifestationNodes.filter(
                (n) => n.id !== tempId
              ),
            }));
            throw error;
          }

          if (data) {
            console.log("✅ Manifestation node added:", data.id);
            // Replace temp node with real node from database
            set((state) => ({
              manifestationNodes: state.manifestationNodes.map((n) =>
                n.id === tempId ? data : n
              ),
            }));
          }
        } catch (error) {
          console.error("❌ Error adding manifestation node:", error);
          throw error;
        }
      },

      updateManifestationNode: async (id, updates) => {
        try {
          console.log("🔄 Updating manifestation node:", id);

          // Optimistic update - update locally first for instant UI feedback
          set((state) => ({
            manifestationNodes: state.manifestationNodes.map((node) =>
              node.id === id
                ? { ...node, ...updates, updated_at: new Date().toISOString() }
                : node
            ),
          }));

          const { data, error } = await db.manifestationNodes.update(
            id,
            updates
          );

          if (error) {
            console.error("❌ Failed to update manifestation node:", error);
            // Rollback on error - reload from database
            await get().loadManifestationNodes();
            throw error;
          }

          if (data) {
            console.log("✅ Manifestation node updated:", data.id);
            // Replace with confirmed data from database
            set((state) => ({
              manifestationNodes: state.manifestationNodes.map((node) =>
                node.id === id ? data : node
              ),
            }));
          }
        } catch (error) {
          console.error("❌ Error updating manifestation node:", error);
          throw error;
        }
      },

      deleteManifestationNode: async (id) => {
        try {
          console.log("🗑️ Deleting manifestation node:", id);

          // Optimistic update - remove from UI immediately
          const previousNodes = get().manifestationNodes;
          set((state) => ({
            manifestationNodes: state.manifestationNodes.filter(
              (node) => node.id !== id
            ),
            selectedNodeId:
              state.selectedNodeId === id ? null : state.selectedNodeId,
          }));

          const { error } = await db.manifestationNodes.delete(id);

          if (error) {
            console.error("❌ Failed to delete manifestation node:", error);
            // Rollback on error
            set({ manifestationNodes: previousNodes });
            throw error;
          }

          console.log("✅ Manifestation node deleted:", id);
        } catch (error) {
          console.error("❌ Error deleting manifestation node:", error);
          throw error;
        }
      },

      selectNode: (id) => set({ selectedNodeId: id }),

      // Energy and Context Actions
      setEnergyLevel: (level: number) => set({ currentEnergyLevel: level }),

      updateTimeContext: () => set({ timeContext: getTimeContext() }),

      // Onboarding Actions
      completeOnboarding: async () => {
        const { user } = get();
        console.log("🔄 completeOnboarding called with user:", user);

        if (user) {
          try {
            console.log(
              "📝 Updating onboarding completion in database for user:",
              user.id
            );

            // Update onboarding completion in database
            const updateResult = await db.profiles.update(user.id, {
              onboarding_completed: true,
              onboarding_progress: {
                currentStep: -1,
                completedSteps: [],
                data: {},
              },
            });

            console.log("📝 Database update result:", updateResult);

            if (updateResult.error) {
              console.error("❌ Database update failed:", updateResult.error);
              throw updateResult.error;
            }

            // Verify the database update was successful
            if (
              updateResult.data &&
              updateResult.data.onboarding_completed === true
            ) {
              console.log("✅ Database update confirmed successful");

              // Update local state with the confirmed data from database
              console.log(
                "🔄 Updating local state with confirmed database data"
              );
              set({
                isOnboardingComplete: true,
                profile: updateResult.data,
              });

              console.log("✅ completeOnboarding completed successfully");
            } else {
              console.error("❌ Database update verification failed");
              throw new Error("Database update verification failed");
            }
          } catch (error) {
            console.error("❌ Failed to complete onboarding:", error);
            throw error;
          }
        } else {
          console.error("❌ No user found when trying to complete onboarding");
          throw new Error("No user found when trying to complete onboarding");
        }
      },

      // Load user profile and onboarding status from database
      loadUserProfile: async (userId: string) => {
        try {
          const { data: profile, error } = await db.profiles.get(userId);
          if (error) throw error;

          if (profile) {
            // ALWAYS update onboarding status from database to prevent stale cached data
            // This ensures switching between accounts works correctly
            set({
              profile,
              isOnboardingComplete: profile.onboarding_completed || false,
            });

            console.log("📊 loadUserProfile - profile loaded:", {
              userId,
              email: profile.email,
              onboarding_completed: profile.onboarding_completed,
              onboarding_progress: profile.onboarding_progress,
              updatedIsOnboardingComplete:
                profile.onboarding_completed || false,
            });
          } else {
            set({
              profile: null,
              isOnboardingComplete: false,
            });
            console.log(
              "📊 loadUserProfile - no profile found, setting onboarding to incomplete"
            );
          }
          return profile;
        } catch (error) {
          console.error("Failed to load user profile:", error);
          // If there's an error loading profile, assume onboarding not complete
          set({
            profile: null,
            isOnboardingComplete: false,
          });
          throw error;
        }
      },

      // Fetch profile for current user (wrapper around loadUserProfile)
      fetchProfile: async () => {
        const { user } = get();
        if (user) {
          console.log("🔄 fetchProfile called for user:", user.id);
          return await get().loadUserProfile(user.id);
        } else {
          console.log("❌ fetchProfile called but no user found");
          return null;
        }
      },

      // Save onboarding progress
      saveOnboardingProgress: async (progress: any) => {
        const { user } = get();
        if (user) {
          try {
            await db.profiles.update(user.id, {
              onboarding_progress: progress,
            });
          } catch (error) {
            console.error("Failed to save onboarding progress:", error);
            throw error;
          }
        }
      },

      // Progress Actions
      addProgressEntry: (entryData) => {
        const newEntry: ProgressEntry = {
          ...entryData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          progressEntries: [...state.progressEntries, newEntry],
        }));
      },

      // Journal Actions
      addJournalEntry: (entryData) => {
        const newEntry: JournalEntry = {
          ...entryData,
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          journalEntries: [...state.journalEntries, newEntry],
        }));
      },
    }),
    {
      name: "manifest-store",
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
        habits: state.habits,
        nonNegotiables: state.nonNegotiables,
        progressEntries: state.progressEntries,
        journalEntries: state.journalEntries,
        manifestationNodes: state.manifestationNodes,
        currentEnergyLevel: state.currentEnergyLevel,
        isOnboardingComplete: state.isOnboardingComplete,
      }),
    }
  )
);

// Computed selectors
export const useManifestSelectors = () => {
  const store = useManifestStore();

  return {
    // Current streak calculation
    currentStreak: store.profile?.current_streak || 0,

    // Best streak
    bestStreak: store.profile?.best_streak || 0,

    // Motivational message
    motivationalMessage: getMotivationalMessage(
      store.profile?.current_streak || 0
    ),

    // Today's completed habits count
    completedHabitsToday: store.habits.filter((h) => h.is_completed_today)
      .length,

    // Total active habits count
    totalActiveHabits: store.habits.filter((h) => h.isActive !== false).length,

    // Today's completed non-negotiables count
    completedNonNegotiablesToday: store.nonNegotiables.filter(
      (n) => n.is_completed
    ).length,

    // Building habits
    buildingHabits: store.habits.filter((h) => h.type === "building"),

    // Breaking habits
    breakingHabits: store.habits.filter((h) => h.type === "breaking"),

    // Today's non-negotiables
    todaysNonNegotiables: store.nonNegotiables.filter((n) => {
      const today = new Date().toISOString().split("T")[0];
      return n.completion_date === today;
    }),

    // Manifestation progress (from latest progress entry)
    manifestationProgress:
      store.progressEntries.length > 0
        ? store.progressEntries[store.progressEntries.length - 1]
            .manifestation_progress
        : 0,

    // Energy level insights
    energyInsight: store.currentEnergyLevel
      ? store.currentEnergyLevel === 4
        ? "Your energy is peak! Tackle your hardest non-negotiable first."
        : store.currentEnergyLevel === 3
        ? "High energy detected! Perfect for deep work sessions."
        : store.currentEnergyLevel === 2
        ? "Medium energy - ideal for routine tasks and planning."
        : "Low energy today - focus on gentle habits and self-care."
      : "Check your energy level to get personalized insights.",

    // Contextual AI insight
    contextualInsight: (() => {
      const { timeContext, currentEnergyLevel, profile } = store;
      const streak = profile?.current_streak || 0;

      if (timeContext.period === "morning" && currentEnergyLevel === 4) {
        return "Your energy is peak! Tackle your hardest non-negotiable first. You complete 92% of tasks when you start with the hardest one.";
      }
      if (timeContext.period === "evening") {
        return `Perfect time for reflection. Your consistency over the last week shows you're 73% more likely to achieve your manifestation goal.`;
      }
      if (streak > 10) {
        return `You're on a ${streak} day streak. People with streaks over 10 days are 5x more likely to achieve their goals.`;
      }
      return "Stay consistent with your habits. Small daily actions create extraordinary results.";
    })(),
  };
};

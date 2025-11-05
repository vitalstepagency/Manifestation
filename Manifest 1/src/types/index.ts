// Core Types for Manifest App
export interface User {
  id: string;
  email?: string;
  fullName?: string;
  role?: 'user' | 'admin';
  is_test_account?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  manifestation_goal: string;
  current_streak: number;
  best_streak: number;
  timezone: string;
  preferences: Record<string, any>;
  archetype?: string;
  onboarding_completed?: boolean;
  onboarding_progress?: any;
  email?: string;
  full_name?: string;
  dream?: string;
  created_at: string;
  updated_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  type: 'building' | 'breaking';
  category?: string;
  description?: string;
  streak_count: number;
  is_completed_today: boolean;
  completionDates?: string[];
  isActive?: boolean;
  created_at: string;
  updated_at: string;
}

export interface NonNegotiable {
  id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  completion_date: string;
  priority_order: number;
  created_at: string;
}

export interface ProgressEntry {
  id: string;
  user_id: string;
  manifestation_progress: number;
  energy_level: number;
  habits_completed: number;
  streak_count: number;
  created_at: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  content: string;
  gratitude_items: string[];
  daily_wins: string[];
  created_at: string;
}

export interface ManifestationNode {
  id: string;
  user_id: string;
  type: 'dream' | 'goal' | 'milestone' | 'habit';
  title: string;
  description?: string;
  category: 'vehicle' | 'home' | 'travel' | 'wealth' | 'love' | 'health' | 'other';
  position_x: number;
  position_y: number;
  position_z: number;
  color: string;
  size: number;
  glow: number;
  image_url?: string;
  progress: number;
  connections: string[];
  is_active: boolean;
  achieved_at?: string;
  created_at: string;
  updated_at: string;
}

export type CreateManifestationNodeInput = Omit<
  ManifestationNode,
  'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_active' | 'achieved_at'
>;

export type UpdateManifestationNodeInput = Partial<
  Omit<ManifestationNode, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>;

// UI State Types
export interface EnergyLevel {
  level: number;
  label: string;
  emoji: string;
}

export interface TimeContext {
  period: 'morning' | 'afternoon' | 'evening';
  greeting: string;
  message: string;
}

export interface ManifestationGoal {
  title: string;
  target_value?: number;
  current_value?: number;
  progress_percentage: number;
  deadline?: string;
}

// Admin Types
export interface AdminUserData {
  user: User;
  profile: Profile | null;
  habitsCount: number;
  nonNegotiablesCount: number;
  onboardingComplete: boolean;
  lastActive: string;
}

export interface TestAccountData {
  email: string;
  password: string;
  archetype: string;
  manifestationGoal: string;
  habits: string[];
  nonNegotiables: string[];
}

// Store Types
export interface AppState {
  user: User | null;
  profile: Profile | null;
  habits: Habit[];
  nonNegotiables: NonNegotiable[];
  progressEntries: ProgressEntry[];
  journalEntries: JournalEntry[];
  manifestationNodes: ManifestationNode[];
  selectedNodeId: string | null;
  isLoadingNodes: boolean;
  currentEnergyLevel: number | null;
  isOnboardingComplete: boolean;
  timeContext: TimeContext;
}

export interface AppActions {
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  clearState: () => void;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Omit<Habit, 'id' | 'created_at' | 'updated_at'>) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setNonNegotiables: (nonNegotiables: NonNegotiable[]) => void;
  addNonNegotiable: (nonNegotiable: Omit<NonNegotiable, 'id' | 'created_at'>) => void;
  updateNonNegotiable: (id: string, updates: Partial<NonNegotiable>) => void;
  setManifestationNodes: (nodes: ManifestationNode[]) => void;
  loadManifestationNodes: () => Promise<void>;
  addManifestationNode: (nodeData: CreateManifestationNodeInput) => Promise<void>;
  updateManifestationNode: (id: string, updates: UpdateManifestationNodeInput) => Promise<void>;
  deleteManifestationNode: (id: string) => Promise<void>;
  selectNode: (id: string | null) => void;
  setEnergyLevel: (level: number) => void;
  completeOnboarding: () => Promise<void>;
  loadUserProfile: (userId: string) => Promise<Profile | null>;
  fetchProfile: () => Promise<Profile | null>;
  saveOnboardingProgress: (progress: any) => Promise<void>;
  updateTimeContext: () => void;
  addProgressEntry: (entry: Omit<ProgressEntry, 'id' | 'created_at'>) => void;
  addJournalEntry: (entry: Omit<JournalEntry, 'id' | 'created_at'>) => void;
}

// Component Props Types
export interface DashboardProps {
  className?: string;
}

export interface OnboardingStepProps {
  onNext: () => void;
  onPrevious?: () => void;
  data?: any;
  onDataChange?: (data: any) => void;
}

export interface HabitCardProps {
  habit: Habit;
  onToggle: (id: string) => void;
  onEdit?: (habit: Habit) => void;
  onDelete?: (id: string) => void;
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  emoji: string;
  color: string;
  progress?: number;
  onClick?: () => void;
}

// Animation Types
export interface AnimationVariants {
  initial: any;
  animate: any;
  exit?: any;
  transition?: any;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

// Supabase Types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
      };
      habits: {
        Row: Habit;
        Insert: Omit<Habit, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Habit, 'id' | 'created_at' | 'updated_at'>>;
      };
      non_negotiables: {
        Row: NonNegotiable;
        Insert: Omit<NonNegotiable, 'id' | 'created_at'>;
        Update: Partial<Omit<NonNegotiable, 'id' | 'created_at'>>;
      };
      progress_entries: {
        Row: ProgressEntry;
        Insert: Omit<ProgressEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<ProgressEntry, 'id' | 'created_at'>>;
      };
      journal_entries: {
        Row: JournalEntry;
        Insert: Omit<JournalEntry, 'id' | 'created_at'>;
        Update: Partial<Omit<JournalEntry, 'id' | 'created_at'>>;
      };
      manifestation_nodes: {
        Row: ManifestationNode;
        Insert: Omit<ManifestationNode, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ManifestationNode, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
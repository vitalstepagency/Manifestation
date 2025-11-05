import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types';
import type { Profile, Habit, NonNegotiable, ProgressEntry, JournalEntry, ManifestationNode } from '../types/index';

// Import runtime configuration (generated at build time from Vercel env vars)
// @ts-ignore - runtime-config.js is generated at build time by inject-env.js script
import { config as runtimeConfig } from '../runtime-config.js';

// Supabase configuration - use runtime config (which has actual values baked in)
const supabaseUrl = runtimeConfig.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = runtimeConfig.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

// Debug logging for production environment variable issues
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase Environment Variables Missing:');
  console.error('VITE_SUPABASE_URL:', supabaseUrl || 'MISSING');
  console.error('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? 'SET' : 'MISSING');
  console.error('All import.meta.env vars:', import.meta.env);
  throw new Error(`Missing Supabase environment variables. URL: ${supabaseUrl ? 'SET' : 'MISSING'}, Key: ${supabaseAnonKey ? 'SET' : 'MISSING'}`);
}

if (!supabaseServiceRoleKey) {
  console.warn('⚠️ WARNING: Service role key is missing. Admin functions will not work.');
}

// Create Supabase client
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Admin client with service role for bypassing email verification
const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: async () => {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers
export const db = {
  // Profile operations
  profiles: {
    get: async (userId: string) => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single() as { data: Profile | null; error: any };
      return { data, error };
    },

    create: async (profile: Database['public']['Tables']['profiles']['Insert']) => {
      const { data, error } = await supabase
        .from('profiles')
        .insert(profile as any)
        .select()
        .single() as { data: Profile | null; error: any };
      return { data, error };
    },

    update: async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
      const result = await (supabase
        .from('profiles') as any)
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      return result as { data: Profile | null; error: any };
    }
  },

  // Habits operations
  habits: {
    getAll: async (userId: string) => {
      const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }) as { data: Habit[] | null; error: any };
      return { data, error };
    },

    create: async (habit: Database['public']['Tables']['habits']['Insert']) => {
      const { data, error } = await supabase
        .from('habits')
        .insert(habit as any)
        .select()
        .single() as { data: Habit | null; error: any };
      return { data, error };
    },

    update: async (habitId: string, updates: Database['public']['Tables']['habits']['Update']) => {
      const result = await (supabase
        .from('habits') as any)
        .update(updates)
        .eq('id', habitId)
        .select()
        .single();
      return result as { data: Habit | null; error: any };
    },

    delete: async (habitId: string) => {
      const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', habitId) as { error: any };
      return { error };
    }
  },

  // Non-negotiables operations
  nonNegotiables: {
    getAll: async (userId: string) => {
      const { data, error } = await supabase
        .from('non_negotiables')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false }) as { data: NonNegotiable[] | null; error: any };
      return { data, error };
    },

    create: async (nonNegotiable: Database['public']['Tables']['non_negotiables']['Insert']) => {
      const { data, error} = await supabase
        .from('non_negotiables')
        .insert(nonNegotiable as any)
        .select()
        .single() as { data: NonNegotiable | null; error: any };
      return { data, error };
    },

    update: async (id: string, updates: Database['public']['Tables']['non_negotiables']['Update']) => {
      const result = await (supabase
        .from('non_negotiables') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return result as { data: NonNegotiable | null; error: any };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('non_negotiables')
        .delete()
        .eq('id', id) as { error: any };
      return { error };
    }
  },

  // Progress entries operations
  progressEntries: {
    getAll: async (userId: string, startDate?: string, endDate?: string) => {
      let query = supabase
        .from('progress_entries')
        .select('*')
        .eq('user_id', userId);

      if (startDate) {
        query = query.gte('date', startDate);
      }
      if (endDate) {
        query = query.lte('date', endDate);
      }

      const { data, error } = await query.order('date', { ascending: false }) as { data: ProgressEntry[] | null; error: any };
      return { data, error };
    },

    getByDate: async (userId: string, date: string) => {
      const { data, error } = await supabase
        .from('progress_entries')
        .select('*')
        .eq('user_id', date)
        .eq('date', date)
        .single() as { data: ProgressEntry | null; error: any };
      return { data, error };
    },

    create: async (entry: Database['public']['Tables']['progress_entries']['Insert']) => {
      const { data, error } = await supabase
        .from('progress_entries')
        .insert(entry as any)
        .select()
        .single() as { data: ProgressEntry | null; error: any };
      return { data, error };
    },

    update: async (id: string, updates: Database['public']['Tables']['progress_entries']['Update']) => {
      const result = await (supabase
        .from('progress_entries') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return result as { data: ProgressEntry | null; error: any };
    }
  },

  // Journal entries operations
  journalEntries: {
    getAll: async (userId: string, limit: number = 50) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit) as { data: JournalEntry[] | null; error: any };
      return { data, error };
    },

    create: async (entry: Database['public']['Tables']['journal_entries']['Insert']) => {
      const { data, error } = await supabase
        .from('journal_entries')
        .insert(entry as any)
        .select()
        .single() as { data: JournalEntry | null; error: any };
      return { data, error };
    },

    update: async (id: string, updates: Database['public']['Tables']['journal_entries']['Update']) => {
      const result = await (supabase
        .from('journal_entries') as any)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      return result as { data: JournalEntry | null; error: any };
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('journal_entries')
        .delete()
        .eq('id', id) as { error: any };
      return { error };
    }
  },

  // Manifestation nodes operations (for 3D Universe)
  manifestationNodes: {
    /**
     * Get all active manifestation nodes for a user
     */
    getAll: async (userId: string) => {
      const { data, error } = await supabase
        .from('manifestation_nodes')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false }) as { data: ManifestationNode[] | null; error: any };
      return { data, error };
    },

    /**
     * Create a new manifestation node
     */
    create: async (userId: string, nodeData: Omit<Database['public']['Tables']['manifestation_nodes']['Insert'], 'user_id'>) => {
      const { data, error } = await supabase
        .from('manifestation_nodes')
        .insert({
          user_id: userId,
          is_active: true,
          ...nodeData,
        } as any)
        .select()
        .single() as { data: ManifestationNode | null; error: any };
      return { data, error };
    },

    /**
     * Update an existing manifestation node
     */
    update: async (nodeId: string, updates: Database['public']['Tables']['manifestation_nodes']['Update']) => {
      const result = await (supabase
        .from('manifestation_nodes') as any)
        .update(updates)
        .eq('id', nodeId)
        .select()
        .single();
      return result as { data: ManifestationNode | null; error: any };
    },

    /**
     * Soft delete a manifestation node (set is_active to false)
     */
    delete: async (nodeId: string) => {
      const result = await (supabase
        .from('manifestation_nodes') as any)
        .update({ is_active: false })
        .eq('id', nodeId)
        .select()
        .single();
      return result as { data: ManifestationNode | null; error: any };
    },

    /**
     * Update progress for a node
     * Progress is clamped between 0-100
     * Automatically sets achieved_at when progress reaches 100%
     */
    updateProgress: async (nodeId: string, progress: number) => {
      const clampedProgress = Math.max(0, Math.min(100, progress));
      const updates: Database['public']['Tables']['manifestation_nodes']['Update'] = {
        progress: clampedProgress,
      };

      // Mark as achieved if progress reaches 100%
      if (clampedProgress === 100) {
        updates.achieved_at = new Date().toISOString();
      }

      const result = await (supabase
        .from('manifestation_nodes') as any)
        .update(updates)
        .eq('id', nodeId)
        .select()
        .single();
      return result as { data: ManifestationNode | null; error: any };
    },
  },

  // Admin functions
  admin: {

    getAllUsers: async () => {
      try {
        // Get all users from auth
        const { data: authUsers, error: authError } = await supabaseAdmin.auth.admin.listUsers();
        
        if (authError) {
          throw authError;
        }

        // Get all profiles
        const { data: profiles, error: profilesError } = await supabaseAdmin
          .from('profiles')
          .select('*') as { data: Profile[] | null; error: any };

        if (profilesError) {
          throw profilesError;
        }

        // Create a map of profiles by user ID for quick lookup
        const profilesMap = new Map<string, Profile>();
        (profiles || []).forEach(profile => {
          profilesMap.set(profile.id, profile);
        });

        // Get habit and non-negotiable counts for each user
        const usersWithCounts = await Promise.all(
          (authUsers.users || []).map(async (user) => {
            const profile = profilesMap.get(user.id);
            
            const [habitsResult, nonNegotiablesResult] = await Promise.all([
              supabaseAdmin
                .from('habits')
                .select('id', { count: 'exact' })
                .eq('user_id', user.id),
              supabaseAdmin
                .from('non_negotiables')
                .select('id', { count: 'exact' })
                .eq('user_id', user.id)
            ]);

            return {
              id: user.id,
              email: user.email || '',
              fullName: profile?.full_name || user.user_metadata?.full_name || '',
              isTestAccount: user.email?.includes('test') || false,
              createdAt: user.created_at,
              lastActiveAt: user.last_sign_in_at || user.created_at,
              onboardingCompleted: profile?.onboarding_completed || false,
              archetype: profile?.dream || '',
              habitCount: habitsResult.count || 0,
              nonNegotiableCount: nonNegotiablesResult.count || 0
            };
          })
        );

        return { data: usersWithCounts, error: null };
      } catch (error) {
        return { data: null, error };
      }
    },

    deleteTestAccount: async (userId: string) => {
      try {
        console.log('Starting deletion for user:', userId);

        // Delete user data in order (due to foreign key constraints)
        console.log('Deleting progress entries...');
        const { error: progressError } = await supabaseAdmin
          .from('progress_entries')
          .delete()
          .eq('user_id', userId);
        
        if (progressError) {
          console.error('Progress deletion error:', progressError);
        }

        console.log('Deleting journal entries...');
        const { error: journalError } = await supabaseAdmin
          .from('journal_entries')
          .delete()
          .eq('user_id', userId);
        
        if (journalError) {
          console.error('Journal deletion error:', journalError);
        }

        console.log('Deleting habits...');
        const { error: habitsError } = await supabaseAdmin
          .from('habits')
          .delete()
          .eq('user_id', userId);
        
        if (habitsError) {
          console.error('Habits deletion error:', habitsError);
        }

        console.log('Deleting non-negotiables...');
        const { error: nonNegotiablesError } = await supabaseAdmin
          .from('non_negotiables')
          .delete()
          .eq('user_id', userId);
        
        if (nonNegotiablesError) {
          console.error('Non-negotiables deletion error:', nonNegotiablesError);
        }

        console.log('Deleting profile...');
        const { error: profileError } = await supabaseAdmin
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (profileError) {
          console.error('Profile deletion error:', profileError);
        }

        console.log('Deleting auth user...');
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
        
        if (authError) {
          console.error('Auth deletion error:', authError);
        }

        const firstError = progressError || journalError || habitsError || nonNegotiablesError || profileError || authError;
        
        if (firstError) {
          console.error('Deletion failed with error:', firstError);
          return { error: firstError };
        }

        console.log('User deletion completed successfully');
        return { error: null };
      } catch (error) {
        console.error('Unexpected error during deletion:', error);
        return { error };
      }
    },

    createTestAccount: async (email: string, password: string, userData: any) => {
      try {
        // First, check if user already exists in auth
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const existingAuthUser = existingUsers.users.find(user => user.email === email);
        
        if (existingAuthUser) {
          // Check if profile exists for this user
          const { data: existingProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('id', existingAuthUser.id)
            .single() as { data: { id: string } | null; error: any };

          if (existingProfile) {
            return {
              data: null,
              error: { message: `A test account with email ${email} already exists` }
            };
          } else {
            // Auth user exists but no profile - delete the orphaned auth user first
            await supabaseAdmin.auth.admin.deleteUser(existingAuthUser.id);
          }
        }

        // Also check for any orphaned profiles by email
        try {
          const { data: orphanedProfile } = await supabaseAdmin
            .from('profiles')
            .select('id')
            .eq('email', email)
            .single() as { data: { id: string } | null; error: any };

          if (orphanedProfile) {
            // Delete orphaned profile
            await supabaseAdmin
              .from('profiles')
              .delete()
              .eq('id', orphanedProfile.id);
          }
        } catch (profileCheckError: any) {
          // If error is "PGRST116" (no rows found), that's good - no orphaned profile
          if (profileCheckError.code !== 'PGRST116') {
            console.error('Error checking for orphaned profiles:', profileCheckError);
          }
        }

        // Create auth user using admin client
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true, // Bypass email verification
          user_metadata: {
            full_name: userData.fullName,
            is_test_account: true
          }
        });

        if (authError || !authData.user) {
          return { data: null, error: { message: `Failed to create auth user: ${authError?.message || 'Unknown error'}` } };
        }

        // Create profile using UPSERT to handle any potential duplicates gracefully
        const { data: profile, error: profileError } = await supabaseAdmin
          .from('profiles')
          .upsert({
            id: authData.user.id,
            email: email,
            full_name: userData.fullName,
            manifestation_goal: userData.manifestationGoal,
            onboarding_completed: false
          } as any, {
            onConflict: 'id'
          })
          .select()
          .single() as { data: Profile | null; error: any };

        if (profileError) {
          // If profile creation fails, clean up the auth user
          await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
          return { data: null, error: { message: `Failed to create profile: ${profileError.message}` } };
        }

      // Create habits
      if (userData.habits && userData.habits.length > 0) {
        const { error: habitsError } = await supabaseAdmin
          .from('habits')
          .insert(
            userData.habits.map((habit: any) => ({
              user_id: authData.user.id,
              title: habit.title,
              description: habit.description,
              category: habit.category || 'building',
              frequency: habit.frequency || 'daily',
              target_count: habit.target_count || 1,
              is_active: true
            }))
          );

        if (habitsError) {
          return { data: null, error: habitsError };
        }
      }

      // Create non-negotiables
      if (userData.nonNegotiables && userData.nonNegotiables.length > 0) {
        const { error: nonNegotiablesError } = await supabaseAdmin
          .from('non_negotiables')
          .insert(
            userData.nonNegotiables.map((item: any) => ({
              user_id: authData.user.id,
              title: item.title,
              description: item.description,
              time_of_day: item.time_of_day || 'morning',
              is_active: true
            }))
          );

        if (nonNegotiablesError) {
          return { data: null, error: nonNegotiablesError };
        }
      }

        return { data: authData.user, error: null };
      } catch (error: any) {
        console.error('Error creating test account:', error);
        return { 
          data: null, 
          error: { 
            message: `Failed to create test account: ${error.message || 'Unknown error'}` 
          } 
        };
      }
    },

    impersonateUser: async (userId: string, onboardingCompleted?: boolean) => {
      try {
        // Store current admin session info
        const currentSession = await supabase.auth.getSession();
        if (currentSession.data.session) {
          localStorage.setItem('adminSession', JSON.stringify({
            userId: currentSession.data.session.user.id,
            email: currentSession.data.session.user.email,
            timestamp: Date.now()
          }));
        }

        // Get the user to impersonate
        const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
        const targetUser = authUsers.users.find(user => user.id === userId);
        
        if (!targetUser) {
          return { error: { message: 'User not found' } };
        }

        // Create a temporary session for the target user
        const { data, error } = await supabaseAdmin.auth.admin.generateLink({
          type: 'magiclink',
          email: targetUser.email,
          options: {
            redirectTo: window.location.origin
          }
        });

        if (error) {
          return { error };
        }

        // Set impersonation flag with cached onboarding status for instant loading
        localStorage.setItem('isImpersonating', JSON.stringify({
          targetUserId: userId,
          targetUserEmail: targetUser.email,
          targetUserName: targetUser.user_metadata?.full_name || 'Unknown User',
          onboardingCompleted: onboardingCompleted,
          timestamp: Date.now()
        }));

        // Temporarily clear admin session flag during impersonation
        localStorage.removeItem('isAdminSession');

        // Sign out current session and sign in as target user
        await supabase.auth.signOut();
        
        // Use the magic link to sign in as the target user
        const url = new URL(data.properties.action_link);
        const token = url.searchParams.get('token');
        const type = url.searchParams.get('type');
        
        if (token && type) {
          const { error: verifyError } = await supabase.auth.verifyOtp({
            token_hash: token,
            type: type as any
          });
          
          if (verifyError) {
            return { error: verifyError };
          }
        }

        // Redirect to main dashboard (not admin) with a longer delay to ensure auth state is updated
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);

        return { data: { success: true }, error: null };
      } catch (error) {
        console.error('Impersonation error:', error);
        return { error };
      }
    },

    exitImpersonation: async () => {
      try {
        // Clear impersonation flags first
        localStorage.removeItem('isImpersonating');
        
        // Sign out current session
        await supabase.auth.signOut();
        
        // Set admin session flag (this will trigger admin mode in App.tsx)
        localStorage.setItem('isAdminSession', 'true');
        
        // Clear any user session data to ensure clean admin return
        localStorage.removeItem('user');
        
        // Add a small delay to ensure localStorage is updated
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Reload to return to admin dashboard
        window.location.href = '/admin/dashboard';
        
        return { data: { success: true }, error: null };
      } catch (error) {
        console.error('Exit impersonation error:', error);
        // Even if there's an error, try to return to admin mode
        localStorage.removeItem('isImpersonating');
        localStorage.setItem('isAdminSession', 'true');
        window.location.href = '/admin/dashboard';
        return { error };
      }
    }
  }
};

// Real-time subscriptions
export const subscriptions = {
  habits: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('habits_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'habits',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  },

  progressEntries: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel('progress_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'progress_entries',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }
};

// Error handling helper
export const handleSupabaseError = (error: any): string => {
  if (!error) return '';
  
  // Common Supabase error messages
  if (error.message?.includes('Invalid login credentials')) {
    return 'Invalid email or password. Please try again.';
  }
  
  if (error.message?.includes('User already registered')) {
    return 'An account with this email already exists.';
  }
  
  if (error.message?.includes('Email not confirmed')) {
    return 'Please check your email and confirm your account.';
  }
  
  if (error.message?.includes('Password should be at least')) {
    return 'Password must be at least 6 characters long.';
  }
  
  if (error.message?.includes('Unable to validate email address')) {
    return 'Please enter a valid email address.';
  }
  
  if (error.message?.includes('Network request failed')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  // Generic error message
  return error.message || 'An unexpected error occurred. Please try again.';
};

export default supabase;
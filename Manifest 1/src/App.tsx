import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useManifestStore } from './store/useManifestStore';
import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
// Upgraded to React 19! Re-enabling performance monitoring
import { PerformanceMonitor } from './systems/PerformanceMonitor';

// Pages
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import HabitsTracker from './pages/HabitsTracker';
import ManifestationHub from './pages/ManifestationHub';
import AIInsights from './pages/AIInsights';
import Analytics from './pages/Analytics';
import Journal from './pages/Journal';
import Auth from './pages/Auth';
import AdminDashboard from './pages/AdminDashboard';
import ManifestationUniverse from './pages/ManifestationUniverse';

// Components
import Navigation from './components/Navigation';
import FloatingOrbs from './components/FloatingOrbs';
import ImpersonationBanner from './components/ImpersonationBanner';

function App() {
  const { user, isOnboardingComplete, setUser, fetchProfile } = useManifestStore();
  const [impersonatedUserOnboardingComplete, setImpersonatedUserOnboardingComplete] = useState<boolean | null>(null);
  const [isLoadingImpersonatedUser, setIsLoadingImpersonatedUser] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  // Check for impersonation mode
  const impersonationData = localStorage.getItem('isImpersonating');
  const isImpersonating = impersonationData ? JSON.parse(impersonationData) : null;

  // Check if current user is admin (by email)
  const isAdmin = user?.email === 'admin@manifest.app';

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        console.log('App.tsx - Initializing authentication...');

        // Check for reset parameter (e.g., ?reset=true) to clear all auth data
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('reset') === 'true') {
          console.log('App.tsx - Reset parameter detected, clearing all auth data...');
          await supabase.auth.signOut();
          localStorage.clear();
          sessionStorage.clear();
          // Remove reset parameter from URL
          window.history.replaceState({}, document.title, window.location.pathname);
          console.log('App.tsx - Auth data cleared, reloading...');
          window.location.reload();
          return;
        }

        // Get current session with timeout
        console.log('App.tsx - Getting current session...');
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('getSession timeout')), 3000)
        );

        const { data: { session }, error } = await Promise.race([sessionPromise, timeoutPromise]);

        if (error) {
          console.error('App.tsx - Error getting session:', error);
          return;
        }

        console.log('App.tsx - Session retrieved successfully');

        if (session?.user) {
          console.log('App.tsx - Found existing session for user:', session.user.id);
          setUser(session.user);

          // Fetch profile to check onboarding status
          try {
            console.log('App.tsx - Fetching profile during initialization...');
            const timeoutPromise = new Promise((_, reject) =>
              setTimeout(() => reject(new Error('fetchProfile timeout')), 5000)
            );
            await Promise.race([fetchProfile(), timeoutPromise]);
            console.log('App.tsx - Profile fetched successfully');
          } catch (profileError) {
            console.error('App.tsx - Error fetching profile during initialization:', profileError);
            // Continue anyway - user will see onboarding if profile fetch fails
          }
        } else {
          console.log('App.tsx - No existing session found');
        }
      } catch (error) {
        console.error('App.tsx - Error initializing auth:', error);
      } finally {
        console.log('App.tsx - Setting isInitializing to false');
        setIsInitializing(false);
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('App.tsx - Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        
        // Safely call fetchProfile with error handling and timeout
        try {
          console.log('App.tsx - Calling fetchProfile from auth state change...');
          
          // Add timeout to prevent hanging
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error('fetchProfile timeout')), 5000)
          );
          
          await Promise.race([fetchProfile(), timeoutPromise]);
          console.log('App.tsx - fetchProfile from auth state change completed successfully');
        } catch (profileError) {
          console.error('App.tsx - Error fetching profile during auth state change:', profileError);
          // Don't block auth state change if profile fetch fails
        }
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [setUser, fetchProfile]);

  // Instant impersonated user profile loading with cached data
  useEffect(() => {
    if (!isImpersonating) {
      setImpersonatedUserOnboardingComplete(null);
      setIsLoadingImpersonatedUser(false);
      return;
    }

    // Use cached onboarding status for instant loading (no database call needed)
    if (isImpersonating.onboardingCompleted !== undefined) {
      setImpersonatedUserOnboardingComplete(isImpersonating.onboardingCompleted);
      setIsLoadingImpersonatedUser(false);
      return;
    }

    // Fallback: if no cached data, load from database (should rarely happen now)
    const loadFromDatabase = async () => {
      setIsLoadingImpersonatedUser(true);
      
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('id', isImpersonating.targetUserId)
          .single();

        if (error) {
          console.error('Error loading impersonated user profile:', error);
          setImpersonatedUserOnboardingComplete(false);
        } else {
          setImpersonatedUserOnboardingComplete(profile?.onboarding_completed || false);
        }
      } catch (error) {
        console.error('Failed to load impersonated user profile:', error);
        setImpersonatedUserOnboardingComplete(false);
      } finally {
        setIsLoadingImpersonatedUser(false);
      }
    };

    loadFromDatabase();
  }, [isImpersonating]);

  // Determine the actual onboarding status to use
  const actualOnboardingComplete = isImpersonating 
    ? impersonatedUserOnboardingComplete 
    : isOnboardingComplete;
  
  console.log('App.tsx - user:', user);
  console.log('App.tsx - isAdmin:', isAdmin);
  console.log('App.tsx - isImpersonating:', isImpersonating);
  console.log('App.tsx - impersonatedUserOnboardingComplete:', impersonatedUserOnboardingComplete);
  console.log('App.tsx - isOnboardingComplete:', isOnboardingComplete);
  console.log('App.tsx - actualOnboardingComplete:', actualOnboardingComplete);
  console.log('App.tsx - isInitializing:', isInitializing);

  // Show loading screen while initializing authentication
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden flex items-center justify-center">
        <FloatingOrbs />
        <div className="text-white text-xl">Loading...</div>
        <Toaster position="top-center" richColors />
      </div>
    );
  }
  
  // If admin user is logged in and not impersonating, show admin dashboard
  if (isAdmin && !isImpersonating) {
    return (
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          <FloatingOrbs />
          <Routes>
            <Route path="*" element={<AdminDashboard />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    );
  }

  // Show public routes (Home/Auth) if not authenticated
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
              <FloatingOrbs />
              <Auth />
            </div>
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </Router>
    );
  }

  // No loading screen needed - we have instant cached data!

  // Show onboarding if not completed (for regular users or impersonated users)
  if (!actualOnboardingComplete) {
    return (
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
          <FloatingOrbs />
          {/* Show impersonation banner if in impersonation mode */}
          {isImpersonating && <ImpersonationBanner impersonationData={isImpersonating} />}

          <Routes>
            {/* FORCE onboarding completion - no universe access until complete */}
            <Route path="*" element={<Onboarding />} />
          </Routes>

          <Toaster position="top-center" richColors />
        </div>
      </Router>
    );
  }

  // Main app for authenticated users who completed onboarding
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
        <FloatingOrbs />

        {/* Performance Monitor - Real-time FPS tracking */}
        {process.env.NODE_ENV === 'development' && (
          <PerformanceMonitor showDebug={true} targetFps={60} />
        )}

        {/* Show impersonation banner if in impersonation mode */}
        {isImpersonating && <ImpersonationBanner impersonationData={isImpersonating} />}
        
        <div className="flex">
          <Navigation />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/universe" element={<ManifestationUniverse />} />
              <Route path="/habits" element={<HabitsTracker />} />
              <Route path="/manifestation" element={<ManifestationHub />} />
              <Route path="/ai-insights" element={<AIInsights />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/journal" element={<Journal />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </div>
        
        <Toaster position="top-center" richColors />
      </div>
    </Router>
  );
}

export default App;

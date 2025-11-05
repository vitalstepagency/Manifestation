import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home,
  Target,
  Sparkles,
  Brain,
  BarChart3,
  BookOpen,
  Menu,
  X,
  LogOut,
  User,
  Shield
} from 'lucide-react';
import { useManifestStore } from '../store/useManifestStore';
import { auth } from '../lib/supabase';
import { toast } from 'sonner';

const Navigation = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const location = useLocation();
  const { user, setUser, clearState } = useManifestStore();

  const baseNavigationItems = [
    { path: '/', icon: Home, label: 'Dashboard', color: 'from-blue-500 to-cyan-500' },
    { path: '/habits', icon: Target, label: 'Habits', color: 'from-green-500 to-emerald-500' },
    { path: '/manifestation', icon: Sparkles, label: 'Manifestation', color: 'from-purple-500 to-pink-500' },
    { path: '/insights', icon: Brain, label: 'AI Insights', color: 'from-orange-500 to-red-500' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics', color: 'from-indigo-500 to-purple-500' },
    { path: '/journal', icon: BookOpen, label: 'Journal', color: 'from-teal-500 to-cyan-500' }
  ];

  const adminNavigationItem = { path: '/admin', icon: Shield, label: 'Admin', color: 'from-red-500 to-orange-500' };

  const navigationItems = user?.email === 'admin@manifest.app' 
    ? [...baseNavigationItems, adminNavigationItem]
    : baseNavigationItems;

  const handleSignOut = async () => {
    try {
      // Clear all Zustand store state (prevents stale cached data)
      clearState();

      // Sign out from Supabase
      await auth.signOut();

      // Clear any admin session data
      localStorage.removeItem('isAdminSession');
      localStorage.removeItem('isImpersonating');

      toast.success('Signed out successfully');

      // Force page reload to ensure clean state
      window.location.href = '/';
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Error signing out');

      // Even if there's an error, try to clear state and redirect
      clearState();
      localStorage.removeItem('isAdminSession');
      localStorage.removeItem('isImpersonating');
      window.location.href = '/';
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white"
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isExpanded ? <X size={20} /> : <Menu size={20} />}
      </motion.button>

      {/* Navigation Sidebar */}
      <AnimatePresence>
        <motion.nav
          initial={{ x: -280 }}
          animate={{ 
            x: isExpanded || window.innerWidth >= 1024 ? 0 : -280 
          }}
          exit={{ x: -280 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed left-0 top-0 h-full w-20 lg:w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 z-40 flex flex-col"
        >
          {/* Logo */}
          <div className="p-6 border-b border-white/10">
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-bold text-white">Manifest</h1>
                <p className="text-sm text-white/60">Transform Your Life</p>
              </div>
            </motion.div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 py-6">
            <div className="space-y-2 px-3">
              {navigationItems.map((item, index) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Link
                      to={item.path}
                      className={`relative flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
                        active
                          ? 'bg-white/10 text-white'
                          : 'text-white/70 hover:text-white hover:bg-white/5'
                      }`}
                      onClick={() => setIsExpanded(false)}
                    >
                      {/* Active indicator */}
                      {active && (
                        <motion.div
                          layoutId="activeTab"
                          className={`absolute inset-0 rounded-xl bg-gradient-to-r ${item.color} opacity-20`}
                          transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        />
                      )}
                      
                      {/* Icon */}
                      <div className={`relative z-10 p-2 rounded-lg ${
                        active 
                          ? `bg-gradient-to-r ${item.color}` 
                          : 'bg-white/10 group-hover:bg-white/20'
                      }`}>
                        <Icon size={18} />
                      </div>
                      
                      {/* Label */}
                      <span className="hidden lg:block relative z-10 font-medium">
                        {item.label}
                      </span>
                      
                      {/* Hover effect */}
                      {!active && (
                        <motion.div
                          className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100"
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* User Profile & Sign Out */}
          <div className="p-3 border-t border-white/10">
            <div className="flex items-center space-x-3 px-3 py-2 rounded-xl bg-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <div className="hidden lg:block flex-1">
                <p className="text-sm font-medium text-white truncate">
                  {user?.fullName || user?.email}
                </p>
                <p className="text-xs text-white/60">Manifesting Greatness</p>
              </div>
            </div>
            
            <motion.button
              onClick={handleSignOut}
              className="w-full mt-2 flex items-center space-x-3 px-3 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition-all duration-200"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut size={18} />
              <span className="hidden lg:block">Sign Out</span>
            </motion.button>
          </div>
        </motion.nav>
      </AnimatePresence>

      {/* Mobile Overlay */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
          onClick={() => setIsExpanded(false)}
        />
      )}
    </>
  );
};

export default Navigation;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Settings, 
  LogOut,
  Eye,
  Trash2,
  UserPlus,
  Download,
  Search,
  Filter,
  Target,
  Calendar,
  Activity,
  AlertCircle,
  CheckCircle2,
  LogIn
} from 'lucide-react';
import { useManifestStore } from '../store/useManifestStore';
import { auth, db } from '../lib/supabase';
import { toast } from 'sonner';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  testUsers: number;
  onboardingCompletionRate: number;
  totalRevenue: number;
  monthlyGrowth: number;
}

interface UserData {
  id: string;
  email: string;
  fullName: string;
  isTestAccount: boolean;
  createdAt: string;
  lastActiveAt: string;
  onboardingCompleted: boolean;
  archetype?: string;
  habitCount: number;
  nonNegotiableCount: number;
}

const AdminDashboard = () => {
  const { user, clearState } = useManifestStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'test' | 'regular'>('all');
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showCreateTestModal, setShowCreateTestModal] = useState(false);
  const [createTestForm, setCreateTestForm] = useState({
    email: '',
    fullName: '',
    password: 'TestAccount123!'
  });

  // Mock stats for now - will be replaced with real data
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    activeUsers: 0,
    testUsers: 0,
    onboardingCompletionRate: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    
    // Add timeout to prevent infinite loading
    const timeoutId = setTimeout(() => {
      setLoading(false);
      toast.error('Dashboard loading timed out');
    }, 10000); // 10 second timeout
    
    try {
      // Load users data
      const { data: usersData, error } = await db.admin.getAllUsers();
      
      if (error) {
        throw error;
      }

      const userData = usersData || [];
      setUsers(userData);

      // Calculate stats
      const totalUsers = userData.length;
      const testUsers = userData.filter(u => u.isTestAccount).length;
      const activeUsers = userData.filter(u => {
        const lastActive = new Date(u.lastActiveAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return lastActive > weekAgo;
      }).length;
      const completedOnboarding = userData.filter(u => u.onboardingCompleted).length;
      const onboardingCompletionRate = totalUsers > 0 ? (completedOnboarding / totalUsers) * 100 : 0;

      const calculatedStats = {
        totalUsers,
        activeUsers,
        testUsers,
        onboardingCompletionRate,
        totalRevenue: 0, // Placeholder
        monthlyGrowth: 0 // Placeholder
      };
      
      setStats(calculatedStats);

    } catch (error: any) {
      console.error('Dashboard loading error:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      clearTimeout(timeoutId);
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      // Clear all Zustand store state (prevents stale cached data)
      clearState();

      // Sign out from Supabase authentication
      await auth.signOut();

      // Clear admin session and any impersonation data
      localStorage.removeItem('isAdminSession');
      localStorage.removeItem('isImpersonating');

      toast.success('Signed out successfully');

      // Redirect to login page
      window.location.href = '/';
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error('Failed to sign out');

      // Even if there's an error, try to clear state and redirect
      clearState();
      localStorage.removeItem('isAdminSession');
      localStorage.removeItem('isImpersonating');
      window.location.href = '/';
    }
  };

  const handleDeleteUser = async (userId: string) => {
    try {
      // Find the user to check if it's an admin account
      const userToDelete = users.find(u => u.id === userId);
      
      // Protect admin accounts from deletion
      if (userToDelete?.email?.includes('admin@manifest.app')) {
        toast.error('Cannot delete admin accounts');
        return;
      }

      // Protect accounts without proper test account flag
      if (!userToDelete?.isTestAccount) {
        toast.error('Can only delete test accounts. Regular users should be managed through proper channels.');
        return;
      }

      const { error } = await db.admin.deleteTestAccount(userId);
      if (error) {
        console.error('Delete error details:', error);
        throw error;
      }
      
      // Remove from local state
      setUsers(users.filter(u => u.id !== userId));
      toast.success('User deleted successfully');
      setShowUserModal(false);
      
      // Refresh the user list to ensure consistency
      setTimeout(() => {
        loadDashboardData();
      }, 1000);
    } catch (error: any) {
      console.error('Failed to delete user:', error);
      const errorMessage = error?.message || error?.error?.message || 'Unknown error occurred';
      toast.error(`Failed to delete user: ${errorMessage}`);
    }
  };

  const handleImpersonateUser = async (userId: string, userEmail: string, userName: string) => {
    try {
      const confirmed = window.confirm(
        `Are you sure you want to log in as "${userName}" (${userEmail})?\n\nThis will switch your session to that user's account.`
      );
      
      if (!confirmed) return;
      
      // Find the user data to get onboarding status
      const userData = users.find(u => u.id === userId);
      
      // Show loading toast
      toast.loading(`Switching to ${userName}'s account...`, { id: 'impersonation' });
      
      const { error } = await db.admin.impersonateUser(userId, userData?.onboardingCompleted);
      
      if (error) {
        toast.error(`Failed to switch to ${userName}'s account: ${error.message}`, { id: 'impersonation' });
        throw error;
      }
      
      // Success message will be shown briefly before redirect
      toast.success(`Successfully switching to ${userName}'s account...`, { id: 'impersonation' });
      
    } catch (error: any) {
      console.error('Failed to impersonate user:', error);
      const errorMessage = error?.message || 'Failed to switch user session';
      toast.error(`Failed to impersonate user: ${errorMessage}`, { id: 'impersonation' });
    }
  };

  const handleCreateTestAccount = async () => {
    try {
      if (!createTestForm.email || !createTestForm.fullName) {
        toast.error('Please fill in all required fields');
        return;
      }

      const { data, error } = await db.admin.createTestAccount(
        createTestForm.email,
        createTestForm.password,
        {
          fullName: createTestForm.fullName,
          manifestationGoal: 'Test manifestation goal',
          habits: [],
          nonNegotiables: []
        }
      );
      
      if (error) throw error;
      
      toast.success('Test account created successfully');
      setShowCreateTestModal(false);
      setCreateTestForm({
        email: '',
        fullName: '',
        password: 'TestAccount123!'
      });
      
      // Add a small delay to ensure database operations are committed
      setTimeout(() => {
        loadDashboardData();
      }, 500);
    } catch (error: any) {
      console.error('Failed to create test account:', error);
      toast.error('Failed to create test account: ' + error.message);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.fullName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                         (filterType === 'test' && user.isTestAccount) ||
                         (filterType === 'regular' && !user.isTestAccount);
    return matchesSearch && matchesFilter;
  });

  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'revenue', label: 'Revenue', icon: DollarSign },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const StatCard = ({ title, value, icon: Icon, trend, color }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-white/70 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </motion.div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          trend={12}
          color="bg-blue-500"
        />
        <StatCard
          title="Active Users"
          value={stats.activeUsers}
          icon={Activity}
          trend={8}
          color="bg-green-500"
        />
        <StatCard
          title="Onboarding Rate"
          value={`${stats.onboardingCompletionRate.toFixed(1)}%`}
          icon={Target}
          trend={5}
          color="bg-purple-500"
        />
        <StatCard
          title="Test Users"
          value={stats.testUsers}
          icon={AlertCircle}
          color="bg-orange-500"
        />
      </div>

      {/* Revenue Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Revenue Overview</h3>
          <div className="text-center py-8">
            <DollarSign className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">Revenue tracking coming soon</p>
            <p className="text-white/50 text-sm mt-2">Integration with payment systems in development</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20"
        >
          <h3 className="text-xl font-semibold text-white mb-4">Growth Projections</h3>
          <div className="text-center py-8">
            <TrendingUp className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <p className="text-white/70">Analytics dashboard coming soon</p>
            <p className="text-white/50 text-sm mt-2">Advanced metrics and forecasting in development</p>
          </div>
        </motion.div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      {/* Header with Create Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">User Management</h3>
        <button
          onClick={() => setShowCreateTestModal(true)}
          className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Create Test Account
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 w-4 h-4" />
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as any)}
          className="px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: 'white'
          }}
        >
          <option value="all" style={{ backgroundColor: '#1f2937', color: 'white' }}>All Users</option>
          <option value="test" style={{ backgroundColor: '#1f2937', color: 'white' }}>Test Users</option>
          <option value="regular" style={{ backgroundColor: '#1f2937', color: 'white' }}>Regular Users</option>
        </select>
      </div>

      {/* Users Table */}
      <div className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/5">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Habits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-white/70 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-white/5">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-white">{user.fullName || 'No name'}</div>
                      <div className="text-sm text-white/70">{user.email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      user.isTestAccount 
                        ? 'bg-orange-100 text-orange-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isTestAccount ? 'Test' : 'Regular'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.onboardingCompleted ? (
                        <CheckCircle2 className="w-4 h-4 text-green-400 mr-2" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-400 mr-2" />
                      )}
                      <span className="text-sm text-white/70">
                        {user.onboardingCompleted ? 'Complete' : 'Pending'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                    {user.habitCount} habits, {user.nonNegotiableCount} non-negotiables
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-white/70">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedUser(user);
                          setShowUserModal(true);
                        }}
                        className="text-blue-400 hover:text-blue-300"
                        title="View user details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {!user.email?.includes('admin@manifest.app') && (
                        <button
                          onClick={() => handleImpersonateUser(user.id, user.email, user.fullName || 'Unknown User')}
                          className="text-green-400 hover:text-green-300"
                          title="Login as this user"
                        >
                          <LogIn className="w-4 h-4" />
                        </button>
                      )}
                      {user.isTestAccount && !user.email?.includes('admin@manifest.app') && (
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-400 hover:text-red-300"
                          title="Delete test account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                      {user.email?.includes('admin@manifest.app') && (
                        <span className="text-yellow-400 text-xs" title="Admin account - protected from deletion">
                          Protected
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPlaceholder = (title: string, description: string, icon: any) => (
    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20 text-center">
      {React.createElement(icon, { className: "w-16 h-16 text-white/50 mx-auto mb-4" })}
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/70">{description}</p>
      <p className="text-white/50 text-sm mt-2">Coming soon in future updates</p>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/70">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-black/20 backdrop-blur-sm border-r border-white/10">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-8">Admin Dashboard</h1>
          
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-white/10">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-4 py-3 rounded-lg text-white/70 hover:bg-red-600/20 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-2">
            {navigationItems.find(item => item.id === activeTab)?.label}
          </h2>
          <p className="text-white/70">
            Welcome back, Admin. Here's what's happening with your app.
          </p>
        </div>

        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'users' && renderUsers()}
        {activeTab === 'analytics' && renderPlaceholder(
          'Advanced Analytics',
          'Detailed user behavior analytics, conversion funnels, and engagement metrics',
          BarChart3
        )}
        {activeTab === 'revenue' && renderPlaceholder(
          'Revenue Dashboard',
          'Subscription tracking, payment analytics, and financial projections',
          DollarSign
        )}
        {activeTab === 'settings' && renderPlaceholder(
          'Admin Settings',
          'System configuration, user permissions, and application settings',
          Settings
        )}
      </div>

      {/* Create Test Account Modal */}
      {showCreateTestModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Create Test Account</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">Email Address</label>
                <input
                  type="email"
                  value={createTestForm.email}
                  onChange={(e) => setCreateTestForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="test@example.com"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Full Name</label>
                <input
                  type="text"
                  value={createTestForm.fullName}
                  onChange={(e) => setCreateTestForm(prev => ({ ...prev, fullName: e.target.value }))}
                  placeholder="Test User"
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div>
                <label className="block text-white/70 text-sm mb-2">Password</label>
                <input
                  type="text"
                  value={createTestForm.password}
                  onChange={(e) => setCreateTestForm(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <p className="text-white/50 text-xs mt-1">Default password for test accounts</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateTestModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTestAccount}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Create Account
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">User Details</h3>
            <div className="space-y-3">
              <div>
                <label className="text-white/70 text-sm">Name</label>
                <p className="text-white">{selectedUser.fullName || 'No name'}</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Email</label>
                <p className="text-white">{selectedUser.email}</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Account Type</label>
                <p className="text-white">{selectedUser.isTestAccount ? 'Test Account' : 'Regular User'}</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Onboarding Status</label>
                <p className="text-white">{selectedUser.onboardingCompleted ? 'Completed' : 'Pending'}</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Habits & Goals</label>
                <p className="text-white">{selectedUser.habitCount} habits, {selectedUser.nonNegotiableCount} non-negotiables</p>
              </div>
              <div>
                <label className="text-white/70 text-sm">Joined</label>
                <p className="text-white">{new Date(selectedUser.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              {selectedUser.isTestAccount && (
                <button
                  onClick={() => handleDeleteUser(selectedUser.id)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  Delete User
                </button>
              )}
              <button
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
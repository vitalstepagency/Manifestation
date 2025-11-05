import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Target,
  Flame,
  Award,
  Clock,
  Activity,
  Zap,
  Star,
  ChevronDown,
  Download,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  RadialBarChart,
  RadialBar
} from 'recharts';
import { useManifestStore } from '../store/useManifestStore';
import { useManifestSelectors } from '../store/useManifestStore';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '1y'>('30d');
  const [selectedMetric, setSelectedMetric] = useState<'completion' | 'streaks' | 'energy' | 'categories'>('completion');

  const { habits, progressEntries, energyLevel } = useManifestStore();
  const { totalStreak, completedHabitsToday, weeklyScore } = useManifestSelectors();

  // Generate mock data for charts
  const chartData = useMemo(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    const data = [];
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      data.push({
        date: date.toISOString().split('T')[0],
        dateLabel: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        completion: Math.floor(Math.random() * 100),
        streak: Math.max(0, totalStreak - i + Math.floor(Math.random() * 3)),
        energy: Math.floor(Math.random() * 10) + 1,
        habits: Math.floor(Math.random() * habits.length) + 1
      });
    }
    
    return data;
  }, [timeRange, habits.length, totalStreak]);

  // Category distribution data
  const categoryData = useMemo(() => {
    const buildingHabits = habits.filter(h => h.category === 'building').length;
    const breakingHabits = habits.filter(h => h.category === 'breaking').length;
    
    return [
      { name: 'Building', value: buildingHabits, color: '#10B981' },
      { name: 'Breaking', value: breakingHabits, color: '#EF4444' }
    ];
  }, [habits]);

  // Weekly performance data
  const weeklyData = useMemo(() => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map((day, index) => ({
      day,
      completion: Math.floor(Math.random() * 100),
      energy: Math.floor(Math.random() * 10) + 1
    }));
  }, []);

  // Streak distribution data
  const streakData = [
    { name: 'Current Streak', value: totalStreak, fill: '#8B5CF6' },
    { name: 'Best Streak', value: Math.max(totalStreak + 5, 21), fill: '#06B6D4' },
    { name: 'Average Streak', value: Math.floor(totalStreak * 0.7), fill: '#10B981' }
  ];

  const stats = [
    {
      title: 'Total Habits',
      value: habits.length,
      change: '+2 this month',
      icon: Target,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Current Streak',
      value: `${totalStreak} days`,
      change: 'Personal best!',
      icon: Flame,
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Weekly Score',
      value: weeklyScore,
      change: '+15% vs last week',
      icon: Star,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Completion Rate',
      value: `${Math.round((completedHabitsToday / Math.max(habits.length, 1)) * 100)}%`,
      change: 'Today',
      icon: Award,
      color: 'from-green-500 to-emerald-500'
    }
  ];

  const achievements = [
    { title: 'First Week Complete', description: 'Completed 7 days in a row', date: '2024-01-07', icon: Calendar },
    { title: 'Habit Master', description: 'Created 10 habits', date: '2024-01-15', icon: Target },
    { title: 'Consistency King', description: '30-day streak achieved', date: '2024-02-01', icon: Flame },
    { title: 'Energy Optimizer', description: 'Tracked energy for 14 days', date: '2024-02-10', icon: Zap }
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
          <p className="text-white font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-white/80" style={{ color: entry.color }}>
              {entry.name}: {entry.value}
              {entry.name === 'completion' && '%'}
              {entry.name === 'energy' && '/10'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
          <p className="text-white/70">Track your progress and celebrate your growth</p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Time Range Selector */}
          <div className="relative">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value as any)}
              className="appearance-none bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 pr-8"
            >
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
              <option value="1y">Last year</option>
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50 pointer-events-none" />
          </div>

          <motion.button
            className="flex items-center space-x-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </motion.button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <TrendingUp className="w-4 h-4 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
              <p className="text-white/70 text-sm">{stat.title}</p>
              <p className="text-green-400 text-xs mt-1">{stat.change}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Metric Selector */}
      <div className="flex space-x-2">
        {[
          { key: 'completion', label: 'Completion Rate', icon: Target },
          { key: 'streaks', label: 'Streaks', icon: Flame },
          { key: 'energy', label: 'Energy Levels', icon: Zap },
          { key: 'categories', label: 'Categories', icon: BarChart3 }
        ].map((metric) => (
          <motion.button
            key={metric.key}
            onClick={() => setSelectedMetric(metric.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedMetric === metric.key
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <metric.icon className="w-4 h-4" />
            <span>{metric.label}</span>
          </motion.button>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Primary Chart */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <BarChart3 className="w-6 h-6" />
            <span>
              {selectedMetric === 'completion' && 'Daily Completion Rate'}
              {selectedMetric === 'streaks' && 'Streak Progress'}
              {selectedMetric === 'energy' && 'Energy Levels'}
              {selectedMetric === 'categories' && 'Habit Categories'}
            </span>
          </h3>
          
          <div className="h-80">
            {selectedMetric === 'completion' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="dateLabel" 
                    stroke="#ffffff60"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="completion" 
                    fill="url(#completionGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="completionGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8B5CF6" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}

            {selectedMetric === 'streaks' && (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="dateLabel" 
                    stroke="#ffffff60"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="streak" 
                    stroke="#F59E0B"
                    strokeWidth={3}
                    dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}

            {selectedMetric === 'energy' && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis 
                    dataKey="dateLabel" 
                    stroke="#ffffff60"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#ffffff60"
                    fontSize={12}
                    domain={[0, 10]}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar 
                    dataKey="energy" 
                    fill="url(#energyGradient)"
                    radius={[4, 4, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="energyGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            )}

            {selectedMetric === 'categories' && (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                            <p className="text-white font-medium">{payload[0].payload.name}</p>
                            <p className="text-white/80">{payload[0].value} habits</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Secondary Chart */}
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <span>Weekly Performance</span>
          </h3>
          
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis 
                  dataKey="day" 
                  stroke="#ffffff60"
                  fontSize={12}
                />
                <YAxis 
                  stroke="#ffffff60"
                  fontSize={12}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar 
                  dataKey="completion" 
                  fill="url(#weeklyGradient)"
                  radius={[4, 4, 0, 0]}
                />
                <defs>
                  <linearGradient id="weeklyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#06B6D4" />
                    <stop offset="100%" stopColor="#0891B2" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Streak Analysis */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Flame className="w-6 h-6" />
          <span>Streak Analysis</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart cx="50%" cy="50%" innerRadius="20%" outerRadius="80%" data={streakData}>
                <RadialBar
                  minAngle={15}
                  label={{ position: 'insideStart', fill: '#fff' }}
                  background
                  clockWise
                  dataKey="value"
                />
                <Tooltip 
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-black/80 backdrop-blur-sm border border-white/20 rounded-lg p-3">
                          <p className="text-white font-medium">{payload[0].payload.name}</p>
                          <p className="text-white/80">{payload[0].value} days</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="space-y-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Current Streak</span>
                <span className="text-2xl font-bold text-white">{totalStreak} days</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className="h-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                  style={{ width: `${Math.min((totalStreak / 30) * 100, 100)}%` }}
                />
              </div>
              <p className="text-white/60 text-sm mt-1">Goal: 30 days</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Best Streak</span>
                <span className="text-2xl font-bold text-white">{Math.max(totalStreak + 5, 21)} days</span>
              </div>
              <p className="text-white/60 text-sm">Personal record achieved!</p>
            </div>
            
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80">Average Streak</span>
                <span className="text-2xl font-bold text-white">{Math.floor(totalStreak * 0.7)} days</span>
              </div>
              <p className="text-white/60 text-sm">Consistency is key!</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
          <Award className="w-6 h-6" />
          <span>Recent Achievements</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.title}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
              className="flex items-center space-x-4 bg-white/5 rounded-lg p-4"
            >
              <div className="p-2 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg">
                <achievement.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-white">{achievement.title}</h4>
                <p className="text-white/70 text-sm">{achievement.description}</p>
                <p className="text-white/50 text-xs mt-1">{achievement.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
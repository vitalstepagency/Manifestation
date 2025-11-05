import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Target,
  Zap,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  Brain
} from 'lucide-react';
import { useManifestStore, useManifestSelectors } from '../store/useManifestStore';
import { getTimeContext, getMotivationalMessage, getContextualInsight } from '../utils/helpers';
import { generateFirstAction } from '../utils/firstActionGenerator';
import type { ArchetypeKey } from '../types/onboarding.types';

// Components
import StatsCard from '../components/StatsCard';
import HabitCard from '../components/HabitCard';
import EnergyCheck from '../components/EnergyCheck';
import QuickActions from '../components/QuickActions';
import ManifestationHero from '../components/ManifestationHero';
import FirstTaskCard from '../components/FirstTaskCard';
import PerfectDayTracker from '../components/PerfectDayTracker';

// World-Class Animations
import { FadeIn, SlideUp, ScaleIn, StaggerReveal } from '../components/ScrollReveal';

const Dashboard = () => {
  const { user, habits, energyLevel, setEnergyLevel, profile } = useManifestStore();
  const { currentStreak, completedHabitsToday, totalActiveHabits } = useManifestSelectors();
  const [timeContext, setTimeContext] = useState(getTimeContext());

  // First visit detection and first task generation
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [firstTask, setFirstTask] = useState<any>(null);
  const [firstTaskCompleted, setFirstTaskCompleted] = useState(false);

  // Archetype gradient mapping
  const archetypeGradients: Record<string, string[]> = {
    builder: ['#0891b2', '#0e7490'],
    optimizer: ['#7c3aed', '#a855f7'],
    phoenix: ['#dc2626', '#f97316'],
    accelerator: ['#eab308', '#f59e0b'],
    visionary: ['#059669', '#10b981'],
    emperor: ['#7c2d12', '#a16207'],
  };

  useEffect(() => {
    // Update time context every minute
    const interval = setInterval(() => {
      setTimeContext(getTimeContext());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // First visit detection and first task generation
  useEffect(() => {
    const hasSeenDashboard = localStorage.getItem('dashboard_first_visit_seen');

    if (!hasSeenDashboard && profile?.manifestation_goal && profile?.archetype) {
      console.log('🌟 FIRST DASHBOARD VISIT - Awakening sequence activated');
      setIsFirstVisit(true);

      // Generate first task
      const task = generateFirstAction(
        profile.manifestation_goal,
        profile.archetype.toLowerCase() as ArchetypeKey
      );

      console.log('🎯 Generated first task:', task);
      setFirstTask(task);

      // Mark as seen after awakening completes
      setTimeout(() => {
        localStorage.setItem('dashboard_first_visit_seen', 'true');
      }, 5000);
    }
  }, [profile]);

  const completionRate = totalActiveHabits > 0 ? (completedHabitsToday / totalActiveHabits) * 100 : 0;
  const motivationalMessage = getMotivationalMessage(currentStreak);
  const contextualInsight = getContextualInsight(
    timeContext.period,
    energyLevel,
    currentStreak,
    completedHabitsToday,
    totalActiveHabits
  );

  const todayHabits = habits.filter(habit => habit.isActive).slice(0, 4);

  // Get user's archetype gradient
  const userGradient = profile?.archetype
    ? archetypeGradients[profile.archetype.toLowerCase()] || ['#9333ea', '#a855f7']
    : ['#9333ea', '#a855f7'];

  // Calculate days remaining in transformation (assuming 90-day journey)
  const transformationStartDate = profile?.created_at
    ? new Date(profile.created_at)
    : new Date();
  const today = new Date();
  const daysSinceStart = Math.floor(
    (today.getTime() - transformationStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const daysRemaining = Math.max(0, 90 - daysSinceStart);

  // Track first task completion for Perfect Day
  const perfectDayCompleted = firstTaskCompleted ? 1 : 0;

  const statsData = [
    {
      title: 'Current Streak',
      value: currentStreak,
      unit: 'days',
      icon: Award,
      color: 'from-orange-500 to-red-500',
      trend: '+2 from yesterday'
    },
    {
      title: 'Today\'s Progress',
      value: Math.round(completionRate),
      unit: '%',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      trend: `${completedHabitsToday}/${totalActiveHabits} habits`
    },
    {
      title: 'Energy Level',
      value: energyLevel || 0,
      unit: '/4',
      icon: Zap,
      color: 'from-purple-500 to-pink-500',
      trend: 'Track your energy'
    },
    {
      title: 'Weekly Score',
      value: 87,
      unit: '%',
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12% this week'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center lg:text-left"
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-4xl lg:text-5xl font-bold text-white mb-2"
            >
              {timeContext.greeting}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-xl text-white/70 mb-1"
            >
              Welcome back, {user?.fullName?.split(' ')[0] || 'Achiever'}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-white/60"
            >
              {timeContext.message} • {motivationalMessage}
            </motion.p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-4 lg:mt-0"
          >
            <div className="flex items-center space-x-2 text-white/60">
              <Calendar size={20} />
              <span>{new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>
            <div className="flex items-center space-x-2 text-white/60 mt-1">
              <Clock size={20} />
              <span>{new Date().toLocaleTimeString('en-US', { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}</span>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Manifestation Hero - Shows user's goal with progress - PREMIUM FADE IN */}
      {profile?.manifestation_goal && (
        <FadeIn delay={0.2}>
          <ManifestationHero
            goal={profile.manifestation_goal}
            progress={daysSinceStart}
            daysRemaining={daysRemaining}
            totalDays={90}
            gradient={userGradient}
            isFirstVisit={isFirstVisit}
          />
        </FadeIn>
      )}

      {/* AI Insight Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-2xl border border-white/20 p-6"
      >
        <div className="flex items-start space-x-4">
          <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-1">AI Insight</h3>
            <p className="text-white/80 leading-relaxed">{contextualInsight}</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid - PREMIUM STAGGER REVEAL */}
      <StaggerReveal
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        stagger={0.1}
        delay={0.3}
      >
        {statsData.map((stat) => (
          <div key={stat.title}>
            <StatsCard {...stat} />
          </div>
        ))}
      </StaggerReveal>

      {/* First Task Card - AI-generated first action - PREMIUM SLIDE UP */}
      {firstTask && !firstTaskCompleted && (
        <SlideUp delay={0.4}>
          <FirstTaskCard
            task={firstTask.task}
            category={firstTask.category}
            estimatedTime={firstTask.estimatedTime}
            xpReward={firstTask.xpReward}
            gradient={userGradient}
            isFirstVisit={isFirstVisit}
            onComplete={() => {
              console.log('🎯 First task completed!');
              setFirstTaskCompleted(true);
            }}
          />
        </SlideUp>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Today's Habits */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          className="lg:col-span-2"
        >
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center space-x-2">
                <Target className="w-6 h-6" />
                <span>Today's Focus</span>
              </h2>
              <div className="text-sm text-white/60">
                {completedHabitsToday}/{totalActiveHabits} completed
              </div>
            </div>
            
            <div className="space-y-4">
              {todayHabits.length > 0 ? (
                todayHabits.map((habit, index) => (
                  <motion.div
                    key={habit.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.0 + index * 0.1, duration: 0.6 }}
                  >
                    <HabitCard habit={habit} />
                  </motion.div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Sparkles className="w-12 h-12 text-white/30 mx-auto mb-4" />
                  <p className="text-white/60">No habits yet. Let's create your first one!</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="space-y-6"
        >
          {/* Energy Check */}
          <EnergyCheck 
            currentLevel={energyLevel}
            onLevelChange={setEnergyLevel}
          />

          {/* Quick Actions */}
          <QuickActions />
        </motion.div>
      </div>

      {/* Perfect Day Tracker - Fixed bottom-right - PREMIUM SCALE IN */}
      <ScaleIn delay={0.6}>
        <PerfectDayTracker
          completed={perfectDayCompleted}
          total={3}
          gradient={userGradient}
          delay={2000}
        />
      </ScaleIn>
    </div>
  );
};

export default Dashboard;
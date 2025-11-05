import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  TrendingUp, 
  Target,
  Lightbulb,
  Calendar,
  Clock,
  Zap,
  Star,
  AlertCircle,
  CheckCircle2,
  BarChart3,
  Activity,
  Sparkles,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { useManifestStore } from '../store/useManifestStore';
import { useManifestSelectors } from '../store/useManifestStore';
import { getTimeContext, getContextualInsight } from '../utils/helpers';

interface AIInsight {
  id: string;
  type: 'pattern' | 'recommendation' | 'achievement' | 'warning' | 'motivation';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  category: 'habits' | 'energy' | 'progress' | 'goals' | 'general';
  timestamp: string;
  data?: any;
}

interface PatternAnalysis {
  bestPerformanceTime: string;
  consistencyScore: number;
  streakPattern: string;
  energyCorrelation: string;
  weeklyTrend: 'improving' | 'declining' | 'stable';
}

const AIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<'all' | AIInsight['category']>('all');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [patternAnalysis, setPatternAnalysis] = useState<PatternAnalysis | null>(null);

  const { habits, progressEntries, energyLevel, user } = useManifestStore();
  const { totalStreak, completedHabitsToday, weeklyScore } = useManifestSelectors();

  // Generate AI insights based on user data
  const generateInsights = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newInsights: AIInsight[] = [];
      const timeContext = getTimeContext();

      // Pattern Recognition Insights
      if (habits.length > 0) {
        const completionRate = (completedHabitsToday / habits.length) * 100;
        
        if (completionRate >= 80) {
          newInsights.push({
            id: 'high-performance',
            type: 'achievement',
            title: 'Exceptional Performance Detected',
            description: `You've completed ${completionRate.toFixed(0)}% of your habits today! Your consistency is building unstoppable momentum.`,
            confidence: 95,
            actionable: false,
            category: 'habits',
            timestamp: new Date().toISOString()
          });
        } else if (completionRate < 50) {
          newInsights.push({
            id: 'low-completion',
            type: 'warning',
            title: 'Completion Rate Below Optimal',
            description: `Today's completion rate is ${completionRate.toFixed(0)}%. Consider starting with your easiest habit to build momentum.`,
            confidence: 85,
            actionable: true,
            category: 'habits',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Energy Pattern Analysis
      if (energyLevel) {
        const energyInsight = getContextualInsight(energyLevel, timeContext.period);
        newInsights.push({
          id: 'energy-optimization',
          type: 'recommendation',
          title: 'Energy Optimization Opportunity',
          description: energyInsight,
          confidence: 78,
          actionable: true,
          category: 'energy',
          timestamp: new Date().toISOString()
        });
      }

      // Streak Analysis
      if (totalStreak > 0) {
        if (totalStreak >= 7) {
          newInsights.push({
            id: 'streak-milestone',
            type: 'achievement',
            title: 'Streak Milestone Achieved',
            description: `${totalStreak} days of consistency! You're in the top 10% of users. Your discipline is becoming automatic.`,
            confidence: 100,
            actionable: false,
            category: 'progress',
            timestamp: new Date().toISOString()
          });
        } else if (totalStreak >= 3) {
          newInsights.push({
            id: 'building-momentum',
            type: 'motivation',
            title: 'Momentum Building Detected',
            description: `${totalStreak} days strong! You're entering the habit formation zone. Keep this energy flowing.`,
            confidence: 88,
            actionable: false,
            category: 'progress',
            timestamp: new Date().toISOString()
          });
        }
      }

      // Time-based Recommendations
      if (timeContext.period === 'morning') {
        newInsights.push({
          id: 'morning-power',
          type: 'recommendation',
          title: 'Morning Power Hour Activated',
          description: 'Your morning energy is peak performance time. Tackle your most challenging habits now for maximum impact.',
          confidence: 82,
          actionable: true,
          category: 'general',
          timestamp: new Date().toISOString()
        });
      } else if (timeContext.period === 'evening') {
        newInsights.push({
          id: 'evening-reflection',
          type: 'recommendation',
          title: 'Evening Reflection Opportunity',
          description: 'Perfect time for reflection and planning tomorrow. Consider journaling about today\'s wins and lessons.',
          confidence: 75,
          actionable: true,
          category: 'general',
          timestamp: new Date().toISOString()
        });
      }

      // Habit Category Analysis
      const buildingHabits = habits.filter(h => h.category === 'building');
      const breakingHabits = habits.filter(h => h.category === 'breaking');

      if (buildingHabits.length > breakingHabits.length * 2) {
        newInsights.push({
          id: 'habit-balance',
          type: 'pattern',
          title: 'Habit Portfolio Analysis',
          description: 'You have a strong focus on building positive habits. Consider adding 1-2 habits to break negative patterns for balanced growth.',
          confidence: 70,
          actionable: true,
          category: 'habits',
          timestamp: new Date().toISOString()
        });
      }

      // Weekly Performance Prediction
      if (weeklyScore > 0) {
        const projectedScore = weeklyScore * (7 / new Date().getDay() || 7);
        newInsights.push({
          id: 'weekly-projection',
          type: 'pattern',
          title: 'Weekly Performance Projection',
          description: `Based on current pace, you're projected to score ${projectedScore.toFixed(0)} points this week. ${projectedScore > 100 ? 'Exceptional trajectory!' : 'Room for acceleration in the remaining days.'}`,
          confidence: 72,
          actionable: true,
          category: 'progress',
          timestamp: new Date().toISOString()
        });
      }

      // Personalized Motivation
      newInsights.push({
        id: 'personalized-motivation',
        type: 'motivation',
        title: 'Your Transformation Journey',
        description: `${user?.fullName || 'Champion'}, every small action you take is rewiring your brain for success. You're not just building habits—you're becoming the person who naturally does these things.`,
        confidence: 100,
        actionable: false,
        category: 'general',
        timestamp: new Date().toISOString()
      });

      setInsights(newInsights);
      
      // Generate pattern analysis
      setPatternAnalysis({
        bestPerformanceTime: timeContext.period === 'morning' ? 'Morning (6-10 AM)' : timeContext.period === 'afternoon' ? 'Afternoon (12-5 PM)' : 'Evening (6-10 PM)',
        consistencyScore: Math.min(totalStreak * 10, 100),
        streakPattern: totalStreak > 7 ? 'Strong upward trend' : totalStreak > 3 ? 'Building momentum' : 'Early formation stage',
        energyCorrelation: energyLevel === 'high' ? 'High energy correlates with better completion' : energyLevel === 'medium' ? 'Moderate energy, consistent performance' : 'Low energy periods need strategic habit selection',
        weeklyTrend: weeklyScore > 80 ? 'improving' : weeklyScore > 50 ? 'stable' : 'declining'
      });

      setIsAnalyzing(false);
    }, 2000);
  };

  useEffect(() => {
    generateInsights();
  }, [habits, progressEntries, energyLevel, totalStreak]);

  const filteredInsights = insights.filter(insight => 
    selectedCategory === 'all' || insight.category === selectedCategory
  );

  const getInsightIcon = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return BarChart3;
      case 'recommendation': return Lightbulb;
      case 'achievement': return Star;
      case 'warning': return AlertCircle;
      case 'motivation': return Zap;
      default: return Brain;
    }
  };

  const getInsightColor = (type: AIInsight['type']) => {
    switch (type) {
      case 'pattern': return 'from-blue-500 to-cyan-500';
      case 'recommendation': return 'from-yellow-500 to-orange-500';
      case 'achievement': return 'from-green-500 to-emerald-500';
      case 'warning': return 'from-red-500 to-pink-500';
      case 'motivation': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-400';
    if (confidence >= 70) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Insights</h1>
          <p className="text-white/70">Intelligent analysis of your transformation journey</p>
        </div>
        <motion.button
          onClick={generateInsights}
          disabled={isAnalyzing}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          whileHover={{ scale: isAnalyzing ? 1 : 1.05 }}
          whileTap={{ scale: isAnalyzing ? 1 : 0.95 }}
        >
          <RefreshCw className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
          <span>{isAnalyzing ? 'Analyzing...' : 'Refresh Analysis'}</span>
        </motion.button>
      </div>

      {/* AI Status */}
      <motion.div
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-white/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">AI Analysis Engine</h3>
            <p className="text-white/70">
              {isAnalyzing 
                ? 'Analyzing your patterns and generating personalized insights...'
                : `Generated ${insights.length} insights from your data. Last updated: ${new Date().toLocaleTimeString()}`
              }
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Active</span>
          </div>
        </div>
      </motion.div>

      {/* Pattern Analysis Dashboard */}
      {patternAnalysis && (
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center space-x-2">
            <Activity className="w-6 h-6" />
            <span>Pattern Analysis</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span className="text-white/80 text-sm">Best Performance</span>
              </div>
              <p className="text-white font-semibold">{patternAnalysis.bestPerformanceTime}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target className="w-5 h-5 text-green-400" />
                <span className="text-white/80 text-sm">Consistency Score</span>
              </div>
              <p className="text-white font-semibold">{patternAnalysis.consistencyScore}/100</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-5 h-5 text-purple-400" />
                <span className="text-white/80 text-sm">Streak Pattern</span>
              </div>
              <p className="text-white font-semibold text-sm">{patternAnalysis.streakPattern}</p>
            </div>

            <div className="bg-white/5 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Zap className="w-5 h-5 text-yellow-400" />
                <span className="text-white/80 text-sm">Weekly Trend</span>
              </div>
              <p className={`font-semibold capitalize ${
                patternAnalysis.weeklyTrend === 'improving' ? 'text-green-400' :
                patternAnalysis.weeklyTrend === 'stable' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {patternAnalysis.weeklyTrend}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'all', label: 'All Insights', count: insights.length },
          { key: 'habits', label: 'Habits', count: insights.filter(i => i.category === 'habits').length },
          { key: 'energy', label: 'Energy', count: insights.filter(i => i.category === 'energy').length },
          { key: 'progress', label: 'Progress', count: insights.filter(i => i.category === 'progress').length },
          { key: 'goals', label: 'Goals', count: insights.filter(i => i.category === 'goals').length },
          { key: 'general', label: 'General', count: insights.filter(i => i.category === 'general').length }
        ].map((category) => (
          <motion.button
            key={category.key}
            onClick={() => setSelectedCategory(category.key as any)}
            className={`px-4 py-2 rounded-lg transition-all duration-200 ${
              selectedCategory === category.key
                ? 'bg-white/20 text-white border border-white/30'
                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {category.label} ({category.count})
          </motion.button>
        ))}
      </div>

      {/* Insights Grid */}
      <AnimatePresence>
        {isAnalyzing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center py-12"
          >
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI is analyzing your data...</h3>
              <p className="text-white/70">Discovering patterns and generating insights</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredInsights.map((insight, index) => {
              const IconComponent = getInsightIcon(insight.type);
              const colorClass = getInsightColor(insight.type);
              
              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 bg-gradient-to-r ${colorClass} rounded-lg`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{insight.title}</h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-white/60 text-sm capitalize">{insight.type}</span>
                          <span className="text-white/40">•</span>
                          <span className="text-white/60 text-sm capitalize">{insight.category}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className={`text-sm font-medium ${getConfidenceColor(insight.confidence)}`}>
                        {insight.confidence}%
                      </div>
                      <div className="text-white/50 text-xs">confidence</div>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-white/80 mb-4">{insight.description}</p>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {insight.actionable && (
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                          Actionable
                        </span>
                      )}
                      <span className="text-white/50 text-xs">
                        {new Date(insight.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    {insight.actionable && (
                      <motion.button
                        className="text-white/70 hover:text-white transition-colors"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <MessageSquare className="w-4 h-4" />
                      </motion.button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isAnalyzing && filteredInsights.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <Brain className="w-10 h-10 text-white/50" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No insights available</h3>
          <p className="text-white/70 mb-4">
            {selectedCategory === 'all' 
              ? 'Start tracking habits and activities to generate AI insights'
              : `No insights found for ${selectedCategory} category`
            }
          </p>
          <motion.button
            onClick={generateInsights}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Generate Insights
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default AIInsights;
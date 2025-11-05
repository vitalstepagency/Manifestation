import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Plus, Minus, Flame, Target } from 'lucide-react';
import { Habit } from '../types';
import { useManifestStore } from '../store/useManifestStore';
import { calculateStreakDays, getStreakEmoji, calculateXP } from '../utils/helpers';
import { toast } from 'sonner';

interface HabitCardProps {
  habit: Habit;
}

const HabitCard = ({ habit }: HabitCardProps) => {
  const { updateHabit } = useManifestStore();
  const [isCompleting, setIsCompleting] = useState(false);

  const today = new Date().toISOString().split('T')[0];
  const isCompletedToday = habit.completionDates?.includes(today) || false;
  const streakDays = calculateStreakDays(habit.completionDates || []);
  const streakEmoji = getStreakEmoji(streakDays);
  const xpReward = calculateXP(habit.type as 'building' | 'breaking', streakDays);

  const handleToggleCompletion = async () => {
    if (isCompleting) return;
    
    setIsCompleting(true);
    
    try {
      const newCompletionDates = isCompletedToday
        ? (habit.completionDates || []).filter(date => date !== today)
        : [...(habit.completionDates || []), today];
      
      await updateHabit(habit.id, { completionDates: newCompletionDates, is_completed_today: !isCompletedToday });
      
      if (!isCompletedToday) {
        toast.success(`+${xpReward} XP! ${habit.title} completed!`, {
          icon: streakEmoji,
        });
      }
    } catch (error) {
      toast.error('Failed to update habit progress');
    } finally {
      setIsCompleting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    return category === 'building' 
      ? 'from-green-500 to-emerald-500' 
      : 'from-red-500 to-orange-500';
  };

  const getCategoryIcon = (category: string) => {
    return category === 'building' ? Plus : Minus;
  };

  return (
    <motion.div
      className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-4 transition-all duration-300 ${
        isCompletedToday ? 'bg-green-500/10 border-green-500/30' : 'hover:bg-white/10'
      }`}
      whileHover={{ scale: 1.01 }}
      layout
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
          {/* Category Icon */}
          <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(habit.category)}`}>
            {habit.category === 'building' ? (
              <Plus className="w-4 h-4 text-white" />
            ) : (
              <Target className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Habit Info */}
          <div className="flex-1">
            <h3 className={`font-semibold ${isCompletedToday ? 'text-green-300' : 'text-white'}`}>
              {habit.title}
            </h3>
            {habit.description && (
              <p className="text-sm text-white/60 mt-1">{habit.description}</p>
            )}
            
            {/* Streak Info */}
            {streakDays > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex items-center space-x-1 text-orange-400">
                  <Flame className="w-4 h-4" />
                  <span className="text-sm font-medium">{streakDays} day streak</span>
                </div>
                <span className="text-lg">{streakEmoji}</span>
              </div>
            )}
          </div>
        </div>

        {/* Completion Button */}
        <motion.button
          onClick={handleToggleCompletion}
          disabled={isCompleting}
          className={`p-3 rounded-xl transition-all duration-200 ${
            isCompletedToday
              ? 'bg-green-500 text-white'
              : 'bg-white/10 text-white/70 hover:bg-white/20 hover:text-white'
          }`}
          whileHover={{ scale: isCompleting ? 1 : 1.05 }}
          whileTap={{ scale: isCompleting ? 1 : 0.95 }}
        >
          {isCompleting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Check className={`w-5 h-5 ${isCompletedToday ? 'text-white' : ''}`} />
          )}
        </motion.button>
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-sm text-white/60 mb-2">
          <span>{habit.category === 'building' ? 'Building' : 'Breaking'} Habit</span>
          <span>+{xpReward} XP</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getCategoryColor(habit.category)}`}
            initial={{ width: 0 }}
            animate={{ width: isCompletedToday ? '100%' : '0%' }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default HabitCard;
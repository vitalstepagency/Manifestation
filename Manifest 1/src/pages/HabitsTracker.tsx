import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Filter, 
  TrendingUp, 
  Target,
  Calendar,
  Flame,
  Award,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { useManifestStore } from '../store/useManifestStore';
import { useManifestSelectors } from '../store/useManifestStore';
import HabitCard from '../components/HabitCard';
import { toast } from 'sonner';
import { Habit } from '../types';

const HabitsTracker = () => {
  const [filter, setFilter] = useState<'all' | 'building' | 'breaking'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [newHabit, setNewHabit] = useState({
    title: '',
    description: '',
    category: 'building' as 'building' | 'breaking',
    frequency: 'daily' as 'daily' | 'weekly',
    targetCount: 1
  });

  const { user, habits, addHabit, updateHabit, deleteHabit } = useManifestStore();
  const { completedHabitsToday, currentStreak } = useManifestSelectors();

  const filteredHabits = habits.filter(habit => 
    filter === 'all' || habit.category === filter
  );

  const buildingHabits = habits.filter(h => h.category === 'building');
  const breakingHabits = habits.filter(h => h.category === 'breaking');

  const handleAddHabit = async () => {
    if (!newHabit.title.trim()) {
      toast.error('Please enter a habit title');
      return;
    }

    if (!user) {
      toast.error('User not found');
      return;
    }

    try {
      await addHabit({
        user_id: user.id,
        title: newHabit.title,
        description: newHabit.description,
        type: newHabit.category as 'building' | 'breaking',
        category: newHabit.category,
        streak_count: 0,
        is_completed_today: false,
        completionDates: [],
        isActive: true
      });
      setNewHabit({
        title: '',
        description: '',
        category: 'building',
        frequency: 'daily',
        targetCount: 1
      });
      setShowAddForm(false);
      toast.success('Habit added successfully!');
    } catch (error) {
      toast.error('Failed to add habit');
    }
  };

  const handleEditHabit = async () => {
    if (!editingHabit || !newHabit.title.trim()) {
      toast.error('Please enter a habit title');
      return;
    }

    try {
      await updateHabit(editingHabit.id, newHabit);
      setEditingHabit(null);
      setNewHabit({
        title: '',
        description: '',
        category: 'building',
        frequency: 'daily',
        targetCount: 1
      });
      toast.success('Habit updated successfully!');
    } catch (error) {
      toast.error('Failed to update habit');
    }
  };

  const handleDeleteHabit = async (habitId: string) => {
    try {
      await deleteHabit(habitId);
      toast.success('Habit deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  const startEditing = (habit: Habit) => {
    setEditingHabit(habit);
    setNewHabit({
      title: habit.title,
      description: habit.description || '',
      category: habit.type as 'building' | 'breaking',
      frequency: 'daily',
      targetCount: 1
    });
    setShowAddForm(true);
  };

  const cancelEditing = () => {
    setEditingHabit(null);
    setNewHabit({
      title: '',
      description: '',
      category: 'building',
      frequency: 'daily',
      targetCount: 1
    });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Habits Tracker</h1>
          <p className="text-white/70">Build the life you want, one habit at a time</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Habit</span>
        </motion.button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Today's Progress</p>
              <p className="text-2xl font-bold text-white">{completedHabitsToday}/{habits.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-500/20 rounded-lg">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Current Streak</p>
              <p className="text-2xl font-bold text-white">{currentStreak} days</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Building</p>
              <p className="text-2xl font-bold text-white">{buildingHabits.length}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Target className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <p className="text-white/70 text-sm">Breaking</p>
              <p className="text-2xl font-bold text-white">{breakingHabits.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-white/70" />
          <span className="text-white/70">Filter:</span>
        </div>
        <div className="flex space-x-2">
          {[
            { key: 'all', label: 'All Habits', count: habits.length },
            { key: 'building', label: 'Building', count: buildingHabits.length },
            { key: 'breaking', label: 'Breaking', count: breakingHabits.length }
          ].map((tab) => (
            <motion.button
              key={tab.key}
              onClick={() => setFilter(tab.key as any)}
              className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                filter === tab.key
                  ? 'bg-white/20 text-white border border-white/30'
                  : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {tab.label} ({tab.count})
            </motion.button>
          ))}
        </div>
      </div>

      {/* Add/Edit Habit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-4">
              {editingHabit ? 'Edit Habit' : 'Add New Habit'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-white/90 font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={newHabit.title}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Drink 8 glasses of water"
                />
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Category</label>
                <select
                  value={newHabit.category}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, category: e.target.value as 'building' | 'breaking' }))}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="building">Building</option>
                  <option value="breaking">Breaking</option>
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Frequency</label>
                <select
                  value={newHabit.frequency}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, frequency: e.target.value as 'daily' | 'weekly' }))}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                </select>
              </div>

              <div>
                <label className="block text-white/90 font-medium mb-2">Target Count</label>
                <input
                  type="number"
                  min="1"
                  value={newHabit.targetCount}
                  onChange={(e) => setNewHabit(prev => ({ ...prev, targetCount: parseInt(e.target.value) || 1 }))}
                  className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-white/90 font-medium mb-2">Description (Optional)</label>
              <textarea
                value={newHabit.description}
                onChange={(e) => setNewHabit(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={3}
                placeholder="Why is this habit important to you?"
              />
            </div>

            <div className="flex space-x-3">
              <motion.button
                onClick={editingHabit ? handleEditHabit : handleAddHabit}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {editingHabit ? 'Update Habit' : 'Add Habit'}
              </motion.button>
              <motion.button
                onClick={cancelEditing}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Habits List */}
      <div className="space-y-4">
        {filteredHabits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <Target className="w-10 h-10 text-white/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No habits yet</h3>
            <p className="text-white/70 mb-4">Start building your transformation by adding your first habit</p>
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Your First Habit
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredHabits.map((habit, index) => (
              <motion.div
                key={habit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group"
              >
                <HabitCard habit={habit} />
                
                {/* Action Menu */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="relative">
                    <motion.button
                      className="p-2 bg-white/10 backdrop-blur-sm rounded-lg hover:bg-white/20 transition-all duration-200"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <MoreVertical className="w-4 h-4 text-white" />
                    </motion.button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white/10 backdrop-blur-xl rounded-lg border border-white/20 py-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEditing(habit)}
                        className="w-full px-4 py-2 text-left text-white hover:bg-white/10 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Edit className="w-4 h-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="w-full px-4 py-2 text-left text-red-400 hover:bg-red-500/10 transition-colors duration-200 flex items-center space-x-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HabitsTracker;
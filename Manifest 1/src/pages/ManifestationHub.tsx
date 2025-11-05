import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Target, 
  TrendingUp,
  Calendar,
  Star,
  Eye,
  Heart,
  Zap,
  Plus,
  Edit,
  CheckCircle2,
  Clock,
  DollarSign
} from 'lucide-react';
import { useManifestStore } from '../store/useManifestStore';
import { toast } from 'sonner';

interface ManifestationGoal {
  id: string;
  title: string;
  description: string;
  category: 'financial' | 'health' | 'career' | 'relationships' | 'personal' | 'spiritual';
  targetDate: string;
  targetValue?: number;
  currentValue?: number;
  isCompleted: boolean;
  visualizationNotes: string;
  affirmations: string[];
  createdAt: string;
}

const ManifestationHub = () => {
  const [goals, setGoals] = useState<ManifestationGoal[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<ManifestationGoal | null>(null);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'personal' as ManifestationGoal['category'],
    targetDate: '',
    targetValue: '',
    visualizationNotes: '',
    affirmations: ['']
  });

  const { user } = useManifestStore();

  // Mock data for demonstration
  useEffect(() => {
    const mockGoals: ManifestationGoal[] = [
      {
        id: '1',
        title: 'Launch My Dream Business',
        description: 'Start and scale my online coaching business to help others achieve their goals',
        category: 'career',
        targetDate: '2024-12-31',
        targetValue: 100000,
        currentValue: 25000,
        isCompleted: false,
        visualizationNotes: 'I see myself confidently leading workshops, helping clients transform their lives, and building a community of empowered individuals.',
        affirmations: [
          'I am a successful entrepreneur who creates massive value',
          'My business grows effortlessly and abundantly',
          'I attract ideal clients who are ready to transform'
        ],
        createdAt: '2024-01-01'
      },
      {
        id: '2',
        title: 'Perfect Health & Vitality',
        description: 'Achieve optimal physical and mental health through consistent habits',
        category: 'health',
        targetDate: '2024-06-30',
        isCompleted: false,
        visualizationNotes: 'I feel energized every morning, my body is strong and flexible, and my mind is clear and focused.',
        affirmations: [
          'My body is a temple of health and vitality',
          'I make choices that nourish my body and soul',
          'Every day I become stronger and more vibrant'
        ],
        createdAt: '2024-01-15'
      }
    ];
    setGoals(mockGoals);
  }, []);

  const activeGoals = goals.filter(goal => !goal.isCompleted);
  const completedGoals = goals.filter(goal => goal.isCompleted);

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    const goal: ManifestationGoal = {
      id: Date.now().toString(),
      title: newGoal.title,
      description: newGoal.description,
      category: newGoal.category,
      targetDate: newGoal.targetDate,
      targetValue: newGoal.targetValue ? parseFloat(newGoal.targetValue) : undefined,
      currentValue: 0,
      isCompleted: false,
      visualizationNotes: newGoal.visualizationNotes,
      affirmations: newGoal.affirmations.filter(a => a.trim()),
      createdAt: new Date().toISOString()
    };

    setGoals(prev => [...prev, goal]);
    resetForm();
    toast.success('Manifestation goal created! The universe is aligning for you.');
  };

  const handleEditGoal = () => {
    if (!editingGoal || !newGoal.title.trim()) {
      toast.error('Please enter a goal title');
      return;
    }

    setGoals(prev => prev.map(goal => 
      goal.id === editingGoal.id 
        ? {
            ...goal,
            title: newGoal.title,
            description: newGoal.description,
            category: newGoal.category,
            targetDate: newGoal.targetDate,
            targetValue: newGoal.targetValue ? parseFloat(newGoal.targetValue) : undefined,
            visualizationNotes: newGoal.visualizationNotes,
            affirmations: newGoal.affirmations.filter(a => a.trim())
          }
        : goal
    ));
    
    resetForm();
    toast.success('Goal updated successfully!');
  };

  const resetForm = () => {
    setNewGoal({
      title: '',
      description: '',
      category: 'personal',
      targetDate: '',
      targetValue: '',
      visualizationNotes: '',
      affirmations: ['']
    });
    setShowAddForm(false);
    setEditingGoal(null);
  };

  const startEditing = (goal: ManifestationGoal) => {
    setEditingGoal(goal);
    setNewGoal({
      title: goal.title,
      description: goal.description,
      category: goal.category,
      targetDate: goal.targetDate,
      targetValue: goal.targetValue?.toString() || '',
      visualizationNotes: goal.visualizationNotes,
      affirmations: goal.affirmations.length > 0 ? goal.affirmations : ['']
    });
    setShowAddForm(true);
  };

  const toggleGoalCompletion = (goalId: string) => {
    setGoals(prev => prev.map(goal => 
      goal.id === goalId 
        ? { ...goal, isCompleted: !goal.isCompleted }
        : goal
    ));
    
    const goal = goals.find(g => g.id === goalId);
    if (goal && !goal.isCompleted) {
      toast.success('🎉 Manifestation complete! You are unstoppable!');
    }
  };

  const updateAffirmation = (index: number, value: string) => {
    const newAffirmations = [...newGoal.affirmations];
    newAffirmations[index] = value;
    setNewGoal(prev => ({ ...prev, affirmations: newAffirmations }));
  };

  const addAffirmation = () => {
    setNewGoal(prev => ({ ...prev, affirmations: [...prev.affirmations, ''] }));
  };

  const removeAffirmation = (index: number) => {
    setNewGoal(prev => ({ 
      ...prev, 
      affirmations: prev.affirmations.filter((_, i) => i !== index) 
    }));
  };

  const getProgressPercentage = (goal: ManifestationGoal) => {
    if (goal.targetValue && goal.currentValue !== undefined) {
      return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
    }
    return 0;
  };

  const getCategoryIcon = (category: ManifestationGoal['category']) => {
    switch (category) {
      case 'financial': return DollarSign;
      case 'health': return Heart;
      case 'career': return TrendingUp;
      case 'relationships': return Heart;
      case 'personal': return Star;
      case 'spiritual': return Sparkles;
      default: return Target;
    }
  };

  const getCategoryColor = (category: ManifestationGoal['category']) => {
    switch (category) {
      case 'financial': return 'from-green-500 to-emerald-500';
      case 'health': return 'from-red-500 to-pink-500';
      case 'career': return 'from-blue-500 to-cyan-500';
      case 'relationships': return 'from-purple-500 to-pink-500';
      case 'personal': return 'from-yellow-500 to-orange-500';
      case 'spiritual': return 'from-indigo-500 to-purple-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Manifestation Hub</h1>
          <p className="text-white/70">Visualize, believe, and achieve your dreams</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>New Goal</span>
        </motion.button>
      </div>

      {/* Manifestation Quote */}
      <motion.div
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-white/10 p-6 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Sparkles className="w-8 h-8 text-yellow-400 mx-auto mb-3" />
        <p className="text-xl text-white font-medium mb-2">
          "Everything you need is inside you – you just need to access it."
        </p>
        <p className="text-white/70">- Buddha</p>
      </motion.div>

      {/* Tabs */}
      <div className="flex space-x-2">
        {[
          { key: 'active', label: 'Active Goals', count: activeGoals.length },
          { key: 'completed', label: 'Completed', count: completedGoals.length }
        ].map((tab) => (
          <motion.button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-6 py-3 rounded-xl transition-all duration-200 ${
              activeTab === tab.key
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

      {/* Add/Edit Goal Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <h3 className="text-xl font-semibold text-white mb-6">
              {editingGoal ? 'Edit Manifestation Goal' : 'Create New Manifestation Goal'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Goal Title</label>
                  <input
                    type="text"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Launch my dream business"
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Category</label>
                  <select
                    value={newGoal.category}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="personal">Personal Growth</option>
                    <option value="financial">Financial</option>
                    <option value="health">Health & Fitness</option>
                    <option value="career">Career</option>
                    <option value="relationships">Relationships</option>
                    <option value="spiritual">Spiritual</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Target Date</label>
                    <input
                      type="date"
                      value={newGoal.targetDate}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetDate: e.target.value }))}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">Target Value (Optional)</label>
                    <input
                      type="number"
                      value={newGoal.targetValue}
                      onChange={(e) => setNewGoal(prev => ({ ...prev, targetValue: e.target.value }))}
                      className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="100000"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Description</label>
                  <textarea
                    value={newGoal.description}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={3}
                    placeholder="Describe your goal in detail..."
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-white/90 font-medium mb-2">Visualization Notes</label>
                  <textarea
                    value={newGoal.visualizationNotes}
                    onChange={(e) => setNewGoal(prev => ({ ...prev, visualizationNotes: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={4}
                    placeholder="Describe how it feels to achieve this goal. Be specific about the emotions, sensations, and environment..."
                  />
                </div>

                <div>
                  <label className="block text-white/90 font-medium mb-2">Affirmations</label>
                  <div className="space-y-2">
                    {newGoal.affirmations.map((affirmation, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={affirmation}
                          onChange={(e) => updateAffirmation(index, e.target.value)}
                          className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="I am worthy of achieving my dreams"
                        />
                        {newGoal.affirmations.length > 1 && (
                          <button
                            onClick={() => removeAffirmation(index)}
                            className="px-3 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={addAffirmation}
                      className="w-full p-3 bg-white/5 border border-white/20 border-dashed rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                      + Add Affirmation
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <motion.button
                onClick={editingGoal ? handleEditGoal : handleAddGoal}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {editingGoal ? 'Update Goal' : 'Create Goal'}
              </motion.button>
              <motion.button
                onClick={resetForm}
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

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(activeTab === 'active' ? activeGoals : completedGoals).map((goal, index) => {
          const IconComponent = getCategoryIcon(goal.category);
          const colorClass = getCategoryColor(goal.category);
          const progress = getProgressPercentage(goal);
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 ${
                goal.isCompleted ? 'opacity-75' : ''
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 bg-gradient-to-r ${colorClass} rounded-lg`}>
                    <IconComponent className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-semibold ${goal.isCompleted ? 'text-white/70 line-through' : 'text-white'}`}>
                      {goal.title}
                    </h3>
                    <p className="text-white/60 text-sm capitalize">{goal.category}</p>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <motion.button
                    onClick={() => startEditing(goal)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Edit className="w-4 h-4 text-white/70" />
                  </motion.button>
                  
                  <motion.button
                    onClick={() => toggleGoalCompletion(goal.id)}
                    className={`p-2 rounded-lg transition-colors ${
                      goal.isCompleted 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-white/10 text-white/70 hover:bg-green-500/20 hover:text-green-400'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>

              {/* Progress Bar */}
              {goal.targetValue && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-white/70 mb-2">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      className={`h-2 bg-gradient-to-r ${colorClass} rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-white/60 mt-1">
                    <span>${goal.currentValue?.toLocaleString() || 0}</span>
                    <span>${goal.targetValue.toLocaleString()}</span>
                  </div>
                </div>
              )}

              {/* Target Date */}
              {goal.targetDate && (
                <div className="flex items-center space-x-2 text-white/60 text-sm mb-4">
                  <Clock className="w-4 h-4" />
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString()}</span>
                </div>
              )}

              {/* Description */}
              {goal.description && (
                <p className="text-white/70 text-sm mb-4">{goal.description}</p>
              )}

              {/* Visualization */}
              {goal.visualizationNotes && (
                <div className="mb-4">
                  <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
                    <Eye className="w-4 h-4" />
                    <span>Visualization</span>
                  </div>
                  <p className="text-white/60 text-sm italic bg-white/5 p-3 rounded-lg">
                    "{goal.visualizationNotes}"
                  </p>
                </div>
              )}

              {/* Affirmations */}
              {goal.affirmations.length > 0 && (
                <div>
                  <div className="flex items-center space-x-2 text-white/80 text-sm mb-2">
                    <Zap className="w-4 h-4" />
                    <span>Affirmations</span>
                  </div>
                  <div className="space-y-1">
                    {goal.affirmations.slice(0, 2).map((affirmation, idx) => (
                      <p key={idx} className="text-white/60 text-sm">
                        • {affirmation}
                      </p>
                    ))}
                    {goal.affirmations.length > 2 && (
                      <p className="text-white/50 text-xs">
                        +{goal.affirmations.length - 2} more affirmations
                      </p>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {(activeTab === 'active' ? activeGoals : completedGoals).length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-white/50" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">
            {activeTab === 'active' ? 'No active goals yet' : 'No completed goals yet'}
          </h3>
          <p className="text-white/70 mb-4">
            {activeTab === 'active' 
              ? 'Start manifesting your dreams by creating your first goal'
              : 'Complete some goals to see them here'
            }
          </p>
          {activeTab === 'active' && (
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Create Your First Goal
            </motion.button>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ManifestationHub;
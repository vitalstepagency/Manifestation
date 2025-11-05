import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BookOpen, 
  Plus, 
  Calendar,
  Heart,
  Lightbulb,
  Target,
  Smile,
  Meh,
  Frown,
  Search,
  Filter,
  Edit,
  Trash2,
  Save,
  X,
  Sparkles,
  Clock,
  TrendingUp
} from 'lucide-react';
import { useManifestStore } from '../store/useManifestStore';
import { toast } from 'sonner';
import { getTimeContext } from '../utils/helpers';

interface JournalEntry {
  id: string;
  date: string;
  mood: 'happy' | 'neutral' | 'sad';
  gratitude: string[];
  reflection: string;
  wins: string[];
  challenges: string[];
  tomorrowGoals: string[];
  energyLevel: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const Journal = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMood, setFilterMood] = useState<'all' | JournalEntry['mood']>('all');
  const [newEntry, setNewEntry] = useState({
    mood: 'happy' as JournalEntry['mood'],
    gratitude: [''],
    reflection: '',
    wins: [''],
    challenges: [''],
    tomorrowGoals: [''],
    energyLevel: 7,
    tags: [] as string[]
  });

  const { user, addJournalEntry } = useManifestStore();

  // Load mock entries
  useEffect(() => {
    const mockEntries: JournalEntry[] = [
      {
        id: '1',
        date: new Date().toISOString().split('T')[0],
        mood: 'happy',
        gratitude: ['My health and energy', 'Supportive family', 'New opportunities'],
        reflection: 'Today was incredibly productive. I completed all my habits and felt a strong sense of momentum building. The morning meditation really set the tone for the entire day.',
        wins: ['Completed morning workout', 'Finished important project', 'Had meaningful conversation with mentor'],
        challenges: ['Struggled with afternoon energy dip', 'Got distracted by social media'],
        tomorrowGoals: ['Start day with cold shower', 'Focus on deep work blocks', 'Prepare healthy meals'],
        energyLevel: 8,
        tags: ['productivity', 'habits', 'growth'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: '2',
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        mood: 'neutral',
        gratitude: ['Peaceful morning', 'Good book', 'Comfortable home'],
        reflection: 'A quieter day today. Sometimes these slower days are necessary for reflection and planning. I used the time to think about my long-term goals.',
        wins: ['Read for 2 hours', 'Organized workspace', 'Planned next week'],
        challenges: ['Felt less motivated', 'Skipped evening workout'],
        tomorrowGoals: ['Get back to full routine', 'Connect with friends', 'Tackle challenging task'],
        energyLevel: 6,
        tags: ['reflection', 'planning', 'rest'],
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
      }
    ];
    setEntries(mockEntries);
  }, []);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      entry.reflection.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.gratitude.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
      entry.wins.some(w => w.toLowerCase().includes(searchTerm.toLowerCase())) ||
      entry.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesMood = filterMood === 'all' || entry.mood === filterMood;
    
    return matchesSearch && matchesMood;
  });

  const handleSaveEntry = async () => {
    if (!newEntry.reflection.trim()) {
      toast.error('Please add a reflection to save your entry');
      return;
    }

    const entry: JournalEntry = {
      id: editingEntry?.id || Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      mood: newEntry.mood,
      gratitude: newEntry.gratitude.filter(g => g.trim()),
      reflection: newEntry.reflection,
      wins: newEntry.wins.filter(w => w.trim()),
      challenges: newEntry.challenges.filter(c => c.trim()),
      tomorrowGoals: newEntry.tomorrowGoals.filter(g => g.trim()),
      energyLevel: newEntry.energyLevel,
      tags: newEntry.tags,
      createdAt: editingEntry?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (editingEntry) {
      setEntries(prev => prev.map(e => e.id === editingEntry.id ? entry : e));
      toast.success('Journal entry updated!');
    } else {
      setEntries(prev => [entry, ...prev]);
      toast.success('Journal entry saved! Your thoughts are captured.');
    }

    // Save to Supabase
    if (user) {
      try {
        await addJournalEntry({
          user_id: user.id,
          content: entry.reflection,
          gratitude_items: entry.gratitude,
          daily_wins: entry.wins
        });
      } catch (error) {
        console.error('Failed to save to Supabase:', error);
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setNewEntry({
      mood: 'happy',
      gratitude: [''],
      reflection: '',
      wins: [''],
      challenges: [''],
      tomorrowGoals: [''],
      energyLevel: 7,
      tags: []
    });
    setShowAddForm(false);
    setEditingEntry(null);
  };

  const startEditing = (entry: JournalEntry) => {
    setEditingEntry(entry);
    setNewEntry({
      mood: entry.mood,
      gratitude: entry.gratitude.length > 0 ? entry.gratitude : [''],
      reflection: entry.reflection,
      wins: entry.wins.length > 0 ? entry.wins : [''],
      challenges: entry.challenges.length > 0 ? entry.challenges : [''],
      tomorrowGoals: entry.tomorrowGoals.length > 0 ? entry.tomorrowGoals : [''],
      energyLevel: entry.energyLevel,
      tags: entry.tags
    });
    setShowAddForm(true);
  };

  const deleteEntry = (entryId: string) => {
    setEntries(prev => prev.filter(e => e.id !== entryId));
    toast.success('Journal entry deleted');
  };

  const updateListField = (field: 'gratitude' | 'wins' | 'challenges' | 'tomorrowGoals', index: number, value: string) => {
    setNewEntry(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addListItem = (field: 'gratitude' | 'wins' | 'challenges' | 'tomorrowGoals') => {
    setNewEntry(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'gratitude' | 'wins' | 'challenges' | 'tomorrowGoals', index: number) => {
    setNewEntry(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const getMoodIcon = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'happy': return Smile;
      case 'neutral': return Meh;
      case 'sad': return Frown;
    }
  };

  const getMoodColor = (mood: JournalEntry['mood']) => {
    switch (mood) {
      case 'happy': return 'text-green-400';
      case 'neutral': return 'text-yellow-400';
      case 'sad': return 'text-red-400';
    }
  };

  const getPrompts = () => {
    const timeContext = getTimeContext();
    const prompts = {
      morning: [
        "What are you most excited about today?",
        "How do you want to feel at the end of today?",
        "What's one thing you're grateful for right now?"
      ],
      afternoon: [
        "How has your day been so far?",
        "What's working well today?",
        "What would make the rest of your day amazing?"
      ],
      evening: [
        "What were your biggest wins today?",
        "What did you learn about yourself?",
        "How did you grow today?"
      ]
    };
    return prompts[timeContext.period] || prompts.evening;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Journal</h1>
          <p className="text-white/70">Reflect, grow, and capture your transformation</p>
        </div>
        <motion.button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-5 h-5" />
          <span>New Entry</span>
        </motion.button>
      </div>

      {/* Reflection Prompts */}
      <motion.div
        className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl rounded-xl border border-white/10 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="w-6 h-6 text-yellow-400" />
          <h3 className="text-xl font-semibold text-white">Reflection Prompts</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {getPrompts().map((prompt, index) => (
            <div key={index} className="bg-white/5 rounded-lg p-4">
              <p className="text-white/80 italic">"{prompt}"</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search your entries..."
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-white/70" />
          <select
            value={filterMood}
            onChange={(e) => setFilterMood(e.target.value as any)}
            className="px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Moods</option>
            <option value="happy">Happy</option>
            <option value="neutral">Neutral</option>
            <option value="sad">Sad</option>
          </select>
        </div>
      </div>

      {/* Add/Edit Entry Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {editingEntry ? 'Edit Entry' : 'New Journal Entry'}
              </h3>
              <button
                onClick={resetForm}
                className="p-2 text-white/70 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Mood and Energy */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/90 font-medium mb-2">Mood</label>
                    <div className="flex space-x-2">
                      {(['happy', 'neutral', 'sad'] as const).map((mood) => {
                        const MoodIcon = getMoodIcon(mood);
                        return (
                          <button
                            key={mood}
                            onClick={() => setNewEntry(prev => ({ ...prev, mood }))}
                            className={`flex-1 p-3 rounded-lg border transition-all duration-200 ${
                              newEntry.mood === mood
                                ? 'bg-white/20 border-white/30'
                                : 'bg-white/5 border-white/10 hover:bg-white/10'
                            }`}
                          >
                            <MoodIcon className={`w-6 h-6 mx-auto ${getMoodColor(mood)}`} />
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white/90 font-medium mb-2">
                      Energy Level: {newEntry.energyLevel}/10
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={newEntry.energyLevel}
                      onChange={(e) => setNewEntry(prev => ({ ...prev, energyLevel: parseInt(e.target.value) }))}
                      className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>
                </div>

                {/* Gratitude */}
                <div>
                  <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                    <Heart className="w-4 h-4" />
                    <span>What are you grateful for?</span>
                  </label>
                  <div className="space-y-2">
                    {newEntry.gratitude.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListField('gratitude', index, e.target.value)}
                          className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Something you're grateful for..."
                        />
                        {newEntry.gratitude.length > 1 && (
                          <button
                            onClick={() => removeListItem('gratitude', index)}
                            className="px-3 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('gratitude')}
                      className="w-full p-3 bg-white/5 border border-white/20 border-dashed rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                      + Add gratitude
                    </button>
                  </div>
                </div>

                {/* Wins */}
                <div>
                  <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Today's Wins</span>
                  </label>
                  <div className="space-y-2">
                    {newEntry.wins.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListField('wins', index, e.target.value)}
                          className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Something you accomplished..."
                        />
                        {newEntry.wins.length > 1 && (
                          <button
                            onClick={() => removeListItem('wins', index)}
                            className="px-3 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('wins')}
                      className="w-full p-3 bg-white/5 border border-white/20 border-dashed rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                      + Add win
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Reflection */}
                <div>
                  <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                    <BookOpen className="w-4 h-4" />
                    <span>Reflection</span>
                  </label>
                  <textarea
                    value={newEntry.reflection}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, reflection: e.target.value }))}
                    className="w-full p-4 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                    rows={6}
                    placeholder="How was your day? What did you learn? How did you grow?"
                  />
                </div>

                {/* Challenges */}
                <div>
                  <label className="block text-white/90 font-medium mb-2">Challenges</label>
                  <div className="space-y-2">
                    {newEntry.challenges.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListField('challenges', index, e.target.value)}
                          className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Something that was difficult..."
                        />
                        {newEntry.challenges.length > 1 && (
                          <button
                            onClick={() => removeListItem('challenges', index)}
                            className="px-3 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('challenges')}
                      className="w-full p-3 bg-white/5 border border-white/20 border-dashed rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                      + Add challenge
                    </button>
                  </div>
                </div>

                {/* Tomorrow's Goals */}
                <div>
                  <label className="block text-white/90 font-medium mb-2 flex items-center space-x-2">
                    <Target className="w-4 h-4" />
                    <span>Tomorrow's Goals</span>
                  </label>
                  <div className="space-y-2">
                    {newEntry.tomorrowGoals.map((item, index) => (
                      <div key={index} className="flex space-x-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateListField('tomorrowGoals', index, e.target.value)}
                          className="flex-1 p-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="Something to focus on tomorrow..."
                        />
                        {newEntry.tomorrowGoals.length > 1 && (
                          <button
                            onClick={() => removeListItem('tomorrowGoals', index)}
                            className="px-3 py-3 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      onClick={() => addListItem('tomorrowGoals')}
                      className="w-full p-3 bg-white/5 border border-white/20 border-dashed rounded-lg text-white/70 hover:bg-white/10 transition-colors"
                    >
                      + Add goal
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-3 mt-6">
              <motion.button
                onClick={resetForm}
                className="px-6 py-3 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSaveEntry}
                className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Save className="w-4 h-4" />
                <span>{editingEntry ? 'Update Entry' : 'Save Entry'}</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-white/50" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm || filterMood !== 'all' ? 'No entries found' : 'Start your journal'}
            </h3>
            <p className="text-white/70 mb-4">
              {searchTerm || filterMood !== 'all' 
                ? 'Try adjusting your search or filter'
                : 'Capture your thoughts, growth, and gratitude'
              }
            </p>
            {!searchTerm && filterMood === 'all' && (
              <motion.button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Write Your First Entry
              </motion.button>
            )}
          </motion.div>
        ) : (
          filteredEntries.map((entry, index) => {
            const MoodIcon = getMoodIcon(entry.mood);
            
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-200"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-white/10 rounded-lg">
                      <MoodIcon className={`w-5 h-5 ${getMoodColor(entry.mood)}`} />
                    </div>
                    <div>
                      <p className="text-white font-medium">
                        {new Date(entry.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                      <div className="flex items-center space-x-2 text-white/60 text-sm">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(entry.createdAt).toLocaleTimeString()}</span>
                        <span>•</span>
                        <span>Energy: {entry.energyLevel}/10</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      onClick={() => startEditing(entry)}
                      className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Edit className="w-4 h-4 text-white/70" />
                    </motion.button>
                    <motion.button
                      onClick={() => deleteEntry(entry.id)}
                      className="p-2 bg-red-500/20 rounded-lg hover:bg-red-500/30 transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4">
                  {/* Reflection */}
                  <div>
                    <p className="text-white/80">{entry.reflection}</p>
                  </div>

                  {/* Gratitude */}
                  {entry.gratitude.length > 0 && (
                    <div>
                      <h4 className="text-white/90 font-medium mb-2 flex items-center space-x-2">
                        <Heart className="w-4 h-4" />
                        <span>Grateful for</span>
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                        {entry.gratitude.map((item, idx) => (
                          <div key={idx} className="bg-white/5 rounded-lg p-2">
                            <p className="text-white/70 text-sm">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Wins and Challenges */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entry.wins.length > 0 && (
                      <div>
                        <h4 className="text-white/90 font-medium mb-2 flex items-center space-x-2">
                          <TrendingUp className="w-4 h-4" />
                          <span>Wins</span>
                        </h4>
                        <div className="space-y-1">
                          {entry.wins.map((win, idx) => (
                            <p key={idx} className="text-green-400 text-sm">• {win}</p>
                          ))}
                        </div>
                      </div>
                    )}

                    {entry.challenges.length > 0 && (
                      <div>
                        <h4 className="text-white/90 font-medium mb-2">Challenges</h4>
                        <div className="space-y-1">
                          {entry.challenges.map((challenge, idx) => (
                            <p key={idx} className="text-orange-400 text-sm">• {challenge}</p>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Tomorrow's Goals */}
                  {entry.tomorrowGoals.length > 0 && (
                    <div>
                      <h4 className="text-white/90 font-medium mb-2 flex items-center space-x-2">
                        <Target className="w-4 h-4" />
                        <span>Tomorrow's Focus</span>
                      </h4>
                      <div className="space-y-1">
                        {entry.tomorrowGoals.map((goal, idx) => (
                          <p key={idx} className="text-blue-400 text-sm">• {goal}</p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {entry.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {entry.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Journal;
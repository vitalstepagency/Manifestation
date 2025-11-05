import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Target, 
  Sparkles, 
  BookOpen, 
  BarChart3,
  Brain
} from 'lucide-react';

const QuickActions = () => {
  const actions = [
    {
      title: 'Add Habit',
      description: 'Create a new habit',
      icon: Plus,
      color: 'from-green-500 to-emerald-500',
      href: '/habits'
    },
    {
      title: 'Set Goal',
      description: 'Define manifestation',
      icon: Sparkles,
      color: 'from-purple-500 to-pink-500',
      href: '/manifestation'
    },
    {
      title: 'Journal',
      description: 'Reflect & plan',
      icon: BookOpen,
      color: 'from-blue-500 to-cyan-500',
      href: '/journal'
    },
    {
      title: 'Analytics',
      description: 'View progress',
      icon: BarChart3,
      color: 'from-orange-500 to-red-500',
      href: '/analytics'
    }
  ];

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
          <p className="text-sm text-white/60">Take action now</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {actions.map((action, index) => {
          const Icon = action.icon;
          
          return (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Link to={action.href}>
                <motion.div
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-200 text-center"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${action.color} mb-3`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="text-sm font-medium text-white mb-1">
                    {action.title}
                  </h4>
                  <p className="text-xs text-white/60">
                    {action.description}
                  </p>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* AI Suggestion */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30"
      >
        <div className="flex items-start space-x-3">
          <Brain className="w-5 h-5 text-purple-300 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-white mb-1">AI Suggestion</h4>
            <p className="text-xs text-white/80">
              Based on your energy level, try completing your most important habit first.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default QuickActions;
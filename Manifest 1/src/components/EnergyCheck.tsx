import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { getEnergyLevels, getEnergyColor } from '../utils/helpers';

interface EnergyCheckProps {
  currentLevel: number | null;
  onLevelChange: (level: number) => void;
}

const EnergyCheck = ({ currentLevel, onLevelChange }: EnergyCheckProps) => {
  const energyLevels = getEnergyLevels();

  return (
    <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${
          currentLevel ? getEnergyColor(currentLevel) : 'from-gray-500 to-gray-600'
        }`}>
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Energy Check</h3>
          <p className="text-sm text-white/60">How are you feeling right now?</p>
        </div>
      </div>

      <div className="space-y-3">
        {energyLevels.map((energy) => (
          <motion.button
            key={energy.level}
            onClick={() => onLevelChange(energy.level)}
            className={`w-full p-4 rounded-xl border transition-all duration-200 ${
              currentLevel === energy.level
                ? `bg-gradient-to-r ${getEnergyColor(energy.level)} border-white/30 text-white`
                : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{energy.emoji}</span>
                <div className="text-left">
                  <div className="font-medium">{energy.label} Energy</div>
                  <div className="text-sm opacity-80">
                    {energy.level === 1 && 'Take it easy today'}
                    {energy.level === 2 && 'Steady progress mode'}
                    {energy.level === 3 && 'Ready for challenges'}
                    {energy.level === 4 && 'Unstoppable force!'}
                  </div>
                </div>
              </div>
              <div className="flex space-x-1">
                {Array.from({ length: 4 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-6 rounded-full ${
                      i < energy.level
                        ? currentLevel === energy.level
                          ? 'bg-white'
                          : 'bg-white/60'
                        : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      {currentLevel && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10"
        >
          <p className="text-sm text-white/80">
            {currentLevel === 1 && "Perfect time for gentle habits and self-care. Listen to your body."}
            {currentLevel === 2 && "Good energy for routine tasks. Maintain your momentum steadily."}
            {currentLevel === 3 && "Great energy! Tackle important habits and push your boundaries."}
            {currentLevel === 4 && "Peak performance mode! This is your time to dominate and achieve."}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default EnergyCheck;
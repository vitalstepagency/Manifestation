import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: number;
  unit: string;
  icon: LucideIcon;
  color: string;
  trend: string;
}

const StatsCard = ({ title, value, unit, icon: Icon, color, trend }: StatsCardProps) => {
  return (
    <motion.div
      className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-6 hover:bg-white/10 transition-all duration-300"
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="text-right">
          <div className="flex items-baseline space-x-1">
            <span className="text-3xl font-bold text-white">{value}</span>
            <span className="text-sm text-white/60">{unit}</span>
          </div>
        </div>
      </div>
      
      <div>
        <h3 className="text-white/90 font-medium mb-1">{title}</h3>
        <p className="text-sm text-white/60">{trend}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;
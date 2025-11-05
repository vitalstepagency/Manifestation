import { motion } from 'framer-motion';

const FloatingOrbs = () => {
  const orbs = [
    {
      id: 1,
      size: 'w-96 h-96',
      color: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
      position: 'top-0 left-0',
      delay: 0
    },
    {
      id: 2,
      size: 'w-80 h-80',
      color: 'bg-gradient-to-r from-blue-500/15 to-cyan-500/15',
      position: 'top-1/4 right-0',
      delay: 2
    },
    {
      id: 3,
      size: 'w-64 h-64',
      color: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
      position: 'bottom-0 left-1/4',
      delay: 4
    },
    {
      id: 4,
      size: 'w-72 h-72',
      color: 'bg-gradient-to-r from-orange-500/15 to-red-500/15',
      position: 'bottom-1/4 right-1/4',
      delay: 1
    },
    {
      id: 5,
      size: 'w-56 h-56',
      color: 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20',
      position: 'top-1/2 left-1/2',
      delay: 3
    }
  ];

  const floatingAnimation = {
    y: [-20, 20, -20],
    x: [-10, 10, -10],
    scale: [1, 1.1, 1],
    rotate: [0, 5, -5, 0]
  };

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {orbs.map((orb) => (
        <motion.div
          key={orb.id}
          className={`absolute ${orb.size} ${orb.color} ${orb.position} rounded-full blur-3xl`}
          animate={floatingAnimation}
          transition={{
            duration: 8 + orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
            delay: orb.delay
          }}
          style={{
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Additional ambient light effects */}
      <motion.div
        className="absolute top-1/3 left-1/3 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [1, 1.2, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      <motion.div
        className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-white/3 rounded-full blur-xl"
        animate={{
          opacity: [0.2, 0.5, 0.2],
          scale: [1, 1.3, 1]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
      />
    </div>
  );
};

export default FloatingOrbs;
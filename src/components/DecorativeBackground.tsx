import { motion } from 'motion/react';
import { Icons } from '../icons';

export const DecorativeBackground = () => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      <motion.div 
        className="absolute top-[15%] left-[10%] text-tertiary opacity-40"
        animate={{ y: [0, -20, 0], rotate: [15, 20, 15] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icons.Heart size={64} fill="currentColor" />
      </motion.div>
      
      <motion.div 
        className="absolute top-[20%] right-[15%] text-secondary opacity-30"
        animate={{ y: [0, -25, 0], rotate: [-10, -5, -10] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        <Icons.Sparkles size={72} fill="currentColor" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[20%] left-[15%] text-primary-container opacity-50"
        animate={{ y: [0, -15, 0], rotate: [20, 25, 20] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      >
        <Icons.Star size={48} fill="currentColor" />
      </motion.div>
      
      <motion.div 
        className="absolute bottom-[10%] right-[10%] text-tertiary-container opacity-40"
        animate={{ y: [0, -20, 0], rotate: [-15, -10, -15] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <Icons.Heart size={60} fill="currentColor" />
      </motion.div>
    </div>
  );
};

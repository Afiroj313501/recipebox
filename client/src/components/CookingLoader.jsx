import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const tips = [
  'Did you know? Salting your pasta water properly makes a bigger difference than the sauce.',
  'Let meat rest a few minutes after cooking — it keeps the juices in.',
  'Toasting spices in a dry pan for 30 seconds wakes up their flavor.',
  'A squeeze of acid (lemon, vinegar) at the end brightens almost any dish.',
  'Room-temperature eggs mix into batters more evenly than cold ones.',
  'Sharper knives are safer — they need less force and slip less.',
];

export default function CookingLoader() {
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((index) => (index + 1) % tips.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <motion.div
        animate={{ rotate: [0, -8, 8, -8, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
        className="text-6xl mb-4"
      >
        🍳
      </motion.div>
      <p className="text-[#1D1D1D] font-medium mb-1">Finding your next meal...</p>

      <div className="h-10 max-w-md">
        <AnimatePresence mode="wait">
          <motion.p
            key={tipIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-gray-500 px-4"
          >
            {tips[tipIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

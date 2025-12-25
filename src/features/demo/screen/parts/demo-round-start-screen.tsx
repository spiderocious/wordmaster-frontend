/**
 * Demo Round Start Screen
 *
 * Quick round start with auto-transition
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDemoContext, DemoGameState } from '../../providers/demo-provider';
import { soundService } from '@shared/services/sound-service';

export function DemoRoundStartScreen() {
  const { setGameState } = useDemoContext();

  useEffect(() => {
    const stopSound = soundService.playRoundStart();

    const timer = setTimeout(() => {
      setGameState(DemoGameState.ROULETTE_SPIN);
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center overflow-hidden">
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/40">
            <span className="text-white font-bold text-lg">Round 1 of 1</span>
          </div>
        </motion.div>

        <motion.h1
          initial={{ scale: 0, y: 100 }}
          animate={{ scale: 1, y: 0 }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 20,
            delay: 0.3,
          }}
          className="text-7xl md:text-8xl font-black text-white mb-8"
        >
          Get Ready!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-white/80 text-xl font-medium"
        >
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Time to choose your letter...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

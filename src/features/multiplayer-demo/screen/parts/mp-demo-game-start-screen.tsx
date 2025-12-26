/**
 * Multiplayer Demo Game Start Screen
 *
 * Quick game start transition
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';

export function MPDemoGameStartScreen() {
  const { setGameState } = useMultiplayerDemoContext();

  useEffect(() => {
    const stopSound = soundService.playRoundStart();

    const timer = setTimeout(() => {
      setGameState(MultiplayerDemoState.ROULETTE);
    }, 2000);

    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 flex items-center justify-center overflow-hidden">
      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-md px-8 py-4 rounded-full border-2 border-white/40">
            <span className="text-white font-bold text-xl">Round 1 of 1</span>
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
          className="text-8xl md:text-9xl font-black text-white mb-8"
        >
          GO!
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="text-white/80 text-2xl font-medium"
        >
          <motion.p
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Choosing your letter...
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

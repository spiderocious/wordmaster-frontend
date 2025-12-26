/**
 * Multiplayer Demo Intro Screen
 *
 * Attention-grabbing intro with multiplayer hook
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaUsers, FaBolt, FaTrophy } from '@icons';

export function MPDemoIntroScreen() {
  const { setGameState } = useMultiplayerDemoContext();

  useEffect(() => {
    const stopSound = soundService.playRoundStart();

    const timer = setTimeout(() => {
      setGameState(MultiplayerDemoState.WAITING_ROOM);
    }, 4000);

    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-3 h-3 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 0.8, 0],
          }}
          transition={{
            duration: 2.5,
            delay: i * 0.15,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}

      {/* Main content */}
      <div className="text-center z-10 px-4 max-w-4xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
            duration: 1,
          }}
        >
          <motion.h1
            className="text-7xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl"
            animate={{
              textShadow: [
                '0 0 30px rgba(255,255,255,0.5)',
                '0 0 60px rgba(255,255,255,0.9)',
                '0 0 30px rgba(255,255,255,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Challenge Friends
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 100 }}
          className="text-3xl md:text-4xl font-bold text-white/95 mb-8"
        >
          Battle in Real-Time Multiplayer
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 150 }}
          className="flex flex-wrap justify-center gap-6 text-white/90"
        >
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/30">
            <FaUsers className="text-3xl" />
            <span className="font-bold text-lg">Compete with Friends</span>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/30">
            <FaBolt className="text-3xl" />
            <span className="font-bold text-lg">Lightning Fast</span>
          </div>
          <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full border-2 border-white/30">
            <FaTrophy className="text-3xl" />
            <span className="font-bold text-lg">Win Glory</span>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="text-white/70 text-xl mt-8 font-medium"
        >
          Watch how it works...
        </motion.p>
      </div>
    </div>
  );
}

/**
 * Demo Intro Screen
 *
 * Enticing product launch style intro
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDemoContext, DemoGameState } from '../../providers/demo-provider';
import { soundService } from '@shared/services/sound-service';

export function DemoIntroScreen() {
  const { setGameState } = useDemoContext();

  useEffect(() => {
    const stopSound = soundService.playRoundStart();

    const timer = setTimeout(() => {
      setGameState(DemoGameState.ROUND_START);
    }, 3500);

    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center overflow-hidden relative">
      {/* Animated background elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            opacity: 0,
          }}
          animate={{
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            delay: i * 0.1,
            repeat: Infinity,
            repeatDelay: 1,
          }}
        />
      ))}

      {/* Main content */}
      <div className="text-center z-10 px-4">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 20,
            duration: 1,
          }}
        >
          <motion.h1
            className="text-8xl md:text-9xl font-black text-white mb-4 drop-shadow-2xl"
            animate={{
              textShadow: [
                '0 0 20px rgba(255,255,255,0.5)',
                '0 0 40px rgba(255,255,255,0.8)',
                '0 0 20px rgba(255,255,255,0.5)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            WordShot
          </motion.h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
          className="text-2xl md:text-3xl font-bold text-white/90 mb-8"
        >
          Think Fast. Type Faster.
        </motion.p>

      
      </div>
    </div>
  );
}

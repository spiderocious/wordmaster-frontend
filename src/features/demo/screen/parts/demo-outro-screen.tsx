/**
 * Demo Outro Screen
 *
 * Final call-to-action with enticing animations
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useDemoContext } from '../../providers/demo-provider';
import { soundService } from '@shared/services/sound-service';

export function DemoOutroScreen() {
  const { roundScore } = useDemoContext();

  useEffect(() => {
    soundService.playComplete();
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={500}
        recycle={false}
        gravity={0.3}
      />

      <div className="text-center z-10 px-4 max-w-2xl">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 1,
          }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="mb-8"
          >
            <div className="text-9xl mb-4">🎉</div>
            <h1 className="text-7xl md:text-8xl font-black text-white mb-4 drop-shadow-2xl">
              Amazing!
            </h1>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl p-8 border-2 border-white/40 mb-8"
        >
          <p className="text-white/80 text-sm uppercase tracking-widest mb-2">Demo Score</p>
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <span className="text-7xl font-black text-white">{roundScore}</span>
            <span className="text-3xl font-bold text-white/80 ml-2">PTS</span>
          </motion.div>
          <p className="text-white/70 text-lg mt-4 font-medium">
            100% Accuracy • Perfect Performance
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: 'spring', stiffness: 100 }}
          className="mb-8"
        >
          <p className="text-white text-2xl md:text-3xl font-bold mb-2">
            Can You Beat This Score?
          </p>
          <p className="text-white/80 text-lg">
            Test your vocabulary, speed & creativity!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <a
              className=" text-white hover:bg-gray-100 font-black text-xl px-12 py-4 rounded-full shadow-2xl min-w-[250px]"
            >
              Play Now at https://wordshot.netlify.app
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8"
        >
          <div className="flex items-center justify-center gap-6 text-white/60 text-sm">
            <div className="flex items-center gap-2">
              <span className="text-2xl">⚡</span>
              <span>Fast-Paced</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🧠</span>
              <span>Brain Training</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎯</span>
              <span>Challenge Friends</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

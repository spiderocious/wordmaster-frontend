/**
 * Multiplayer Letter Reveal Screen
 *
 * Dramatic letter reveal with bounce animation (matches single-player design)
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { soundService } from '@shared/services/sound-service';

interface MPLetterRevealScreenProps {
  onComplete: () => void;
}

export function MPLetterRevealScreen({ onComplete }: MPLetterRevealScreenProps) {
  const { room } = useMultiplayer();
  const letter = room?.roundData?.letter || 'A';

  useEffect(() => {
    const stopSound = soundService.playLetterReveal();

    const timer = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearTimeout(timer);
      stopSound();
    };
  }, [onComplete]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-orange-400 via-red-500 to-pink-500 flex items-center justify-center overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        recycle={false}
        gravity={0.3}
      />

      <div className="text-center z-10">
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 12,
            duration: 1.2,
          }}
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative"
          >
            <motion.div
              className="absolute inset-0 rounded-3xl bg-white/30 blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              style={{ width: '400px', height: '500px', margin: '-50px' }}
            />

            <div className="relative w-80 h-96 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center">
              <p className="text-xl text-gray-500 uppercase tracking-widest mb-4 font-bold">
                Your Letter
              </p>
              <motion.div
                className="text-[200px] font-black text-transparent bg-clip-text bg-gradient-to-br from-orange-500 to-pink-600"
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                }}
              >
                {letter}
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring', stiffness: 300 }}
                className="absolute bottom-8 bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-3 rounded-full"
              >
                <p className="text-white text-lg font-black uppercase tracking-wide">
                  Let's Go!
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, type: 'spring' }}
          className="text-white text-2xl font-bold mt-8"
        >
          Think of words starting with {letter}!
        </motion.p>
      </div>
    </div>
  );
}

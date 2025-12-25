/**
 * Demo Roulette Screen
 *
 * Fast roulette spin with auto-transition
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useDemoContext, DemoGameState } from '../../providers/demo-provider';
import { soundService } from '@shared/services/sound-service';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function DemoRouletteScreen() {
  const { setGameState, letter } = useDemoContext();
  const [isSpinning, setIsSpinning] = useState(true);

  const targetIndex = ALPHABET.indexOf(letter.toUpperCase());

  useEffect(() => {
    const stopSound = soundService.playLetterSpin();

    const spinTimer = setTimeout(() => {
      setIsSpinning(false);
    }, 2000);

    const transitionTimer = setTimeout(() => {
      setGameState(DemoGameState.LETTER_REVEAL);
    }, 3000);

    return () => {
      clearTimeout(spinTimer);
      clearTimeout(transitionTimer);
      stopSound();
    };
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={150}
        recycle={true}
        gravity={0.25}
      />

      <div className="text-center z-10 w-full max-w-md">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-8 inline-flex items-center gap-2 bg-indigo-100 border-2 border-indigo-300 px-4 py-2 rounded-full"
        >
          <motion.div
            animate={isSpinning ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="w-3 h-3 bg-indigo-600 rounded-full"
          />
          <span className="text-indigo-900 font-bold text-sm uppercase tracking-wide">
            {isSpinning ? 'Spinning...' : 'Letter Selected!'}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black text-black drop-shadow-lg mb-2">
            Your Letter Is...
          </h1>
        </motion.div>

        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            delay: 0.4,
            type: 'spring',
            stiffness: 200,
            damping: 15,
          }}
          className="relative my-8"
        >
          <motion.div
            animate={isSpinning ? { y: [0, 5, 0] } : { y: 0 }}
            transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
            className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-pink-500 drop-shadow-lg" />
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full -mt-1" />
          </motion.div>

          <div className="relative w-80 h-80 mx-auto">
            <motion.div
              animate={
                isSpinning
                  ? {
                      scale: [1, 1.05, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: isSpinning ? Infinity : 0,
                ease: 'easeInOut',
              }}
              className="absolute inset-0 rounded-full bg-pink-400/40 blur-2xl"
            />

            <motion.div
              animate={{
                rotate: isSpinning ? [0, 360] : targetIndex * (360 / ALPHABET.length) + 360 * 5,
              }}
              transition={
                isSpinning
                  ? {
                      duration: 0.5,
                      repeat: Infinity,
                      ease: 'linear',
                    }
                  : {
                      duration: 1.5,
                      type: 'spring',
                      stiffness: 50,
                      damping: 15,
                    }
              }
              className="absolute inset-0"
            >
              <div className="absolute inset-0 rounded-full border-8 border-pink-500 shadow-2xl overflow-hidden">
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full"
                >
                  {ALPHABET.map((char, index) => {
                    const angle = (360 / ALPHABET.length) * index;
                    const isEven = index % 2 === 0;
                    return (
                      <g key={char}>
                        <path
                          d={`M 50 50 L ${50 + 50 * Math.cos((angle - 90) * (Math.PI / 180))} ${
                            50 + 50 * Math.sin((angle - 90) * (Math.PI / 180))
                          } A 50 50 0 0 1 ${
                            50 + 50 * Math.cos((angle + 360 / ALPHABET.length - 90) * (Math.PI / 180))
                          } ${
                            50 + 50 * Math.sin((angle + 360 / ALPHABET.length - 90) * (Math.PI / 180))
                          } Z`}
                          fill={isEven ? '#4C1D95' : '#2D1B4E'}
                          stroke="#1F1028"
                          strokeWidth="0.5"
                        />
                        <text
                          x="50"
                          y="50"
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${angle + 360 / ALPHABET.length / 2} 50 50) translate(0 -35)`}
                          fill="white"
                          fontSize="6"
                          fontWeight="bold"
                          fontFamily="sans-serif"
                        >
                          {char}
                        </text>
                      </g>
                    );
                  })}
                </svg>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-700 to-purple-900 border-4 border-indigo-500 flex items-center justify-center shadow-lg">
                    <motion.div
                      animate={isSpinning ? { rotate: 360 } : {}}
                      transition={{
                        duration: 2,
                        repeat: isSpinning ? Infinity : 0,
                        ease: 'linear',
                      }}
                      className="text-indigo-300 text-2xl"
                    >
                      ✨
                    </motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

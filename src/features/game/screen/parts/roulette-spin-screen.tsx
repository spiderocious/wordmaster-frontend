/**
 * Roulette Spin Screen
 *
 * Animated roulette wheel that spins for 3 seconds and reveals the selected letter
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../../providers/game-provider';
import { GameState } from '../../constants/game-state';
import Confetti from 'react-confetti';
import { PageTransition } from '@shared/ui/components/page-transition';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
const BASE_SPIN_DURATION = 3000; // 3 seconds base
const FAST_SPIN_REDUCTION = 500; // Reduce by 500ms per click

export function RouletteSpinScreen() {
  const gameContext = useGameContext();
  const [isSpinning, setIsSpinning] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [clickCount, setClickCount] = useState(0);
  const [spinDuration, setSpinDuration] = useState(BASE_SPIN_DURATION);

  // Get the target letter from the current round
  const currentRound = gameContext.rounds[gameContext.currentRoundIndex];
  const targetLetter = currentRound?.letter || 'A';
  const targetIndex = ALPHABET.indexOf(targetLetter.toUpperCase());

  // Handle screen clicks to speed up spin
  function handleClick() {
    if (isSpinning) {
      setClickCount((prev) => prev + 1);
      const newDuration = Math.max(500, spinDuration - FAST_SPIN_REDUCTION);
      setSpinDuration(newDuration);
    }
  }

  useEffect(() => {
    // Calculate final rotation to land on target letter
    const degreesPerLetter = 360 / ALPHABET.length;
    const targetRotation = 360 * 5 + (targetIndex * degreesPerLetter); // 5 full spins + target position

    // Stop spinning and show target letter after duration
    const stopTimer = setTimeout(() => {
      setIsSpinning(false);
      setRotation(targetRotation);

      // Transition to letter reveal screen after brief pause
      setTimeout(() => {
        gameContext.setGameState(GameState.LETTER_REVEAL);
      }, 1000);
    }, spinDuration);

    return () => {
      clearTimeout(stopTimer);
    };
  }, [targetIndex, spinDuration, gameContext]);

  return (
    <PageTransition direction="right" className="h-screen w-full">
      <div
        onClick={handleClick}
        className="h-screen w-full bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100 flex flex-col items-center justify-center px-4 overflow-hidden relative cursor-pointer"
      >
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={150}
          recycle={true}
          gravity={0.25}
        />

        <div className="text-center z-10 w-full max-w-md">
          {/* Status Badge */}
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
              Spinning in Progress
            </span>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
            className="mb-2"
          >
            <h1 className="text-5xl font-black text-white drop-shadow-lg mb-2">
              Next Letter Is...
            </h1>
            <p className="text-indigo-200 text-sm font-medium">
              Get ready to think fast!
            </p>
          </motion.div>

          {/* Roulette Wheel */}
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
            {/* Pointer at top */}
            <motion.div
              animate={isSpinning ? { y: [0, 5, 0] } : { y: 0 }}
              transition={{ duration: 0.3, repeat: isSpinning ? Infinity : 0 }}
              className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-20"
            >
              <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-pink-500 drop-shadow-lg" />
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-pink-500 rounded-full -mt-1" />
            </motion.div>

            {/* Wheel container */}
            <div className="relative w-80 h-80 mx-auto">
              {/* Outer glow */}
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

              {/* Spinning wheel */}
              <motion.div
                animate={{
                  rotate: isSpinning ? [0, 360] : rotation,
                }}
                transition={
                  isSpinning
                    ? {
                        duration: 0.8,
                        repeat: Infinity,
                        ease: 'linear',
                      }
                    : {
                        duration: 1,
                        type: 'spring',
                        stiffness: 50,
                        damping: 15,
                      }
                }
                className="absolute inset-0"
              >
                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-8 border-pink-500 shadow-2xl overflow-hidden">
                  {/* Wheel segments */}
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 w-full h-full"
                  >
                    {ALPHABET.map((letter, index) => {
                      const angle = (360 / ALPHABET.length) * index;
                      const isEven = index % 2 === 0;
                      return (
                        <g key={letter}>
                          {/* Segment path */}
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
                          {/* Letter text */}
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
                            {letter}
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* Center circle */}
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

          {/* Click to spin faster instruction */}
          <AnimatePresence>
            {isSpinning && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.8 }}
                className="mt-4"
              >
                <motion.p
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                  className="text-indigo-700 text-sm font-semibold bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full inline-block shadow-md"
                >
                  👆 Click anywhere to spin faster!
                </motion.p>
                {clickCount > 0 && (
                  <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="text-pink-600 text-xs font-bold mt-2"
                  >
                    🚀 Speed boost: {clickCount}x
                  </motion.p>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status message */}
          <motion.div
            animate={isSpinning ? { opacity: [0.7, 1, 0.7] } : { opacity: 1 }}
            transition={
              isSpinning
                ? {
                    duration: 1.2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }
                : {}
            }
            className="mt-6"
          >
            <p className="text-indigo-900 text-base font-bold">
              {isSpinning ? 'Spinning...' : 'Letter Selected!'}
            </p>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

/**
 * Letter Reveal Screen
 *
 * Shows the selected letter in a large card with animation
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../providers/game-provider';
import { GameState } from '../../constants/game-state';
import Confetti from 'react-confetti';
import { PageTransition } from '@shared/ui/components/page-transition';

export function LetterRevealScreen() {
  const gameContext = useGameContext();

  // Get the current round's letter
  const currentRound = gameContext.rounds[gameContext.currentRoundIndex];
  const selectedLetter = currentRound?.letter || 'A';

  // Auto-transition to answering state after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      gameContext.setGameState(GameState.ANSWERING);
    }, 3000);

    return () => clearTimeout(timer);
  }, [gameContext]);

  return (
    <PageTransition direction="left" className="h-screen w-full">
      <div className="h-screen w-full bg-gradient-to-b from-purple-600 to-pink-600 flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={150}
        recycle={true}
        gravity={0.3}
      />

      <div className="text-center z-10">
        {/* Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <p className="text-purple-100 text-lg font-medium">
            Get ready! Your letter is...
          </p>
        </motion.div>

        {/* Letter card */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.3,
          }}
          className="relative"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 bg-white/30 rounded-3xl blur-2xl scale-110" />

          {/* Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl p-12 w-64 h-64 flex items-center justify-center">
            {/* Letter */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-pink-600"
            >
              {selectedLetter.toUpperCase()}
            </motion.div>

            {/* Decorative corner elements */}
            <div className="absolute top-4 left-4 w-8 h-8 border-l-4 border-t-4 border-purple-300 rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-8 h-8 border-r-4 border-t-4 border-purple-300 rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-8 h-8 border-l-4 border-b-4 border-purple-300 rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-8 h-8 border-r-4 border-b-4 border-purple-300 rounded-br-lg" />
          </div>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="mt-8"
        >
          <p className="text-white text-base font-semibold mb-1">
            Words starting with "{selectedLetter.toUpperCase()}"
          </p>
          <p className="text-purple-100 text-sm">
            Think fast! Categories coming up...
          </p>
        </motion.div>

        {/* Animated dots to indicate loading */}
        <motion.div
          className="flex gap-2 justify-center mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-white"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </motion.div>
      </div>
    </div>
    </PageTransition>
  );
}

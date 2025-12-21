/**
 * Round Start Screen
 *
 * Displays round number and progress before transitioning to roulette spin
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../providers/game-provider';
import { GameState } from '../../constants/game-state';
import Confetti from 'react-confetti';
import { PageTransition } from '@shared/ui/components/page-transition';

export function RoundStartScreen() {
  const gameContext = useGameContext();
  const currentRound = gameContext.currentRoundIndex + 1;
  const totalRounds = gameContext.totalRounds;

  // Auto-transition to roulette spin after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      gameContext.setGameState(GameState.ROULETTE_SPIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, [gameContext]);

  // Calculate progress dots
  const progressDots = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <PageTransition direction="up" className="h-screen w-full">
      <div className="h-screen w-full bg-gray-50 flex flex-col items-center justify-center px-4 overflow-hidden relative">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={150}
          recycle={true}
          gravity={0.3}
        />

        <div className="text-center z-10">
          {/* Round indicator */}
          <motion.div
            className="mb-8"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 10,
              delay: 0.2,
            }}
          >
            <div className="flex items-baseline justify-center gap-3">
              <span className="text-6xl font-black text-gray-900">
                Round
              </span>
              <span className="text-6xl font-black text-blue-600">
                {currentRound}
              </span>
            </div>
            <p className="text-gray-500 text-xl font-medium mt-2">
              of {totalRounds}
            </p>
          </motion.div>

          {/* Progress dots */}
          <motion.div
            className="flex gap-3 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {progressDots.map((round, index) => (
              <motion.div
                key={round}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 15,
                  delay: 0.5 + index * 0.1,
                }}
                className={`w-4 h-4 rounded-full ${
                  round < currentRound
                    ? 'bg-blue-600'
                    : round === currentRound
                    ? 'bg-blue-600'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </motion.div>

          {/* Current score if available */}
          {gameContext.currentScore !== undefined && gameContext.currentScore > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 12,
                delay: 0.8,
              }}
              className="mb-16 bg-white rounded-full shadow-md px-6 py-3 inline-flex items-center gap-2"
            >
              <span className="text-blue-600 text-xl">🏆</span>
              <span className="text-gray-700 font-medium">Score:</span>
              <span className="text-gray-900 font-bold text-lg">
                {gameContext.currentScore.toLocaleString()}
              </span>
            </motion.div>
          )}

        </div>
      </div>
    </PageTransition>
  );
}

/**
 * Multiplayer Demo Answering Screen
 *
 * Clean version matching the actual game - NO gradients, NO emojis
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaClock, FaTrophy, FaCrown } from '@icons';

export function MPDemoAnsweringScreen() {
  const { setGameState, players, letter, categories } = useMultiplayerDemoContext();
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [showScores, setShowScores] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  const currentCategory = categories[currentCategoryIndex];

  useEffect(() => {
    // Play typing sound
    const stopSound = soundService.playAnswering();

    // Countdown timer
    const countdownInterval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    // Show answers with typing animation
    const answerTimer = setTimeout(() => {
      soundService.playSuccess();
      setShowScores(true);
    }, 3000);

    // Move to next category or finish
    const nextTimer = setTimeout(() => {
      if (currentCategoryIndex < categories.length - 1) {
        setCurrentCategoryIndex((prev) => prev + 1);
        setShowScores(false);
        setTimeLeft(30);
      } else {
        setGameState(MultiplayerDemoState.ROUND_RESULTS);
      }
    }, 5000);

    return () => {
      clearInterval(countdownInterval);
      clearTimeout(answerTimer);
      clearTimeout(nextTimer);
      stopSound();
    };
  }, [currentCategoryIndex, setGameState, categories.length]);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col overflow-hidden">
      {/* Header - matches real game */}
      <div className="flex justify-between items-center p-4 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg">
          <span className="text-gray-700 font-semibold text-sm">Letter:</span>
          <span className="text-2xl font-bold text-blue-600">{letter}</span>
        </div>

        <motion.div
          className="flex items-center gap-2 bg-gray-100 px-4 py-2 rounded-lg"
          animate={{ scale: timeLeft <= 10 ? [1, 1.05, 1] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          <FaClock className="text-lg text-gray-600" />
          <span className="text-xl font-bold text-gray-900">{timeLeft}s</span>
        </motion.div>

        <div className="bg-blue-600 px-4 py-2 rounded-lg">
          <span className="text-white font-bold text-sm uppercase">
            {currentCategory}
          </span>
        </div>
      </div>

      {/* Players Grid */}
      <div className="flex-1 flex items-center justify-center gap-6 p-6">
        {players.map((player, index) => {
          const answer = player.answers.find((a) => a.category === currentCategory);

          return (
            <motion.div
              key={player.username}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl shadow-lg p-6 w-72 relative border border-gray-200">
                {/* Player header */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-12 h-12 rounded-full border-2 border-blue-500"
                    />
                    {player.role === 'host' && (
                      <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full w-5 h-5 flex items-center justify-center">
                        <FaCrown className="text-xs text-yellow-900" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{player.username}</h3>
                    <p className="text-xs text-gray-500 uppercase">
                      {player.role === 'host' ? 'Host' : 'Player'}
                    </p>
                  </div>
                </div>

                {/* Answer area */}
                <div className="bg-gray-50 rounded-xl p-4 mb-3 min-h-[100px] flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentCategory}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-center w-full"
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1.8, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-3xl font-bold text-gray-900">
                          {answer?.word || ''}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2 }}
                        className="mt-2 text-sm text-gray-600 font-medium"
                      >
                        {answer?.timeLeft}s left
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Score popup */}
                <AnimatePresence>
                  {showScores && answer && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute -top-3 -right-3 bg-green-500 rounded-full w-20 h-20 flex flex-col items-center justify-center shadow-lg border-4 border-white"
                    >
                      <FaTrophy className="text-white text-base mb-0.5" />
                      <span className="text-white font-bold text-xl">+{answer.score}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Typing indicator */}
                {!showScores && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-2 text-gray-400 text-sm"
                  >
                    <motion.div
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="flex gap-1"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    </motion.div>
                    <span>typing...</span>
                  </motion.div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Category progress */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex gap-2 justify-center">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`px-5 py-2 rounded-lg font-semibold text-sm ${
                idx === currentCategoryIndex
                  ? 'bg-blue-600 text-white'
                  : idx < currentCategoryIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

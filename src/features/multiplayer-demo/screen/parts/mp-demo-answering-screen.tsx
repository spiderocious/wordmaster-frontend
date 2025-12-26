/**
 * Multiplayer Demo Answering Screen
 *
 * Shows both players answering categories simultaneously
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaClock, FaTrophy } from 'react-icons/fa';

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
    <div className="h-screen w-full bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-center p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full">
          <span className="text-white font-bold text-lg">Letter:</span>
          <span className="text-3xl font-black text-white">{letter}</span>
        </div>

        <motion.div
          className="flex items-center gap-3 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full"
          animate={{ scale: timeLeft <= 10 ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5, repeat: timeLeft <= 10 ? Infinity : 0 }}
        >
          <FaClock className="text-2xl text-white" />
          <span className="text-2xl font-black text-white">{timeLeft}s</span>
        </motion.div>

        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 px-6 py-3 rounded-full">
          <span className="text-white font-black text-lg uppercase tracking-wide">
            {currentCategory}
          </span>
        </div>
      </div>

      {/* Annotation */}
      <AnimatePresence>
        {currentCategoryIndex === 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.5 }}
            className="absolute top-24 left-1/2 transform -translate-x-1/2 z-20"
          >
            <div className="bg-white rounded-2xl shadow-2xl px-6 py-4 flex items-center gap-3 border-4 border-yellow-400">
              <div className="text-2xl">⚡</div>
              <p className="text-gray-800 font-bold text-lg">Everyone answers at once!</p>
            </div>
            <div className="w-0 h-0 border-l-[12px] border-r-[12px] border-t-[16px] border-l-transparent border-r-transparent border-t-white mx-auto" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Players Grid */}
      <div className="flex-1 flex items-center justify-center gap-8 p-8">
        {players.map((player, index) => {
          const answer = player.answers.find((a) => a.category === currentCategory);

          return (
            <motion.div
              key={player.username}
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: index * 0.2, type: 'spring', stiffness: 200 }}
              className="relative"
            >
              <div className="bg-white rounded-3xl shadow-2xl p-8 w-80 relative overflow-hidden">
                {/* Player header */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-16 h-16 rounded-full border-4 border-purple-500"
                    />
                    {player.role === 'host' && (
                      <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full w-6 h-6 flex items-center justify-center text-xs">
                        👑
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-gray-800">{player.username}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                      {player.role === 'host' ? 'Host' : 'Player'}
                    </p>
                  </div>
                </div>

                {/* Answer area */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-4 min-h-[120px] flex items-center justify-center">
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
                        transition={{ duration: 2, ease: 'easeOut' }}
                        className="overflow-hidden"
                      >
                        <p className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                          {answer?.word || ''}
                        </p>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2.2 }}
                        className="mt-2 text-sm text-gray-500 font-medium"
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
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      className="absolute -top-4 -right-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full w-24 h-24 flex flex-col items-center justify-center shadow-2xl border-4 border-white"
                    >
                      <FaTrophy className="text-white text-xl mb-1" />
                      <span className="text-white font-black text-2xl">+{answer.score}</span>
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
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
                      <div className="w-2 h-2 bg-purple-500 rounded-full" />
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
      <div className="p-6 bg-black/20 backdrop-blur-sm">
        <div className="flex gap-3 justify-center">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`px-6 py-3 rounded-full font-bold ${
                idx === currentCategoryIndex
                  ? 'bg-white text-purple-600'
                  : idx < currentCategoryIndex
                  ? 'bg-green-500 text-white'
                  : 'bg-white/20 text-white/50'
              }`}
            >
              {cat}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

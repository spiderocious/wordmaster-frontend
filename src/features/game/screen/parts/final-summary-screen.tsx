/**
 * Final Summary Screen
 *
 * Shows complete game statistics, performance breakdown, and highlights
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useGameContext } from '../../providers/game-provider';
import { PageTransition } from '@shared/ui/components/page-transition';
import { gameApi } from '../../api/game-api';
import { GameStats } from '../../types/game-types';
import { Button } from '@ui/components';
import { soundService } from '@shared/services/sound-service';
import {
  FaCheckCircle,
  FaBullseye,
  FaClock,
  FaBolt,
  FaFire,
  FaTrophy,
  FaPaw,
  FaCity,
  FaAppleAlt,
  FaCar,
  FaUser,
  FaBuilding,
  FaPalette,
  FaGlobe,
  FaDollarSign,
  FaVirus,
  FaMobileAlt,
  FaBook,
  FaMusic,
  FaGuitar,
} from '@icons';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  instruments: <FaGuitar />,
  geography: <FaGlobe />,
  animals: <FaPaw />,
  fruits: <FaAppleAlt />,
  'mobile-app': <FaMobileAlt />,
  name: <FaUser />,
  city: <FaCity />,
  car: <FaCar />,
  building: <FaBuilding />,
  color: <FaPalette />,
  country: <FaGlobe />,
  currency: <FaDollarSign />,
  disease: <FaVirus />,
  book: <FaBook />,
  music: <FaMusic />,
};

export function FinalSummaryScreen() {
  const gameContext = useGameContext();
  const navigate = useNavigate();

  const [stats, setStats] = useState<GameStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameDuration, setGameDuration] = useState<string>('0m 0s');

  // Calculate game duration
  useEffect(() => {
    if (gameContext.createdAt) {
      const start = new Date(gameContext.createdAt);
      const end = new Date();
      const durationMs = end.getTime() - start.getTime();
      const minutes = Math.floor(durationMs / 60000);
      const seconds = Math.floor((durationMs % 60000) / 1000);
      setGameDuration(`${minutes}m ${seconds}s`);
    }
  }, [gameContext.createdAt]);

  // Fetch final summary on mount
  useEffect(() => {
    async function fetchFinalSummary() {
      if (gameContext.answers.length === 0) {
        setError('No answers found');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const response = await gameApi.getFinalSummary(gameContext.answers);

        if (response.success && response.data) {
          setStats(response.data.stats);
          soundService.playComplete();
          setIsLoading(false);
        } else {
          setError('Failed to load summary');
          soundService.playError();
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Summary error:', err);
        setError('Failed to load summary. Please try again.');
        setIsLoading(false);
      }
    }

    fetchFinalSummary();
  }, []);

  function handlePlayAgain() {
    soundService.playButtonClick();
    gameContext.startNewGame();
    navigate('/game/start');
  }

  function handleBackToHome() {
    soundService.playButtonClick();
    gameContext.clearGame();
    navigate('/');
  }

  function handleShare() {
    soundService.playButtonClick();
    const shareText = `I scored ${stats?.totalScore.toLocaleString()} points in WordBlitz! 🎉\n${stats?.accuracy}% accuracy | ${stats?.performanceGrade} grade`;

    if (navigator.share) {
      navigator.share({
        title: 'WordBlitz Score',
        text: shareText,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareText);
      alert('Score copied to clipboard!');
    }
  }

  function getCategoryIcon(categoryName: string) {
    return CATEGORY_ICONS[categoryName.toLowerCase()] || <FaPaw />;
  }

  if (isLoading) {
    return (
      <PageTransition direction="up" className="h-screen">
        <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </PageTransition>
    );
  }

  if (error || !stats) {
    return (
      <PageTransition direction="up" className="h-screen">
        <div className="h-screen w-full bg-gray-50 flex items-center justify-center p-4">
          <div className="text-center">
            <p className="text-red-600 text-lg font-semibold mb-4">{error || 'No data available'}</p>
            <Button onClick={handleBackToHome} variant="primary">
              Back to Home
            </Button>
          </div>
        </div>
      </PageTransition>
    );
  }

  const totalQuestions = stats.totalCorrect + stats.totalWrong;

  return (
    <PageTransition direction="up" className="min-h-screen">
      <div className="min-h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">

        {/* Header */}
        <header className="bg-white text-gray-900 px-4 py-4 shadow-md relative z-10">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black"
            >
              Game Complete!
            </motion.h1>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FaClock className="text-gray-500" />
              <span>Duration: {gameDuration}</span>
            </div>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-sm mt-1"
          >
            {stats.performanceMessage}
          </motion.p>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 relative z-10 overflow-y-auto pb-24">
          <div className="w-full max-w-2xl mx-auto space-y-6">
            {/* Final Score Card */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center"
            >
              <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">FINAL SCORE</p>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.2 }}
                className="text-6xl font-black text-blue-600 mb-4"
              >
                {stats.totalScore.toLocaleString()}
              </motion.div>
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-4">POINTS</p>

              {/* 100% Accuracy Badge */}
              {stats.accuracy === 100 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.4 }}
                  className="inline-flex items-center gap-2 bg-green-50 border-2 border-green-500 text-green-700 px-4 py-2 rounded-full font-bold"
                >
                  <FaCheckCircle />
                  <span>100% Accuracy</span>
                </motion.div>
              )}
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-xl p-4 shadow-md text-center"
              >
                <div className="flex items-center justify-center mb-2 text-2xl text-green-600">
                  <FaCheckCircle />
                </div>
                <p className="text-2xl font-black text-gray-900">{stats.totalCorrect}/{totalQuestions}</p>
                <p className="text-xs text-gray-600">Correct Answers</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-xl p-4 shadow-md text-center"
              >
                <div className="flex items-center justify-center mb-2 text-2xl text-blue-600">
                  <FaBullseye />
                </div>
                <p className="text-2xl font-black text-gray-900">{stats.accuracy}%</p>
                <p className="text-xs text-gray-600">Hit Accuracy</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-xl p-4 shadow-md text-center"
              >
                <div className="flex items-center justify-center mb-2 text-2xl text-purple-600">
                  <FaClock />
                </div>
                <p className="text-2xl font-black text-gray-900">{stats.averageTimeTaken.toFixed(1)}s</p>
                <p className="text-xs text-gray-600">Avg Time</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl p-4 shadow-md text-center"
              >
                <div className="flex items-center justify-center mb-2 text-2xl text-orange-600">
                  <FaBolt />
                </div>
                <p className="text-2xl font-black text-gray-900">{stats.totalSpeedBonus}</p>
                <p className="text-xs text-gray-600">Speed Bonus</p>
              </motion.div>
            </div>

            {/* Longest Streak */}
            {stats.longestStreak > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 rounded-xl p-4 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">
                    <FaFire className="text-orange-500" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Longest Streak: {stats.longestStreak}x</p>
                    <p className="text-sm text-gray-600">You were on fire this round!</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-orange-600 font-black text-lg">+{stats.longestStreak * 10} Bonus Pts</p>
                </div>
              </motion.div>
            )}

            {/* Highlights */}
            <div>
              <h2 className="text-xl font-black text-gray-900 mb-4">Highlights</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Best Word */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{getCategoryIcon(stats.bestWord.category)}</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Best Word</p>
                      <p className="font-bold text-gray-900 capitalize">{stats.bestWord.category}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-1">{stats.bestWord.score} pts</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{stats.bestWord.word.toUpperCase()}</span>
                  </p>
                  {stats.bestWord.comment && (
                    <p className="text-xs text-blue-600 mt-1">{stats.bestWord.comment}</p>
                  )}
                </motion.div>

                {/* Fastest Answer */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.7 }}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl text-yellow-500">
                      <FaBolt />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Fastest Time</p>
                      <p className="font-bold text-gray-900 capitalize">{stats.fastestAnswer.category}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-1">{stats.fastestAnswer.timeTaken.toFixed(1)}s</p>
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">{stats.fastestAnswer.word.toUpperCase()}</span>
                  </p>
                </motion.div>

                {/* Best Category */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white rounded-xl p-4 shadow-md"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{getCategoryIcon(stats.bestCategory.name)}</div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Best Category</p>
                      <p className="font-bold text-gray-900 capitalize">{stats.bestCategory.name}</p>
                    </div>
                  </div>
                  <p className="text-2xl font-black text-gray-900 mb-1">{stats.bestCategory.averageScore} pts/word</p>
                  <div className="w-full bg-pink-200 rounded-full h-2">
                    <div
                      className="bg-pink-500 h-2 rounded-full"
                      style={{ width: `${stats.bestCategory.accuracy}%` }}
                    />
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Performance by Category */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900">Performance by Category</h2>
              </div>
              <div className="space-y-3">
                {stats.categoryBreakdown.map((category, index) => (
                  <motion.div
                    key={category.category}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    className="bg-white rounded-xl p-4 shadow-md"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">{getCategoryIcon(category.category)}</div>
                        <div>
                          <p className="font-bold text-gray-900 capitalize">{category.category}</p>
                          <p className="text-xs text-gray-500">
                            {category.correctAnswers}/{category.totalAttempts} correct
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-black text-gray-900">{category.totalScore}</p>
                        <p className="text-xs text-gray-500">{category.accuracy}%</p>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          category.accuracy === 100
                            ? 'bg-green-500'
                            : category.accuracy >= 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${category.accuracy}%` }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Performance Grade Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2 }}
              className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 text-center"
            >
              <div className="flex items-center justify-center mb-2 text-4xl text-blue-600">
                <FaTrophy />
              </div>
              <p className="text-sm text-gray-600 uppercase tracking-wide mb-1">Performance Grade</p>
              <p className="text-5xl font-black text-gray-900 mb-2">{stats.performanceGrade}</p>
              <p className="text-gray-600">{stats.performanceMessage}</p>
            </motion.div>
          </div>
        </main>

        {/* Footer Actions - Fixed at bottom */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
          <div className="w-full max-w-2xl mx-auto flex items-center gap-3">
            <Button
              onClick={handleBackToHome}
              variant="secondary"
              className="flex-1 py-3 rounded-xl font-bold"
            >
              Back to Home
            </Button>
            <button
              onClick={handleShare}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors"
            >
              Share
            </button>
            <Button
              onClick={handlePlayAgain}
              variant="primary"
              className="flex-1 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <span className="text-xl">↻</span>
              <span>Play Again</span>
            </Button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

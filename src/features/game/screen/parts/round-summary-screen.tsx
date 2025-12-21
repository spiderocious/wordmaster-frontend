/**
 * Round Summary Screen
 *
 * Shows all answers for the round, validates them via API, and displays scores
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGameContext } from '../../providers/game-provider';
import { GameState } from '../../constants/game-state';
import { PageTransition } from '@shared/ui/components/page-transition';
import { gameApi } from '../../api/game-api';
import { ValidationResult } from '../../types/game-types';
import { Button } from '@ui/components';
import {
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
} from '@icons';

// Category icon mapping
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  animal: <FaPaw />,
  city: <FaCity />,
  fruit: <FaAppleAlt />,
  car: <FaCar />,
  name: <FaUser />,
  building: <FaBuilding />,
  color: <FaPalette />,
  country: <FaGlobe />,
  currency: <FaDollarSign />,
  disease: <FaVirus />,
  'mobile-app': <FaMobileAlt />,
  book: <FaBook />,
  music: <FaMusic />,
};

export function RoundSummaryScreen() {
  const gameContext = useGameContext();
  const currentRound = gameContext.rounds[gameContext.currentRoundIndex];
  const currentRoundNumber = gameContext.currentRoundIndex + 1;
  const selectedLetter = currentRound?.letter || 'A';

  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [roundScore, setRoundScore] = useState(0);

  // Get answers for current round only
  const roundAnswers = gameContext.answers.filter(
    (answer) => answer.letter.toUpperCase() === selectedLetter.toUpperCase()
  );

  // Validate answers on mount
  useEffect(() => {
    async function validateAnswers() {
      if (roundAnswers.length === 0) {
        setIsValidating(false);
        return;
      }

      try {
        setIsValidating(true);
        setError(null);

        const response = await gameApi.validateAnswers(roundAnswers);

        if (response.success && response.data) {
          // Delay to show loading state
          setTimeout(() => {
            setValidationResults(response.data);

            // Calculate total score for this round
            const totalScore = response.data.reduce((sum, result) => sum + result.totalScore, 0);
            setRoundScore(totalScore);

            // Update game context score
            gameContext.setCurrentScore(gameContext.currentScore + totalScore);

            setIsValidating(false);
          }, 1500);
        } else {
          setError('Failed to validate answers');
          setIsValidating(false);
        }
      } catch (err) {
        console.error('Validation error:', err);
        setError('Failed to validate answers. Please try again.');
        setIsValidating(false);
      }
    }

    validateAnswers();
  }, []);

  // Calculate stats
  const correctAnswers = validationResults.filter((r) => r.valid).length;
  const totalAnswers = roundAnswers.length;
  const avgTimeLeft = roundAnswers.reduce((sum, a) => sum + a.timeLeft, 0) / roundAnswers.length;
  const avgTimeSeconds = (avgTimeLeft * (currentRound?.timeLimit || 30)).toFixed(1);

  function handleNextRound() {
    // Move to next round or final summary
    if (gameContext.currentRoundIndex < gameContext.totalRounds - 1) {
      gameContext.setCurrentRoundIndex(gameContext.currentRoundIndex + 1);
      gameContext.setGameState(GameState.ROUND_START);
    } else {
      gameContext.setGameState(GameState.FINAL_SUMMARY);
    }
  }

  function getCategoryIcon(categoryName: string) {
    return CATEGORY_ICONS[categoryName.toLowerCase()] || <FaPaw />;
  }

  return (
    <PageTransition direction="up" className="h-screen">
      <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white text-gray-900 px-4 py-4 shadow-md relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-black text-center"
          >
            Round {currentRoundNumber} Complete
          </motion.h1>
        </header>

        {/* Main Content */}
        <main className="flex-1 px-4 py-6 relative z-10 overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto">
            {/* Letter Card */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-6"
            >
              <div className="w-32 h-40 mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-blue-500">
                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Letter</p>
                <div className="text-6xl font-black text-gray-900">
                  {selectedLetter.toUpperCase()}
                </div>
              </div>
            </motion.div>

            {/* Answers List */}
            <div className="space-y-3 mb-6">
              {roundAnswers.map((answer, index) => {
                const result = validationResults.find(
                  (r) => r.category === answer.category
                );

                return (
                  <motion.div
                    key={`${answer.category}-${index}`}
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`bg-white rounded-xl p-4 shadow-md border-2 ${
                      result?.valid
                        ? 'border-green-500'
                        : result && !result.valid
                        ? 'border-red-500'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Category Icon */}
                      <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl text-gray-700">
                        {getCategoryIcon(answer.category)}
                      </div>

                      {/* Category & Answer */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 capitalize">
                          {answer.category}
                        </h3>
                        <p className="text-gray-600">
                          Answer: <span className="font-semibold">{answer.word}</span>
                          {' • '}
                          <span className="text-xs">
                            {(answer.timeLeft * (currentRound?.timeLimit || 30)).toFixed(1)}s
                          </span>
                        </p>
                        {result && !result.valid && result.possibleAnswers && (
                          <p className="text-xs text-gray-500 mt-1">
                            Suggestion: {result.possibleAnswers.join(', ')}
                          </p>
                        )}
                        {result?.comment && (
                          <p className="text-xs text-blue-600 mt-1 font-medium">
                            {result.comment}
                          </p>
                        )}
                      </div>

                      {/* Score/Loading */}
                      <div className="flex-shrink-0">
                        {isValidating ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full"
                          />
                        ) : result ? (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                            className="text-right"
                          >
                            <div className="flex items-center gap-1">
                              <span
                                className={`text-xl font-black ${
                                  result.valid ? 'text-blue-600' : 'text-red-600'
                                }`}
                              >
                                {result.valid ? '+' : ''}
                                {result.totalScore}
                              </span>
                              <span className="text-sm font-bold text-gray-500">PTS</span>
                              {result.valid ? (
                                <span className="text-green-500 text-xl">✓</span>
                              ) : (
                                <span className="text-red-500 text-xl">✗</span>
                              )}
                            </div>
                          </motion.div>
                        ) : (
                          <span className="text-gray-400 text-sm">No answer</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Error State */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6"
              >
                <p className="text-red-700 text-center font-medium">{error}</p>
              </motion.div>
            )}

            {/* Round Score Summary */}
            {!isValidating && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 mb-6 shadow-lg"
              >
                <p className="text-center text-sm text-gray-600 uppercase tracking-wide mb-2">
                  Round Score
                </p>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.4 }}
                  className="text-center"
                >
                  <span className="text-6xl font-black text-gray-900">{roundScore}</span>
                  <span className="text-2xl font-bold text-blue-600 ml-2">PTS</span>
                </motion.div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-900">
                      {correctAnswers}/{totalAnswers}
                    </p>
                    <p className="text-xs text-gray-600">Correct</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-gray-900">{avgTimeSeconds}s</p>
                    <p className="text-xs text-gray-600">Avg Time</p>
                  </div>
                  <div className="text-center">
                    <p className="text-3xl font-black text-orange-600">
                      {correctAnswers >= 3 ? correctAnswers : 0}x
                    </p>
                    <p className="text-xs text-gray-600">Streak</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Next Round Button */}
            {!isValidating && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button
                  onClick={handleNextRound}
                  variant="primary"
                  size="large"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  <span className="flex items-center justify-center gap-2">
                    {gameContext.currentRoundIndex < gameContext.totalRounds - 1
                      ? 'Next Round'
                      : 'View Final Score'}
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                    </svg>
                  </span>
                </Button>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

/**
 * Demo Round Summary Screen
 *
 * Shows validation results with score animations
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDemoContext, DemoGameState } from '../../providers/demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaPaw, FaCity, FaAppleAlt } from '@icons';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  animal: <FaPaw />,
  city: <FaCity />,
  food: <FaAppleAlt />,
};

export function DemoRoundSummaryScreen() {
  const { setGameState, letter, answers, roundScore } = useDemoContext();

  useEffect(() => {
    soundService.playSuccess();

    const timer = setTimeout(() => {
      setGameState(DemoGameState.OUTRO);
    }, 5000);

    return () => clearTimeout(timer);
  }, [setGameState]);

  const getCategoryIcon = (categoryName: string) => {
    return CATEGORY_ICONS[categoryName.toLowerCase()] || <FaPaw />;
  };

  const totalCategories = answers.length;
  const correctAnswers = answers.length;
  const avgTime = (answers.reduce((sum, a) => sum + (a.timeLeft * 30), 0) / answers.length).toFixed(1);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">
      <header className="bg-white text-gray-900 px-4 py-4 shadow-md relative z-10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-black text-center"
        >
          Round Complete!
        </motion.h1>
      </header>

      <main className="flex-1 px-4 py-6 relative z-10 overflow-y-auto">
        <div className="w-full max-w-2xl mx-auto">
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className="w-32 h-40 mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-blue-500">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Letter</p>
              <div className="text-6xl font-black text-gray-900">
                {letter.toUpperCase()}
              </div>
            </div>
          </motion.div>

          <div className="space-y-3 mb-6">
            {answers.map((answer, index) => (
              <motion.div
                key={`${answer.category}-${index}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-xl p-4 shadow-md border-2 border-green-500"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl text-gray-700">
                    {getCategoryIcon(answer.category)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 capitalize">
                      {answer.categoryDisplayName}
                    </h3>
                    <p className="text-gray-600">
                      Answer: <span className="font-semibold">{answer.word}</span>
                      {' • '}
                      <span className="text-xs">{(answer.timeLeft * 30).toFixed(1)}s</span>
                    </p>
                    {answer.comment && (
                      <p className="text-xs text-blue-600 mt-1 font-medium">
                        {answer.comment}
                      </p>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 15, delay: index * 0.2 + 0.3 }}
                      className="text-right"
                    >
                      <div className="flex items-center gap-1">
                        <span className="text-xl font-black text-blue-600">
                          +{answer.score}
                        </span>
                        <span className="text-sm font-bold text-gray-500">PTS</span>
                        <span className="text-green-500 text-xl">✓</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        <div>{answer.wordScore} base</div>
                        <div className="text-orange-600">+{answer.speedBonus} speed</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 shadow-lg"
          >
            <p className="text-center text-sm text-gray-600 uppercase tracking-wide mb-2">
              Round Score
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 1 }}
              className="text-center"
            >
              <span className="text-6xl font-black text-gray-900">{roundScore}</span>
              <span className="text-2xl font-bold text-blue-600 ml-2">PTS</span>
            </motion.div>

            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">
                  {correctAnswers}/{totalCategories}
                </p>
                <p className="text-xs text-gray-600">Correct</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-gray-900">{avgTime}s</p>
                <p className="text-xs text-gray-600">Avg Time</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-black text-orange-600">
                  {correctAnswers}x
                </p>
                <p className="text-xs text-gray-600">Streak</p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

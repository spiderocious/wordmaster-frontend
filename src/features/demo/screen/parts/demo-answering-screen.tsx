/**
 * Demo Answering Screen
 *
 * Shows auto-typing answers with realistic timing and animations
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDemoContext, DemoGameState } from '../../providers/demo-provider';
import { formatCategoryChallenge } from '@shared/utils/format-category-challenge';
import { soundService } from '@shared/services/sound-service';

export function DemoAnsweringScreen() {
  const { setGameState, letter, answers, currentAnswerIndex, setCurrentAnswerIndex, totalScore, setTotalScore } = useDemoContext();
  const currentAnswer = answers[currentAnswerIndex];
  const timeLimit = 30;

  const [typedText, setTypedText] = useState(letter);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [showScore, setShowScore] = useState(false);

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (timeLeft / timeLimit) * circumference;

  const getTimerColor = () => {
    const percentage = (timeLeft / timeLimit) * 100;
    if (percentage > 50) return '#3B82F6';
    if (percentage > 25) return '#F59E0B';
    return '#EF4444';
  };

  useEffect(() => {
    soundService.playAnswering();

    const targetTimeLeft = currentAnswer.timeLeft * timeLimit;
    const typingDuration = currentAnswer.typingDelay;

    const fullWord = letter + currentAnswer.word.slice(1);
    let charIndex = 1;

    const typeInterval = setInterval(() => {
      if (charIndex < fullWord.length) {
        setTypedText(fullWord.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);

        setTimeout(() => {
          setShowScore(true);
          setTotalScore(totalScore + currentAnswer.score);
          soundService.playSuccess();

          setTimeout(() => {
            if (currentAnswerIndex < answers.length - 1) {
              setCurrentAnswerIndex(currentAnswerIndex + 1);
              setTypedText(letter);
              setShowScore(false);
            } else {
              setTimeout(() => {
                setGameState(DemoGameState.ROUND_SUMMARY);
              }, 1500);
            }
          }, 1500);
        }, 500);
      }
    }, typingDuration / (fullWord.length - 1));

    const timerInterval = setInterval(() => {
      setTimeLeft(prev => {
        const newTime = prev - 0.1;
        if (newTime <= targetTimeLeft) {
          clearInterval(timerInterval);
          return targetTimeLeft;
        }
        return newTime;
      });
    }, 100);

    return () => {
      clearInterval(typeInterval);
      clearInterval(timerInterval);
    };
  }, [currentAnswerIndex]);

  return (
    <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">
      <header className="bg-white text-gray-900 px-4 py-3 flex items-center justify-between shadow-md relative z-10">
        <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
          Round 1/1
        </div>
        <motion.div
          key={`score-${totalScore}`}
          initial={{ scale: 1.5 }}
          animate={{ scale: 1 }}
          className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl shadow-lg"
        >
          <p className="text-xs uppercase tracking-wider opacity-90">Score</p>
          <p className="text-xl font-black">{totalScore}</p>
        </motion.div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6 relative z-10 overflow-y-auto">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnswerIndex}
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: -50 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="mb-6"
            >
              <div className="w-48 h-56 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center relative">
                <div className="text-9xl font-black text-white">
                  {letter.toUpperCase()}
                </div>
                <div className="absolute bottom-4 bg-orange-700 px-3 py-1 rounded-full">
                  <p className="text-white text-xs font-bold uppercase tracking-wide">
                    Revealed
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentAnswerIndex}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center mb-4 min-h-[60px] flex items-center justify-center"
            >
              <h1 className="text-3xl font-black text-gray-900">
                {formatCategoryChallenge(letter, currentAnswer.categoryDisplayName)}
              </h1>
            </motion.div>
          </AnimatePresence>

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke="#E5E7EB"
                  strokeWidth="6"
                  fill="none"
                />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="45"
                  stroke={getTimerColor()}
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{
                    transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s ease',
                  }}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.span
                  className="text-2xl font-black text-gray-900"
                >
                  {Math.ceil(timeLeft)}s
                </motion.span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-4"
          >
            <div className="relative">
              <input
                type="text"
                value={typedText}
                readOnly
                className="w-full bg-gray-800 text-white text-lg px-6 py-4 rounded-2xl border-4 border-blue-500 focus:outline-none uppercase cursor-default"
                style={{ caretColor: 'transparent' }}
              />
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 w-0.5 h-6 bg-white"
              />
            </div>
          </motion.div>

          <AnimatePresence>
            {showScore && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 border-4 border-green-500">
                  <div className="text-center">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="text-6xl mb-2"
                    >
                      ✓
                    </motion.div>
                    <p className="text-green-600 text-xl font-black mb-2">CORRECT!</p>
                    <motion.p
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                      className="text-5xl font-black text-blue-600"
                    >
                      +{currentAnswer.score}
                    </motion.p>
                    <p className="text-gray-500 text-sm mt-2">points</p>
                    {currentAnswer.comment && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-blue-600 text-sm font-medium mt-2"
                      >
                        {currentAnswer.comment}
                      </motion.p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-center"
          >
            <p className="text-gray-500 text-sm">
              Category {currentAnswerIndex + 1} of {answers.length}
            </p>
            <div className="flex gap-2 justify-center mt-2">
              {answers.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index < currentAnswerIndex
                      ? 'bg-green-500'
                      : index === currentAnswerIndex
                      ? 'bg-blue-600 scale-125'
                      : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

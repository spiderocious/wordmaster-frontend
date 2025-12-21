/**
 * Answering Screen
 *
 * Screen where user answers questions for each category with the selected letter
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '../../providers/game-provider';
import { GameState } from '../../constants/game-state';
import { PageTransition } from '@shared/ui/components/page-transition';
import { formatCategoryChallenge } from '@shared/utils/format-category-challenge';
import { FaArrowLeft } from '@icons';
import { Button } from '@ui/components';

export function AnsweringScreen() {
  const gameContext = useGameContext();
  const currentRound = gameContext.rounds[gameContext.currentRoundIndex];
  const currentRoundNumber = gameContext.currentRoundIndex + 1;
  const selectedLetter = currentRound?.letter || 'A';
  const categories = currentRound?.categories || [];

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, string>>({});
  const [categoryTimesLeft, setCategoryTimesLeft] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentCategory = categories[currentCategoryIndex];
  const currentTimeLimit = currentCategory?.timeLimit || 30;

  // Initialize timeLeft with the first category's time limit
  const [timeLeft, setTimeLeft] = useState(currentTimeLimit);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (timeLeft / currentTimeLimit) * circumference;

  // Get timer color based on time remaining
  const getTimerColor = () => {
    const percentage = (timeLeft / currentTimeLimit) * 100;
    if (percentage > 50) return '#3B82F6'; // blue
    if (percentage > 25) return '#F59E0B'; // yellow/orange
    return '#EF4444'; // red
  };

  // Initialize on mount - set up first category
  useEffect(() => {
    if (currentCategory) {
      setTimeLeft(currentCategory.timeLimit);
      setAnswer(selectedLetter.toUpperCase());
    }
  }, []); // Run only once on mount

  // Typewriter effect for challenge text
  useEffect(() => {
    if (!currentCategory) return;

    const fullText = formatCategoryChallenge(selectedLetter, currentCategory.displayName);
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    const typingInterval = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, typingSpeed);

    return () => clearInterval(typingInterval);
  }, [currentCategoryIndex, selectedLetter, currentCategory]);

  // Reset answer and timer when category changes and pre-fill with letter
  useEffect(() => {
    setAnswer(selectedLetter.toUpperCase());
    // Reset timer to current category's time limit
    if (currentCategory) {
      setTimeLeft(currentCategory.timeLimit);
    }
    // Auto-focus input after category change
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentCategoryIndex, selectedLetter, currentCategory]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitAll();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  function handleSubmit() {
    if (!currentCategory) return;

    // Extract answer without the pre-filled letter
    const actualAnswer = answer.slice(1).trim();

    // Save answer for current category (even if empty)
    const fullAnswer = actualAnswer ? selectedLetter.toUpperCase() + actualAnswer : '';
    setCategoryAnswers((prev) => ({
      ...prev,
      [currentCategory.name]: fullAnswer,
    }));

    // Save time left for this category as a decimal (0-1)
    const timeLeftDecimal = timeLeft / currentTimeLimit;
    setCategoryTimesLeft((prev) => ({
      ...prev,
      [currentCategory.name]: timeLeftDecimal,
    }));

    // Move to next category or submit all
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else {
      handleSubmitAll();
    }
  }

  function handleSubmitAll() {
    setIsSubmitting(true);

    // Save current answer before submitting all
    const actualAnswer = answer.slice(1).trim();
    const fullAnswer = actualAnswer ? selectedLetter.toUpperCase() + actualAnswer : '';
    const currentTimeLeftDecimal = timeLeft / currentTimeLimit;

    const finalAnswers = { ...categoryAnswers };
    const finalTimesLeft = { ...categoryTimesLeft };

    if (currentCategory) {
      finalAnswers[currentCategory.name] = fullAnswer;
      finalTimesLeft[currentCategory.name] = currentTimeLeftDecimal;
    }

    // Save ALL categories to context, including unanswered ones (empty string)
    categories.forEach((category) => {
      const word = finalAnswers[category.name] || ''; // Empty string if not answered
      const timeLeftDecimal = finalTimesLeft[category.name] || 0; // 0 if no time tracked

      gameContext.addAnswer({
        letter: selectedLetter,
        word,
        category: category.name,
        timeLeft: timeLeftDecimal,
      });
    });

    // Transition to round summary
    setTimeout(() => {
      gameContext.setGameState(GameState.ROUND_SUMMARY);
    }, 500);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleBack() {
    window.history.back();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    // Ensure the letter is always at the start
    if (value.length === 0 || !value.toUpperCase().startsWith(selectedLetter.toUpperCase())) {
      setAnswer(selectedLetter.toUpperCase());
    } else {
      setAnswer(value.toUpperCase());
    }
  }

  if (!currentCategory) {
    return null;
  }

  return (
    <PageTransition direction="left" className="h-screen">
      <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white text-gray-900 px-4 py-3 flex items-center justify-between shadow-md relative z-10">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-gray-900 hover:text-gray-700 transition-colors"
          >
            <FaArrowLeft className="text-lg" />
            <span className="text-sm font-medium">Exit Game</span>
          </button>

          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Round {currentRoundNumber}/{gameContext.totalRounds}
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-6 relative z-10 overflow-y-auto">
          <div className="w-full max-w-xl">
            {/* Score Display - Enhanced with animations */}
            <motion.div
              key={`score-${gameContext.currentScore}`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="absolute top-4 right-4"
            >
              <motion.div
                animate={{
                  y: [0, -5, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-5 py-3 rounded-2xl shadow-xl"
              >
                <p className="text-xs uppercase tracking-wider mb-1 opacity-90">Score</p>
                <motion.p
                  key={gameContext.currentScore}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                  className="text-2xl font-black"
                >
                  {gameContext.currentScore.toLocaleString()}
                </motion.p>
              </motion.div>
            </motion.div>

            {/* Letter Card - with category bounce animation */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategoryIndex}
                initial={{ scale: 0.8, opacity: 0, y: 50 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.8, opacity: 0, y: -50 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="mb-6"
              >
                <div className="w-48 h-56 mx-auto bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-2xl flex flex-col items-center justify-center relative">
                  <div className="text-9xl font-black text-white">
                    {selectedLetter.toUpperCase()}
                  </div>
                  <div className="absolute bottom-4 bg-orange-700 px-3 py-1 rounded-full">
                    <p className="text-white text-xs font-bold uppercase tracking-wide">
                      Revealed
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Challenge Text with Typewriter Effect */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentCategoryIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mb-4 min-h-[60px] flex items-center justify-center"
              >
                <h1 className="text-3xl font-black text-gray-900">
                  {displayedText}
                  {isTyping && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-1 h-8 bg-gray-900 ml-1"
                    />
                  )}
                </h1>
              </motion.div>
            </AnimatePresence>

            {/* Timer with color change */}
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
                      transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.span
                    key={timeLeft}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-2xl font-black text-gray-900"
                  >
                    {timeLeft}s
                  </motion.span>
                </div>
              </div>
            </motion.div>

            {/* Input Field with pre-filled letter */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-4"
            >
              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={answer}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={`${selectedLetter.toUpperCase()}...`}
                  autoFocus
                  autoComplete="off"
                  autoCapitalize="characters"
                  className="w-full bg-gray-800 text-white text-lg px-6 py-4 rounded-2xl border-4 border-blue-500 focus:outline-none focus:border-blue-600 transition-colors placeholder-gray-500 uppercase"
                  style={{ caretColor: 'white' }}
                />
                <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-medium">
                  ENTER
                </span>
              </div>
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                variant="primary"
                size="large"
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
              >
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M5 13l4 4L19 7"></path>
                  </svg>
                  {currentCategoryIndex < categories.length - 1 ? 'Submit / Skip' : 'Submit All'}
                </span>
              </Button>
            </motion.div>

            {/* Category Progress */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 text-center"
            >
              <p className="text-gray-500 text-sm">
                Category {currentCategoryIndex + 1} of {categories.length}
              </p>
              <div className="flex gap-2 justify-center mt-2">
                {categories.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index < currentCategoryIndex
                        ? 'bg-green-500'
                        : index === currentCategoryIndex
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
    </PageTransition>
  );
}

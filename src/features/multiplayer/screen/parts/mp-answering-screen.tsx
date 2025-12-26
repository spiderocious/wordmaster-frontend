/**
 * Multiplayer Answering Screen
 *
 * ONE category at a time with timer per category (matches single-player exactly)
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStopCircle } from '@icons';
import { PageTransition } from '@shared/ui/components/page-transition';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { useWebSocket } from '../../providers/websocket-provider';
import { soundService } from '@shared/services/sound-service';
import { formatCategoryChallenge } from '@shared/utils/format-category-challenge';
import { WSMessageType, AnswerSubmitPayload } from '../../types/multiplayer-types';
import { EndGameConfirmationDialog } from './end-game-confirmation-dialog';

export function MPAnsweringScreen() {
  const { room, currentPlayer, isHost, endGame, error } = useMultiplayer();
  const { sendMessage } = useWebSocket();

  const [showEndGameDialog, setShowEndGameDialog] = useState(false);

  const letter = room?.roundData?.letter || 'A';
  const categories = room?.roundData?.categories || [];

  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [categoryAnswers, setCategoryAnswers] = useState<Record<string, string>>({});
  const [categoryTimesLeft, setCategoryTimesLeft] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const currentCategory = categories[currentCategoryIndex];
  const currentTimeLimit = currentCategory?.timeLimit || 30;

  const [timeLeft, setTimeLeft] = useState(currentTimeLimit);
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (timeLeft / currentTimeLimit) * circumference;

  const getTimerColor = () => {
    const percentage = (timeLeft / currentTimeLimit) * 100;
    if (percentage > 50) return '#3B82F6';
    if (percentage > 25) return '#F59E0B';
    return '#EF4444';
  };

  // Initialize on mount
  useEffect(() => {
    if (currentCategory) {
      setTimeLeft(currentCategory.timeLimit);
      setAnswer(letter.toUpperCase());
      soundService.playAnswering();
    }
  }, []);

  // Typewriter effect for challenge text
  useEffect(() => {
    if (!currentCategory) return;

    const fullText = formatCategoryChallenge(letter, currentCategory.displayName);
    setDisplayedText('');
    setIsTyping(true);

    let currentIndex = 0;
    const typingSpeed = 30;

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
  }, [currentCategoryIndex, letter, currentCategory]);

  // Reset answer and timer when category changes
  useEffect(() => {
    setAnswer(letter.toUpperCase());
    if (currentCategory) {
      setTimeLeft(currentCategory.timeLimit);
    }
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [currentCategoryIndex, letter, currentCategory]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmitAll();
      return;
    }

    if (timeLeft <= 5) {
      soundService.playTick();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Listen for errors after submission
  useEffect(() => {
    if (error && isSubmitting) {
      setSubmitError(error);
      setIsSubmitting(false);
    }
  }, [error, isSubmitting]);

  function handleSubmit() {
    if (!currentCategory) return;

    soundService.playButtonClick();

    // Extract answer without the pre-filled letter
    const actualAnswer = answer.slice(1).trim();
    const fullAnswer = actualAnswer ? letter.toUpperCase() + actualAnswer : '';

    // Save answer and timeLeft for this category
    setCategoryAnswers((prev) => ({
      ...prev,
      [currentCategory.name]: fullAnswer,
    }));

    setCategoryTimesLeft((prev) => ({
      ...prev,
      [currentCategory.name]: timeLeft / currentTimeLimit,
    }));

    // Move to next category or submit all
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else {
      handleSubmitAll();
    }
  }

  function handleSubmitAll() {
    if (!room || !currentPlayer) return;

    setIsSubmitting(true);
    setSubmitError(null);

    // Save current answer before submitting
    const actualAnswer = answer.slice(1).trim();
    const fullAnswer = actualAnswer ? letter.toUpperCase() + actualAnswer : '';

    const finalAnswers = { ...categoryAnswers };
    const finalTimesLeft = { ...categoryTimesLeft };

    if (currentCategory) {
      finalAnswers[currentCategory.name] = fullAnswer;
      finalTimesLeft[currentCategory.name] = timeLeft / currentTimeLimit;
    }

    // Build submission payload with ALL categories
    const submissionData = categories.map((category) => ({
      letter: letter,
      word: finalAnswers[category.name] || '',
      category: category.name,
      timeLeft: finalTimesLeft[category.name] || 0,
    }));

    const payload: AnswerSubmitPayload = {
      roomId: room.roomId,
      username: currentPlayer.username,
      answers: submissionData,
    };

    console.log('[MPAnswering] Submitting answers:', payload);
    sendMessage(WSMessageType.ANSWER_SUBMIT, payload);
    soundService.playSuccess();
  }

  function handleRetry() {
    setIsSubmitting(false);
    setSubmitError(null);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    if (value.length === 0 || !value.toUpperCase().startsWith(letter.toUpperCase())) {
      setAnswer(letter.toUpperCase());
    } else {
      setAnswer(value.toUpperCase());
    }
  }

  function handleEndGame() {
    setShowEndGameDialog(true);
  }

  function handleConfirmEndGame() {
    endGame();
    setShowEndGameDialog(false);
  }

  function handleCancelEndGame() {
    setShowEndGameDialog(false);
  }

  if (!currentCategory) {
    return null;
  }

  return (
    <PageTransition className="h-screen">
      <EndGameConfirmationDialog
        isOpen={showEndGameDialog}
        onConfirm={handleConfirmEndGame}
        onCancel={handleCancelEndGame}
      />
      <div className="h-screen w-full bg-gray-50 flex flex-col relative overflow-hidden">
        {/* Header */}
        <header className="bg-white text-gray-900 px-4 py-3 flex items-center justify-between shadow-md relative z-10">
          <div className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
            Round {room?.currentRound || 1}/{room?.totalRounds || 1}
          </div>
          {isHost && (
            <button
              onClick={handleEndGame}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <FaStopCircle />
              End
            </button>
          )}
          <motion.div
            key={`score-${currentPlayer?.currentScore}`}
            initial={{ scale: 1.5 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white px-4 py-2 rounded-xl shadow-lg"
          >
            <p className="text-xs uppercase tracking-wider opacity-90">Score</p>
            <p className="text-xl font-black">{currentPlayer?.currentScore || 0}</p>
          </motion.div>
        </header>

        {/* Main Content */}
        <main className="flex-1 flex items-center justify-center px-4 py-6 relative z-10 overflow-y-auto">
          <div className="w-full max-w-xl">
            {/* Letter Card */}
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

            {/* Challenge Text with Typewriter */}
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

            {/* Timer */}
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

            {/* Input Field */}
            {!isSubmitting ? (
              <>
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
                      placeholder={`${letter.toUpperCase()}...`}
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
                  <button
                    onClick={handleSubmit}
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 active:scale-95"
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
                  </button>
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
                        className={`w-2 h-2 rounded-full transition-all ${index < currentCategoryIndex
                            ? 'bg-green-500'
                            : index === currentCategoryIndex
                              ? 'bg-blue-600 scale-125'
                              : 'bg-gray-300'
                          }`}
                      />
                    ))}
                  </div>
                </motion.div>
              </>
            ) : submitError ? (
              <motion.div
                className="w-full bg-red-100 border-2 border-red-500 rounded-2xl p-6 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="mb-4">
                  <p className="text-xl font-bold text-red-900 mb-2">Submission Failed</p>
                  <p className="text-red-700 text-sm">{submitError}</p>
                </div>
                <button
                  onClick={handleRetry}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  Retry Submission
                </button>
              </motion.div>
            ) : (
              <motion.div
                className="w-full bg-green-100 border-2 border-green-500 rounded-2xl p-6 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <p className="text-xl font-bold text-green-900 mb-2">Submitted!</p>
                <p className="text-green-700">Waiting for other players...</p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-6 h-6 border-3 border-green-600 border-t-transparent rounded-full"
                  />
                </div>
              </motion.div>
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
}

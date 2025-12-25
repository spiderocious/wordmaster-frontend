/**
 * Multiplayer Answering Screen
 *
 * Players answer questions with live submission tracking
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCheck, FaClock } from '@icons';
import { PageTransition } from '@shared/ui/components/page-transition';
import { TextInput } from '@ui/components';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { soundService } from '@shared/services/sound-service';

export function MPAnsweringScreen() {
  const { room } = useMultiplayer();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(30);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const letter = 'A'; // TODO: Get from room/WebSocket event
  const categories = room?.config.supportedCategories.slice(0, 5) || [];
  const playerCount = room?.players.length || 0;
  const submittedCount = 0; // TODO: Track from WebSocket events

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function handleAnswerChange(category: string, value: string) {
    setAnswers((prev) => ({
      ...prev,
      [category]: value,
    }));
  }

  function handleSubmit() {
    if (hasSubmitted) return;

    setHasSubmitted(true);
    soundService.playSuccess();

    // TODO: Emit answer:submit WebSocket event
    const submissionData = categories.map((category) => ({
      category,
      word: answers[category] || '',
      timeLeft: timeLeft / 30,
    }));

    console.log('Submitting answers:', submissionData);
  }

  return (
    <PageTransition className="min-h-screen">
      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header with timer */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                <span className="text-4xl font-black text-white">{letter}</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900">Round {room?.currentRound || 1}</h1>
                <p className="text-gray-600 text-sm">Fill in the answers</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                timeLeft > 10 ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <FaClock className={timeLeft > 10 ? 'text-green-600' : 'text-red-600'} />
                <span className={`font-bold text-lg ${
                  timeLeft > 10 ? 'text-green-900' : 'text-red-900'
                }`}>
                  {timeLeft}s
                </span>
              </div>

              <div className="bg-blue-100 px-4 py-2 rounded-xl">
                <span className="text-blue-900 font-semibold text-sm">
                  {submittedCount}/{playerCount} submitted
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answering area */}
        <div className="flex-1 px-6 py-8">
          <div className="max-w-2xl mx-auto space-y-4">
            {categories.map((category, index) => (
              <motion.div
                key={category}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200"
              >
                <label className="block text-sm font-semibold text-gray-700 mb-3 capitalize">
                  {category}
                </label>
                <div className="flex gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-xl font-black text-blue-600">{letter}</span>
                  </div>
                  <TextInput
                    value={answers[category] || ''}
                    onChange={(e) => handleAnswerChange(category, e.target.value)}
                    placeholder={`Enter ${category} starting with ${letter}...`}
                    disabled={hasSubmitted}
                    className="flex-1"
                    autoFocus={index === 0}
                  />
                </div>
              </motion.div>
            ))}

            {/* Submit button */}
            {!hasSubmitted ? (
              <motion.button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Submit Answers
              </motion.button>
            ) : (
              <motion.div
                className="w-full bg-green-100 border-2 border-green-500 rounded-2xl p-6 text-center"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
              >
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FaCheck className="text-2xl text-green-600" />
                  <span className="text-xl font-bold text-green-900">Submitted!</span>
                </div>
                <p className="text-green-700">Waiting for other players...</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

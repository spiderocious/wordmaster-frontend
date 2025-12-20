import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import {
  FiShuffle,
  FaKeyboard,
  FaClock,
  FaTrophy,
  FaUser,
  FaPaw,
  FaMapMarkerAlt,
  FaBuilding,
  FaMobileAlt,
  FaBook,
  FaCar,
  FaCity,
  FaPalette,
  FaGlobe,
  FaDollarSign,
  FaVirus,
  FaUtensils,
  FaLanguage
} from '@icons';
import { ROUTES } from '@shared/constants/routes';
import { Button, Heading, Text } from '@ui/components';

export function HowToPlayScreen() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(15);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleStart();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  function handleStart() {
    //navigate(ROUTES.game.absPath);
  }

  function handleSkip() {
    navigate(ROUTES.game.absPath);
  }

  const progress = ((15 - countdown) / 5) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col relative overflow-hidden">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={1500}
          gravity={0.3}
          onConfettiComplete={() => setShowConfetti(false)}
        />
      )}

      {/* Header */}
      <motion.header
        className="p-6 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <Heading level={2} className="text-center text-gray-900">
          How to Play
        </Heading>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-2xl w-full">
          {/* Countdown Circle */}
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#1371ec"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - progress / 100)}`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-primary">{countdown}</span>
              </div>
            </div>
            <Text className="text-gray-600">Starting in {countdown}...</Text>
          </motion.div>

          {/* Get Ready Section */}
          <motion.div
            className="text-center mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Heading level={1} className="mb-3">
              Get Ready!
            </Heading>
            <Text className="text-gray-600">Here's how it works</Text>
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="space-y-4 mb-12"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Step 1 */}
            <motion.div
              className="bg-white p-6 shadow-md flex items-start gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-primary text-white flex items-center justify-center font-bold text-lg">
                1
              </div>
              <div className="flex-shrink-0 text-primary text-3xl">
                <FiShuffle />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Random Letter</h3>
                <Text className="text-gray-600">You'll get a random letter for each round</Text>
              </div>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="bg-white p-6 shadow-md flex items-start gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-purple-600 text-white flex items-center justify-center font-bold text-lg">
                2
              </div>
              <div className="flex-shrink-0 text-purple-600 text-3xl">
                <FaKeyboard />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Category Answer</h3>
                <Text className="text-gray-600">Type a word that fits the category</Text>
              </div>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="bg-white p-6 shadow-md flex items-start gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-orange-600 text-white flex items-center justify-center font-bold text-lg">
                3
              </div>
              <div className="flex-shrink-0 text-orange-600 text-3xl">
                <FaClock />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Beat the Clock</h3>
                <Text className="text-gray-600">You have 30 seconds to answer</Text>
              </div>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              className="bg-white p-6 shadow-md flex items-start gap-4"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-600 text-white flex items-center justify-center font-bold text-lg">
                4
              </div>
              <div className="flex-shrink-0 text-green-600 text-3xl">
                <FaTrophy />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900 mb-1">Earn Points</h3>
                <Text className="text-gray-600">Answer fast to climb the leaderboard</Text>
              </div>
            </motion.div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Text className="text-gray-500 text-sm uppercase tracking-wide mb-4 text-center font-semibold">
              Categories You'll See
            </Text>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaPaw className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Animal</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaMobileAlt className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">App</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaBook className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Bible</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaCar className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Car</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaCity className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">City</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaPalette className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Color</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaBuilding className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Company</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaGlobe className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Country</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaDollarSign className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Currency</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaVirus className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Disease</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaUtensils className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Food</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaLanguage className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Language</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center gap-2 shadow-sm">
                <FaUser className="text-gray-700 text-xl" />
                <span className="font-medium text-gray-800">Name</span>
              </div>
            </div>
          </motion.div>

          {/* Skip Button */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button onClick={handleSkip} variant="primary" size="large" className="min-w-[200px]" fullWidth>
              Skip & Start Now
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

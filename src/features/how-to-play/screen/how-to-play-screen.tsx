import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { PageTransition } from "@shared/ui/components/page-transition";
import {
  FiShuffle,
  FaKeyboard,
  FaClock,
  FaTrophy,
  FaUser,
  FaPaw,
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
  FaLanguage,
  FiArrowLeft,
} from "@icons";
import { ROUTES } from "@shared/constants/routes";
import { Button, Heading, Text } from "@ui/components";

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
    navigate(ROUTES.game.start.absPath);
  }

  function handleSkip() {
    navigate(ROUTES.game.start.absPath);
  }

  function handleBack() {
    navigate(ROUTES.ROOT.absPath)
  }

  const progress = ((15 - countdown) / 15) * 100;

  return (
    <PageTransition direction="right" className="h-screen">
      <div className="h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col relative overflow-hidden">
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

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-3 py-4 relative z-10 overflow-y-auto">
        <div className="max-w-2xl w-full">
          <div className="fixed top-4 right-4 z-20">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#E5E7EB"
                  strokeWidth="4"
                  fill="none"
                />
                <circle
                  cx="32"
                  cy="32"
                  r="28"
                  stroke="#1371ec"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 28}`}
                  strokeDashoffset={`${
                    2 * Math.PI * 28 * (1 - progress / 100)
                  }`}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {countdown}
                </span>
              </div>
          </div>
          </div>

          {/* Get Ready Section */}
          <motion.div
            className="text-center mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Heading level={2} className="mb-1 text-xl">
              Instructions
            </Heading>
            <Text className="text-gray-600 text-sm">Here's how it works</Text>
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="space-y-2 mb-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {/* Step 1 */}
            <motion.div
              className="bg-white p-3 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-shrink-0 w-6 h-6 bg-primary text-white flex items-center justify-center font-bold text-xs">
                  1
                </div>
                <div className="flex-shrink-0 text-primary text-lg">
                  <FiShuffle />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">
                  You Get a Random Letter
                </h3>
              </div>
              <p className="text-xs text-gray-600 ml-8">
                The game picks a random letter and category for you
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div
              className="bg-white p-3 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                  2
                </div>
                <div className="flex-shrink-0 text-purple-600 text-lg">
                  <FaKeyboard />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">
                  Type a Word That Fits
                </h3>
              </div>
              <p className="text-xs text-gray-600 ml-8">
                Think of a word in that category starting with that letter
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div
              className="bg-white p-3 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white flex items-center justify-center font-bold text-xs">
                  3
                </div>
                <div className="flex-shrink-0 text-orange-600 text-lg">
                  <FaClock />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">
                  You Have 30 Seconds
                </h3>
              </div>
              <p className="text-xs text-gray-600 ml-8">
                Answer quickly! The faster you type, the higher your score
              </p>
            </motion.div>

            {/* Step 4 */}
            <motion.div
              className="bg-white p-3 shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-shrink-0 w-6 h-6 bg-green-600 text-white flex items-center justify-center font-bold text-xs">
                  4
                </div>
                <div className="flex-shrink-0 text-green-600 text-lg">
                  <FaTrophy />
                </div>
                <h3 className="font-semibold text-sm text-gray-900">
                  Earn Points & Play 5 Rounds
                </h3>
              </div>
              <p className="text-xs text-gray-600 ml-8">
                Complete all 5 rounds and see your final score
              </p>
            </motion.div>
          </motion.div>

          {/* Example Section */}
          <motion.div
            className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 mb-4 border-2 border-blue-200"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Text className="text-gray-700 text-xs font-semibold mb-2 text-center">
              Example Round
            </Text>
            <div className="bg-white p-2 shadow-sm mb-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-gray-600">Category:</span>
                <span className="text-sm font-bold text-gray-900">Animal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">Letter:</span>
                <span className="text-2xl font-bold text-primary">L</span>
              </div>
            </div>
            <div className="bg-green-50 border border-green-200 p-2 mt-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-700 font-medium">Correct answers:</span>
                <span className="text-xs text-green-900">Lion, Leopard, Llama, Lizard</span>
              </div>
            </div>
          </motion.div>

          {/* Categories Section */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="hidden"
          >
            <Text className="text-gray-500 text-xs uppercase tracking-wide mb-2 text-center font-semibold">
              Categories You'll See
            </Text>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaPaw className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Animal</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaMobileAlt className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">App</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaBook className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Bible</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaCar className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Car</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaCity className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">City</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaPalette className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Color</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaBuilding className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Company</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaGlobe className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Country</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaDollarSign className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Currency</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaVirus className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Disease</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaUtensils className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Food</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaLanguage className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Language</span>
              </div>
              <div className="bg-white px-2 py-2 flex items-center gap-1 shadow-sm">
                <FaUser className="text-gray-700 text-sm" />
                <span className="font-medium text-gray-800 text-xs">Name</span>
              </div>
            </div>
          </motion.div>

          {/* Skip Button */}
          <motion.div
            className="text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <Button
              onClick={handleSkip}
              variant="primary"
              size="medium"
              className="w-full"
            >
              Skip & Start Now
              </Button>
              <Button
              onClick={handleBack}
              variant="secondary"
              size="medium"
              className="w-full mt-2"
            >
              <FiArrowLeft /> Back 
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
    </PageTransition>
  );
}

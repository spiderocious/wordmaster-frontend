import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { FaPlay, FaUserCircle, FaQuestionCircle, FaUsers, FaTrophy } from '@icons';
import { ROUTES } from '@shared/constants/routes';
import { Button, Logo, Heading, Text } from '@ui/components';
import { HeroIllustration } from './parts/hero-illustration';
import { soundService } from '../../../shared/services/sound-service';
import { useEffect } from 'react';

/**
 * Entrypoint Screen
 *
 * Gamified landing page for AlphaGame - The Alphabet Category Game
 * Features animations, confetti effects, and exciting visual elements
 */
export function EntrypointScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    soundService.playWelcome();
  }, []);

  function handlePlayAsGuest() {
    navigate(ROUTES.howToPlay.absPath);
    soundService.playButtonClick();
  }

  function handlePlayGuestMultiplayer() {
    //navigate(ROUTES.multiplayer.absPath);
  }

  function handleSignIn() {
    //navigate(ROUTES.auth.absPath);
  }

  function handleHowToPlay() {
    navigate(ROUTES.howToPlay.absPath);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col relative overflow-hidden">

        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={300}
          gravity={0.2}
        />
      

      {/* Floating Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-6xl font-bold opacity-5"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              color: ['#3b82f6', '#8b5cf6', '#ec4899', '#10b981'][i % 4],
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
          >
            {String.fromCharCode(65 + (i % 26))}
          </motion.div>
        ))}
      </div>

      {/* Header with Animation */}
      <motion.header
        className="p-6 relative z-10"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <Logo width={48} height={48} />
          </motion.div>
          <motion.h1
            className="text-3xl font-bold bg-clip-text text-primary"
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            AlphaGame
          </motion.h1>
          <motion.div
            className="ml-auto"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <FaTrophy className="text-3xl text-yellow-500" />
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Hero Illustration */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <HeroIllustration />
          </motion.div>

          {/* Headline with Gradient Animation */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Heading level={1} className="text-6xl mb-4 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Unleash Your Inner{' '}
              </span>
              <motion.span
                className="text-blue-600"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                Wordsmith!
              </motion.span>
            </Heading>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Text className="text-xl mb-12 max-w-xl mx-auto font-medium">
              Challenge your mind, expand your vocabulary, and race against the clock!
            </Text>
          </motion.div>

          {/* Action Buttons with Animations */}
          <motion.div
            className="space-y-4 max-w-md mx-auto"
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            {/* Play as Guest - Primary */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={handlePlayAsGuest}
                variant="primary"
                size="large"
                fullWidth
                className="shadow-2xl"
              >
                <FaPlay className="text-xl" />
                Play
              </Button>
            </motion.div>

            {/* Play Guest Multiplayer - Success Green */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={handlePlayGuestMultiplayer}
                variant="primary"
                size="large"
                fullWidth
                className="shadow-2xl bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hidden"
              >
                <FaUsers className="text-xl" />
                Play Multiplayer
              </Button>
            </motion.div>

            {/* Sign Up / Sign In - Secondary */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 17 }}
            >
              <Button
                onClick={handleSignIn}
                variant="secondary"
                size="large"
                fullWidth
                className="shadow-lg hidden"
              >
                <FaUserCircle className="text-xl" />
                Sign Up / Sign In
              </Button>
            </motion.div>
          </motion.div>

          {/* How to Play Link with Pulse */}
          <motion.button
            onClick={handleHowToPlay}
            className="mt-10 inline-flex items-center gap-2 text-gray-700 hover:text-blue-600 font-semibold transition-colors px-6 py-3 rounded-full hover:bg-white hover:shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(59, 130, 246, 0)',
                '0 0 0 10px rgba(59, 130, 246, 0)',
                '0 0 0 0 rgba(59, 130, 246, 0)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          >
            <FaQuestionCircle className="text-xl" />
            How to Play
          </motion.button>
        </div>
      </main>

      {/* Footer */}
      <motion.footer
        className="py-6 text-center text-sm text-gray-600 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
      >
        © 2024 AlphaGame. All rights reserved.
      </motion.footer>
    </div>
  );
}

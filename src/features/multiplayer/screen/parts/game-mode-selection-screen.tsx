/**
 * Game Mode Selection Screen
 *
 * Allows users to choose between hosting a game or joining an existing one
 */

import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaTrophy, FaDoorOpen } from '@icons';
import { ROUTES } from '@shared/constants/routes';
import { PageTransition } from '@shared/ui/components/page-transition';
import { UsernameModal } from '@shared/ui/components/username-modal';
import { soundService } from '@shared/services/sound-service';
import { useUsernameGuard } from '@shared/hooks/use-username-guard';
import { useState } from 'react';
import { STORAGE_KEYS } from '../../providers/multiplayer-provider';

export function GameModeSelectionScreen() {
  const navigate = useNavigate();
  const { showModal, checkAndPrompt, closeModal, saveUsername } = useUsernameGuard();
  const [action, setAction] = useState<'host' | 'join' | null>(null);

  function handleHostGame() {
    sessionStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
    soundService.playButtonClick();

    const hasUsername = checkAndPrompt();
    if (hasUsername) {
      navigate(ROUTES.multiplayer.host.absPath);
    }
    setAction('host');
  }

  function handleJoinGame() {
    soundService.playButtonClick();

    const hasUsername = checkAndPrompt();
    if (hasUsername) {
      navigate(ROUTES.multiplayer.joinWaiting.absPath);
    }
    setAction('join');
  }

  function handleUsernameSubmit(username: string) {
    saveUsername(username);
    if (action === 'host') {
      handleHostGame();
    } else if (action === 'join') {
      handleJoinGame();
    }
  }

  return (
    <PageTransition direction="up" className="min-h-screen">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 20,
          }}
        >
          <h1 className="text-5xl font-black text-gray-900 mb-3">
            Multiplayer
          </h1>
          <p className="text-gray-500 text-lg font-medium">
            Choose your game mode
          </p>
        </motion.div>

        {/* Mode Cards Container */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl w-full">
          {/* Host a Game Card */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
              delay: 0.2,
            }}
            whileHover={{ y: -8 }}
          >
            <div className="bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full -mr-16 -mt-16 opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-50 rounded-full -ml-12 -mb-12 opacity-50" />

              {/* Icon */}
              <motion.div
                className="mb-6 relative z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <div className="w-20 h-20 bg-yellow-100 rounded-2xl flex items-center justify-center">
                  <FaTrophy className="text-5xl text-yellow-600" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  Host a Game
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Create a new room and invite friends to join
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    Set game rules
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    Control when to start
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    Room code provided
                  </li>
                </ul>
              </div>

              {/* Button */}
              <motion.button
                onClick={handleHostGame}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-colors relative z-10 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Host Game
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          </motion.div>

          {/* Join a Game Card */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: 'spring',
              stiffness: 150,
              damping: 15,
              delay: 0.3,
            }}
            whileHover={{ y: -8 }}
          >
            <div className="bg-white rounded-3xl shadow-lg p-8 h-full flex flex-col relative overflow-hidden border-2 border-blue-100">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-full -mr-16 -mt-16 opacity-50" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-50 rounded-full -ml-12 -mb-12 opacity-50" />

              {/* Icon */}
              <motion.div
                className="mb-6 relative z-10"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, -5, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: 0.5,
                }}
              >
                <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center">
                  <FaDoorOpen className="text-5xl text-blue-600" />
                </div>
              </motion.div>

              {/* Content */}
              <div className="flex-1 relative z-10">
                <h2 className="text-3xl font-black text-gray-900 mb-3">
                  Join a Game
                </h2>
                <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                  Enter a 6-digit code to join your friend's game
                </p>

                {/* Features List */}
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    Quick join
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    Play with friends
                  </li>
                  <li className="flex items-center gap-2 text-gray-700">
                    <span className="text-blue-600 font-bold">•</span>
                    No setup needed
                  </li>
                </ul>
              </div>

              {/* Button */}
              <motion.button
                onClick={handleJoinGame}
                className="w-full bg-white hover:bg-blue-50 text-blue-600 border-2 border-blue-600 font-bold text-lg py-4 rounded-2xl shadow-lg transition-colors relative z-10 flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Join Game
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  →
                </motion.span>
              </motion.button>
            </div>
          </motion.div>
        </div>

        {/* Footer Note */}
        <motion.div
          className="mt-12 flex items-center gap-2 text-gray-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <span className="text-yellow-500 text-xl">⚠</span>
          <p className="text-sm font-medium">
            Need 2–4 players to start a game
          </p>
        </motion.div>
      </div>

      {/* Username Modal */}
      <UsernameModal
        isOpen={showModal}
        onSubmit={handleUsernameSubmit}
        onClose={closeModal}
      />
    </PageTransition>
  );
}

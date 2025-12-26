/**
 * Game Starting Countdown Screen
 *
 * Shows 3-2-1 countdown with player avatars before game starts
 * Matches design exactly
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PageTransition } from '@shared/ui/components/page-transition';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { soundService } from '@shared/services/sound-service';
import { FaUsers, FaCircle, FaClock } from '@icons';

export function GameStartingCountdown() {
  const { room } = useMultiplayer();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    soundService.playRoundStart();

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          console.log('[GameStartingCountdown] Countdown finished, waiting for round:started from server');
          return 0;
        }
        soundService.playTick();
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Debug: Log room phase changes
  useEffect(() => {
    console.log('[GameStartingCountdown] Current room phase:', room?.phase);
  }, [room?.phase]);

  if (!room) return null;

  const totalRounds = room.config.roundsCount;
  const categoriesCount = room.config.supportedCategories.length;

  return (
    <PageTransition className="h-screen">
      <div className="h-screen w-full bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col items-center justify-center px-4 relative overflow-hidden">

        {/* Animated background circles */}
        <motion.div
          className="absolute top-10 left-10 w-32 h-32 bg-blue-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200 rounded-full opacity-20"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        {/* Main content */}
        <div className="text-center z-10 max-w-2xl w-full">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
              Get Ready!
            </h1>
            <p className="text-gray-600 text-lg">First round begins soon...</p>
          </motion.div>

          {/* Countdown Number */}
          <AnimatePresence mode="wait">
            {countdown > 0 && (
              <motion.div
                key={countdown}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className="my-12"
              >
                <div className="relative inline-block">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-blue-400 rounded-full blur-3xl opacity-30 scale-110" />

                  {/* Number circle */}
                  <div className="relative w-48 h-48 bg-white rounded-full shadow-2xl flex items-center justify-center border-8 border-blue-500">
                    <span className="text-9xl font-black text-blue-600">
                      {countdown}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playing with section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <p className="text-blue-600 text-sm font-bold uppercase tracking-wide mb-4">
              Playing with
            </p>
            <div className="flex justify-center items-center gap-4 flex-wrap">
              {room.players.map((player, index) => (
                <motion.div
                  key={player.username}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.4 + index * 0.1,
                    type: 'spring',
                    stiffness: 200,
                  }}
                  className="flex flex-col items-center gap-2 bg-white rounded-2xl px-4 py-3 shadow-md"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 border-2 border-blue-200">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.username} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xl">
                        {player.username[0].toUpperCase()}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-gray-900">
                    {player.username}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Game info cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex justify-center gap-4 flex-wrap"
          >
            {/* Rounds */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <FaCircle className="text-red-500" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-gray-900">{totalRounds}</p>
                <p className="text-xs text-gray-600">Rounds</p>
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FaUsers className="text-blue-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-gray-900">{categoriesCount}</p>
                <p className="text-xs text-gray-600">Categories</p>
              </div>
            </div>

            {/* Time per answer */}
            <div className="bg-white rounded-2xl px-6 py-4 shadow-md flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <FaClock className="text-orange-600" />
              </div>
              <div className="text-left">
                <p className="text-2xl font-black text-gray-900">30s</p>
                <p className="text-xs text-gray-600">per answer</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}

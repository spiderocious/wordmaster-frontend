/**
 * Multiplayer Demo Waiting Room Screen
 *
 * Shows waiting room with animated features and annotations
 */

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaUsers, FaCopy, FaComments, FaCog, FaPlay, FaCrown, FaCheckCircle } from '@icons';

interface Annotation {
  id: string;
  position: { x: string; y: string };
  text: string;
  icon: React.ReactNode;
  delay: number;
}

const annotations: Annotation[] = [
  {
    id: 'room-code',
    position: { x: '50%', y: '15%' },
    text: 'Share room code instantly',
    icon: <FaCopy className="text-blue-500" />,
    delay: 1000,
  },
  {
    id: 'players',
    position: { x: '20%', y: '40%' },
    text: 'See who joined',
    icon: <FaUsers className="text-green-500" />,
    delay: 2500,
  },
  {
    id: 'settings',
    position: { x: '50%', y: '60%' },
    text: 'Customize game settings',
    icon: <FaCog className="text-purple-500" />,
    delay: 4000,
  },
  {
    id: 'chat',
    position: { x: '80%', y: '40%' },
    text: 'Chat while waiting',
    icon: <FaComments className="text-pink-500" />,
    delay: 5500,
  },
];

export function MPDemoWaitingRoomScreen() {
  const { setGameState, roomCode, players } = useMultiplayerDemoContext();
  const [visibleAnnotations, setVisibleAnnotations] = useState<string[]>([]);
  const [chatMessages, setChatMessages] = useState<Array<{ user: string; text: string }>>([]);

  useEffect(() => {
    soundService.playSuccess();

    // Show annotations progressively
    annotations.forEach((annotation) => {
      setTimeout(() => {
        setVisibleAnnotations((prev) => [...prev, annotation.id]);
      }, annotation.delay);
    });

    // Simulate chat messages
    setTimeout(() => {
      setChatMessages([{ user: 'Jordan', text: 'Ready to play!' }]);
    }, 3000);

    setTimeout(() => {
      setChatMessages((prev) => [...prev, { user: 'Alex', text: "Let's do this! 🔥" }]);
    }, 4500);

    const timer = setTimeout(() => {
      setGameState(MultiplayerDemoState.GAME_START);
    }, 7500);

    return () => clearTimeout(timer);
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center overflow-hidden relative">
      {/* Annotations */}
      <AnimatePresence>
        {annotations.map((annotation) =>
          visibleAnnotations.includes(annotation.id) ? (
            <motion.div
              key={annotation.id}
              initial={{ opacity: 0, scale: 0, x: '-50%' }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="absolute bg-white rounded-2xl shadow-2xl p-4 border-2 border-blue-500 z-50 pointer-events-none"
              style={{ left: annotation.position.x, top: annotation.position.y, transform: 'translateX(-50%)' }}
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{annotation.icon}</div>
                <p className="font-black text-gray-900 text-sm whitespace-nowrap">{annotation.text}</p>
              </div>
              {/* Arrow pointing down */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-blue-500" />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Waiting Room UI */}
      <div className="w-full max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 text-white">
            <div className="text-center">
              <p className="text-sm uppercase tracking-wide opacity-90 mb-1">Room Code</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: 'spring' }}
                className="text-4xl font-black tracking-widest"
              >
                {roomCode}
              </motion.div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-3 gap-6 p-6">
            {/* Players Section */}
            <div className="col-span-1">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <FaUsers className="text-blue-500" />
                Players ({players.length}/8)
              </h3>
              <div className="space-y-3">
                {players.map((player, index) => (
                  <motion.div
                    key={player.username}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.3 }}
                    className={`p-3 rounded-xl ${
                      player.role === 'host'
                        ? 'bg-yellow-50 border-2 border-yellow-400'
                        : 'bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-sm">{player.username}</p>
                          {player.role === 'host' && (
                            <FaCrown className="text-yellow-600 text-xs" />
                          )}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <FaCheckCircle />
                          <span>Ready</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Settings Section */}
            <div className="col-span-1">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <FaCog className="text-purple-500" />
                Settings
              </h3>
              <div className="space-y-3">
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">Rounds</p>
                  <p className="text-2xl font-black text-gray-900">1</p>
                </div>
                <div className="bg-purple-50 p-3 rounded-xl border border-purple-200">
                  <p className="text-xs text-gray-600 mb-1">Categories</p>
                  <p className="text-lg font-bold text-gray-900">Animal, City</p>
                </div>
              </div>
            </div>

            {/* Chat Section */}
            <div className="col-span-1">
              <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2">
                <FaComments className="text-pink-500" />
                Chat
              </h3>
              <div className="bg-gray-50 rounded-xl p-3 h-40 overflow-y-auto space-y-2">
                <AnimatePresence>
                  {chatMessages.map((msg, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white p-2 rounded-lg shadow-sm"
                    >
                      <p className="text-xs font-bold text-blue-600">{msg.user}</p>
                      <p className="text-sm text-gray-800">{msg.text}</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Start Button */}
          <div className="px-6 pb-6">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 6, type: 'spring' }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl py-4 text-center shadow-lg"
            >
              <div className="flex items-center justify-center gap-3">
                <FaPlay className="text-2xl" />
                <span className="text-xl font-black">Starting Game...</span>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/**
 * Multiplayer Demo Outro Screen
 *
 * Final conversion screen with strong call-to-action
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useMultiplayerDemoContext } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaUsers, FaBolt, FaTrophy, FaGamepad } from 'react-icons/fa';

export function MPDemoOutroScreen() {
  const { players } = useMultiplayerDemoContext();

  useEffect(() => {
    soundService.playComplete();
  }, []);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        recycle={true}
        gravity={0.2}
      />

      <div className="text-center z-10 px-4 max-w-4xl">
        {/* Main hook */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 1,
          }}
          className="mb-8"
        >
          <motion.div
            animate={{
              y: [0, -15, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <div className="text-8xl mb-6">🎮</div>
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl leading-tight">
              Your Turn to
              <br />
              <span className="text-yellow-300">Dominate!</span>
            </h1>
          </motion.div>
        </motion.div>

        {/* Value props */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-10"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <FaUsers />, text: 'Multiplayer' },
              { icon: <FaBolt />, text: 'Real-Time' },
              { icon: <FaTrophy />, text: 'Compete' },
              { icon: <FaGamepad />, text: 'Instant Play' },
            ].map((feature, idx) => (
              <motion.div
                key={feature.text}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 + idx * 0.1, type: 'spring', stiffness: 200 }}
                className="bg-white/20 backdrop-blur-md rounded-2xl p-4 border-2 border-white/40"
              >
                <div className="text-4xl mb-2 text-white">{feature.icon}</div>
                <p className="text-white font-bold text-sm">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
          className="bg-white/20 backdrop-blur-md rounded-3xl p-6 border-2 border-white/40 mb-10"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="flex -space-x-2">
              {players.map((player) => (
                <img
                  key={player.username}
                  src={player.avatar}
                  alt={player.username}
                  className="w-12 h-12 rounded-full border-2 border-white"
                />
              ))}
              <div className="w-12 h-12 rounded-full border-2 border-white bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white font-black">
                +10k
              </div>
            </div>
          </div>
          <p className="text-white text-lg font-bold">
            Join thousands playing right now!
          </p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="mt-2"
          >
            <div className="flex items-center justify-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-yellow-300 text-2xl">
                  ⭐
                </span>
              ))}
            </div>
            <p className="text-white/80 text-sm mt-1">Rated 5/5 by players</p>
          </motion.div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, type: 'spring', stiffness: 100 }}
        >
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              boxShadow: [
                '0 0 0 0 rgba(255, 255, 255, 0.7)',
                '0 0 0 20px rgba(255, 255, 255, 0)',
                '0 0 0 0 rgba(255, 255, 255, 0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block mb-6"
          >
            <motion.button
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-purple-600 font-black text-3xl px-16 py-6 rounded-full shadow-2xl hover:shadow-3xl transition-shadow"
            >
              PLAY NOW FREE
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <p className="text-white text-xl font-bold mb-2">
              wordshot.netlify.app
            </p>
            <p className="text-white/70 text-sm">
              No download • No signup • Instant play
            </p>
          </motion.div>
        </motion.div>

        {/* Urgency element */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="mt-8"
        >
          <motion.div
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-flex items-center gap-2 bg-red-500 text-white px-6 py-3 rounded-full font-bold"
          >
            <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span>1,247 players online now</span>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

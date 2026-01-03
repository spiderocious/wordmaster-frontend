/**
 * Hero Section - Main landing hero
 */

import { motion } from 'framer-motion';

interface HeroSectionProps {
  onPlayNowClick: () => void;
  onPlayMultiplayerClick: () => void;
}

export function HeroSection({ onPlayNowClick, onPlayMultiplayerClick }: HeroSectionProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-block bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-6"
        >
          Play Now on Web
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6"
        >
          Think Fast. <span className="text-blue-600">Word Hard.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
        >
          The addictive social word game where you race against the clock. Pick a letter, name a
          category, and beat your friends.
        </motion.p>

        <div className="flex flex-col md:flex-row justify-center gap-2">
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={onPlayNowClick}
            className="bg-primary hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg cursor-pointer"
          >
            Play Now
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onClick={onPlayMultiplayerClick}
            className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors shadow-lg"
          >
            Play Multiplayer
          </motion.button>
        </div>
      </div>
    </section>
  );
}

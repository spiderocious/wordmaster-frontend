/**
 * Multiplayer Demo Round Results Screen
 *
 * Shows final scores and winner announcement
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaTrophy, FaMedal } from 'react-icons/fa';

export function MPDemoRoundResultsScreen() {
  const { setGameState, players } = useMultiplayerDemoContext();

  // Sort players by score (descending)
  const sortedPlayers = [...players].sort((a, b) => b.totalScore - a.totalScore);
  const winner = sortedPlayers[0];

  useEffect(() => {
    soundService.playComplete();

    const timer = setTimeout(() => {
      setGameState(MultiplayerDemoState.OUTRO);
    }, 6000);

    return () => {
      clearTimeout(timer);
    };
  }, [setGameState]);

  return (
    <div className="h-screen w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 flex items-center justify-center overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={400}
        recycle={false}
        gravity={0.3}
      />

      <div className="text-center z-10 px-4 max-w-5xl w-full">
        {/* Winner announcement */}
        <motion.div
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 1,
          }}
          className="mb-12"
        >
          <motion.div
            animate={{
              y: [0, -20, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <FaTrophy className="text-8xl text-yellow-300 mx-auto mb-4 drop-shadow-2xl" />
            <h1 className="text-6xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">
              {winner.username} Wins!
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl text-white/90 font-bold"
            >
              Victory by {winner.totalScore - sortedPlayers[1].totalScore} points!
            </motion.p>
          </motion.div>
        </motion.div>

        {/* Players comparison */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch mb-8">
          {sortedPlayers.map((player, index) => {
            const isWinner = index === 0;

            return (
              <motion.div
                key={player.username}
                initial={{ opacity: 0, scale: 0.8, y: 100 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.8 + index * 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className={`relative ${isWinner ? 'md:scale-110 z-10' : 'md:scale-95'}`}
              >
                <div
                  className={`bg-white rounded-3xl shadow-2xl p-8 w-80 relative overflow-hidden ${
                    isWinner ? 'border-4 border-yellow-400' : ''
                  }`}
                >
                  {/* Rank badge */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2 + index * 0.2, type: 'spring' }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-black ${
                        isWinner
                          ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white'
                          : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-700'
                      }`}
                    >
                      {index === 0 ? '🥇' : '🥈'}
                    </motion.div>
                  </div>

                  {/* Player info */}
                  <div className="flex flex-col items-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + index * 0.2, type: 'spring', stiffness: 300 }}
                      className="relative mb-4"
                    >
                      <img
                        src={player.avatar}
                        alt={player.username}
                        className={`w-24 h-24 rounded-full ${
                          isWinner ? 'border-4 border-yellow-400' : 'border-4 border-gray-300'
                        }`}
                      />
                      {player.role === 'host' && (
                        <div className="absolute -top-2 -right-2 bg-yellow-500 rounded-full w-8 h-8 flex items-center justify-center">
                          👑
                        </div>
                      )}
                    </motion.div>

                    <h3 className="text-3xl font-black text-gray-800 mb-1">{player.username}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-4">
                      {player.role === 'host' ? 'Host' : 'Player'}
                    </p>

                    {/* Total score */}
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 + index * 0.2, type: 'spring', stiffness: 300 }}
                      className={`rounded-2xl p-4 w-full ${
                        isWinner
                          ? 'bg-gradient-to-br from-yellow-50 to-orange-50'
                          : 'bg-gray-50'
                      }`}
                    >
                      <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                        Total Score
                      </p>
                      <motion.div
                        animate={isWinner ? { scale: [1, 1.1, 1] } : {}}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex items-baseline justify-center gap-2"
                      >
                        <span
                          className={`text-5xl font-black ${
                            isWinner
                              ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-orange-500'
                              : 'text-gray-700'
                          }`}
                        >
                          {player.totalScore}
                        </span>
                        <span className="text-xl font-bold text-gray-500">PTS</span>
                      </motion.div>
                    </motion.div>
                  </div>

                  {/* Category breakdown */}
                  <div className="space-y-2">
                    {player.answers.map((answer, idx) => (
                      <motion.div
                        key={answer.category}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8 + index * 0.2 + idx * 0.1 }}
                        className="flex justify-between items-center bg-purple-50 rounded-xl px-4 py-2"
                      >
                        <div className="flex items-center gap-2">
                          <FaMedal className="text-purple-500" />
                          <span className="font-bold text-gray-700 capitalize">
                            {answer.category}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-black text-purple-600">{answer.word}</span>
                          <span className="text-sm text-gray-500">+{answer.score}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Next round teaser */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5 }}
          className="text-white text-xl font-bold"
        >
          <motion.p
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Ready for your own battle?
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

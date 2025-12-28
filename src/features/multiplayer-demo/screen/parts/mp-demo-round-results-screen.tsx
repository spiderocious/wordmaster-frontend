/**
 * Multiplayer Demo Round Results Screen
 *
 * Clean version matching actual game - NO gradients, NO emojis
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useMultiplayerDemoContext, MultiplayerDemoState } from '../../providers/multiplayer-demo-provider';
import { soundService } from '@shared/services/sound-service';
import { FaTrophy, FaMedal, FaCheck, FaBolt } from '@icons';

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
    <div className="h-screen w-full bg-gray-50 flex items-center justify-center overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={300}
        recycle={false}
        gravity={0.25}
        colors={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6']}
      />

      <div className="text-center z-10 px-4 max-w-5xl w-full">
        {/* Winner announcement */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            duration: 0.8,
          }}
          className="mb-10"
        >
          <div className="inline-block bg-yellow-400 rounded-full p-6 mb-6">
            <FaTrophy className="text-7xl text-yellow-900" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-3">
            {winner.username} Wins!
          </h1>
          <p className="text-xl text-gray-600 font-semibold">
            Victory by {winner.totalScore - sortedPlayers[1].totalScore} points
          </p>
        </motion.div>

        {/* Players comparison */}
        <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch">
          {sortedPlayers.map((player, index) => {
            const isWinner = index === 0;
            const medal = index === 0 ? '1st' : '2nd';
            const medalColor = index === 0 ? 'bg-yellow-400 text-yellow-900' : 'bg-gray-400 text-gray-900';

            return (
              <motion.div
                key={player.username}
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  delay: 0.6 + index * 0.2,
                  type: 'spring',
                  stiffness: 200,
                  damping: 15,
                }}
                className={`relative ${isWinner ? 'md:scale-105' : ''}`}
              >
                <div className="bg-white rounded-2xl shadow-xl p-6 w-80 relative border-2 border-gray-200">
                  {/* Medal badge */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className={`${medalColor} rounded-full w-12 h-12 flex items-center justify-center shadow-lg border-4 border-white`}>
                      <FaMedal className="text-xl" />
                    </div>
                  </div>

                  {/* Player info */}
                  <div className="flex flex-col items-center mt-6 mb-6">
                    <img
                      src={player.avatar}
                      alt={player.username}
                      className="w-20 h-20 rounded-full border-4 border-blue-500 mb-3"
                    />
                    <h3 className="text-2xl font-black text-gray-900">{player.username}</h3>
                    <p className="text-sm text-gray-500 uppercase tracking-wide">{medal} Place</p>
                  </div>

                  {/* Total score */}
                  <div className="bg-blue-50 rounded-xl p-4 mb-4 border border-blue-200">
                    <p className="text-sm text-gray-600 mb-1">Total Score</p>
                    <p className="text-4xl font-black text-blue-600">{player.totalScore}</p>
                  </div>

                  {/* Category breakdown */}
                  <div className="space-y-2">
                    {player.answers.map((answer) => (
                      <div key={answer.category} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-gray-700 capitalize">{answer.category}</span>
                          <div className="flex items-center gap-2">
                            <FaCheck className="text-green-500 text-xs" />
                            <span className="text-sm font-bold text-green-600">+{answer.score}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs text-gray-600 flex-1">"{answer.word}"</p>
                          <div className="flex items-center gap-1">
                            <FaBolt className="text-orange-500 text-xs" />
                            <span className="text-xs text-orange-600">+{answer.speedBonus}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Call to action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="mt-8"
        >
          <p className="text-gray-600 font-semibold">Ready for your own battle?</p>
        </motion.div>
      </div>
    </div>
  );
}

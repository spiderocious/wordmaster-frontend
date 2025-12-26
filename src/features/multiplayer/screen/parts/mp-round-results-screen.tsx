/**
 * Multiplayer Round Results Screen
 *
 * Shows round complete with player's score and leaderboard
 * Matches design exactly from image
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PageTransition } from '@shared/ui/components/page-transition';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { useWebSocket } from '../../providers/websocket-provider';
import { soundService } from '@shared/services/sound-service';
import { FaCheck, FaBolt, FaTrophy } from '@icons';
import {
  WSMessageType,
  RoundResultsPayload,
  RoundResultsSuccessResponse,
  RoundNextPayload,
} from '../../types/multiplayer-types';

interface RoundResultsData {
  letter: string;
  yourScore: number;
  correctAnswers: number;
  totalScore: number;
  avgTime: string;
  leaderboard: Array<{
    username: string;
    score: number;
    scoreChange: string;
    avatar: string;
    rank: number;
  }>;
}

export function MPRoundResultsScreen() {
  const { room, currentPlayer, isHost } = useMultiplayer();
  const { socket, sendMessage } = useWebSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [resultsData, setResultsData] = useState<RoundResultsData | null>(null);

  useEffect(() => {
    soundService.playSuccess();
  }, []);

  // Fetch round results on mount
  useEffect(() => {
    if (!room || !currentPlayer || !socket) return;

    const payload: RoundResultsPayload = {
      roomId: room.roomId,
      username: currentPlayer.username,
    };

    console.log('[MPRoundResults] Requesting round results:', payload);
    sendMessage(WSMessageType.ROUND_RESULTS, payload);

    const handleRoundResults = (response: RoundResultsSuccessResponse) => {
      console.log('[MPRoundResults] Received results:', response);

      if (!response.success) return;

      const { data } = response;
      const currentPlayerData = data.players.find(p => p.username === currentPlayer.username);

      // Calculate stats
      const correctAnswers = currentPlayerData?.answers.filter(a => a.valid).length || 0;
      const totalTime = currentPlayerData?.answers.reduce((sum, a) => sum + (1 - a.timeLeft), 0) || 0;
      const avgTime = currentPlayerData ? `${Math.round((totalTime / currentPlayerData.answers.length) * 30)}s` : '0s';

      // Build leaderboard sorted by total score
      const sortedPlayers = [...data.players].sort((a, b) => b.totalScore - a.totalScore);
      const leaderboard = sortedPlayers.map((player, index) => ({
        username: player.username === currentPlayer.username ? 'You' : player.username,
        score: player.totalScore,
        scoreChange: player.roundScore > 0 ? `+${player.roundScore} pts` : `${player.roundScore} pts`,
        avatar: player.avatar,
        rank: index + 1,
      }));

      setResultsData({
        letter: data.letter,
        yourScore: currentPlayerData?.roundScore || 0,
        correctAnswers,
        totalScore: currentPlayerData?.totalScore || 0,
        avgTime,
        leaderboard,
      });

      setIsLoading(false);
    };

    socket.on(WSMessageType.ROUND_RESULTS_SUCCESS, handleRoundResults);

    return () => {
      socket.off(WSMessageType.ROUND_RESULTS_SUCCESS, handleRoundResults);
    };
  }, [room, currentPlayer, socket, sendMessage]);

  function handleNextRound() {
    if (!room || !currentPlayer || !isHost) return;

    soundService.playButtonClick();

    const payload: RoundNextPayload = {
      roomId: room.roomId,
      username: currentPlayer.username,
    };

    console.log('[MPRoundResults] Host starting next round:', payload);
    sendMessage(WSMessageType.ROUND_NEXT, payload);
  }

  if (!room) return null;

  const currentRound = room.currentRound || 1;
  const totalRounds = room.config.roundsCount;

  if (isLoading || !resultsData) {
    return (
      <PageTransition className="h-screen">
        <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
          />
        </div>
      </PageTransition>
    );
  }

  const yourRank = resultsData.leaderboard.find(p => p.username === 'You')?.rank || 0;

  return (
    <PageTransition className="min-h-screen">
      <div className="min-h-screen w-full bg-gray-50 flex flex-col px-4 py-6">
        <div className="max-w-2xl mx-auto w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <motion.button
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-600 hover:text-gray-900"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              ←
            </motion.button>

            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-black text-gray-900"
            >
              Round {currentRound} Complete
            </motion.h1>

            <div className="bg-gray-100 px-3 py-1 rounded-lg text-xs font-bold">
              Round {currentRound} of {totalRounds}
            </div>
          </div>

          {/* Letter card */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="mb-6"
          >
            <div className="w-24 h-32 mx-auto bg-white rounded-xl shadow-lg flex flex-col items-center justify-center border-4 border-blue-500">
              <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Letter</p>
              <div className="text-5xl font-black text-blue-600">{resultsData.letter}</div>
            </div>
          </motion.div>

          {/* Your Score Card */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl p-6 mb-6 shadow-lg border-4 border-blue-500 relative"
          >
            {/* Rank ribbon - only show if 1st place */}
            {yourRank === 1 && (
              <div className="absolute -top-3 -right-3 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-black uppercase shadow-lg rotate-12">
                1st Place
              </div>
            )}

            <p className="text-center text-sm text-gray-600 uppercase tracking-wide mb-2">
              Your Score
            </p>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 10, delay: 0.3 }}
              className="text-center mb-4"
            >
              <span className="text-6xl font-black text-blue-600">{resultsData.yourScore}</span>
              <span className="text-2xl font-bold text-gray-500 ml-2">PTS</span>
            </motion.div>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaCheck className="text-green-500" />
                  <span className="text-2xl font-black text-gray-900">{resultsData.correctAnswers}</span>
                </div>
                <p className="text-xs text-gray-600">Correct</p>
              </div>

              <div className="bg-white rounded-xl p-3 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <FaBolt className="text-blue-500" />
                  <span className="text-2xl font-black text-gray-900">{resultsData.avgTime}</span>
                </div>
                <p className="text-xs text-gray-600">Avg Time</p>
              </div>
            </div>
          </motion.div>

          {/* Round Leaderboard */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-6"
          >
            <h2 className="text-xl font-black text-gray-900 mb-4">Round Leaderboard</h2>

            <div className="space-y-3">
              {resultsData.leaderboard.map((player, index) => (
                <motion.div
                  key={player.username}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`rounded-2xl p-4 flex items-center gap-4 ${
                    player.username === 'You'
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-white border-2 border-gray-100'
                  }`}
                >
                  {/* Rank */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
                    player.rank === 1
                      ? 'bg-yellow-400 text-yellow-900'
                      : player.rank === 2
                      ? 'bg-gray-300 text-gray-700'
                      : player.rank === 3
                      ? 'bg-orange-300 text-orange-900'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {player.rank}
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                    {player.avatar ? (
                      <img src={player.avatar} alt={player.username} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-xl font-bold">
                        {player.username[0]}
                      </div>
                    )}
                  </div>

                  {/* Name and score change */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{player.username}</h3>
                    <p className={`text-sm font-semibold ${
                      player.scoreChange.startsWith('+')
                        ? 'text-green-600'
                        : player.scoreChange.startsWith('-')
                        ? 'text-red-600'
                        : 'text-gray-500'
                    }`}>
                      {player.scoreChange}
                    </p>
                  </div>

                  {/* Total score */}
                  <div className="text-right">
                    <p className="text-2xl font-black text-gray-900">{player.score}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Current standing */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9 }}
              className="mt-4 bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <FaTrophy className="text-orange-500 text-xl" />
                <span className="text-gray-700 font-semibold">
                  You are currently{' '}
                  <span className="font-black">
                    {yourRank === 1 ? '1st' : yourRank === 2 ? '2nd' : yourRank === 3 ? '3rd' : `${yourRank}th`} overall
                  </span>{' '}
                  with <span className="font-black">{resultsData.totalScore} total pts</span>
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* Next round button - host only */}
          {isHost ? (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              onClick={handleNextRound}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>{currentRound < totalRounds ? 'Start Next Round' : 'View Final Summary'}</span>
            </motion.button>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="w-full bg-gray-100 text-gray-700 font-bold text-lg py-5 rounded-2xl flex items-center justify-center gap-3"
            >
              <span>Waiting for host...</span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-3 border-gray-400 border-t-transparent rounded-full"
              />
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  );
}

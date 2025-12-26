/**
 * Multiplayer Final Summary Screen
 *
 * Shows game over with winner, final leaderboard, and stats
 * Matches design exactly from image
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PageTransition } from '@shared/ui/components/page-transition';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { useWebSocket } from '../../providers/websocket-provider';
import { soundService } from '@shared/services/sound-service';
import { ROUTES } from '@shared/constants/routes';
import { FaTrophy, FaBolt, FaCheckCircle, FaShare, FaRedo } from '@icons';
import {
  WSMessageType,
  GameSummaryPayload,
  GameSummarySuccessResponse,
} from '../../types/multiplayer-types';

interface GameSummaryData {
  winner: {
    username: string;
    score: number;
    accuracy: number;
    streak: number;
    avatar: string;
  };
  leaderboard: Array<{
    rank: number;
    username: string;
    totalWords: number;
    accuracy: number;
    score: number;
    avatar: string;
    isYou?: boolean;
  }>;
  gameStats: {
    fastestAnswer: { time: string; category: string; player: string };
    hardestCategory: { name: string; accuracy: number };
    totalWords: number;
  };
  yourStats: {
    totalScore: number;
    correct: string;
    accuracy: string;
    longestStreak: number;
    avgTime: string;
  };
}

export function MPFinalSummaryScreen() {
  const navigate = useNavigate();
  const { room, currentPlayer, leaveRoom } = useMultiplayer();
  const { socket, sendMessage } = useWebSocket();
  const [isLoading, setIsLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<GameSummaryData | null>(null);

  useEffect(() => {
    soundService.playComplete();
  }, []);

  // Fetch game summary on mount
  useEffect(() => {
    if (!room || !currentPlayer || !socket) return;

    const payload: GameSummaryPayload = {
      roomId: room.roomId,
      username: currentPlayer.username,
    };

    console.log('[MPFinalSummary] Requesting game summary:', payload);
    sendMessage(WSMessageType.GAME_SUMMARY, payload);

    const handleGameSummary = (response: GameSummarySuccessResponse) => {
      console.log('[MPFinalSummary] Received summary:', response);

      if (!response.success) return;

      const { data } = response;
      const currentPlayerData = data.players.find(p => p.username === currentPlayer.username);

      // Build leaderboard sorted by total score
      const sortedPlayers = [...data.players].sort((a, b) => b.totalScore - a.totalScore);
      const leaderboard = sortedPlayers.map((player, index) => ({
        rank: index + 1,
        username: player.username === currentPlayer.username ? `You (${player.username})` : player.username,
        totalWords: player.correctAnswers,
        accuracy: Math.round(player.accuracy * 100),
        score: player.totalScore,
        avatar: player.avatar,
        isYou: player.username === currentPlayer.username,
      }));

      // Game stats
      const gameStats = {
        fastestAnswer: {
          time: `${data.gameStats.fastestAnswer.time.toFixed(1)}s`,
          category: data.gameStats.fastestAnswer.category,
          player: data.gameStats.fastestAnswer.username,
        },
        hardestCategory: {
          name: data.gameStats.hardestCategory.name,
          accuracy: Math.round(data.gameStats.hardestCategory.accuracy * 100),
        },
        totalWords: data.gameStats.totalWords,
      };

      // Your stats
      const yourStats = {
        totalScore: currentPlayerData?.totalScore || 0,
        correct: `${currentPlayerData?.correctAnswers || 0}/${(currentPlayerData?.correctAnswers || 0) + Math.floor((currentPlayerData?.correctAnswers || 0) / 0.85)}`,
        accuracy: `${Math.round((currentPlayerData?.accuracy || 0) * 100)}%`,
        longestStreak: currentPlayerData?.longestStreak || 0,
        avgTime: `${currentPlayerData?.averageTime.toFixed(1)}s`,
      };

      // Winner data
      const winner = {
        username: data.winner.username,
        score: data.winner.score,
        accuracy: Math.round((data.players.find(p => p.username === data.winner.username)?.accuracy || 0) * 100),
        streak: data.players.find(p => p.username === data.winner.username)?.longestStreak || 0,
        avatar: data.winner.avatar,
      };

      setSummaryData({
        winner,
        leaderboard,
        gameStats,
        yourStats,
      });

      setIsLoading(false);
    };

    socket.on(WSMessageType.GAME_SUMMARY_SUCCESS, handleGameSummary);

    return () => {
      socket.off(WSMessageType.GAME_SUMMARY_SUCCESS, handleGameSummary);
    };
  }, [room, currentPlayer, socket, sendMessage]);

  function handlePlayAgain() {
    soundService.playButtonClick();
    leaveRoom();
    navigate(ROUTES.multiplayer.mode.absPath);
  }

  function handleBackToHome() {
    soundService.playButtonClick();
    leaveRoom();
    navigate('/');
  }

  function handleShare() {
    if (!summaryData) return;

    const shareText = `I scored ${summaryData.yourStats.totalScore} points in WordShot Multiplayer! 🎉`;
    if (navigator.share) {
      navigator.share({ title: 'WordShot Score', text: shareText });
    } else {
      navigator.clipboard.writeText(shareText);
    }
  }

  if (isLoading || !summaryData) {
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

  return (
    <PageTransition className="min-h-screen">
      <div className="min-h-screen w-full bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-gray-900">Game Over!</h1>
              <p className="text-gray-600 text-sm">Final Results</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span>Room: #{room?.joinCode}</span>
              <span>•</span>
              <span>Duration: 12m 30s</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-4 py-6 pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Winner Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-3xl p-8 mb-6 shadow-xl border-4 border-yellow-400 relative overflow-hidden"
            >
              {/* Trophy background */}
              <div className="absolute top-0 right-0 text-yellow-200 opacity-20">
                <FaTrophy className="text-[200px]" />
              </div>

              <div className="relative z-10 flex items-center gap-6">
                {/* Winner avatar with crown */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-white border-4 border-yellow-400 shadow-lg">
                    {summaryData.winner.avatar ? (
                      <img src={summaryData.winner.avatar} alt={summaryData.winner.username} className="w-full h-full" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-6xl text-yellow-600 font-black">
                        🏆
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 rounded-full p-3 shadow-lg">
                      <FaTrophy className="text-3xl text-yellow-900" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-3 py-1 rounded-full shadow-lg">
                    <span className="text-xs font-black text-yellow-900 uppercase">Champion</span>
                  </div>
                </div>

                {/* Winner info */}
                <div className="flex-1">
                  <h2 className="text-4xl font-black text-gray-900 mb-2">{summaryData.winner.username}</h2>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="bg-white rounded-xl px-4 py-2">
                      <span className="text-3xl font-black text-blue-600">{summaryData.winner.score}</span>
                      <span className="text-sm font-bold text-gray-500 ml-1">PTS</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2">
                      <FaCheckCircle className="text-green-500" />
                      <span className="text-lg font-bold text-gray-900">{summaryData.winner.accuracy}% Accuracy</span>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2">
                      <FaBolt className="text-orange-500" />
                      <span className="text-lg font-bold text-gray-900">{summaryData.winner.streak} Streak</span>
                    </div>
                  </div>
                  <div className="bg-yellow-400 px-4 py-2 rounded-xl inline-block">
                    <span className="text-yellow-900 font-bold">🎉 +500 XP Reward</span>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 bg-white rounded-2xl p-6 shadow-md"
              >
                <h3 className="text-xl font-black text-gray-900 mb-4 flex items-center gap-2">
                  <FaTrophy className="text-yellow-500" />
                  Leaderboard
                </h3>
                <p className="text-sm text-gray-500 mb-4">Round {room?.config.roundsCount || 5}/{room?.config.roundsCount || 5} Complete</p>

                <div className="space-y-3">
                  {summaryData.leaderboard.map((player, index) => (
                    <motion.div
                      key={player.username}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`rounded-xl p-4 flex items-center gap-4 ${
                        player.isYou
                          ? 'bg-blue-100 border-2 border-blue-500'
                          : 'bg-gray-50'
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
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold">
                            {player.username[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900">{player.username}</h4>
                        <p className="text-xs text-gray-500">{player.totalWords} words • {player.accuracy}% acc</p>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className="text-2xl font-black text-gray-900">{player.score.toLocaleString()}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Game Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-black text-gray-900 mb-4">📊 Game Stats</h3>

                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Fastest Answer</p>
                      <p className="font-bold text-gray-900">{summaryData.gameStats.fastestAnswer.time}</p>
                      <p className="text-xs text-blue-600">{summaryData.gameStats.fastestAnswer.player}</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Hardest Category</p>
                      <p className="font-bold text-gray-900">{summaryData.gameStats.hardestCategory.name}</p>
                      <p className="text-xs text-gray-600">Only {summaryData.gameStats.hardestCategory.accuracy}% correct answers</p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500 uppercase mb-1">Total Words</p>
                      <p className="text-3xl font-black text-gray-900">{summaryData.gameStats.totalWords}</p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl p-6 shadow-md">
                  <h3 className="text-lg font-black text-gray-900 mb-4">🏆 Achievements</h3>
                  <div className="flex gap-3">
                    <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">⚡</span>
                    </div>
                    <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <span className="text-3xl">🎯</span>
                    </div>
                    <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center opacity-50">
                      <span className="text-3xl">👑</span>
                    </div>
                  </div>
                  <div className="mt-3 space-y-1">
                    <p className="text-xs font-semibold text-purple-600">⚡ Speed Demon</p>
                    <p className="text-xs font-semibold text-blue-600">🎯 Word Master</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Your detailed stats section can go here similar to single player */}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-20">
          <div className="max-w-4xl mx-auto flex items-center gap-3">
            <button
              onClick={handleBackToHome}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors"
            >
              Back to Home
            </button>
            <button
              onClick={handleShare}
              className="px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-gray-700 transition-colors flex items-center gap-2"
            >
              <FaShare />
              Share
            </button>
            <button
              onClick={handlePlayAgain}
              className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <FaRedo />
              Play Again
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

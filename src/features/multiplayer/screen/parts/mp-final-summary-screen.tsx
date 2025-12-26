/**
 * Multiplayer Final Summary Screen
 *
 * Shows game over with winner, final leaderboard, and stats
 * Matches design exactly from image
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PageTransition } from "@shared/ui/components/page-transition";
import { useMultiplayer } from "../../providers/multiplayer-provider";
import { useWebSocket } from "../../providers/websocket-provider";
import { soundService } from "@shared/services/sound-service";
import {
  FaTrophy,
  FaBolt,
  FaCheckCircle,
  FaStopCircle,
  FaGift,
  FaChartBar,
  FaCrown,
} from "@icons";
import {
  WSMessageType,
  GameSummaryPayload,
  GameSummarySuccessResponse,
} from "../../types/multiplayer-types";

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
  const { room, currentPlayer, endGame, isHost } = useMultiplayer();
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

    console.log("[MPFinalSummary] Requesting game summary:", payload);
    sendMessage(WSMessageType.GAME_SUMMARY, payload);

    const handleGameSummary = (response: GameSummarySuccessResponse) => {
      console.log("[MPFinalSummary] Received summary:", response);

      if (!response.success) return;

      const { data } = response;
      const currentPlayerData = data.players.find(
        (p) => p.username === currentPlayer.username
      );

      // Build leaderboard sorted by total score
      const sortedPlayers = [...data.players].sort(
        (a, b) => b.totalScore - a.totalScore
      );
      const leaderboard = sortedPlayers.map((player, index) => ({
        rank: index + 1,
        username:
          player.username === currentPlayer.username
            ? `You (${player.username})`
            : player.username,
        totalWords: player.correctAnswers,
        accuracy: Math.round(player.accuracy * 100),
        score: player.totalScore,
        avatar: player.avatar,
        isYou: player.username === currentPlayer.username,
      }));

      // Game stats
      const gameStats = {
        fastestAnswer: {
          time: data.gameStats.fastestAnswer ? `${data.gameStats.fastestAnswer?.time?.toFixed(1)}s` : data.gameStats.fastestAnswer,
          category: data.gameStats.fastestAnswer?.category,
          player: data.gameStats.fastestAnswer?.username,
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
        correct: `${currentPlayerData?.correctAnswers || 0}/${
          (currentPlayerData?.correctAnswers || 0) +
          Math.floor((currentPlayerData?.correctAnswers || 0) / 0.85)
        }`,
        accuracy: `${Math.round((currentPlayerData?.accuracy || 0) * 100)}%`,
        longestStreak: currentPlayerData?.longestStreak || 0,
        avgTime: `${currentPlayerData?.averageTime.toFixed(1)}s`,
      };

      // Winner data
      const winner = {
        username: data.winner.username,
        score: data.winner.score,
        accuracy: Math.round(
          (data.players.find((p) => p.username === data.winner.username)
            ?.accuracy || 0) * 100
        ),
        streak:
          data.players.find((p) => p.username === data.winner.username)
            ?.longestStreak || 0,
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


  if (isLoading || !summaryData) {
    return (
      <PageTransition className="h-screen">
        <div className="h-screen w-full bg-gray-50 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
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
        <div className="bg-white border-b border-gray-200 px-4 sm:px-6 py-3 sm:py-4">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-gray-900">Game Over!</h1>
                <p className="text-gray-600 text-xs sm:text-sm">Final Results</p>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                <span>Room: #{room?.joinCode}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 px-3 sm:px-4 py-4 sm:py-6 pb-20 sm:pb-24">
          <div className="max-w-4xl mx-auto">
            {/* Winner Card */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-4 sm:mb-6 shadow-xl border-2 sm:border-4 border-yellow-400 relative overflow-hidden"
            >
              {/* Trophy background - hidden on mobile */}
              <div className="absolute top-0 right-0 text-yellow-200 opacity-20 hidden sm:block">
                <FaTrophy className="text-[200px]" />
              </div>

              <div className="relative z-10 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                {/* Winner avatar with crown */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-white border-4 border-yellow-400 shadow-lg">
                    {summaryData.winner.avatar ? (
                      <img
                        src={summaryData.winner.avatar}
                        alt={summaryData.winner.username}
                        className="w-full h-full"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-yellow-600">
                        <FaTrophy className="text-4xl sm:text-6xl" />
                      </div>
                    )}
                  </div>
                  <div className="absolute -top-6 sm:-top-8 left-1/2 transform -translate-x-1/2">
                    <div className="bg-yellow-400 rounded-full p-2 sm:p-3 shadow-lg">
                      <FaTrophy className="text-xl sm:text-3xl text-yellow-900" />
                    </div>
                  </div>
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-400 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-lg whitespace-nowrap">
                    <span className="text-[10px] sm:text-xs font-black text-yellow-900 uppercase">
                      Champion
                    </span>
                  </div>
                </div>

                {/* Winner info */}
                <div className="flex-1 text-center sm:text-left">
                  <h2 className="text-2xl sm:text-4xl font-black text-gray-900 mb-2 break-words">
                    {summaryData.winner.username}
                  </h2>
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="bg-white rounded-xl px-3 sm:px-4 py-1.5 sm:py-2">
                      <span className="text-2xl sm:text-3xl font-black text-blue-600">
                        {summaryData.winner.score}
                      </span>
                      <span className="text-xs sm:text-sm font-bold text-gray-500 ml-1">
                        PTS
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-xl px-3 sm:px-4 py-1.5 sm:py-2">
                      <FaCheckCircle className="text-green-500 text-sm sm:text-base" />
                      <span className="text-sm sm:text-lg font-bold text-gray-900">
                        {summaryData.winner.accuracy}% Accuracy
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 sm:gap-2 bg-white rounded-xl px-3 sm:px-4 py-1.5 sm:py-2">
                      <FaBolt className="text-orange-500 text-sm sm:text-base" />
                      <span className="text-sm sm:text-lg font-bold text-gray-900">
                        {summaryData.winner.streak} Streak
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
              {/* Leaderboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="md:col-span-2 bg-white rounded-2xl p-4 sm:p-6 shadow-md"
              >
                <h3 className="text-lg sm:text-xl font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                  <FaTrophy className="text-yellow-500 text-base sm:text-xl" />
                  Leaderboard
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
                  Round {room?.config.roundsCount || 5}/
                  {room?.config.roundsCount || 5} Complete
                </p>

                <div className="space-y-2 sm:space-y-3">
                  {summaryData.leaderboard.map((player, index) => (
                    <motion.div
                      key={player.username}
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`rounded-xl p-3 sm:p-4 flex items-center gap-2 sm:gap-4 ${
                        player.isYou
                          ? "bg-blue-100 border-2 border-blue-500"
                          : "bg-gray-50"
                      }`}
                    >
                      {/* Rank */}
                      <div
                        className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-black text-base sm:text-lg flex-shrink-0 ${
                          player.rank === 1
                            ? "bg-yellow-400 text-yellow-900"
                            : player.rank === 2
                            ? "bg-gray-300 text-gray-700"
                            : player.rank === 3
                            ? "bg-orange-300 text-orange-900"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {player.rank}
                      </div>

                      {/* Avatar */}
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        {player.avatar ? (
                          <img
                            src={player.avatar}
                            alt={player.username}
                            className="w-full h-full"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-500 font-bold text-sm">
                            {player.username[0]}
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm sm:text-base truncate">
                          {player.username}
                        </h4>
                        <p className="text-[10px] sm:text-xs text-gray-500">
                          {player.totalWords} words • {player.accuracy}% acc
                        </p>
                      </div>

                      {/* Score */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-lg sm:text-2xl font-black text-gray-900">
                          {player.score.toLocaleString()}
                        </p>
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
                className="space-y-4 sm:space-y-6"
              >
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaChartBar className="text-blue-500 text-sm sm:text-base" />
                    Game Stats
                  </h3>

                  <div className="space-y-3">
                    {summaryData.gameStats.fastestAnswer?.time && (
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase mb-1">
                          Fastest Answer
                        </p>
                        <p className="font-bold text-gray-900 text-sm sm:text-base">
                          {summaryData.gameStats.fastestAnswer.time}
                        </p>
                        <p className="text-[10px] sm:text-xs text-blue-600">
                          {summaryData.gameStats.fastestAnswer.player}
                        </p>
                      </div>
                    )}

                    {summaryData.gameStats.hardestCategory && (
                      <div>
                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase mb-1">
                          Hardest Category
                        </p>
                        <p className="font-bold text-gray-900 uppercase text-sm sm:text-base">
                          {summaryData.gameStats.hardestCategory.name}
                        </p>
                        <p className="text-[10px] sm:text-xs text-gray-600">
                          Only {summaryData.gameStats.hardestCategory.accuracy}%
                          correct answers
                        </p>
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] sm:text-xs text-gray-500 uppercase mb-1">
                        Total Words
                      </p>
                      <p className="text-2xl sm:text-3xl font-black text-gray-900">
                        {summaryData.gameStats.totalWords}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-md">
                  <h3 className="text-base sm:text-lg font-black text-gray-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <FaTrophy className="text-yellow-500 text-sm sm:text-base" />
                    Achievements
                  </h3>
                  <div className="flex gap-2 sm:gap-3">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-purple-100 rounded-xl flex items-center justify-center">
                      <FaBolt className="text-2xl sm:text-3xl text-purple-600" />
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-xl flex items-center justify-center">
                      <FaCheckCircle className="text-2xl sm:text-3xl text-blue-600" />
                    </div>
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-100 rounded-xl flex items-center justify-center opacity-50">
                      <FaCrown className="text-2xl sm:text-3xl text-gray-400" />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-3 space-y-1">
                    <p className="text-[10px] sm:text-xs font-semibold text-purple-600 flex items-center gap-1">
                      <FaBolt className="text-xs sm:text-sm" /> Speed Demon
                    </p>
                    <p className="text-[10px] sm:text-xs font-semibold text-blue-600 flex items-center gap-1">
                      <FaCheckCircle className="text-xs sm:text-sm" /> Word Master
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {isHost && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                onClick={() => endGame()}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-base sm:text-lg py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FaStopCircle className="text-base sm:text-lg" />
                <span>End Game and Restart</span>
              </motion.button>
            )}

            {/* Your detailed stats section can go here similar to single player */}
          </div>
        </div>
      </div>
    </PageTransition>
  );
}

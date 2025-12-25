/**
 * Host Waiting Room Screen
 *
 * Lobby screen where host waits for players to join
 * Room is created automatically on mount
 */

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCrown, FaCopy, FaShare, FaCog, FaUserCircle } from '@icons';
import { PageTransition } from '@shared/ui/components/page-transition';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { usernameService } from '@shared/services/username-service';
import { soundService } from '@shared/services/sound-service';
import { ROUTES } from '@shared/constants/routes';
import {
  DEFAULT_ROUNDS_COUNT,
  AVAILABLE_CATEGORIES,
  DEFAULT_EXCLUDED_LETTERS,
  getAvatarUrl,
  MIN_PLAYERS,
} from '../../constants/game-config';
import { ConnectionStatusIndicator } from './connection-status-indicator';

export function HostWaitingRoomScreen() {
  const navigate = useNavigate();
  const { room, createRoom, startGame, leaveRoom, isCreatingRoom, error } = useMultiplayer();
  const [copySuccess, setCopySuccess] = useState(false);

  const username = usernameService.getUsername();
  const playerCount = room?.players.length || 0;
  const canStartGame = playerCount >= MIN_PLAYERS;

  // Auto-create room on mount
  useEffect(() => {
    if (!username) {
      navigate(ROUTES.multiplayer.mode.absPath);
      return;
    }

    if (!room && !isCreatingRoom) {
      createRoom({
        username,
        avatar: getAvatarUrl(username),
        config: {
          roundsCount: DEFAULT_ROUNDS_COUNT,
          supportedCategories: [...AVAILABLE_CATEGORIES],
          excludedLetters: DEFAULT_EXCLUDED_LETTERS,
        },
      });
    }
  }, [username, room, isCreatingRoom, createRoom, navigate]);

  // Navigate to waiting room after room is created
  useEffect(() => {
    if (room && !isCreatingRoom) {
      navigate(`${ROUTES.multiplayer.absPath}/waiting`);
    }
  }, [room, isCreatingRoom, navigate]);

  function handleCopyCode() {
    if (room?.joinCode) {
      navigator.clipboard.writeText(room.joinCode);
      setCopySuccess(true);
      soundService.playSuccess();

      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  }

  function handleShareLink() {
    if (room?.joinCode) {
      const shareUrl = `${window.location.origin}${ROUTES.multiplayer.join.absPath}/${room.joinCode}`;
      navigator.clipboard.writeText(shareUrl);
      soundService.playSuccess();
    }
  }

  function handleStartGame() {
    if (canStartGame) {
      soundService.playButtonClick();
      startGame();
    }
  }

  function handleLeaveRoom() {
    soundService.playButtonClick();
    leaveRoom();
    navigate(ROUTES.multiplayer.mode.absPath);
  }

  // Loading state
  if (isCreatingRoom || !room) {
    return (
      <PageTransition className="min-h-screen">
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"
          />
          <p className="mt-4 text-gray-600 font-medium">Creating room...</p>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition className="min-h-screen">
      <ConnectionStatusIndicator />

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <button
            onClick={handleLeaveRoom}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            ← Back
          </button>
          <h1 className="text-xl font-black text-gray-900">Waiting Room</h1>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <FaCog className="text-xl" />
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start px-4 py-8 max-w-2xl mx-auto w-full">
          {/* Room Code Section */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8 w-full mb-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-gray-500 text-sm uppercase tracking-wider text-center mb-3">
              Room Code
            </p>

            <div className="flex items-center justify-center mb-6">
              <motion.h2
                className="text-6xl font-black text-blue-600 tracking-widest"
                animate={{
                  textShadow: [
                    '0 0 0px rgba(37, 99, 235, 0)',
                    '0 0 20px rgba(37, 99, 235, 0.3)',
                    '0 0 0px rgba(37, 99, 235, 0)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {room.joinCode}
              </motion.h2>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleCopyCode}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaCopy />
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={handleShareLink}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FaShare />
                Share Link
              </button>
            </div>

            <p className="text-gray-400 text-sm text-center mt-4">
              Share this code with friends to join
            </p>
          </motion.div>

          {/* Host Player Card */}
          <motion.div
            className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-2xl p-4 w-full mb-4"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {room.players[0]?.avatar ? (
                    <img src={room.players[0].avatar} alt="Host avatar" className="w-full h-full" />
                  ) : (
                    <FaUserCircle className="text-4xl text-gray-400" />
                  )}
                </div>
                <div className="absolute -top-1 -left-1 bg-yellow-400 rounded-full p-1">
                  <FaCrown className="text-xs text-yellow-800" />
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">
                    {room.players[0]?.username || 'You'}
                  </h3>
                  <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded">
                    HOST
                  </span>
                </div>
                <p className="text-sm text-gray-600">Ready to play</p>
              </div>

              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
          </motion.div>

          {/* Players Section */}
          <div className="w-full mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Players ({playerCount}/{MIN_PLAYERS})
              </h2>
              <span className="text-sm text-gray-500">Checking for players...</span>
            </div>

            <div className="space-y-3">
              {/* Waiting slots */}
              {[...Array(MIN_PLAYERS - 1)].map((_, i) => (
                <motion.div
                  key={i}
                  className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                      <FaUserCircle className="text-3xl text-gray-300" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-400 font-medium">Waiting for player...</p>
                    </div>
                    <div className="flex gap-1">
                      <motion.div
                        className="w-2 h-2 bg-gray-300 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-300 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 + i * 0.2 }}
                      />
                      <motion.div
                        className="w-2 h-2 bg-gray-300 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 + i * 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Game Settings */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-4 w-full mb-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <button className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaCog className="text-gray-600" />
                <span className="text-gray-900 font-semibold">Game Settings</span>
              </div>
              <span className="text-gray-400">▼</span>
            </button>

            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Rounds:</span>
                <span className="font-semibold text-gray-900">{room.config.roundsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categories:</span>
                <span className="font-semibold text-gray-900">
                  {room.config.supportedCategories.length}
                </span>
              </div>
            </div>

            <p className="text-xs text-gray-400 mt-2">Configure when players join</p>
          </motion.div>

          {/* Error message */}
          {error && (
            <motion.div
              className="bg-red-50 border-2 border-red-200 rounded-xl p-4 w-full mb-4"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          {/* Start Game Button */}
          <motion.button
            onClick={handleStartGame}
            disabled={!canStartGame}
            className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
              canStartGame
                ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={canStartGame ? { scale: 1.02 } : {}}
            whileTap={canStartGame ? { scale: 0.98 } : {}}
          >
            Start Game
          </motion.button>

          {!canStartGame && (
            <motion.p
              className="text-red-600 text-sm font-medium mt-2 flex items-center gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              ⚠ Need at least {MIN_PLAYERS} players to start
            </motion.p>
          )}

          {/* Leave Room Button */}
          <button
            onClick={handleLeaveRoom}
            className="mt-4 text-red-600 hover:text-red-700 font-semibold transition-colors"
          >
            Leave Room
          </button>
        </div>
      </div>
    </PageTransition>
  );
}

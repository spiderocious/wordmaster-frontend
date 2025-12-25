/**
 * Join Setup Screen
 *
 * Screen for joining a multiplayer room via code
 * Supports direct URL join with code parameter
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserCircle, FaDoorOpen } from '@icons';
import { TextInput } from '@ui/components';
import { PageTransition } from '@shared/ui/components/page-transition';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { usernameService } from '@shared/services/username-service';
import { soundService } from '@shared/services/sound-service';
import { ROUTES } from '@shared/constants/routes';
import { getAvatarUrl } from '../../constants/game-config';

export function JoinSetupScreen() {
  console.log('join screen');
  const { code } = useParams<{ code?: string }>();
  const navigate = useNavigate();
  const { room, joinRoom, isJoiningRoom, error, clearError } = useMultiplayer();

  const savedUsername = usernameService.getUsername();
  const [joinCode, setJoinCode] = useState(code || '');
  const [username] = useState(savedUsername || '');

  const canJoin = joinCode.trim().length === 6 && username.trim().length >= 3;

  useEffect(() => {
    if (!savedUsername) {
      navigate(ROUTES.multiplayer.mode.absPath);
      return;
    }

    // Auto-join if code is provided in URL
    if (code && code.length === 6 && !room) {
      handleJoinRoom();
    }
  }, []);

  // Navigate to waiting room after successful join
  useEffect(() => {
    if (room && !isJoiningRoom) {
      navigate(`${ROUTES.multiplayer.absPath}/waiting`);
    }
  }, [room, isJoiningRoom, navigate]);

  function handleJoinRoom() {
    if (!canJoin) return;

    clearError();
    soundService.playButtonClick();

    joinRoom({
      joinCode: joinCode.trim().toUpperCase(),
      username: username.trim(),
      avatar: getAvatarUrl(username.trim()),
    });
  }

  function handleBack() {
    soundService.playButtonClick();
    navigate(ROUTES.multiplayer.mode.absPath);
  }

  function handleKeyPress(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && canJoin) {
      handleJoinRoom();
    }
  }

  return (
    <PageTransition className="min-h-screen">
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-8">
        {/* Back button */}
        <button
          onClick={handleBack}
          className="absolute top-6 left-6 text-gray-600 hover:text-gray-900 transition-colors font-semibold"
        >
          ← Back
        </button>

        <div className="max-w-md w-full">
          {/* Icon */}
          <motion.div
            className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 15,
            }}
          >
            <FaDoorOpen className="text-4xl text-blue-600" />
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-black text-gray-900 mb-3">
              Join Game
            </h1>
            <p className="text-gray-600 text-lg">
              Enter the room code to join your friends
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            className="bg-white rounded-3xl shadow-lg p-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Join Code Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Room Code
              </label>
              <TextInput
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                onKeyPress={handleKeyPress}
                placeholder="Enter 6-digit code"
                maxLength={6}
                autoFocus={!code}
                className="text-center text-2xl font-bold tracking-widest"
                state={error ? 'error' : 'default'}
              />
              <p className="text-sm text-gray-500 mt-2 text-center">
                {joinCode.length}/6 characters
              </p>
            </div>

            {/* Username Display */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Playing as
              </label>
              <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center overflow-hidden">
                  {username ? (
                    <img src={getAvatarUrl(username)} alt="Avatar" className="w-full h-full" />
                  ) : (
                    <FaUserCircle className="text-3xl text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900">{username}</p>
                  <p className="text-sm text-gray-500">Your username</p>
                </div>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <motion.div
                className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-red-800 text-sm font-medium">{error}</p>
              </motion.div>
            )}

            {/* Join Button */}
            <motion.button
              onClick={handleJoinRoom}
              disabled={!canJoin || isJoiningRoom}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-lg ${
                canJoin && !isJoiningRoom
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              whileHover={canJoin && !isJoiningRoom ? { scale: 1.02 } : {}}
              whileTap={canJoin && !isJoiningRoom ? { scale: 0.98 } : {}}
            >
              {isJoiningRoom ? 'Joining...' : 'Join Room'}
            </motion.button>
          </motion.div>

          {/* Help text */}
          <motion.p
            className="text-center text-gray-500 text-sm mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Don't have a code? Ask your friend to share it with you
          </motion.p>
        </div>
      </div>
    </PageTransition>
  );
}

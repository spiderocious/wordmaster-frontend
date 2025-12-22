import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { FaArrowLeft } from '@icons';
import { getGameSessionRoute, ROUTES } from '@shared/constants/routes';
import { Button, Heading, Text } from '@ui/components';
import { gameApi } from '../api/game-api';
import { useGameContext } from '../providers/game-provider';
import { GameState } from '../constants/game-state';
import { PageTransition } from '@shared/ui/components/page-transition';

const FLOATING_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

export function GameStartScreen() {
  const navigate = useNavigate();
  const gameContext = useGameContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleStartGame() {
    try {
      setIsLoading(true);
      setError(null);

      const response = await gameApi.startSingleGame();

      if (response.success && response.data) {
        gameContext.startNewGame();
        // Store game data in context
        gameContext.setGameId(response.data.gameId);
        gameContext.setTotalRounds(response.data.totalRounds);
        gameContext.setRounds(response.data.rounds);
        gameContext.setCreatedAt(response.data.createdAt);
        gameContext.setCurrentRoundIndex(0);
        gameContext.setGameState(GameState.ROUND_START);
        
        // Navigate to game session
        navigate(getGameSessionRoute(response.data.gameId));
      }
    } catch (err) {
      console.error('Failed to start game:', err);
      setError('Failed to start game. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }

  function handleBack() {
    navigate(ROUTES.howToPlay.absPath)
  }

  return (
    <PageTransition direction="left" className="min-h-screen">
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex flex-col relative overflow-hidden">

        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={true}
          numberOfPieces={100}
          gravity={0.2}
        />
      {/* Floating Letters Background */}
      {FLOATING_LETTERS.map((letter, index) => (
        <motion.div
          key={index}
          className="absolute text-gray-200 font-bold pointer-events-none select-none"
          style={{
            fontSize: `${Math.random() * 100 + 50}px`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 0.15, 0],
            scale: [0, 1, 0],
            x: [0, (Math.random() - 0.5) * 200],
            y: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: index * 0.1,
            ease: 'easeInOut',
          }}
        >
          {letter}
        </motion.div>
      ))}

      {/* Back Button */}
      <motion.header
        className="p-6 relative z-10"
        initial={{ x: -50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
        >
          <FaArrowLeft className="text-xl" />
        </button>
      </motion.header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 relative z-10">
        <div className="max-w-2xl w-full text-center">
          {/* Title */}
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Heading level={1} className="mb-8">
              Get Ready to Play!
            </Heading>
          </motion.div>

          {/* Central Circle with "Ready?" */}
          <motion.div
            className="flex flex-col items-center mb-12"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4, type: 'spring', stiffness: 100 }}
          >
            <motion.div
              className="relative"
              animate={{
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            >
              {/* Outer glow rings */}
              <motion.div
                className="absolute inset-0 rounded-full bg-primary opacity-20 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                style={{ width: '300px', height: '300px', margin: '-50px' }}
              />

              {/* Main circle */}
              <div className="relative bg-white shadow-2xl flex items-center justify-center" style={{ width: '200px', height: '200px', borderRadius: '50%' }}>
                {/* Dashed circles */}
                <svg className="absolute inset-0 w-full h-full">
                  <circle
                    cx="100"
                    cy="100"
                    r="90"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8 8"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    stroke="#E5E7EB"
                    strokeWidth="2"
                    fill="none"
                    strokeDasharray="8 8"
                  />
                </svg>

                {/* Ready text */}
                <motion.div
                  className="text-6xl font-bold text-primary"
                  animate={{
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  Ready?
                </motion.div>

                {/* Floating dots around circle */}
                {[0, 1, 2, 3].map((dot) => (
                  <motion.div
                    key={dot}
                    className="absolute w-4 h-4 rounded-full"
                    style={{
                      background: ['#EC4899', '#3B82F6', '#F59E0B', '#10B981'][dot],
                      top: dot === 0 ? '20px' : dot === 1 ? '50%' : dot === 2 ? 'auto' : '50%',
                      bottom: dot === 2 ? '20px' : 'auto',
                      right: dot === 1 ? '-20px' : 'auto',
                      left: dot === 3 ? '-20px' : dot === 0 ? '50%' : 'auto',
                      transform: (dot === 0 || dot === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
                    }}
                    animate={{
                      y: dot === 1 || dot === 3 ? [0, -10, 0] : 0,
                      x: dot === 0 || dot === 2 ? [0, -10, 0] : 0,
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: dot * 0.5,
                    }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Subtitle */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <Text className="text-gray-600 text-lg">
              The alphabet roulette will select your first letter!
            </Text>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="text-center mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Text className="text-red-600 text-sm">{error}</Text>
            </motion.div>
          )}

          {/* Start Button */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Button
              onClick={handleStartGame}
              variant="primary"
              size="large"
              className="min-w-[250px]"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? 'Starting...' : 'Start Game'}
            </Button>
          </motion.div>
        </div>
      </main>
    </div>
    </PageTransition>
  );
}

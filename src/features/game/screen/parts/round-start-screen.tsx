/**
 * Round Start Screen
 *
 * Displays round number and progress before transitioning to roulette spin
 */

import { useEffect } from 'react';
import { useGameContext } from '../../providers/game-provider';
import { GameState } from '../../constants/game-state';
import Confetti from 'react-confetti';

export function RoundStartScreen() {
  const gameContext = useGameContext();
  const currentRound = gameContext.currentRoundIndex + 1;
  const totalRounds = gameContext.totalRounds;

  // Auto-transition to roulette spin after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      gameContext.setGameState(GameState.ROULETTE_SPIN);
    }, 2000);

    return () => clearTimeout(timer);
  }, [gameContext]);

  // Calculate progress dots
  const progressDots = Array.from({ length: totalRounds }, (_, i) => i + 1);

  return (
    <div className="h-screen w-full bg-gradient-to-b from-purple-600 to-purple-800 flex flex-col items-center justify-center px-4 overflow-hidden relative">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        numberOfPieces={150}
        recycle={true}
        gravity={0.3}
      />

      <div className="text-center z-10">
        {/* Round indicator */}
        <div className="mb-6">
          <p className="text-purple-200 text-sm uppercase tracking-wide mb-2">
            Round
          </p>
          <div className="flex items-baseline justify-center gap-2">
            <span className="text-6xl font-black text-white">
              {currentRound}
            </span>
            <span className="text-3xl font-bold text-purple-200">
              of {totalRounds}
            </span>
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-2 justify-center mb-8">
          {progressDots.map((round) => (
            <div
              key={round}
              className={`w-2 h-2 rounded-full transition-all ${
                round < currentRound
                  ? 'bg-green-400'
                  : round === currentRound
                  ? 'bg-white scale-125'
                  : 'bg-purple-400/40'
              }`}
            />
          ))}
        </div>

        {/* Motivational text */}
        <div className="space-y-2">
          <p className="text-2xl font-bold text-white">
            YOU'RE DOING GREAT!
          </p>
          <p className="text-purple-200 text-sm">
            Get ready for the next round
          </p>
        </div>

        {/* Current score if available */}
        {gameContext.currentScore !== undefined && gameContext.currentScore > 0 && (
          <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 inline-block">
            <p className="text-xs text-purple-200 uppercase tracking-wide">
              Current Score
            </p>
            <p className="text-2xl font-bold text-white">
              {gameContext.currentScore}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

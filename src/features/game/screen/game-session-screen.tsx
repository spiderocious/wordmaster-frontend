/**
 * Game Session Screen
 *
 * Container that manages game state transitions
 */

import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGameContext } from '../providers/game-provider';
import { GameState } from '../constants/game-state';
import { RoundStartScreen } from './parts/round-start-screen';
import { RouletteSpinScreen } from './parts/roulette-spin-screen';
import { LetterRevealScreen } from './parts/letter-reveal-screen';
import { AnsweringScreen } from './parts/answering-screen';
import { RoundSummaryScreen } from './parts/round-summary-screen';

export function GameSessionScreen() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const gameContext = useGameContext();

  // Load game from cache or redirect if not found
  useEffect(() => {
    if (!gameId) {
      navigate('/game/start');
      return;
    }

    // If game is not in context, try to load from cache
    if (!gameContext.gameId || gameContext.gameId !== gameId) {
      const loaded = gameContext.loadGameFromCache(gameId);
      if (!loaded) {
        // Game not found in cache, redirect to start
        navigate('/game/start');
      }
    }
  }, [gameId, gameContext, navigate]);

  if (!gameContext.gameId) {
    return null; // Loading or redirecting
  }

  // Render screen based on current game state
  switch (gameContext.gameState) {
    case GameState.ROUND_START:
      return <RoundStartScreen />;

    case GameState.ROULETTE_SPIN:
      return <RouletteSpinScreen />;

    case GameState.LETTER_REVEAL:
      return <LetterRevealScreen />;

    case GameState.ANSWERING:
      return <AnsweringScreen />;

    case GameState.ROUND_SUMMARY:
      return <RoundSummaryScreen />;

    // TODO: Add other states
    default:
      console.log('Unknown game state:', gameContext);
      return <div>Unknown game state. {gameContext.gameState} </div>;
  }
}

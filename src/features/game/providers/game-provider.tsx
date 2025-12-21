/**
 * Game Context Provider
 *
 * Manages global game state across all screens
 */

import { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { GameStateType, GameState } from '../constants/game-state';
import { Answer, Round } from '../types/game-types';
import { cacheService } from '@shared/services/cache-service';
import { gameHistoryService, GameStatus } from '@shared/services/game-history-service';

interface GameContextValue {
  gameId: string | null;
  setGameId: (id: string) => void;

  totalRounds: number;
  setTotalRounds: (count: number) => void;

  rounds: Round[];
  setRounds: (rounds: Round[]) => void;

  currentRoundIndex: number;
  setCurrentRoundIndex: (index: number) => void;

  gameState: GameStateType;
  setGameState: (state: GameStateType) => void;

  answers: Answer[];
  addAnswer: (answer: Answer) => void;

  createdAt: string | null;
  setCreatedAt: (date: string) => void;

  currentScore: number;
  setCurrentScore: (score: number) => void;

  clearGame: () => void;
  saveGameToCache: () => void;
  loadGameFromCache: (gameId: string) => boolean;
}

const GameContext = createContext<GameContextValue | undefined>(undefined);

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  const [gameId, setGameIdState] = useState<string | null>(null);
  const [totalRounds, setTotalRounds] = useState<number>(0);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [currentRoundIndex, setCurrentRoundIndex] = useState<number>(0);
  const [gameState, setGameState] = useState<GameStateType>(GameState.ROUND_START);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [currentScore, setCurrentScore] = useState<number>(0);

  function setGameId(id: string) {
    setGameIdState(id);

    // Add to game history
    gameHistoryService.add({
      gameId: id,
      date: new Date().toISOString(),
      totalScore: null,
      status: GameStatus.PENDING,
    });
  }

  function addAnswer(answer: Answer) {
    setAnswers((prev) => [...prev, answer]);
  }

  function saveGameToCache() {
    if (!gameId) return;

    const gameData = {
      gameId,
      totalRounds,
      rounds,
      currentRoundIndex,
      gameState,
      answers,
      createdAt,
      currentScore,
    };

    cacheService.save(`game_${gameId}`, gameData);
  }

  function loadGameFromCache(id: string): boolean {
    const gameData = cacheService.get<{
      gameId: string;
      totalRounds: number;
      rounds: Round[];
      currentRoundIndex: number;
      gameState: GameStateType;
      answers: Answer[];
      createdAt: string;
      currentScore: number;
    }>(`game_${id}`);

    if (!gameData) {
      return false;
    }

    setGameIdState(gameData.gameId);
    setTotalRounds(gameData.totalRounds);
    setRounds(gameData.rounds);
    setCurrentRoundIndex(gameData.currentRoundIndex);
    setGameState(gameData.gameState);
    setAnswers(gameData.answers);
    setCreatedAt(gameData.createdAt);
    setCurrentScore(gameData.currentScore || 0);

    return true;
  }

  function clearGame() {
    if (gameId) {
      cacheService.remove(`game_${gameId}`);
    }
    setGameIdState(null);
    setTotalRounds(0);
    setRounds([]);
    setCurrentRoundIndex(0);
    setGameState(GameState.ROUND_START);
    setAnswers([]);
    setCreatedAt(null);
    setCurrentScore(0);
  }

  // Auto-save to cache whenever game state changes
  useEffect(() => {
    if (gameId) {
      saveGameToCache();
    }
  }, [gameId, totalRounds, rounds, currentRoundIndex, gameState, answers, createdAt, currentScore]);

  const value: GameContextValue = {
    gameId,
    setGameId,
    totalRounds,
    setTotalRounds,
    rounds,
    setRounds,
    currentRoundIndex,
    setCurrentRoundIndex,
    gameState,
    setGameState,
    answers,
    addAnswer,
    createdAt,
    setCreatedAt,
    currentScore,
    setCurrentScore,
    clearGame,
    saveGameToCache,
    loadGameFromCache,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

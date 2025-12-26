/**
 * Multiplayer Demo Provider
 *
 * Provides scripted multiplayer demo data and orchestrates auto-play functionality
 */

import { createContext, useContext, ReactNode, useState } from 'react';

export const MultiplayerDemoState = {
  INTRO: 'INTRO',
  WAITING_ROOM: 'WAITING_ROOM',
  GAME_START: 'GAME_START',
  ROULETTE: 'ROULETTE',
  LETTER_REVEAL: 'LETTER_REVEAL',
  ANSWERING: 'ANSWERING',
  ROUND_RESULTS: 'ROUND_RESULTS',
  OUTRO: 'OUTRO',
} as const;

export type MultiplayerDemoStateType = typeof MultiplayerDemoState[keyof typeof MultiplayerDemoState];

interface DemoPlayer {
  username: string;
  avatar: string;
  role: 'host' | 'player';
  status: 'active';
  answers: {
    category: string;
    categoryDisplayName: string;
    word: string;
    typingDelay: number;
    timeLeft: number;
    score: number;
    wordScore: number;
    speedBonus: number;
  }[];
  totalScore: number;
}

interface MultiplayerDemoContextValue {
  gameState: MultiplayerDemoStateType;
  setGameState: (state: MultiplayerDemoStateType) => void;

  letter: string;
  roomCode: string;
  players: DemoPlayer[];
  categories: string[];
  currentAnswerIndex: number;
  setCurrentAnswerIndex: (index: number) => void;
}

const MultiplayerDemoContext = createContext<MultiplayerDemoContextValue | undefined>(undefined);

export function useMultiplayerDemoContext() {
  const context = useContext(MultiplayerDemoContext);
  if (!context) {
    throw new Error('useMultiplayerDemoContext must be used within MultiplayerDemoProvider');
  }
  return context;
}

interface MultiplayerDemoProviderProps {
  children: ReactNode;
}

export function MultiplayerDemoProvider({ children }: MultiplayerDemoProviderProps) {
  const [gameState, setGameState] = useState<MultiplayerDemoStateType>(MultiplayerDemoState.INTRO);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);

  const letter = 'S';
  const roomCode = 'DEMO1';
  const categories = ['animal', 'city'];

  const players: DemoPlayer[] = [
    {
      username: 'Alex',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      role: 'host',
      status: 'active',
      answers: [
        {
          category: 'animal',
          categoryDisplayName: 'Animal',
          word: 'Snake',
          typingDelay: 1400,
          timeLeft: 21,
          score: 142,
          wordScore: 100,
          speedBonus: 42,
        },
        {
          category: 'city',
          categoryDisplayName: 'City',
          word: 'Seattle',
          typingDelay: 1800,
          timeLeft: 19,
          score: 138,
          wordScore: 100,
          speedBonus: 38,
        },
      ],
      totalScore: 280,
    },
    {
      username: 'Jordan',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jordan',
      role: 'player',
      status: 'active',
      answers: [
        {
          category: 'animal',
          categoryDisplayName: 'Animal',
          word: 'Shark',
          typingDelay: 1200,
          timeLeft: 24,
          score: 148,
          wordScore: 100,
          speedBonus: 48,
        },
        {
          category: 'city',
          categoryDisplayName: 'City',
          word: 'Seoul',
          typingDelay: 1500,
          timeLeft: 22,
          score: 144,
          wordScore: 100,
          speedBonus: 44,
        },
      ],
      totalScore: 292,
    },
  ];

  const value: MultiplayerDemoContextValue = {
    gameState,
    setGameState,
    letter,
    roomCode,
    players,
    categories,
    currentAnswerIndex,
    setCurrentAnswerIndex,
  };

  return (
    <MultiplayerDemoContext.Provider value={value}>
      {children}
    </MultiplayerDemoContext.Provider>
  );
}

/**
 * Demo Provider
 *
 * Provides scripted demo data and orchestrates auto-play functionality
 */

import { createContext, useContext, ReactNode, useState } from 'react';

export const DemoGameState = {
  INTRO: 'INTRO',
  ROUND_START: 'ROUND_START',
  ROULETTE_SPIN: 'ROULETTE_SPIN',
  LETTER_REVEAL: 'LETTER_REVEAL',
  ANSWERING: 'ANSWERING',
  ROUND_SUMMARY: 'ROUND_SUMMARY',
  OUTRO: 'OUTRO',
} as const;

export type DemoGameStateType = typeof DemoGameState[keyof typeof DemoGameState];

interface DemoAnswer {
  category: string;
  categoryDisplayName: string;
  word: string;
  typingDelay: number;
  timeLeft: number;
  score: number;
  wordScore: number;
  speedBonus: number;
  comment?: string;
}

interface DemoContextValue {
  gameState: DemoGameStateType;
  setGameState: (state: DemoGameStateType) => void;

  letter: string;
  answers: DemoAnswer[];
  currentAnswerIndex: number;
  setCurrentAnswerIndex: (index: number) => void;

  totalScore: number;
  setTotalScore: (score: number) => void;

  roundScore: number;
}

const DemoContext = createContext<DemoContextValue | undefined>(undefined);

export function useDemoContext() {
  const context = useContext(DemoContext);
  if (!context) {
    throw new Error('useDemoContext must be used within DemoProvider');
  }
  return context;
}

interface DemoProviderProps {
  children: ReactNode;
}

export function DemoProvider({ children }: DemoProviderProps) {
  const [gameState, setGameState] = useState<DemoGameStateType>(DemoGameState.INTRO);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const letter = 'L';

  const answers: DemoAnswer[] = [
    {
      category: 'animal',
      categoryDisplayName: 'Animal',
      word: 'Lion',
      typingDelay: 1200,
      timeLeft: 0.75,
      score: 145,
      wordScore: 100,
      speedBonus: 45,
      comment: 'King of the jungle! Excellent choice!',
    },
    {
      category: 'city',
      categoryDisplayName: 'City',
      word: 'London',
      typingDelay: 1500,
      timeLeft: 0.68,
      score: 138,
      wordScore: 100,
      speedBonus: 38,
    },
    {
      category: 'food',
      categoryDisplayName: 'Food',
      word: 'Lasagna',
      typingDelay: 1800,
      timeLeft: 0.72,
      score: 142,
      wordScore: 100,
      speedBonus: 42,
      comment: 'Delicious Italian classic!',
    },
  ];

  const roundScore = answers.reduce((sum, answer) => sum + answer.score, 0);

  const value: DemoContextValue = {
    gameState,
    setGameState,
    letter,
    answers,
    currentAnswerIndex,
    setCurrentAnswerIndex,
    totalScore,
    setTotalScore,
    roundScore,
  };

  return (
    <DemoContext.Provider value={value}>
      {children}
    </DemoContext.Provider>
  );
}

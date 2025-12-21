/**
 * Game Type Definitions
 *
 * TypeScript interfaces for game data structures
 */

export interface Category {
  name: string;
  displayName: string;
  timeLimit: number;
}

export interface Round {
  roundNumber: number;
  letter: string;
  categories: Category[];
}

export interface StartGameResponse {
  success: boolean;
  data: {
    gameId: string;
    totalRounds: number;
    rounds: Round[];
    createdAt: string;
  };
  message: string;
}

export interface StartGamePayload {
  rounds?: number;
  supportedCategories?: string[];
}

export interface Answer {
  letter: string;
  word: string;
  category: string;
  timeLeft: number;
}

export interface ValidationResult {
  valid: boolean;
  wordScore: number;
  wordBonus: number;
  totalScore: number;
  word: string;
  category: string;
  letter: string;
  possibleAnswers?: string[];
  comment?: string;
}

export interface ValidateResponse {
  success: boolean;
  data: ValidationResult[];
  message: string;
}

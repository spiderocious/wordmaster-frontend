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

export interface FastestAnswer {
  word: string;
  timeLeft: number;
  timeTaken: number;
  category: string;
}

export interface BestCategory {
  name: string;
  averageScore: number;
  correctCount: number;
  accuracy: number;
}

export interface WorstCategory {
  name: string;
  averageScore: number;
  wrongCount: number;
  accuracy: number;
}

export interface CategoryBreakdown {
  category: string;
  totalAttempts: number;
  correctAnswers: number;
  wrongAnswers: number;
  accuracy: number;
  totalScore: number;
  averageScore: number;
}

export interface BestWord {
  word: string;
  score: number;
  category: string;
  letter: string;
  comment?: string;
}

export interface BestSpeedBonus {
  word: string;
  bonus: number;
  timeLeft: number;
  category: string;
}

export interface GameStats {
  totalScore: number;
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  averageScore: number;
  bestScore: number;
  worstScore: number;
  totalSpeedBonus: number;
  averageSpeedBonus: number;
  fastestAnswer: FastestAnswer;
  slowestAnswer: FastestAnswer;
  averageTimeLeft: number;
  averageTimeTaken: number;
  bestCategory: BestCategory;
  worstCategory: WorstCategory;
  categoryBreakdown: CategoryBreakdown[];
  bestWord: BestWord;
  bestSpeedBonus: BestSpeedBonus;
  currentStreak: number;
  longestStreak: number;
  excellentCount: number;
  rareWordCount: number;
  performanceGrade: string;
  performanceMessage: string;
}

export interface FinalSummaryResponse {
  success: boolean;
  data: {
    results: ValidationResult[];
    stats: GameStats;
  };
  message: string;
}

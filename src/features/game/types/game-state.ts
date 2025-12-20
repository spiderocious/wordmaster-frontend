/**
 * Game State Machine Types
 *
 * Defines all possible states and transitions for the game flow
 */

export type GameState = 'how-to-play' | 'playing' | 'round-complete' | 'game-over';

export interface GameCategory {
  id: string;
  name: string;
  icon: string;
}

export interface RoundData {
  letter: string;
  timeRemaining: number;
  answers: Record<string, string>;
  score: number;
}

export interface GameMachineContext {
  state: GameState;
  currentRound: number;
  totalRounds: number;
  letter: string;
  categories: GameCategory[];
  answers: Record<string, string>;
  score: number;
  streak: number;
  timeRemaining: number;
}

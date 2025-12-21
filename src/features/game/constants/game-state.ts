/**
 * Game State Constants
 *
 * Finite state machine states for game flow
 * NO STRING LITERALS - Using const object maps
 */

export const GameState = {
  ROUND_START: 'ROUND_START',
  ROULETTE_SPIN: 'ROULETTE_SPIN',
  LETTER_REVEAL: 'LETTER_REVEAL',
  ANSWERING: 'ANSWERING',
  ROUND_SUMMARY: 'ROUND_SUMMARY',
  FINAL_SUMMARY: 'FINAL_SUMMARY',
} as const;

export type GameStateType = typeof GameState[keyof typeof GameState];

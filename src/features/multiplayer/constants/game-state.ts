/**
 * Multiplayer Game State Constants
 *
 * Finite state machine states for multiplayer game flow
 * NO STRING LITERALS - Using const object maps
 */

export const MultiplayerGameState = {
  COUNTDOWN: 'COUNTDOWN',
  ROUND_START: 'ROUND_START',
  ROULETTE_SPIN: 'ROULETTE_SPIN',
  LETTER_REVEAL: 'LETTER_REVEAL',
  ANSWERING: 'ANSWERING',
  ROUND_RESULTS: 'ROUND_RESULTS',
  FINAL_SUMMARY: 'FINAL_SUMMARY',
} as const;

export type MultiplayerGameStateType = typeof MultiplayerGameState[keyof typeof MultiplayerGameState];

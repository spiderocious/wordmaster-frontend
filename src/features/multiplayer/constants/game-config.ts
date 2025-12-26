/**
 * Multiplayer Game Configuration Constants
 *
 * Default values and available options for multiplayer games
 */

export const DEFAULT_ROUNDS_COUNT = 4;
export const MIN_ROUNDS_COUNT = 1;
export const MAX_ROUNDS_COUNT = 10;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

export const AVAILABLE_CATEGORIES = [
  "name",
  "place",
  "animal",
  "food",
  "country",
  "city",
  "language",
  "currency",
  "bible",
  "car",
] as const;

export const AVAILABLE_LETTERS = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
] as const;

export const MINIMUM_CATEGORIES = 3;

export const DEFAULT_EXCLUDED_LETTERS = ["Q", "X", "Z"];

export function getAvatarUrl(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    username
  )}`;
}

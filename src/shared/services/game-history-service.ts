/**
 * Game History Service
 *
 * Abstraction for managing game history
 * Can be switched to backend API calls in the future
 */

import { cacheService } from './cache-service';

export const GameStatus = {
  PENDING: 'PENDING',
  COMPLETE: 'COMPLETE',
} as const;

export type GameStatusType = typeof GameStatus[keyof typeof GameStatus];

export interface GameHistoryEntry {
  gameId: string;
  date: string;
  totalScore: number | null;
  status: GameStatusType;
}

const GAME_HISTORIES_KEY = 'game-histories';

class GameHistoryService {
  getAll(): GameHistoryEntry[] {
    return cacheService.get<GameHistoryEntry[]>(GAME_HISTORIES_KEY) || [];
  }

  add(entry: GameHistoryEntry): void {
    const histories = this.getAll();
    histories.push(entry);
    cacheService.save(GAME_HISTORIES_KEY, histories);
  }

  update(gameId: string, updates: Partial<GameHistoryEntry>): void {
    const histories = this.getAll();
    const index = histories.findIndex((h) => h.gameId === gameId);

    if (index !== -1) {
      histories[index] = { ...histories[index], ...updates };
      cacheService.save(GAME_HISTORIES_KEY, histories);
    }
  }

  getByGameId(gameId: string): GameHistoryEntry | null {
    const histories = this.getAll();
    return histories.find((h) => h.gameId === gameId) || null;
  }

  remove(gameId: string): void {
    const histories = this.getAll();
    const filtered = histories.filter((h) => h.gameId !== gameId);
    cacheService.save(GAME_HISTORIES_KEY, filtered);
  }

  clear(): void {
    cacheService.remove(GAME_HISTORIES_KEY);
  }
}

export const gameHistoryService = new GameHistoryService();

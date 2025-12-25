/**
 * Username Service
 *
 * Service for managing username storage and retrieval
 */

import { cacheService } from './cache-service';

const USERNAME_CACHE_KEY = 'wordshot_username';

class UsernameService {
  /**
   * Get saved username from local storage
   */
  getUsername(): string | null {
    return cacheService.get<string>(USERNAME_CACHE_KEY);
  }

  /**
   * Save username to local storage
   */
  saveUsername(username: string): boolean {
    return cacheService.save(USERNAME_CACHE_KEY, username);
  }

  /**
   * Remove username from local storage
   */
  removeUsername(): boolean {
    return cacheService.remove(USERNAME_CACHE_KEY);
  }

  /**
   * Check if username exists in local storage
   */
  hasUsername(): boolean {
    return this.getUsername() !== null;
  }
}

export const usernameService = new UsernameService();

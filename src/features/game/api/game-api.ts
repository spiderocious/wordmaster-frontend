/**
 * Game API Service
 *
 * API methods for game operations
 */

import { apiClient } from '@shared/api/axios-instance';
import { StartGameResponse, StartGamePayload, ValidateResponse, Answer } from '../types/game-types';

export const gameApi = {
  /**
   * Start a new single player game
   */
  async startSingleGame(payload?: StartGamePayload): Promise<StartGameResponse> {
    const response = await apiClient.post<StartGameResponse>('/api/game/single/start', payload);
    return response.data;
  },

  /**
   * Validate answers
   */
  async validateAnswers(answers: Answer[]): Promise<ValidateResponse> {
    const response = await apiClient.post<ValidateResponse>('/api/game/validate', answers);
    return response.data;
  },
};

/**
 * Game API Service
 *
 * API methods for game operations
 */

import { apiClient } from '@shared/api/axios-instance';
import { StartGameResponse, StartGamePayload, ValidateResponse, FinalSummaryResponse, Answer } from '../types/game-types';

export const gameApi = {
  /**
   * Start a new single player game
   */
  async startSingleGame(payload?: StartGamePayload): Promise<StartGameResponse> {
    const response = await apiClient.post<StartGameResponse>('/api/game/single/start', payload);
    return response.data;
  },

  /**
   * Validate answers for a round
   */
  async validateAnswers(answers: Answer[]): Promise<ValidateResponse> {
    const response = await apiClient.post<ValidateResponse>('/api/game/validate', answers);
    return response.data;
  },

  /**
   * Get final game summary with all answers
   */
  async getFinalSummary(answers: Answer[]): Promise<FinalSummaryResponse> {
    const response = await apiClient.post<FinalSummaryResponse>('/api/game/submit', answers);
    return response.data;
  },
};

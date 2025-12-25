/**
 * User API Service
 *
 * API methods for user operations
 */

import { apiClient } from './axios-instance';
import { UsernameCheckRequest, UsernameCheckResponse } from '../types/user-types';

export const userApi = {
  /**
   * Check if username is available
   */
  async checkUsername(username: string): Promise<UsernameCheckResponse> {
    const payload: UsernameCheckRequest = { username };
    const response = await apiClient.post<UsernameCheckResponse>(
      '/api/users/username-check',
      payload
    );
    return response.data;
  },
};

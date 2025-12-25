/**
 * User Types
 *
 * Type definitions for user-related data
 */

export interface UsernameCheckRequest {
  username: string;
}

export interface UsernameCheckResponse {
  success: boolean;
  data: {
    available: boolean;
    username: string;
  };
  message: string;
}

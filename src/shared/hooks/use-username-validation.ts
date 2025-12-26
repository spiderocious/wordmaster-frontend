/**
 * Username Validation Hook
 *
 * Hook for validating username availability with debouncing
 */

import { useState, useEffect, useCallback } from 'react';
import { userApi } from '../api/user-api';

interface UsernameValidationState {
  isChecking: boolean;
  isAvailable: boolean | null;
  error: string | null;
}

export function useUsernameValidation(username: string, debounceMs = 500) {
  const [state, setState] = useState<UsernameValidationState>({
    isChecking: false,
    isAvailable: null,
    error: null,
  });

  const checkUsername = useCallback(async (usernameToCheck: string) => {
    if (!usernameToCheck || usernameToCheck.trim().length < 3) {
      setState({
        isChecking: false,
        isAvailable: null,
        error: usernameToCheck.trim().length > 0 ? 'Username must be at least 3 characters' : null,
      });
      return;
    }

    setState({ isChecking: true, isAvailable: null, error: null });

    try {
      const response = await userApi.checkUsername(usernameToCheck.trim());

      if (response.success) {
        setState({
          isChecking: false,
          isAvailable: response.data.available,
          error: response.data.available ? null : 'Username is already taken',
        });
      } else {
        setState({
          isChecking: false,
          isAvailable: null,
          error: response.message || 'Failed to check username',
        });
      }
    } catch (error) {
      setState({
        isChecking: false,
        isAvailable: null,
        error: 'Failed to check username availability',
      });
    }
  }, []);

  useEffect(() => {
    const trimmedUsername = username.trim();

    if (!trimmedUsername) {
      setState({ isChecking: false, isAvailable: null, error: null });
      return;
    }

    const timeoutId = setTimeout(() => {
      checkUsername(trimmedUsername);
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [username, debounceMs, checkUsername]);

  return state;
}

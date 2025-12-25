/**
 * Username Guard Hook
 *
 * Hook to ensure user has a username before proceeding
 */

import { useState, useCallback } from 'react';
import { usernameService } from '../services/username-service';

interface UseUsernameGuardResult {
  hasUsername: boolean;
  username: string | null;
  showModal: boolean;
  checkAndPrompt: () => boolean;
  closeModal: () => void;
  saveUsername: (username: string) => void;
}

export function useUsernameGuard(): UseUsernameGuardResult {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState<string | null>(
    usernameService.getUsername()
  );

  const checkAndPrompt = useCallback((): boolean => {
    const savedUsername = usernameService.getUsername();

    if (savedUsername) {
      setUsername(savedUsername);
      return true;
    }

    setShowModal(true);
    return false;
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
  }, []);

  const saveUsername = useCallback((newUsername: string) => {
    usernameService.saveUsername(newUsername);
    setUsername(newUsername);
    setShowModal(false);
  }, []);

  return {
    hasUsername: username !== null,
    username,
    showModal,
    checkAndPrompt,
    closeModal,
    saveUsername,
  };
}

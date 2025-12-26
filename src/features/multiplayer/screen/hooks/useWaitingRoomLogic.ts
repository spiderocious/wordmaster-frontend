/**
 * Waiting Room Logic Hook
 *
 * Extracts all business logic, state management, and event handlers
 * from the waiting room UI. Can be reused for both mobile and desktop layouts.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMultiplayer } from '../../providers/multiplayer-provider';
import { soundService } from '@shared/services/sound-service';
import { ROUTES } from '@shared/constants/routes';
import { MIN_PLAYERS, MAX_PLAYERS } from '../../constants/game-config';

export function useWaitingRoomLogic() {
  const navigate = useNavigate();
  const { room, isHost, startGame, leaveRoom, endGame, error, messages, sendChatMessage } =
    useMultiplayer();

  // Local UI state
  const [copyCodeSuccess, setCopyCodeSuccess] = useState(false);
  const [copyLinkSuccess, setCopyLinkSuccess] = useState(false);
  const [showConfigUpdate, setShowConfigUpdate] = useState(false);
  const [showEndGameDialog, setShowEndGameDialog] = useState(false);
  const [isUpdatingConfig, setIsUpdatingConfig] = useState(false);
  const prevConfigRef = useRef(room?.config);

  // Derived state
  const playerCount = room?.players.length || 0;
  const onlinePlayerCount = room?.players.filter(p => p.status === 'active').length || 0;
  const canStartGame = isHost && playerCount >= MIN_PLAYERS && !isUpdatingConfig;
  const isGameActive = room?.phase !== 'waiting';

  // Listen for config updates - disable start button for 3 seconds
  useEffect(() => {
    if (!room?.config) return;

    const prevConfig = prevConfigRef.current;
    const currentConfig = room.config;

    // Check if config actually changed
    if (
      prevConfig &&
      (prevConfig.roundsCount !== currentConfig.roundsCount ||
        JSON.stringify(prevConfig.supportedCategories) !==
          JSON.stringify(currentConfig.supportedCategories) ||
        JSON.stringify(prevConfig.excludedLetters) !== JSON.stringify(currentConfig.excludedLetters))
    ) {
      // Config is being updated - disable start button
      setIsUpdatingConfig(true);

      // Show notification for non-host players
      if (!isHost) {
        setShowConfigUpdate(true);
        soundService.playSuccess();

        setTimeout(() => {
          setShowConfigUpdate(false);
        }, 3000);
      }

      // Re-enable start button after 3 seconds
      setTimeout(() => {
        setIsUpdatingConfig(false);
      }, 3000);
    }

    // Update ref
    prevConfigRef.current = currentConfig;
  }, [room?.config, isHost]);

  // Event handlers
  const handleCopyCode = useCallback(() => {
    if (room?.joinCode) {
      navigator.clipboard.writeText(room.joinCode);
      setCopyCodeSuccess(true);
      soundService.playSuccess();

      setTimeout(() => {
        setCopyCodeSuccess(false);
      }, 2000);
    }
  }, [room?.joinCode]);

  const handleCopyLink = useCallback(() => {
    if (room?.joinCode) {
      const shareUrl = `${window.location.origin}/multiplayer/join/${room.joinCode}`;
      navigator.clipboard.writeText(shareUrl);
      setCopyLinkSuccess(true);
      soundService.playSuccess();

      setTimeout(() => {
        setCopyLinkSuccess(false);
      }, 2000);
    }
  }, [room?.joinCode]);

  const handleShareLink = useCallback(async () => {
    if (room?.joinCode) {
      const shareUrl = `${window.location.origin}/multiplayer/join/${room.joinCode}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join my WordShot game!',
            text: `Use code ${room.joinCode} to join my WordShot multiplayer game!`,
            url: shareUrl,
          });
          soundService.playSuccess();
        } catch (error) {
          // User cancelled or share failed, fallback to copy
          handleCopyLink();
        }
      } else {
        // Fallback for browsers without Web Share API
        handleCopyLink();
      }
    }
  }, [room?.joinCode, handleCopyLink]);

  const handleStartGame = useCallback(() => {
    if (canStartGame) {
      soundService.playButtonClick();
      startGame();
    }
  }, [canStartGame, startGame]);

  const handleLeaveRoom = useCallback(() => {
    soundService.playButtonClick();
    leaveRoom();
    navigate(ROUTES.multiplayer.mode.absPath);
  }, [leaveRoom, navigate]);

  const handleEndGame = useCallback(() => {
    setShowEndGameDialog(true);
  }, []);

  const handleConfirmEndGame = useCallback(() => {
    endGame();
    setShowEndGameDialog(false);
  }, [endGame]);

  const handleCancelEndGame = useCallback(() => {
    setShowEndGameDialog(false);
  }, []);

  return {
    // Room data
    room,
    isHost,
    error,

    // Derived state
    playerCount,
    onlinePlayerCount,
    canStartGame,
    isGameActive,

    // UI state
    copyCodeSuccess,
    copyLinkSuccess,
    showConfigUpdate,
    showEndGameDialog,
    isUpdatingConfig,

    // Chat
    messages,
    sendChatMessage,

    // Event handlers
    handleCopyCode,
    handleCopyLink,
    handleShareLink,
    handleStartGame,
    handleLeaveRoom,
    handleEndGame,
    handleConfirmEndGame,
    handleCancelEndGame,

    // Constants
    MIN_PLAYERS,
    MAX_PLAYERS,
  };
}

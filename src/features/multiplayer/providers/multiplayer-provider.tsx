/**
 * Multiplayer Provider
 *
 * Manages multiplayer game state and WebSocket event handling
 */

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWebSocket } from './websocket-provider';
import {
  Room,
  Player,
  GameConfig,
  WSMessageType,
  RoomCreatePayload,
  RoomJoinPayload,
  RoomLeavePayload,
  GameStartPayload,
  RoomCreatedResponse,
  RoomJoinedResponse,
  PlayerJoinedBroadcast,
  PlayerLeftBroadcast,
  GameStartedBroadcast,
  RoundStartedBroadcast,
  RoundEndedBroadcast,
  AnswerSubmittedBroadcast,
  GameFinishedBroadcast,
  ErrorResponse,
} from '../types/multiplayer-types';

interface MultiplayerContextValue {
  // Room state
  room: Room | null;
  isHost: boolean;
  currentPlayer: Player | null;

  // Actions
  createRoom: (payload: RoomCreatePayload) => void;
  joinRoom: (payload: RoomJoinPayload) => void;
  leaveRoom: () => void;
  startGame: () => void;
  updateGameConfig: (config: GameConfig) => void;

  // Loading states
  isCreatingRoom: boolean;
  isJoiningRoom: boolean;

  // Error state
  error: string | null;
  clearError: () => void;
}

const MultiplayerContext = createContext<MultiplayerContextValue | null>(null);

export function useMultiplayer(): MultiplayerContextValue {
  const context = useContext(MultiplayerContext);
  if (!context) {
    throw new Error('useMultiplayer must be used within MultiplayerProvider');
  }
  return context;
}

interface MultiplayerProviderProps {
  children: ReactNode;
  username: string;
}

export function MultiplayerProvider({ children, username }: MultiplayerProviderProps) {
  const navigate = useNavigate();
  const { socket, sendMessage, isConnected } = useWebSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentPlayer = room?.players.find(p => p.username === username) || null;
  const isHost = currentPlayer?.role === 'host';

  // Room creation
  const createRoom = useCallback((payload: RoomCreatePayload) => {
    if (!isConnected) {
      setError('Not connected to server');
      return;
    }

    setIsCreatingRoom(true);
    setError(null);
    sendMessage(WSMessageType.ROOM_CREATE, payload);
  }, [isConnected, sendMessage]);

  // Room joining
  const joinRoom = useCallback((payload: RoomJoinPayload) => {
    if (!isConnected) {
      setError('Not connected to server');
      return;
    }

    setIsJoiningRoom(true);
    setError(null);
    sendMessage(WSMessageType.ROOM_JOIN, payload);
  }, [isConnected, sendMessage]);

  // Leave room
  const leaveRoom = useCallback(() => {
    if (!room) return;

    const payload: RoomLeavePayload = {
      roomId: room.roomId,
      username,
    };

    sendMessage(WSMessageType.ROOM_LEAVE, payload);
    setRoom(null);
  }, [room, username, sendMessage]);

  // Start game
  const startGame = useCallback(() => {
    if (!room || !isHost) {
      setError('Only host can start the game');
      return;
    }

    if (room.players.length < 2) {
      setError('Need at least 2 players to start');
      return;
    }

    const payload: GameStartPayload = {
      roomId: room.roomId,
      username,
    };

    sendMessage(WSMessageType.GAME_START, payload);
  }, [room, isHost, username, sendMessage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update game config (host only)
  const updateGameConfig = useCallback((config: GameConfig) => {
    if (!isHost || !room) return;

    setRoom(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        config,
      };
    });

    // TODO: Emit config update to WebSocket if needed
  }, [isHost, room]);

  // Set up event listeners
  useEffect(() => {
    if (!socket) return;

    // Room created
    socket.on(WSMessageType.ROOM_CREATED, (response: RoomCreatedResponse) => {
      console.log('[Multiplayer] Room created:', response);
      setIsCreatingRoom(false);

      if (response.success) {
        setRoom(response.data);
      }
    });

    // Room joined
    socket.on(WSMessageType.ROOM_JOINED, (response: RoomJoinedResponse) => {
      console.log('[Multiplayer] Room joined:', response);
      setIsJoiningRoom(false);

      if (response.success) {
        setRoom(response.data);
      }
    });

    // Room left
    socket.on(WSMessageType.ROOM_LEFT, () => {
      console.log('[Multiplayer] Left room');
      setRoom(null);
    });

    // Player joined broadcast
    socket.on(WSMessageType.PLAYER_JOINED, (data: PlayerJoinedBroadcast) => {
      console.log('[Multiplayer] Player joined:', data);

      setRoom(prev => {
        if (!prev) return prev;

        const newPlayer: Player = {
          userId: null,
          username: data.username,
          avatar: data.avatar,
          role: data.role,
          status: 'active',
          currentScore: 0,
          isGuest: true,
        };

        return {
          ...prev,
          players: [...prev.players, newPlayer],
        };
      });
    });

    // Player left broadcast
    socket.on(WSMessageType.PLAYER_LEFT, (data: PlayerLeftBroadcast) => {
      console.log('[Multiplayer] Player left:', data);

      setRoom(prev => {
        if (!prev) return prev;

        const updatedPlayers = prev.players.filter(p => p.username !== data.username);

        // Update host if needed
        if (data.newHostId) {
          updatedPlayers.forEach(p => {
            if (p.username === data.newHostId) {
              p.role = 'host';
            }
          });
        }

        return {
          ...prev,
          players: updatedPlayers,
          hostId: data.newHostId || prev.hostId,
        };
      });
    });

    // Game started broadcast
    socket.on(WSMessageType.GAME_STARTED, (data: GameStartedBroadcast) => {
      console.log('[Multiplayer] Game started:', data);
      console.log('[Multiplayer] Phase from server:', data.phase);
      console.log('[Multiplayer] Round data:', data.round);

      setRoom(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          phase: 'playing', // Go directly to playing phase (server includes round data)
          currentRound: data.round.roundNumber,
          totalRounds: data.totalRounds,
          roundData: data.round,
        };
      });

      // Navigate to session screen
      navigate('/multiplayer/session');
    });

    // Round started broadcast
    socket.on(WSMessageType.ROUND_STARTED, (data: RoundStartedBroadcast) => {
      console.log('[Multiplayer] Round started:', data);

      setRoom(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          phase: 'playing', // Go directly to playing phase
          currentRound: data.roundNumber,
          totalRounds: data.totalRounds,
          roundData: data.round,
        };
      });
    });

    // Round ended broadcast
    socket.on(WSMessageType.ROUND_ENDED, (data: RoundEndedBroadcast) => {
      console.log('[Multiplayer] Round ended:', data);

      setRoom(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          phase: data.phase,
        };
      });
    });

    // Answer submitted broadcast
    socket.on(WSMessageType.ANSWER_SUBMITTED, (data: AnswerSubmittedBroadcast) => {
      console.log('[Multiplayer] Answer submitted:', data);
      // This is used to update UI showing how many players have submitted
      // The answering screen will listen to this via the provider
    });

    // Game finished broadcast
    socket.on(WSMessageType.GAME_FINISHED, (data: GameFinishedBroadcast) => {
      console.log('[Multiplayer] Game finished:', data);

      setRoom(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          phase: data.phase,
        };
      });
    });

    // Error handling
    socket.on(WSMessageType.ERROR, (errorResponse: ErrorResponse) => {
      console.error('[Multiplayer] Error:', errorResponse);
      setError(errorResponse.message);
      setIsCreatingRoom(false);
      setIsJoiningRoom(false);
    });

    return () => {
      socket.off(WSMessageType.ROOM_CREATED);
      socket.off(WSMessageType.ROOM_JOINED);
      socket.off(WSMessageType.ROOM_LEFT);
      socket.off(WSMessageType.PLAYER_JOINED);
      socket.off(WSMessageType.PLAYER_LEFT);
      socket.off(WSMessageType.GAME_STARTED);
      socket.off(WSMessageType.ROUND_STARTED);
      socket.off(WSMessageType.ROUND_ENDED);
      socket.off(WSMessageType.ANSWER_SUBMITTED);
      socket.off(WSMessageType.GAME_FINISHED);
      socket.off(WSMessageType.ERROR);
    };
  }, [socket]);

  const value: MultiplayerContextValue = {
    room,
    isHost,
    currentPlayer,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    updateGameConfig,
    isCreatingRoom,
    isJoiningRoom,
    error,
    clearError,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
}

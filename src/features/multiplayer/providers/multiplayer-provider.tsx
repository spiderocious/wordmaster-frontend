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
  ChatMessage,
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
  GameEndedBroadcast,
  ConfigUpdatePayload,
  GameEndPayload,
  ConfigUpdatedBroadcast,
  ChatMessagePayload,
  ErrorResponse,
} from '../types/multiplayer-types';
import { MAX_ROUNDS_COUNT, MIN_ROUNDS_COUNT, MINIMUM_CATEGORIES } from '../constants/game-config';

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
  endGame: () => void;
  sendChatMessage: (message: string) => void;

  // Loading states
  isCreatingRoom: boolean;
  isJoiningRoom: boolean;

  // Error state
  error: string | null;
  clearError: () => void;

  // Chat
  messages: ChatMessage[];
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
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const currentPlayer = room?.players.find(p => p.username === username) || null;
  const isHost = currentPlayer?.role === 'host';

  // SessionStorage keys for reconnection
  const STORAGE_KEYS = {
    ROOM_DATA: 'multiplayer_room_data',
    USERNAME: 'multiplayer_username',
  };

  // Persist room data to sessionStorage whenever it changes
  useEffect(() => {
    if (room && currentPlayer) {
      sessionStorage.setItem(STORAGE_KEYS.ROOM_DATA, JSON.stringify({
        roomId: room.roomId,
        joinCode: room.joinCode,
        phase: room.phase,
        avatar: currentPlayer.avatar,
      }));
      sessionStorage.setItem(STORAGE_KEYS.USERNAME, username);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
      sessionStorage.removeItem(STORAGE_KEYS.USERNAME);
    }
  }, [room, username, currentPlayer]);

  // Auto-rejoin room on reconnection
  useEffect(() => {
    const handleReconnection = () => {
      console.log('[Multiplayer] WebSocket reconnected, attempting to rejoin room...');

      const storedRoomData = sessionStorage.getItem(STORAGE_KEYS.ROOM_DATA);
      const storedUsername = sessionStorage.getItem(STORAGE_KEYS.USERNAME);

      if (storedRoomData && storedUsername && isConnected && !room) {
        try {
          const roomData = JSON.parse(storedRoomData);

          console.log('[Multiplayer] Rejoining room:', roomData.joinCode);

          // Attempt to rejoin the room
          const rejoinPayload: RoomJoinPayload = {
            joinCode: roomData.joinCode,
            username: storedUsername,
            avatar: roomData.avatar,
          };

          setIsJoiningRoom(true);
          sendMessage(WSMessageType.ROOM_JOIN, rejoinPayload);
        } catch (err) {
          console.error('[Multiplayer] Failed to parse stored room data:', err);
          sessionStorage.removeItem(STORAGE_KEYS.ROOM_DATA);
          sessionStorage.removeItem(STORAGE_KEYS.USERNAME);
        }
      }
    };

    window.addEventListener('websocket:reconnected', handleReconnection);

    return () => {
      window.removeEventListener('websocket:reconnected', handleReconnection);
    };
  }, [isConnected, room, sendMessage]);

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

    if (room.config.roundsCount < MIN_ROUNDS_COUNT || room.config.roundsCount > MAX_ROUNDS_COUNT) {
      setError(`Rounds count must be between ${MIN_ROUNDS_COUNT} and ${MAX_ROUNDS_COUNT}`);
      return;
    }

    if (room.config.supportedCategories.length < MINIMUM_CATEGORIES) {
      setError(`Select at least ${MINIMUM_CATEGORIES} categories to start`);
      return;
    }

    console.log(room.config);

    const payload: GameStartPayload = {
      roomId: room.roomId,
      username,
      config: room.config,
    };

    sendMessage(WSMessageType.GAME_START, payload);
  }, [room, isHost, username, sendMessage]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Update game config (host only)
  const updateGameConfig = useCallback((config: GameConfig) => {
    if (!isHost || !room) {
      setError('Only host can update configuration');
      return;
    }

    const payload: ConfigUpdatePayload = {
      roomId: room.roomId,
      username,
      config,
    };

    sendMessage(WSMessageType.CONFIG_UPDATE, payload);
  }, [isHost, room, username, sendMessage]);

  // End game (host only)
  const endGame = useCallback(() => {
    if (!isHost || !room) {
      setError('Only host can end the game');
      return;
    }

    const payload: GameEndPayload = {
      roomId: room.roomId,
      username,
    };

    sendMessage(WSMessageType.GAME_END, payload);
  }, [isHost, room, username, sendMessage]);

  // Send chat message
  const sendChatMessage = useCallback((message: string) => {
    if (!room) {
      setError('Not in a room');
      return;
    }

    if (!message.trim()) {
      return; // Don't send empty messages
    }

    if (message.length > 500) {
      setError('Message too long (max 500 characters)');
      return;
    }

    const payload: ChatMessagePayload = {
      roomId: room.roomId,
      username,
      message: message.trim(),
    };

    sendMessage(WSMessageType.CHAT_MESSAGE, payload);
  }, [room, username, sendMessage]);

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
          phase: 'round_end', // Always set to round_end when round ends
        };
      });
    });

    // Answer submitted broadcast
    socket.on(WSMessageType.ANSWER_SUBMITTED, (data: AnswerSubmittedBroadcast) => {
      console.log('[Multiplayer] Answer submitted:', data);

      // Check if all players have submitted - transition to round_end CLIENT-SIDE
      if (data.allSubmitted) {
        console.log('[Multiplayer] All players submitted! Transitioning to round_end');
        setRoom(prev => {
          if (!prev) return prev;
          return {
            ...prev,
            phase: 'round_end',
          };
        });
      }
    });

    // Game finished broadcast
    socket.on(WSMessageType.GAME_FINISHED, (data: GameFinishedBroadcast) => {
      console.log('[Multiplayer] Game finished:', data);

      setRoom(prev => {
        if (!prev) return prev;

        return {
          ...prev,
          phase: 'finished', // Always set to finished when game ends
        };
      });
    });

    // Game ended broadcast (host ended game early)
    socket.on(WSMessageType.GAME_ENDED, (data: GameEndedBroadcast) => {
      console.log('[Multiplayer] Game ended by host:', data);

      // Reset room to waiting phase
      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          phase: 'waiting',
          currentRound: undefined,
          totalRounds: undefined,
          roundData: undefined,
          // Keep players in room, just reset game state
          players: prev.players.map(p => ({
            ...p,
            currentScore: 0,
            isReady: false,
          })),
        };
      });
    });

    // Config updated broadcast (from host)
    socket.on(WSMessageType.CONFIG_UPDATED, (data: ConfigUpdatedBroadcast) => {
      console.log('[Multiplayer] Config updated:', data);

      setRoom(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          config: data.config,
        };
      });
    });

    // Chat message broadcast - server sends 'chat:message'
    socket.on(WSMessageType.CHAT_MESSAGE, (data: ChatMessage) => {
      console.log('[Multiplayer] Chat message received:', data);
      setMessages(prev => [...prev, data]);
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
      socket.off(WSMessageType.GAME_ENDED);
      socket.off(WSMessageType.CONFIG_UPDATED);
      socket.off(WSMessageType.CHAT_MESSAGE);
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
    endGame,
    sendChatMessage,
    isCreatingRoom,
    isJoiningRoom,
    error,
    clearError,
    messages,
  };

  return (
    <MultiplayerContext.Provider value={value}>
      {children}
    </MultiplayerContext.Provider>
  );
}

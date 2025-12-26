/**
 * WebSocket Provider
 *
 * Manages Socket.IO connection and provides WebSocket context
 * with automatic reconnection handling and Page Visibility API support
 */

import { createContext, useContext, ReactNode, useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@shared/config';
import { WSMessageType } from '../types/multiplayer-types';

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  isReconnecting: boolean;
  reconnectAttempt: number;
  sendMessage: (event: string, data?: unknown) => void;
  manualReconnect: () => void;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export function useWebSocket(): WebSocketContextValue {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within WebSocketProvider');
  }
  return context;
}

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const wasConnectedRef = useRef(false);

  // Manual reconnect function
  const manualReconnect = useCallback(() => {
    if (socket && !isConnected) {
      console.log('[WebSocket] Manual reconnect triggered');
      socket.connect();
    }
  }, [socket, isConnected]);

  useEffect(() => {
    const socketInstance = io(config.apiBaseUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity, // Never give up trying
      reconnectionDelay: 1000,
      reconnectionDelayMax: 10000, // Max 10 seconds between attempts
      timeout: 20000,
      autoConnect: true,
    });

    setSocket(socketInstance);

    // Connection established
    socketInstance.on(WSMessageType.CONNECT, () => {
      console.log('[WebSocket] Connected:', socketInstance.id);
      setIsConnected(true);
      setIsReconnecting(false);
      setReconnectAttempt(0);
      wasConnectedRef.current = true;

      // Trigger reconnection event for multiplayer provider to handle room rejoin
      if (wasConnectedRef.current) {
        window.dispatchEvent(new CustomEvent('websocket:reconnected', {
          detail: { socketId: socketInstance.id }
        }));
      }
    });

    // Disconnection
    socketInstance.on(WSMessageType.DISCONNECT, (reason) => {
      console.log('[WebSocket] Disconnected:', reason);
      setIsConnected(false);

      // Only set reconnecting if it was an unexpected disconnect
      if (reason === 'io server disconnect' || reason === 'io client disconnect') {
        setIsReconnecting(false);
      } else {
        setIsReconnecting(true);
      }
    });

    // Connection error
    socketInstance.on(WSMessageType.CONNECT_ERROR, (error) => {
      console.error('[WebSocket] Connection error:', error);
      setIsConnected(false);
      setIsReconnecting(true);
    });

    // Reconnection attempt
    socketInstance.io.on('reconnect_attempt', (attempt) => {
      console.log('[WebSocket] Reconnection attempt:', attempt);
      setReconnectAttempt(attempt);
      setIsReconnecting(true);
    });

    // Reconnection failed (shouldn't happen with Infinity attempts, but just in case)
    socketInstance.io.on('reconnect_failed', () => {
      console.error('[WebSocket] Reconnection failed');
      setIsReconnecting(false);
    });

    // Successful reconnection
    socketInstance.io.on('reconnect', (attempt) => {
      console.log('[WebSocket] Reconnected after', attempt, 'attempts');
      setIsReconnecting(false);
      setReconnectAttempt(0);
    });

    return () => {
      console.log('[WebSocket] Cleaning up connection');
      wasConnectedRef.current = false;
      socketInstance.disconnect();
    };
  }, []);

  // Handle Page Visibility API - reconnect when page becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && socket && !isConnected && wasConnectedRef.current) {
        console.log('[WebSocket] Page became visible, checking connection...');

        // Force reconnect if we were connected before
        if (!socket.connected) {
          console.log('[WebSocket] Forcing reconnection after page resume');
          socket.connect();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [socket, isConnected]);

  // Handle page focus/blur events (additional safety net)
  useEffect(() => {
    const handleFocus = () => {
      if (socket && !isConnected && wasConnectedRef.current) {
        console.log('[WebSocket] Window focused, checking connection...');
        if (!socket.connected) {
          socket.connect();
        }
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [socket, isConnected]);

  const sendMessage = useCallback((event: string, data?: unknown) => {
    if (socket && isConnected) {
      console.log(`[WebSocket] Sending ${event}:`, data);
      socket.emit(event, data);
    } else {
      console.warn(`[WebSocket] Cannot send ${event}: Socket not connected`);
    }
  }, [socket, isConnected]);

  const value: WebSocketContextValue = {
    socket,
    isConnected,
    isReconnecting,
    reconnectAttempt,
    sendMessage,
    manualReconnect,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

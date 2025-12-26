/**
 * WebSocket Provider
 *
 * Manages Socket.IO connection and provides WebSocket context
 */

import { createContext, useContext, ReactNode, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { config } from '@shared/config';
import { WSMessageType } from '../types/multiplayer-types';

interface WebSocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  sendMessage: (event: string, data?: unknown) => void;
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

  useEffect(() => {
    const socketInstance = io(config.apiBaseUrl, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    setSocket(socketInstance);

    socketInstance.on(WSMessageType.CONNECT, () => {
      console.log('[WebSocket] Connected:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on(WSMessageType.DISCONNECT, () => {
      console.log('[WebSocket] Disconnected');
      setIsConnected(false);
    });

    socketInstance.on(WSMessageType.CONNECT_ERROR, (error) => {
      console.error('[WebSocket] Connection error:', error);
      setIsConnected(false);
    });

    return () => {
      console.log('[WebSocket] Cleaning up connection');
      socketInstance.disconnect();
    };
  }, []);

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
    sendMessage,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

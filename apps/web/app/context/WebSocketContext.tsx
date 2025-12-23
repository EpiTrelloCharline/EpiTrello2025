'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinBoard: (boardId: string) => void;
  leaveBoard: (boardId: string) => void;
  startEditingCard: (boardId: string, cardId: string, userId: string, userName: string) => Promise<{ success: boolean; conflict?: boolean; editor?: any }>;
  endEditingCard: (boardId: string, cardId: string, userId: string) => Promise<{ success: boolean }>;
}

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  isConnected: false,
  joinBoard: () => {},
  leaveBoard: () => {},
  startEditingCard: async () => ({ success: false }),
  endEditingCard: async () => ({ success: false }),
});

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Initialize socket connection
    const socketInstance = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000', {
      auth: {
        token,
      },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socketInstance.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const joinBoard = useCallback((boardId: string) => {
    if (socket) {
      socket.emit('joinBoard', { boardId });
      console.log('Joined board:', boardId);
    }
  }, [socket]);

  const leaveBoard = useCallback((boardId: string) => {
    if (socket) {
      socket.emit('leaveBoard', { boardId });
      console.log('Left board:', boardId);
    }
  }, [socket]);

  const startEditingCard = useCallback(async (
    boardId: string,
    cardId: string,
    userId: string,
    userName: string
  ): Promise<{ success: boolean; conflict?: boolean; editor?: any }> => {
    return new Promise((resolve) => {
      if (socket) {
        socket.emit('startEditingCard', { boardId, cardId, userId, userName }, (response: any) => {
          resolve(response);
        });
      } else {
        resolve({ success: false });
      }
    });
  }, [socket]);

  const endEditingCard = useCallback(async (
    boardId: string,
    cardId: string,
    userId: string
  ): Promise<{ success: boolean }> => {
    return new Promise((resolve) => {
      if (socket) {
        socket.emit('endEditingCard', { boardId, cardId, userId }, (response: any) => {
          resolve(response);
        });
      } else {
        resolve({ success: false });
      }
    });
  }, [socket]);

  const value: WebSocketContextType = {
    socket,
    isConnected,
    joinBoard,
    leaveBoard,
    startEditingCard,
    endEditingCard,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

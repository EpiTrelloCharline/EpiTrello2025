'use client';

import { useState, useEffect, useCallback } from 'react';
import { useWebSocket } from '@/app/context/WebSocketContext';
import {
  getNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  Notification,
  GetNotificationsParams,
} from '@/lib/api';

export interface UseNotificationsOptions {
  boardId?: string;
  autoFetch?: boolean;
  limit?: number;
}

export interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  showUnreadOnly: boolean;
  setShowUnreadOnly: (value: boolean) => void;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  removeNotification: (notificationId: string, isRead: boolean) => Promise<void>;
  hasMore: boolean;
  loadMore: () => Promise<void>;
}

export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  const { boardId, autoFetch = true, limit = 20 } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [offset, setOffset] = useState(0);

  const { socket, isConnected } = useWebSocket();

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params: GetNotificationsParams = {
        unreadOnly: showUnreadOnly,
        boardId,
        limit,
        offset: 0,
      };
      const data = await getNotifications(params);
      setNotifications(data.notifications || []);
      setHasMore(data.hasMore || false);
      setOffset(data.notifications?.length || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
      console.error('Failed to fetch notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [showUnreadOnly, boardId, limit]);

  // Load more notifications (pagination)
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const params: GetNotificationsParams = {
        unreadOnly: showUnreadOnly,
        boardId,
        limit,
        offset,
      };
      const data = await getNotifications(params);
      setNotifications(prev => [...prev, ...(data.notifications || [])]);
      setHasMore(data.hasMore || false);
      setOffset(prev => prev + (data.notifications?.length || 0));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more notifications');
      console.error('Failed to load more notifications:', err);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, showUnreadOnly, boardId, limit, offset]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    try {
      const data = await getUnreadNotificationsCount(boardId);
      setUnreadCount(data.count || 0);
    } catch (err) {
      console.error('Failed to fetch unread count:', err);
    }
  }, [boardId]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      throw err;
    }
  }, []);

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await markAllNotificationsAsRead(boardId);
      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      throw err;
    }
  }, [boardId]);

  // Delete notification
  const removeNotification = useCallback(async (notificationId: string, isRead: boolean) => {
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (!isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (err) {
      console.error('Failed to delete notification:', err);
      throw err;
    }
  }, []);

  // Auto-fetch unread count on mount
  useEffect(() => {
    if (autoFetch) {
      fetchUnreadCount();
    }
  }, [autoFetch, fetchUnreadCount]);

  // Refetch when filter changes
  useEffect(() => {
    if (autoFetch) {
      fetchNotifications();
    }
  }, [showUnreadOnly, autoFetch, fetchNotifications]);

  // WebSocket listener for real-time notifications
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewNotification = (notification: Notification) => {
      // Only add if it matches the current filter (boardId)
      if (!boardId || notification.boardId === boardId) {
        setNotifications(prev => {
          // Avoid duplicates
          if (prev.some(n => n.id === notification.id)) {
            return prev;
          }
          // If showing unread only, only add if unread
          if (showUnreadOnly && notification.isRead) {
            return prev;
          }
          return [notification, ...prev];
        });
        setUnreadCount(prev => prev + 1);
      }
    };

    const handleNotificationRead = (data: { notificationId: string }) => {
      setNotifications(prev =>
        prev.map(n =>
          n.id === data.notificationId ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    };

    const handleNotificationDeleted = (data: { notificationId: string }) => {
      setNotifications(prev => prev.filter(n => n.id !== data.notificationId));
    };

    socket.on('notification:new', handleNewNotification);
    socket.on('notification:read', handleNotificationRead);
    socket.on('notification:deleted', handleNotificationDeleted);

    return () => {
      socket.off('notification:new', handleNewNotification);
      socket.off('notification:read', handleNotificationRead);
      socket.off('notification:deleted', handleNotificationDeleted);
    };
  }, [socket, isConnected, boardId, showUnreadOnly]);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    showUnreadOnly,
    setShowUnreadOnly,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    hasMore,
    loadMore,
  };
}

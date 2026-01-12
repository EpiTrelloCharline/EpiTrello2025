'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useWebSocket } from '@/app/context/WebSocketContext';
import { useNotifications } from '@/app/hooks/useNotifications';

interface NotificationBellProps {
  boardId?: string;
}

export function NotificationBell({ boardId }: NotificationBellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { isConnected } = useWebSocket();

  const {
    notifications,
    unreadCount,
    loading,
    showUnreadOnly,
    setShowUnreadOnly,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications({ boardId, autoFetch: true });

  // Fetch notifications when dropdown opens
  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen, fetchNotifications]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle mark as read
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  // Handle delete notification
  const handleDelete = async (notificationId: string, isRead: boolean) => {
    try {
      await removeNotification(notificationId, isRead);
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  // Get notification icon based on type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CARD_CREATED':
        return '🆕';
      case 'CARD_UPDATED':
        return '✏️';
      case 'CARD_DELETED':
        return '🗑️';
      case 'CARD_MOVED':
        return '➡️';
      case 'LABEL_ADDED':
        return '🏷️';
      case 'LABEL_REMOVED':
        return '🏷️';
      case 'MEMBER_ADDED':
        return '👤';
      case 'MEMBER_REMOVED':
        return '👤';
      case 'COMMENT_ADDED':
        return '💬';
      default:
        return '🔔';
    }
  };

  // Format time ago
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'À l\'instant';
    if (seconds < 3600) return `Il y a ${Math.floor(seconds / 60)} min`;
    if (seconds < 86400) return `Il y a ${Math.floor(seconds / 3600)}h`;
    if (seconds < 604800) return `Il y a ${Math.floor(seconds / 86400)}j`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Notifications"
        title="Notifications"
      >
        {/* Bell SVG Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
              <div className="flex items-center gap-2">
                {/* Real-time indicator */}
                {isConnected && (
                  <span className="flex items-center text-xs text-green-600" title="Temps réel actif">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    Live
                  </span>
                )}
              </div>
            </div>

            {/* Filter & Actions */}
            <div className="flex items-center justify-between mt-2">
              <label className="flex items-center text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showUnreadOnly}
                  onChange={(e) => setShowUnreadOnly(e.target.checked)}
                  className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                Non lues uniquement
              </label>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Tout marquer comme lu
                </button>
              )}
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-8 text-center text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-3 text-gray-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                <p>Aucune notification</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <li
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.isRead ? 'bg-blue-50' : ''
                    }`}
                    onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <span className="text-xl flex-shrink-0">
                        {getNotificationIcon(notification.type)}
                      </span>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-500">
                            {formatTimeAgo(notification.createdAt)}
                          </span>
                          {notification.board && (
                            <span className="text-xs text-gray-400">
                              • {notification.board.title}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-1 flex-shrink-0">
                        {!notification.isRead && (
                          <span className="w-2 h-2 bg-blue-500 rounded-full" title="Non lu"></span>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(notification.id, notification.isRead);
                          }}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          title="Supprimer"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
              <button
                onClick={fetchNotifications}
                className="w-full text-center text-sm text-blue-600 hover:text-blue-800 font-medium py-1"
              >
                Actualiser
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

'use client';

import { useEffect, useState, useRef } from 'react';
import { api } from '@/lib/api';

type Activity = {
  id: string;
  boardId: string;
  userId: string;
  type: 'CREATE_CARD' | 'DELETE_CARD' | 'MOVE_CARD' | 'UPDATE_DESCRIPTION' | 'ADD_LABEL';
  entityId: string;
  details: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};

const activityIcons: Record<Activity['type'], string> = {
  CREATE_CARD: '➕',
  DELETE_CARD: '🗑️',
  MOVE_CARD: '↔️',
  UPDATE_DESCRIPTION: '📝',
  ADD_LABEL: '🏷️',
};

const activityLabels: Record<Activity['type'], string> = {
  CREATE_CARD: 'a créé une carte',
  DELETE_CARD: 'a supprimé une carte',
  MOVE_CARD: 'a déplacé une carte',
  UPDATE_DESCRIPTION: 'a modifié la description',
  ADD_LABEL: 'a ajouté une étiquette',
};

interface ActivitySidebarProps {
  boardId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ActivitySidebar({ boardId, isOpen, onClose }: ActivitySidebarProps) {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const activitiesEndRef = useRef<HTMLDivElement>(null);
  const previousCountRef = useRef(0);

  const fetchActivities = async () => {
    if (!boardId) return;
    
    setLoading(true);
    try {
      const response = await api(`/boards/${boardId}/activity`);
      if (!response.ok) throw new Error('Failed to fetch activities');
      const data = await response.json();
      setActivities(data);
      
      // Scroll to new entries if activities count increased
      if (data.length > previousCountRef.current) {
        setTimeout(() => {
          activitiesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      previousCountRef.current = data.length;
    } catch (error) {
      console.error('Error fetching activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchActivities();
      // Poll for new activities every 10 seconds
      const interval = setInterval(fetchActivities, 10000);
      return () => clearInterval(interval);
    }
  }, [isOpen, boardId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInDays === 1) return 'Hier';
    if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
    
    return date.toLocaleDateString('fr-FR', { 
      day: 'numeric', 
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <h2 className="text-xl font-bold text-white">Historique</h2>
            </div>
            <button
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full p-2 transition-colors"
              aria-label="Fermer"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {loading && activities.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p>Chargement...</p>
                </div>
              </div>
            ) : activities.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <div className="text-gray-400 text-center">
                  <span className="text-6xl mb-3 block">📭</span>
                  <p className="text-lg">Aucune activité pour le moment</p>
                  <p className="text-sm mt-2">Les actions sur ce tableau apparaîtront ici</p>
                </div>
              </div>
            ) : (
              <>
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors border border-gray-200 shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">
                        {activityIcons[activity.type]}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-gray-900 truncate">
                            {activity.user.name || activity.user.email}
                          </span>
                          <span className="text-sm text-gray-600">
                            {activityLabels[activity.type]}
                          </span>
                        </div>
                        
                        {activity.details && (
                          <p className="text-sm text-gray-700 mt-1 break-words">
                            {activity.details}
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-500 mt-2">
                          {formatDate(activity.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={activitiesEndRef} />
              </>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <button
              onClick={fetchActivities}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium"
            >
              {loading ? 'Actualisation...' : '🔄 Actualiser'}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e0;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a0aec0;
        }
      `}</style>
    </>
  );
}

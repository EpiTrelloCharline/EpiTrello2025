import React from 'react';
import { Activity } from '@/lib/api';

interface ActivityItemProps {
    activity: Activity;
}

export function ActivityItem({ activity }: ActivityItemProps) {
    const getActionText = (type: Activity['type']) => {
        switch (type) {
            case 'CREATE_CARD':
                return 'a créé cette carte';
            case 'DELETE_CARD':
                return 'a supprimé cette carte';
            case 'MOVE_CARD':
                return 'a déplacé cette carte';
            case 'UPDATE_DESCRIPTION':
                return 'a mis à jour la description';
            case 'ADD_LABEL':
                return 'a ajouté une étiquette';
            default:
                return 'a effectué une action';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('fr-FR', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    };

    return (
        <div className="flex gap-3 py-2 items-start opacity-75 hover:opacity-100 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">
                    <span className="font-semibold text-[#172b4d]">{activity.user.name || activity.user.email}</span>
                    {' '}
                    {getActionText(activity.type)}
                    {activity.details && <span className="text-gray-500 italic"> ({activity.details})</span>}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {formatDate(activity.createdAt)}
                </p>
            </div>
        </div>
    );
}

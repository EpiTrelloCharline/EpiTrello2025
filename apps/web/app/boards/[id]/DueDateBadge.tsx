import React from 'react';

type DueDateBadgeProps = {
    dueDate: string | null | undefined;
    isDone?: boolean;
};

export function DueDateBadge({ dueDate, isDone }: DueDateBadgeProps) {
    if (!dueDate) return null;

    const now = new Date();
    const due = new Date(dueDate);
    const diffInHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60);
    const diffInDays = Math.ceil(diffInHours / 24);

    // Determine badge style based on due date status
    let bgColor = 'bg-gray-200';
    let textColor = 'text-gray-700';
    let icon = null;

    if (isDone) {
        // Green : task completed
        bgColor = 'bg-green-100';
        textColor = 'text-green-700';
        icon = (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
        );
    } else if (diffInHours < 0) {
        // Red : overdue
        bgColor = 'bg-red-100';
        textColor = 'text-red-700';
        icon = (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        );
    } else if (diffInHours < 24) {
        // Yellow : due within 24 hours
        bgColor = 'bg-yellow-100';
        textColor = 'text-yellow-700';
        icon = (
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
        );
    }

    // Format the date
    const formatDate = () => {
        const options: Intl.DateTimeFormatOptions = { 
            month: 'short', 
            day: 'numeric'
        };
        
        if (due.getFullYear() !== now.getFullYear()) {
            options.year = 'numeric';
        }

        return due.toLocaleDateString('fr-FR', options);
    };

    // Additional info text
    const getTimeInfo = () => {
        if (isDone) return 'Terminée';
        if (diffInHours < 0) {
            const absDays = Math.abs(diffInDays);
            return absDays === 1 ? 'En retard de 1 jour' : `En retard de ${absDays} jours`;
        }
        if (diffInHours < 24) return 'Bientôt';
        if (diffInDays === 1) return 'Demain';
        if (diffInDays <= 7) return `Dans ${diffInDays} jours`;
        return '';
    };

    return (
        <div 
            className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${bgColor} ${textColor}`}
            title={`Échéance: ${due.toLocaleString('fr-FR')}`}
        >
            {icon}
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formatDate()}</span>
            {getTimeInfo() && (
                <span className="ml-0.5">• {getTimeInfo()}</span>
            )}
        </div>
    );
}

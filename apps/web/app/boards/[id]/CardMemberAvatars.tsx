'use client';

import { useState } from 'react';

type User = {
    id: string;
    name: string | null;
    email: string;
};

type CardMemberAvatarsProps = {
    members?: User[];
    maxDisplay?: number;
};

/**
 * Component to display member avatars on a card
 * Shows up to maxDisplay avatars + "+X" for remaining members
 * Includes tooltips showing member names on hover
 */
export function CardMemberAvatars({ members = [], maxDisplay = 3 }: CardMemberAvatarsProps) {
    const [hoveredMemberId, setHoveredMemberId] = useState<string | null>(null);

    if (!members || members.length === 0) {
        return null;
    }

    const displayedMembers = members.slice(0, maxDisplay);
    const remainingCount = members.length - maxDisplay;

    /**
     * Get initials from name or email
     */
    const getInitials = (member: User): string => {
        if (member.name) {
            const parts = member.name.trim().split(' ');
            if (parts.length >= 2) {
                return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
            }
            return member.name[0].toUpperCase();
        }
        return member.email[0].toUpperCase();
    };

    /**
     * Get display name for tooltip
     */
    const getDisplayName = (member: User): string => {
        return member.name || member.email;
    };

    /**
     * Generate a consistent color for each member based on their ID
     */
    const getAvatarColor = (userId: string): string => {
        const colors = [
            '#4F46E5', // indigo
            '#7C3AED', // violet
            '#DB2777', // pink
            '#DC2626', // red
            '#EA580C', // orange
            '#CA8A04', // yellow
            '#16A34A', // green
            '#0891B2', // cyan
            '#0284C7', // blue
            '#6366F1', // indigo-400
        ];
        
        // Simple hash function to get consistent color for user
        let hash = 0;
        for (let i = 0; i < userId.length; i++) {
            hash = userId.charCodeAt(i) + ((hash << 5) - hash);
        }
        return colors[Math.abs(hash) % colors.length];
    };

    return (
        <div className="flex items-center -space-x-1.5">
            {displayedMembers.map((member) => (
                <div
                    key={member.id}
                    className="relative"
                    onMouseEnter={() => setHoveredMemberId(member.id)}
                    onMouseLeave={() => setHoveredMemberId(null)}
                >
                    <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold text-white border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        style={{ backgroundColor: getAvatarColor(member.id) }}
                        title={getDisplayName(member)}
                    >
                        {getInitials(member)}
                    </div>
                    
                    {/* Tooltip */}
                    {hoveredMemberId === member.id && (
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap z-50 pointer-events-none">
                            {getDisplayName(member)}
                            {/* Arrow */}
                            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-900"></div>
                        </div>
                    )}
                </div>
            ))}
            
            {remainingCount > 0 && (
                <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold bg-gray-300 text-gray-700 border-2 border-white shadow-sm hover:scale-110 transition-transform cursor-pointer"
                    title={`${remainingCount} autre${remainingCount > 1 ? 's' : ''} membre${remainingCount > 1 ? 's' : ''}`}
                >
                    +{remainingCount}
                </div>
            )}
        </div>
    );
}

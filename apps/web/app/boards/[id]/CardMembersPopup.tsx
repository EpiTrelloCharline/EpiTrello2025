'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { api } from '@/lib/api';

type User = {
    id: string;
    name: string | null;
    email: string;
};

type CardMembersPopupProps = {
    cardId: string;
    boardId: string;
    currentMembers: User[];
    onClose: () => void;
    onMembersUpdated?: () => void;
    anchorEl?: HTMLElement | null;
};

export function CardMembersPopup({
    cardId,
    boardId,
    currentMembers,
    onClose,
    onMembersUpdated,
    anchorEl
}: CardMembersPopupProps) {
    const [boardMembers, setBoardMembers] = useState<any[]>([]);
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchBoardMembers() {
            try {
                const response = await api(`/boards/${boardId}`);
                if (response.ok) {
                    const data = await response.json();
                    setBoardMembers(data.members || []);
                }
            } catch (error) {
                console.error('Failed to fetch board members:', error);
            }
        }
        fetchBoardMembers();
    }, [boardId]);

    useEffect(() => {
        if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            // Position it to the right of the button
            let left = rect.right + 10;
            // Fallback to left if no space on right
            if (left + 320 > window.innerWidth) {
                left = rect.left - 330;
            }

            let top = rect.top - 120;
            // If the popup would go off bottom, shift it up
            const popupHeight = 600; // Match max-h
            if (top + popupHeight > window.innerHeight) {
                top = window.innerHeight - popupHeight - 10;
            }
            if (top < 10) top = 10;

            setPosition({ top, left });
        }
    }, [anchorEl]);

    const isMemberOfCard = (userId: string) => {
        return currentMembers.some(m => m.id === userId);
    };

    const toggleMember = async (userId: string) => {
        setLoading(true);
        try {
            if (isMemberOfCard(userId)) {
                await api(`/cards/${cardId}/members/${userId}`, { method: 'DELETE' });
            } else {
                await api(`/cards/${cardId}/members`, {
                    method: 'POST',
                    body: JSON.stringify({ userId })
                });
            }
            onMembersUpdated?.();
        } catch (error) {
            console.error('Failed to toggle member:', error);
        } finally {
            setLoading(false);
        }
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[250]" onClick={onClose}>
            <div
                className="absolute bg-white rounded-lg shadow-2xl w-80 max-h-[600px] flex flex-col"
                style={{ top: position.top, left: (position.left + 320 > window.innerWidth) ? window.innerWidth - 330 : position.left }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative border-b border-gray-200 p-3">
                    <h3 className="text-sm font-semibold text-center text-[#172b4d]">
                        Membres
                    </h3>
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded text-gray-500"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-3 border-b border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Membres du tableau</h4>
                    <div className="space-y-1 overflow-y-auto max-h-60 custom-scrollbar">
                        {boardMembers.map((bm) => {
                            const isSelected = isMemberOfCard(bm.user.id);
                            return (
                                <button
                                    key={bm.user.id}
                                    onClick={() => toggleMember(bm.user.id)}
                                    disabled={loading}
                                    className="w-full flex items-center gap-2 p-2 rounded hover:bg-gray-100 transition-colors text-left"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold text-white uppercase">
                                        {(bm.user.name || bm.user.email)[0]}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium text-[#172b4d] truncate">
                                            {bm.user.name || bm.user.email}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

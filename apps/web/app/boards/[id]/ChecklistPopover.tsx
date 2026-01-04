import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { createChecklist } from '@/lib/api';

type ChecklistPopoverProps = {
    cardId: string;
    onClose: () => void;
    onChecklistCreated: () => void;
    anchorEl: HTMLElement | null;
};

export function ChecklistPopover({ cardId, onClose, onChecklistCreated, anchorEl }: ChecklistPopoverProps) {
    const [title, setTitle] = useState('Checklist');
    const [isLoading, setIsLoading] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node) && anchorEl && !anchorEl.contains(event.target as Node)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose, anchorEl]);

    // Calculate position
    const getPosition = () => {
        if (!anchorEl) return { top: 0, left: 0 };
        const rect = anchorEl.getBoundingClientRect();
        return {
            top: rect.bottom + window.scrollY + 5,
            left: rect.left + window.scrollX,
        };
    };

    const position = getPosition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            await createChecklist(cardId, title);
            onChecklistCreated();
            onClose();
        } catch (error) {
            console.error('Failed to create checklist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div
            ref={popoverRef}
            className="fixed z-[300] bg-white rounded shadow-lg border border-gray-200 w-72"
            style={{ top: position.top, left: position.left }}
        >
            <div className="p-3 border-b border-gray-100 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-700 mx-auto">Ajouter une checklist</span>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-3">
                <div className="mb-3">
                    <label htmlFor="checklist-title" className="block text-xs font-semibold text-gray-700 mb-1">
                        Titre
                    </label>
                    <input
                        id="checklist-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-2 py-1.5 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm outline-none"
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-1.5 rounded transition-colors disabled:opacity-50"
                >
                    {isLoading ? 'Ajout...' : 'Ajouter'}
                </button>
            </form>
        </div>,
        document.body
    );
}

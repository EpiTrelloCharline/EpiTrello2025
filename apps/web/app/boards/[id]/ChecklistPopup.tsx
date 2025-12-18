import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

type ChecklistPopupProps = {
    onClose: () => void;
    onCreate: (title: string) => Promise<void>;
    anchorEl: HTMLElement | null;
};

export function ChecklistPopup({ onClose, onCreate, anchorEl }: ChecklistPopupProps) {
    const [title, setTitle] = useState('Checklist');
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) {
                onClose();
            }
        };

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEscape);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEscape);
        };
    }, [onClose]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            try {
                await onCreate(title.trim());
                // Only close after successful creation
                onClose();
            } catch (error) {
                console.error('Failed to create checklist:', error);
                // Keep popup open on error so user can retry
            }
        }
    };

    // Calculate position based on anchor element
    const getPosition = () => {
        if (!anchorEl) return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' };

        const rect = anchorEl.getBoundingClientRect();
        return {
            top: `${rect.bottom + 8}px`,
            left: `${rect.left}px`,
        };
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[250]">
            <div
                ref={popupRef}
                className="absolute bg-[#282e33] rounded-lg shadow-xl w-[304px] p-3"
                style={getPosition()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-300 text-center flex-1">Add checklist</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-200 transition-colors"
                        aria-label="Close"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-xs font-medium text-gray-400 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-[#22272b] border border-gray-600 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
                    >
                        Ajouter
                    </button>
                </form>
            </div>
        </div>,
        document.body
    );
}

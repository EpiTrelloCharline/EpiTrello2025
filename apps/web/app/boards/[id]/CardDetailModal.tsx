import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { CardLabelPicker } from './CardLabelPicker';

type Label = {
    id: string;
    name: string;
    color: string;
};

type Card = {
    id: string;
    listId: string;
    title: string;
    description?: string;
    position: string;
    labels?: Label[];
};

type CardDetailModalProps = {
    card: Card;
    boardId: string;
    onClose: () => void;
    onSave: (data: { title: string; description: string }) => Promise<void> | void;
    onLabelsUpdated?: () => void;
};

export function CardDetailModal({ card, boardId, onClose, onSave, onLabelsUpdated }: CardDetailModalProps) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const labelButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        setIsVisible(true);
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(onClose, 200); // Wait for transition
    };

    const handleSave = async () => {
        await onSave({ title, description });
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className={`fixed inset-0 z-[200] flex items-center justify-center transition-opacity duration-200 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200"
                onClick={handleClose}
            />
            <div
                className={`relative bg-[#f4f5f7] rounded-lg w-full max-w-3xl mx-4 shadow-2xl flex flex-col max-h-[90vh] transform transition-all duration-200 ${isVisible ? 'scale-100 translate-y-0' : 'scale-95 translate-y-4'}`}
                onClick={e => e.stopPropagation()}
            >

                {/* Close button */}
                <button
                    onClick={handleClose}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                    aria-label="Fermer"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {/* Header Section */}
                    <div className="mb-6">
                        <div className="flex items-start gap-3 mb-1">
                            <svg className="w-6 h-6 text-gray-700 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                            </svg>
                            <div className="flex-1">
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full text-xl font-semibold bg-transparent border-2 border-transparent focus:bg-white focus:border-blue-600 rounded px-2 py-1 -ml-2 transition-colors text-[#172b4d] focus:outline-none"
                                />
                                <p className="text-sm text-gray-500 mt-1">dans la liste <span className="underline decoration-1 cursor-pointer">À faire</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Labels Section */}
                    {card.labels && card.labels.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Étiquettes</h3>
                            <div className="flex flex-wrap gap-1">
                                {card.labels.map(label => (
                                    <div
                                        key={label.id}
                                        className="px-3 py-1.5 rounded text-sm font-semibold text-white cursor-pointer hover:opacity-80 transition-opacity"
                                        style={{ backgroundColor: label.color }}
                                        title={label.name}
                                    >
                                        {label.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Main Content */}
                        <div className="flex-1">
                            {/* Description Section */}
                            <div className="mb-6">
                                <div className="flex items-center gap-3 mb-2">
                                    <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                                    </svg>
                                    <h3 className="font-semibold text-[#172b4d]">Description</h3>
                                </div>
                                <div className="ml-9">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Ajouter une description plus détaillée..."
                                        className="w-full min-h-[108px] bg-gray-100 hover:bg-gray-200 focus:bg-white border-none rounded-lg p-3 text-sm text-[#172b4d] placeholder-gray-500 transition-colors focus:ring-2 focus:ring-blue-600 resize-y focus:outline-none"
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                                        >
                                            Enregistrer
                                        </button>
                                        <button
                                            onClick={handleClose}
                                            className="text-gray-700 px-4 py-1.5 rounded hover:bg-gray-200 font-medium text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-full md:w-48 space-y-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ajouter à la carte</h3>
                            <SidebarButton icon={<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />} label="Membres" />
                            <SidebarButton
                                ref={labelButtonRef}
                                icon={<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />}
                                label="Étiquettes"
                                onClick={() => setShowLabelPicker(true)}
                            />
                            <SidebarButton icon={<path d="M5 13l4 4L19 7" />} label="Checklist" />
                            <SidebarButton icon={<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />} label="Dates" />
                        </div>
                    </div>
                </div>

                {/* Label Picker */}
                {showLabelPicker && (
                    <CardLabelPicker
                        cardId={card.id}
                        boardId={boardId}
                        currentLabels={card.labels || []}
                        onClose={() => setShowLabelPicker(false)}
                        onLabelsUpdated={onLabelsUpdated}
                        anchorEl={labelButtonRef.current}
                    />
                )}
            </div>
        </div>,
        document.body
    );
}

const SidebarButton = React.forwardRef<HTMLButtonElement, { icon: React.ReactNode; label: string; onClick?: () => void }>(function SidebarButton({ icon, label, onClick }, ref) {
    return (
        <button
            ref={ref}
            onClick={onClick}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                {icon}
            </svg>
            <span>{label}</span>
        </button>
    );
});


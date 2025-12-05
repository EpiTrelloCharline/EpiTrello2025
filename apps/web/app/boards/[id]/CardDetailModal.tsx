import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getCardLabels, assignLabel, unassignLabel, createLabel, getLabelsByBoard } from '@/lib/api';

type Card = {
    id: string;
    listId: string;
    title: string;
    description?: string;
    position: string;
};

type Label = { 
    id: string; 
    boardId: string;
    name: string; 
    color: string;
};

type CardDetailModalProps = {
    card: Card;
    boardId: string;
    availableLabels: Label[]; 

    onClose: () => void;
    onSave: (data: { title: string; description: string }) => Promise<void> | void;
    onLabelsChange?: () => void;
};

const PRESET_COLORS = [
    '#61bd4f', // green
    '#f2d600', // yellow
    '#ff9f1a', // orange
    '#eb5a46', // red
    '#c377e0', // purple
    '#0079bf', // blue
    '#00c2e0', // sky
    '#51e898', // lime
    '#ff78cb', // pink
    '#344563', // dark gray
];

export function CardDetailModal({ card, boardId, availableLabels, onClose, onSave, onLabelsChange }: CardDetailModalProps) {
    const [title, setTitle] = useState(card.title);
    const [description, setDescription] = useState(card.description || '');
    const [cardLabels, setCardLabels] = useState<Label[]>([]); 
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [allLabels, setAllLabels] = useState<Label[]>(availableLabels);
    const [isCreatingLabel, setIsCreatingLabel] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#61bd4f'); 


    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    useEffect(() => { 
        loadCardLabels();
        loadAllLabels();
    }, [card.id]);

    const loadCardLabels = async () => { 
        try { 
            const labels = await getCardLabels(card.id);
            // Ensure labels is an array
            setCardLabels(Array.isArray(labels) ? labels : []); 
        } catch (error) {
            console.error('Failed to load card labels:', error);
            setCardLabels([]); // In case of error, set an empty array
        }
    };

    const loadAllLabels = async () => {
        try {
            const labels = await getLabelsByBoard(boardId);
            setAllLabels(Array.isArray(labels) ? labels : []);
        } catch (error) {
            console.error('Failed to load all labels:', error);
            setAllLabels([]);
        }
    };

    const handleCreateLabel = async () => {
        if (!newLabelName.trim()) return;

        try {
            const created = await createLabel(boardId, newLabelName, newLabelColor);
            setAllLabels([...allLabels, created]);
            setNewLabelName('');
            setNewLabelColor('#61bd4f');
            setIsCreatingLabel(false);
            // Notify parent to refresh
            if (onLabelsChange) {
                onLabelsChange();
            }
        } catch (error) {
            console.error('Failed to create label:', error);
            alert('Failed to create label. Please try again.');
        }
    };

    const handleSave = async () => {
        console.log('handleSave clicked', { title, description });
        try {
            await onSave({ title, description });
            console.log('Save successful');
        } catch (error) {
            console.error('Save failed:', error);
        }
    };

    const handleToggleLabel = async (label: Label) => {
        const isAssigned = (Array.isArray(cardLabels) ? cardLabels : []).some(l => l.id === label.id);
        
        try {
            if (isAssigned) {
                await unassignLabel(label.id, card.id);
                setCardLabels((Array.isArray(cardLabels) ? cardLabels : []).filter(l => l.id !== label.id));
            } else {
                await assignLabel(label.id, card.id);
                setCardLabels([...(Array.isArray(cardLabels) ? cardLabels : []), label]);
            }
            // Notify parent to refresh card labels display
            if (onLabelsChange) {
                onLabelsChange();
            }
        } catch (error) {
            console.error('Failed to toggle label:', error);
        }
    };

    const handleCloseLabelPicker = () => {
        setShowLabelPicker(false);
        setIsCreatingLabel(false);
        setNewLabelName('');
        setNewLabelColor('#61bd4f');
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-[#f4f5f7] rounded-lg w-full max-w-3xl mx-4 shadow-2xl flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-2 right-2 p-2 text-gray-500 hover:bg-gray-200 rounded-full transition-colors"
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
                                    className="w-full text-xl font-semibold bg-transparent border-2 border-transparent focus:bg-white focus:border-blue-600 rounded px-2 py-1 -ml-2 transition-colors text-[#172b4d]"
                                />
                                <p className="text-sm text-gray-500 mt-1">dans la liste <span className="underline decoration-1 cursor-pointer">À faire</span></p>
                            </div>
                        </div>
                        
                        {/* Labels Display */}
                        {Array.isArray(cardLabels) && cardLabels.length > 0 && (
                            <div className="ml-9 mt-3">
                                <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Étiquettes</h4>
                                <div className="flex flex-wrap gap-1">
                                    {(Array.isArray(cardLabels) ? cardLabels : []).map((label) => (
                                        <span
                                            key={label.id}
                                            className="px-3 py-1 rounded text-white text-xs font-medium"
                                            style={{ backgroundColor: label.color }}
                                        >
                                            {label.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-8">
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
                                        className="w-full min-h-[108px] bg-gray-100 hover:bg-gray-200 focus:bg-white border-none rounded-lg p-3 text-sm text-[#172b4d] placeholder-gray-500 transition-colors focus:ring-2 focus:ring-blue-600 resize-y"
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleSave();
                                            }}
                                            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 font-medium text-sm transition-colors"
                                        >
                                            Enregistrer
                                        </button>
                                        <button
                                            type="button" 

                                            onClick={onClose}
                                            className="text-gray-700 px-4 py-1.5 rounded hover:bg-gray-200 font-medium text-sm transition-colors"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="w-48 space-y-2">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Ajouter à la carte</h3>
                            <SidebarButton icon={<path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />} label="Membres" />
                            <div className="relative">
                                <SidebarButton 
                                    icon={<path d="M7 7h10v3l5-5-5-5v3H7v4z" />} 
                                    label="Étiquettes" 
                                    onClick={() => setShowLabelPicker(!showLabelPicker)}
                                />
                                {showLabelPicker && (
                                    <div className="absolute right-full top-0 mr-2 w-72 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
                                        {/* Header */}
                                        <div className="border-b border-gray-200 p-3 flex items-center justify-between">
                                            <h4 className="font-semibold text-sm text-gray-800">Labels</h4>
                                            <button
                                                onClick={handleCloseLabelPicker}
                                                className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3">
                                            {!isCreatingLabel ? (
                                                <>
                                                    <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar mb-2">
                                                        {(Array.isArray(allLabels) ? allLabels : []).map((label) => {
                                                            const isAssigned = (Array.isArray(cardLabels) ? cardLabels : []).some(l => l.id === label.id);
                                                            return (
                                                                <button
                                                                    key={label.id}
                                                                    onClick={() => handleToggleLabel(label)}
                                                                    className="w-full flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-50 transition-colors text-left"
                                                                >
                                                                    <div
                                                                        className="flex-1 px-3 py-1.5 rounded text-white text-sm font-medium"
                                                                        style={{ backgroundColor: label.color }}
                                                                    >
                                                                        {label.name}
                                                                    </div>
                                                                    {isAssigned && (
                                                                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                                        </svg>
                                                                    )}
                                                                </button>
                                                            );
                                                        })}
                                                        {(!Array.isArray(allLabels) || allLabels.length === 0) && (
                                                            <p className="text-sm text-gray-500 text-center py-4">No labels yet</p>
                                                        )}
                                                    </div>

                                                    {/* Create New Label Button */}
                                                    <button
                                                        onClick={() => setIsCreatingLabel(true)}
                                                        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                                                    >
                                                        + Create new label
                                                    </button>
                                                </>
                                            ) : (
                                                <>
                                                    {/* Create Label Form */}
                                                    <div className="space-y-3">
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Name</label>
                                                            <input
                                                                type="text"
                                                                value={newLabelName}
                                                                onChange={(e) => setNewLabelName(e.target.value)}
                                                                placeholder="Label name..."
                                                                className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                                autoFocus
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Color</label>
                                                            <div className="grid grid-cols-5 gap-2">
                                                                {PRESET_COLORS.map((color) => (
                                                                    <button
                                                                        key={color}
                                                                        onClick={() => setNewLabelColor(color)}
                                                                        className={`h-8 rounded transition-all ${
                                                                            newLabelColor === color 
                                                                                ? 'ring-2 ring-blue-600 ring-offset-2 scale-110' 
                                                                                : 'hover:scale-105'
                                                                        }`}
                                                                        style={{ backgroundColor: color }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        {/* Preview */}
                                                        <div>
                                                            <label className="block text-xs font-semibold text-gray-600 mb-1">Preview</label>
                                                            <div
                                                                className="px-3 py-1.5 rounded text-white text-sm font-medium inline-block"
                                                                style={{ backgroundColor: newLabelColor }}
                                                            >
                                                                {newLabelName || 'Label name'}
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="flex gap-2 pt-2">
                                                            <button
                                                                onClick={handleCreateLabel}
                                                                disabled={!newLabelName.trim()}
                                                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium text-sm transition-colors"
                                                            >
                                                                Create
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    setIsCreatingLabel(false);
                                                                    setNewLabelName('');
                                                                    setNewLabelColor('#61bd4f');
                                                                }}
                                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded font-medium text-sm transition-colors"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <SidebarButton icon={<path d="M5 13l4 4L19 7" />} label="Checklist" />
                            <SidebarButton icon={<path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />} label="Dates" />
                        </div>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}

function SidebarButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick?: () => void }) {
    return (
        <button 
            onClick={onClick}
            className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors text-left"
        >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                {icon}
            </svg>
            <span>{label}</span>
        </button>
    );
}

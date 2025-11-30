import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { getLabelsByBoard } from '@/lib/api';

type Label = {
    id: string;
    boardId: string;
    name: string;
    color: string;
};

type LabelsManagementModalProps = {
    boardId: string;
    onClose: () => void;
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

export function LabelsManagementModal({ boardId, onClose }: LabelsManagementModalProps) {
    const [localLabels, setLocalLabels] = useState<Label[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newLabel, setNewLabel] = useState({ name: '', color: '#61bd4f' });
    const [editLabel, setEditLabel] = useState({ name: '', color: '' });

    useEffect(() => {
        loadLabels();
    }, [boardId]);

    const loadLabels = async () => {
        try {
            const labels = await getLabelsByBoard(boardId);
            setLocalLabels(labels);
        } catch (error) {
            console.error('Failed to load labels:', error);
        }
    };

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    const handleCreate = async () => {
        if (!newLabel.name.trim()) return;

        try {
            const response = await fetch('http://localhost:3001/labels', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify({ ...newLabel, boardId }),
            });

            if (response.ok) {
                const created = await response.json();
                setLocalLabels([...localLabels, created]);
                setNewLabel({ name: '', color: '#61bd4f' });
                setIsCreating(false);
            }
        } catch (error) {
            console.error('Failed to create label:', error);
        }
    };

    const handleUpdate = async (labelId: string) => {
        if (!editLabel.name.trim()) return;

        try {
            const response = await fetch(`http://localhost:3001/labels/${labelId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(editLabel),
            });

            if (response.ok) {
                const updated = await response.json();
                setLocalLabels(localLabels.map(l => l.id === labelId ? updated : l));
                setEditingId(null);
            }
        } catch (error) {
            console.error('Failed to update label:', error);
        }
    };

    const handleDelete = async (labelId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer cette étiquette ?')) return;

        try {
            const response = await fetch(`http://localhost:3001/labels/${labelId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
                },
            });

            if (response.ok) {
                setLocalLabels(localLabels.filter(l => l.id !== labelId));
            }
        } catch (error) {
            console.error('Failed to delete label:', error);
        }
    };

    const startEditing = (label: Label) => {
        setEditingId(label.id);
        setEditLabel({ name: label.name, color: label.color });
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[300] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />
            <div className="relative bg-white rounded-lg w-full max-w-md mx-4 shadow-2xl" onClick={e => e.stopPropagation()}>
                {/* Header */}
                <div className="border-b border-gray-200 p-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-800">Gérer les étiquettes</h2>
                    <button
                        onClick={onClose}
                        className="p-1 text-gray-500 hover:bg-gray-100 rounded transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    {/* Labels List */}
                    <div className="space-y-2 mb-4">
                        {localLabels.map((label) => (
                            <div key={label.id}>
                                {editingId === label.id ? (
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={editLabel.name}
                                            onChange={(e) => setEditLabel({ ...editLabel, name: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Nom de l'étiquette"
                                            autoFocus
                                        />
                                        <div className="flex gap-2 flex-wrap">
                                            {PRESET_COLORS.map((color) => (
                                                <button
                                                    key={color}
                                                    onClick={() => setEditLabel({ ...editLabel, color })}
                                                    className={`w-10 h-8 rounded ${editLabel.color === color ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleUpdate(label.id)}
                                                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                                            >
                                                Enregistrer
                                            </button>
                                            <button
                                                onClick={() => setEditingId(null)}
                                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                Annuler
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2 group">
                                        <div
                                            className="flex-1 px-3 py-2 rounded-lg text-white font-medium text-sm flex items-center justify-between cursor-pointer hover:opacity-90"
                                            style={{ backgroundColor: label.color }}
                                            onClick={() => startEditing(label)}
                                        >
                                            <span>{label.name}</span>
                                            <svg className="w-4 h-4 opacity-0 group-hover:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(label.id)}
                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-all"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Create New Label */}
                    {isCreating ? (
                        <div className="space-y-2 border-t border-gray-200 pt-4">
                            <input
                                type="text"
                                value={newLabel.name}
                                onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Nom de l'étiquette"
                                autoFocus
                            />
                            <div className="flex gap-2 flex-wrap">
                                {PRESET_COLORS.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setNewLabel({ ...newLabel, color })}
                                        className={`w-10 h-8 rounded ${newLabel.color === color ? 'ring-2 ring-blue-600 ring-offset-2' : ''}`}
                                        style={{ backgroundColor: color }}
                                    />
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={handleCreate}
                                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                                >
                                    Créer
                                </button>
                                <button
                                    onClick={() => {
                                        setIsCreating(false);
                                        setNewLabel({ name: '', color: '#61bd4f' });
                                    }}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <button
                            onClick={() => setIsCreating(true)}
                            className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium text-sm flex items-center justify-center gap-2 transition-colors mt-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Créer une nouvelle étiquette
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

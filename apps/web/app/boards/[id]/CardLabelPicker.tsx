'use client';

import { useState, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { api } from '@/lib/api';

type Label = {
    id: string;
    name: string;
    color: string;
};

type CardLabelPickerProps = {
    cardId: string;
    boardId: string;
    currentLabels: Label[];
    onClose: () => void;
    onLabelsUpdated?: () => void;
    anchorEl?: HTMLElement | null;
};

export function CardLabelPicker({
    cardId,
    boardId,
    currentLabels,
    onClose,
    onLabelsUpdated,
    anchorEl
}: CardLabelPickerProps) {
    const [boardLabels, setBoardLabels] = useState<Label[]>([]);
    const [selectedLabelIds, setSelectedLabelIds] = useState<Set<string>>(
        new Set(currentLabels.map(l => l.id))
    );
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreatingLabel, setIsCreatingLabel] = useState(false);
    const [newLabelName, setNewLabelName] = useState('');
    const [newLabelColor, setNewLabelColor] = useState('#61bd4f');
    const [position, setPosition] = useState({ top: 0, left: 0 });
    const [editingLabelId, setEditingLabelId] = useState<string | null>(null);
    const [editLabelName, setEditLabelName] = useState('');
    const [editLabelColor, setEditLabelColor] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const colors = [
        { name: 'vert', value: '#61bd4f' },
        { name: 'jaune', value: '#f2d600' },
        { name: 'orange', value: '#ff9f1a' },
        { name: 'rouge', value: '#eb5a46' },
        { name: 'violet', value: '#c377e0' },
        { name: 'bleu', value: '#0079bf' },
        { name: 'cyan', value: '#00c2e0' },
        { name: 'vert citron', value: '#51e898' },
        { name: 'rose', value: '#ff78cb' },
        { name: 'noir', value: '#344563' },
    ];

    const fetchBoardLabels = useCallback(async () => {
        try {
            const response = await api(`/boards/${boardId}/labels`);
            if (response.ok) {
                const labels = await response.json();
                setBoardLabels(labels);
            }
        } catch (error) {
            console.error('Failed to fetch board labels:', error);
        }
    }, [boardId, setBoardLabels]);

    useEffect(() => {
        fetchBoardLabels();
    }, [boardId, fetchBoardLabels]);

    useEffect(() => {
        if (anchorEl) {
            const rect = anchorEl.getBoundingClientRect();
            setPosition({
                top: rect.top - 200,
                left: rect.left
            });
        }
    }, [anchorEl]);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (editingLabelId) {
                    cancelEdit();
                } else {
                    onClose();
                }
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [onClose, editingLabelId]);



    async function toggleLabel(labelId: string) {
        const isSelected = selectedLabelIds.has(labelId);

        try {
            if (isSelected) {
                await api(`/cards/${cardId}/labels/${labelId}`, { method: 'DELETE' });
                setSelectedLabelIds(prev => {
                    const next = new Set(prev);
                    next.delete(labelId);
                    return next;
                });
            } else {
                await api(`/cards/${cardId}/labels/${labelId}`, { method: 'POST' });
                setSelectedLabelIds(prev => new Set(prev).add(labelId));
            }
            onLabelsUpdated?.();
        } catch (error) {
            console.error('Failed to toggle label:', error);
        }
    }

    async function createLabel() {
        if (!newLabelName.trim()) {
            console.warn('Label name is empty');
            return;
        }

        console.log('Creating label:', { name: newLabelName.trim(), color: newLabelColor, boardId });

        try {
            const response = await api(`/boards/${boardId}/labels`, {
                method: 'POST',
                body: JSON.stringify({
                    name: newLabelName.trim(),
                    color: newLabelColor
                })
            });

            console.log('Create label response status:', response.status);

            if (response.ok) {
                const newLabel = await response.json();
                console.log('Label created successfully:', newLabel);
                setBoardLabels(prev => [...prev, newLabel]);
                setNewLabelName('');
                setNewLabelColor('#61bd4f');
                setIsCreatingLabel(false);

                // Automatically assign the new label to the card
                await toggleLabel(newLabel.id);
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                console.error('Failed to create label - Server response:', response.status, errorData);
                alert(`Erreur lors de la création de l'étiquette: ${errorData.message || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Failed to create label - Network error:', error);
            alert('Erreur réseau lors de la création de l\'étiquette. Vérifiez que l\'API est en cours d\'exécution.');
        }
    }

    function startEdit(label: Label) {
        setEditingLabelId(label.id);
        setEditLabelName(label.name);
        setEditLabelColor(label.color);
        setShowDeleteConfirm(false);
    }

    function cancelEdit() {
        setEditingLabelId(null);
        setEditLabelName('');
        setEditLabelColor('');
        setShowDeleteConfirm(false);
    }

    async function saveEdit() {
        if (!editLabelName.trim()) {
            alert('Le nom de l\'étiquette ne peut pas être vide');
            return;
        }

        try {
            const response = await api(`/labels/${editingLabelId}`, {
                method: 'PATCH',
                body: JSON.stringify({
                    name: editLabelName.trim(),
                    color: editLabelColor
                })
            });

            if (response.ok) {
                const updatedLabel = await response.json();
                setBoardLabels(prev => prev.map(l => l.id === editingLabelId ? updatedLabel : l));
                cancelEdit();
                onLabelsUpdated?.();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                alert(`Erreur lors de la modification: ${errorData.message || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Failed to update label:', error);
            alert('Erreur réseau lors de la modification de l\'étiquette.');
        }
    }

    async function deleteLabel() {
        try {
            const response = await api(`/labels/${editingLabelId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setBoardLabels(prev => prev.filter(l => l.id !== editingLabelId));
                setSelectedLabelIds(prev => {
                    const next = new Set(prev);
                    next.delete(editingLabelId!);
                    return next;
                });
                cancelEdit();
                onLabelsUpdated?.();
            } else {
                const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
                alert(`Erreur lors de la suppression: ${errorData.message || 'Erreur inconnue'}`);
            }
        } catch (error) {
            console.error('Failed to delete label:', error);
            alert('Erreur réseau lors de la suppression de l\'étiquette.');
        }
    }

    const filteredLabels = boardLabels.filter(label =>
        label.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[250]" onClick={onClose}>
            <div
                className="absolute bg-white rounded-lg shadow-2xl w-80 max-h-[600px] flex flex-col"
                style={{ top: position.top, left: position.left }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="relative border-b border-gray-200 p-3">
                    <h3 className="text-sm font-semibold text-center text-[#172b4d]">
                        {editingLabelId ? 'Modifier l\'étiquette' : 'Étiquettes'}
                    </h3>
                    <button
                        onClick={editingLabelId ? cancelEdit : onClose}
                        className="absolute top-2 right-2 p-1 hover:bg-gray-200 rounded text-gray-500"
                    >
                        ✕
                    </button>
                    {editingLabelId && (
                        <button
                            onClick={cancelEdit}
                            className="absolute top-2 left-2 p-1 hover:bg-gray-200 rounded text-gray-500"
                            title="Retour"
                        >
                            ←
                        </button>
                    )}
                </div>

                {editingLabelId ? (
                    /* Edit Label Mode */
                    <div className="p-3 space-y-3">
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Nom</label>
                            <input
                                type="text"
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={editLabelName}
                                onChange={e => setEditLabelName(e.target.value)}
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-2">Couleur</label>
                            <div className="grid grid-cols-5 gap-2">
                                {colors.map(color => (
                                    <button
                                        key={color.value}
                                        className={`h-8 rounded transition-transform ${editLabelColor === color.value ? 'ring-2 ring-blue-500 scale-110' : ''
                                            }`}
                                        style={{ backgroundColor: color.value }}
                                        onClick={() => setEditLabelColor(color.value)}
                                        title={color.name}
                                    />
                                ))}
                            </div>
                        </div>

                        <div
                            className="px-3 py-2 rounded font-semibold text-sm text-white text-center"
                            style={{ backgroundColor: editLabelColor }}
                        >
                            {editLabelName || 'Aperçu'}
                        </div>

                        <button
                            onClick={saveEdit}
                            className="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700"
                        >
                            Enregistrer
                        </button>

                        <div className="border-t border-gray-200 pt-3">
                            {showDeleteConfirm ? (
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-700">
                                        Supprimer cette étiquette de toutes les cartes ? Cette action est irréversible.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={deleteLabel}
                                            className="flex-1 bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700"
                                        >
                                            Supprimer
                                        </button>
                                        <button
                                            onClick={() => setShowDeleteConfirm(false)}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full bg-red-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-red-700"
                                >
                                    Supprimer l&apos;étiquette
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Search */}
                        <div className="p-3 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder="Rechercher des étiquettes..."
                                className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {/* Labels List */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
                            <h4 className="text-xs font-semibold text-gray-600 mb-2">Étiquettes</h4>
                            {filteredLabels.map(label => {
                                const isSelected = selectedLabelIds.has(label.id);
                                return (
                                    <div
                                        key={label.id}
                                        className="flex items-center gap-2 group"
                                    >
                                        <button
                                            onClick={() => toggleLabel(label.id)}
                                            className="flex-1 flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100 transition-colors"
                                        >
                                            <div
                                                className="flex-1 px-3 py-1.5 rounded font-semibold text-sm text-white"
                                                style={{ backgroundColor: label.color }}
                                            >
                                                {label.name}
                                            </div>
                                            {isSelected && (
                                                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </button>
                                        <button
                                            onClick={() => startEdit(label)}
                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 rounded text-gray-500"
                                            title="Modifier"
                                        >
                                            ✎
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Create New Label */}
                        <div className="border-t border-gray-200 p-3">
                            {isCreatingLabel ? (
                                <div className="space-y-2">
                                    <input
                                        type="text"
                                        placeholder="Nom de l'étiquette"
                                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={newLabelName}
                                        onChange={e => setNewLabelName(e.target.value)}
                                        autoFocus
                                        onKeyDown={e => {
                                            if (e.key === 'Enter') createLabel();
                                            if (e.key === 'Escape') setIsCreatingLabel(false);
                                        }}
                                    />
                                    <div className="grid grid-cols-5 gap-2">
                                        {colors.map(color => (
                                            <button
                                                key={color.value}
                                                className={`h-8 rounded transition-transform ${newLabelColor === color.value ? 'ring-2 ring-blue-500 scale-110' : ''
                                                    }`}
                                                style={{ backgroundColor: color.value }}
                                                onClick={() => setNewLabelColor(color.value)}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={createLabel}
                                            className="flex-1 bg-blue-600 text-white px-3 py-2 rounded text-sm font-medium hover:bg-blue-700"
                                        >
                                            Créer
                                        </button>
                                        <button
                                            onClick={() => setIsCreatingLabel(false)}
                                            className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm"
                                        >
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    onClick={() => setIsCreatingLabel(true)}
                                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded text-sm font-medium transition-colors"
                                >
                                    Créer une nouvelle étiquette
                                </button>
                            )}
                        </div>

                        {/* Enable colorblind mode */}
                        <div className="border-t border-gray-200 p-3">
                            <button className="w-full text-left text-sm text-gray-600 hover:bg-gray-100 px-3 py-2 rounded">
                                Activer le mode daltonien
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>,
        document.body
    );
}

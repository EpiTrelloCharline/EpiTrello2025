import React, { useState } from 'react';
import { ChecklistItem } from './ChecklistItem';
import { updateChecklist, deleteChecklist, createChecklistItem } from '@/lib/api';

type ChecklistSectionProps = {
    checklist: {
        id: string;
        title: string;
        items: any[];
    };
    onUpdate: () => void;
};

export function ChecklistSection({ checklist, onUpdate }: ChecklistSectionProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(checklist.title);
    const [newItemContent, setNewItemContent] = useState('');
    const [isAddingItem, setIsAddingItem] = useState(false);

    // Calculate progress
    const totalItems = checklist.items?.length || 0;
    const checkedItems = checklist.items?.filter((item: any) => item.checked).length || 0;
    const progress = totalItems === 0 ? 0 : Math.round((checkedItems / totalItems) * 100);

    const handleUpdateTitle = async () => {
        if (title.trim() === '') return;
        setIsEditingTitle(false);
        if (title === checklist.title) return;

        try {
            await updateChecklist(checklist.id, { title });
            onUpdate();
        } catch (error) {
            setTitle(checklist.title);
            console.error('Failed to update checklist title:', error);
        }
    };

    const handleDeleteChecklist = async () => {
        if (!confirm('Voulez-vous vraiment supprimer cette checklist ?')) return;
        try {
            await deleteChecklist(checklist.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete checklist:', error);
        }
    };

    const handleInitializeAddItem = () => {
        setIsAddingItem(true);
    };

    const handleAddItem = async () => {
        if (newItemContent.trim() === '') return;

        try {
            await createChecklistItem(checklist.id, newItemContent);
            setNewItemContent('');
            // Keep adding mode open to add multiple items quickly
            onUpdate();
        } catch (error) {
            console.error('Failed to add item:', error);
        }
    };

    return (
        <div className="mb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-2 group">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>

                <div className="flex-1 flex justify-between items-center">
                    {isEditingTitle ? (
                        <div className="flex-1 mr-2">
                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                onBlur={handleUpdateTitle}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleUpdateTitle();
                                    if (e.key === 'Escape') {
                                        setIsEditingTitle(false);
                                        setTitle(checklist.title);
                                    }
                                }}
                                className="w-full font-semibold text-[#172b4d] bg-white border border-blue-600 rounded px-2 py-1 outline-none"
                            />
                        </div>
                    ) : (
                        <h3
                            onClick={() => setIsEditingTitle(true)}
                            className="font-semibold text-[#172b4d] cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -ml-2 transition-colors"
                        >
                            {checklist.title}
                        </h3>
                    )}

                    <button
                        onClick={handleDeleteChecklist}
                        className="opacity-0 group-hover:opacity-100 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-1.5 rounded text-sm transition-all focus:opacity-100"
                    >
                        Supprimer
                    </button>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="ml-9 mb-4 flex items-center gap-3">
                <span className="text-xs text-gray-500 w-8">{progress}%</span>
                <div className="flex-1 h-2 bg-[#091e420f] rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-300 ease-in-out rounded-full ${progress === 100 ? 'bg-[#1f845a]' : 'bg-[#579dff]'}`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Items List */}
            <div className="ml-9 mb-2 space-y-1">
                {checklist.items?.map((item: any) => (
                    <ChecklistItem
                        key={item.id}
                        item={item}
                        onUpdate={onUpdate}
                    />
                ))}
            </div>

            {/* Add Item Form */}
            <div className="ml-9">
                {!isAddingItem ? (
                    <button
                        onClick={handleInitializeAddItem}
                        className="bg-gray-200 hover:bg-gray-300 text-[#172b4d] px-3 py-1.5 rounded text-sm transition-colors"
                    >
                        Ajouter un élément
                    </button>
                ) : (
                    <div className="mb-2">
                        <textarea
                            autoFocus
                            placeholder="Ajouter un élément"
                            value={newItemContent}
                            onChange={(e) => setNewItemContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddItem();
                                }
                                if (e.key === 'Escape') setIsAddingItem(false);
                            }}
                            className="w-full bg-white border border-blue-600 rounded px-3 py-2 text-sm outline-none resize-none shadow-sm mb-2"
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={handleAddItem}
                                className="bg-blue-600 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!newItemContent.trim()}
                            >
                                Ajouter
                            </button>
                            <button
                                onClick={() => setIsAddingItem(false)}
                                className="text-gray-700 px-4 py-1.5 rounded text-sm hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

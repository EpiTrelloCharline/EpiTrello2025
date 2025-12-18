import React, { useState } from 'react';
import type { Checklist, ChecklistItem } from '../../api/checklists';
import {
    updateChecklist,
    deleteChecklist,
    createChecklistItem,
    updateChecklistItem,
    deleteChecklistItem,
} from '../../api/checklists';

type ChecklistSectionProps = {
    checklist: Checklist;
    onUpdate: () => void;
};

export function ChecklistSection({ checklist, onUpdate }: ChecklistSectionProps) {
    const [isEditingTitle, setIsEditingTitle] = useState(false);
    const [title, setTitle] = useState(checklist.title);
    const [newItemContent, setNewItemContent] = useState('');
    const [editingItemId, setEditingItemId] = useState<string | null>(null);
    const [editingItemContent, setEditingItemContent] = useState('');

    // Calculate progress
    const totalItems = checklist.items.length;
    const checkedItems = checklist.items.filter((item) => item.checked).length;
    const progress = totalItems > 0 ? (checkedItems / totalItems) * 100 : 0;

    const handleTitleSave = async () => {
        if (title.trim() && title !== checklist.title) {
            try {
                await updateChecklist(checklist.id, title.trim());
                onUpdate();
            } catch (error) {
                console.error('Failed to update checklist title:', error);
            }
        }
        setIsEditingTitle(false);
    };

    const handleDeleteChecklist = async () => {
        if (confirm('Êtes-vous sûr de vouloir supprimer cette checklist ?')) {
            try {
                await deleteChecklist(checklist.id);
                onUpdate();
            } catch (error) {
                console.error('Failed to delete checklist:', error);
            }
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newItemContent.trim()) {
            try {
                await createChecklistItem(checklist.id, newItemContent.trim());
                setNewItemContent('');
                onUpdate();
            } catch (error) {
                console.error('Failed to create checklist item:', error);
            }
        }
    };

    const handleToggleItem = async (item: ChecklistItem) => {
        try {
            await updateChecklistItem(item.id, { checked: !item.checked });
            onUpdate();
        } catch (error) {
            console.error('Failed to toggle checklist item:', error);
        }
    };

    const handleStartEditItem = (item: ChecklistItem) => {
        setEditingItemId(item.id);
        setEditingItemContent(item.content);
    };

    const handleSaveItemEdit = async (itemId: string) => {
        if (editingItemContent.trim()) {
            try {
                await updateChecklistItem(itemId, { content: editingItemContent.trim() });
                setEditingItemId(null);
                onUpdate();
            } catch (error) {
                console.error('Failed to update checklist item:', error);
            }
        }
    };

    const handleDeleteItem = async (itemId: string) => {
        try {
            await deleteChecklistItem(itemId);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete checklist item:', error);
        }
    };

    return (
        <div className="mb-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isEditingTitle ? (
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onBlur={handleTitleSave}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleTitleSave();
                            if (e.key === 'Escape') {
                                setTitle(checklist.title);
                                setIsEditingTitle(false);
                            }
                        }}
                        className="flex-1 text-base font-semibold bg-white border-2 border-blue-600 rounded px-2 py-1 text-[#172b4d] focus:outline-none"
                        autoFocus
                    />
                ) : (
                    <h3
                        className="flex-1 font-semibold text-[#172b4d] cursor-pointer hover:bg-gray-100 rounded px-2 py-1 -ml-2"
                        onClick={() => setIsEditingTitle(true)}
                    >
                        {checklist.title}
                    </h3>
                )}
                <button
                    onClick={handleDeleteChecklist}
                    className="text-gray-500 hover:text-red-600 px-2 py-1 text-sm transition-colors"
                    title="Supprimer la checklist"
                >
                    Supprimer
                </button>
            </div>

            {/* Progress Bar */}
            <div className="ml-9 mb-3">
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-gray-600 font-medium">{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                        className="bg-blue-600 h-full rounded-full transition-all duration-500 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Items List */}
            <div className="ml-9 space-y-2">
                {checklist.items.map((item) => (
                    <div
                        key={item.id}
                        className="flex items-start gap-2 group hover:bg-gray-50 rounded p-1 -ml-1"
                    >
                        <input
                            type="checkbox"
                            checked={item.checked}
                            onChange={() => handleToggleItem(item)}
                            className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-600 cursor-pointer"
                        />
                        {editingItemId === item.id ? (
                            <input
                                type="text"
                                value={editingItemContent}
                                onChange={(e) => setEditingItemContent(e.target.value)}
                                onBlur={() => handleSaveItemEdit(item.id)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') handleSaveItemEdit(item.id);
                                    if (e.key === 'Escape') {
                                        setEditingItemId(null);
                                        setEditingItemContent('');
                                    }
                                }}
                                className="flex-1 bg-white border-2 border-blue-600 rounded px-2 py-1 text-sm text-[#172b4d] focus:outline-none"
                                autoFocus
                            />
                        ) : (
                            <span
                                className={`flex-1 text-sm cursor-pointer rounded px-2 py-1 -ml-2 ${item.checked ? 'line-through text-gray-500' : 'text-[#172b4d]'
                                    }`}
                                onClick={() => handleStartEditItem(item)}
                            >
                                {item.content}
                            </span>
                        )}
                        <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-600 transition-all p-1"
                            title="Supprimer l'item"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                ))}

                {/* Add New Item */}
                <form onSubmit={handleAddItem} className="flex items-center gap-2 mt-2">
                    <button
                        type="submit"
                        className="w-4 h-4 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                        disabled={!newItemContent.trim()}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                    <input
                        type="text"
                        value={newItemContent}
                        onChange={(e) => setNewItemContent(e.target.value)}
                        placeholder="Add an item"
                        className="flex-1 bg-transparent hover:bg-gray-100 focus:bg-white border-none rounded px-2 py-1 text-sm text-[#172b4d] placeholder-gray-400 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                </form>
            </div>
        </div>
    );
}

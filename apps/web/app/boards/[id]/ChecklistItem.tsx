import React, { useState } from 'react';
import { updateChecklistItem, deleteChecklistItem } from '@/lib/api';

type ChecklistItemProps = {
    item: {
        id: string;
        content: string;
        checked: boolean;
    };
    onUpdate: () => void;
};

export function ChecklistItem({ item, onUpdate }: ChecklistItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [content, setContent] = useState(item.content);
    const [checked, setChecked] = useState(item.checked);
    const [isHovered, setIsHovered] = useState(false);

    const handleToggle = async () => {
        const newChecked = !checked;
        setChecked(newChecked); // Optimistic update
        try {
            await updateChecklistItem(item.id, { checked: newChecked });
            onUpdate();
        } catch (error) {
            setChecked(!newChecked); // Revert on error
            console.error('Failed to toggle item:', error);
        }
    };

    const handleSave = async () => {
        if (content.trim() === '') return;
        setIsEditing(false);
        if (content === item.content) return;

        try {
            await updateChecklistItem(item.id, { content });
            onUpdate();
        } catch (error) {
            setContent(item.content);
            console.error('Failed to update item:', error);
        }
    };

    const handleDelete = async () => {
        try {
            await deleteChecklistItem(item.id);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete item:', error);
        }
    };

    return (
        <div
            className="group flex items-start gap-3 py-1.5 hover:bg-gray-100/50 rounded -mx-2 px-2 transition-colors"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="pt-0.5">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={handleToggle}
                    className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                />
            </div>

            <div className="flex-1 min-w-0">
                {isEditing ? (
                    <div className="flex flex-col gap-2">
                        <textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            onBlur={handleSave}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleSave();
                                }
                                if (e.key === 'Escape') {
                                    setIsEditing(false);
                                    setContent(item.content);
                                }
                            }}
                            autoFocus
                            className="w-full bg-white border border-blue-500 rounded px-2 py-1.5 text-sm outline-none resize-none overflow-hidden"
                            rows={2}
                        />
                        <div className="flex gap-2">
                            <button
                                onMouseDown={handleSave} // onMouseDown fires before onBlur
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                            >
                                Enregistrer
                            </button>
                            <button
                                onMouseDown={() => {
                                    setIsEditing(false);
                                    setContent(item.content);
                                }}
                                className="text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-200"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                ) : (
                    <div
                        onClick={() => setIsEditing(true)}
                        className={`text-sm cursor-pointer break-words ${checked ? 'text-gray-500 line-through' : 'text-[#172b4d]'}`}
                    >
                        {item.content}
                    </div>
                )}
            </div>

            {!isEditing && (
                <button
                    onClick={handleDelete}
                    className={`text-gray-400 hover:text-gray-700 p-1 rounded hover:bg-gray-200 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-0'}`}
                    aria-label="Supprimer l'élément"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}

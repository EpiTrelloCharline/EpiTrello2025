'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { getArchivedCards, getArchivedLists, restoreList, deleteCardPermanent, deleteListPermanent, updateCard } from '@/lib/api';

interface ArchivedItemsModalProps {
    boardId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ArchivedItemsModal({ boardId, isOpen, onClose }: ArchivedItemsModalProps) {
    const [activeTab, setActiveTab] = useState<'cards' | 'lists'>('cards');
    const [archivedCards, setArchivedCards] = useState<any[]>([]);
    const [archivedLists, setArchivedLists] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            if (activeTab === 'cards') {
                const cards = await getArchivedCards(boardId);
                setArchivedCards(cards);
            } else {
                const lists = await getArchivedLists(boardId);
                setArchivedLists(lists);
            }
        } catch (error) {
            console.error('Error fetching archived items:', error);
        } finally {
            setLoading(false);
        }
    }, [activeTab, boardId]);

    useEffect(() => {
        if (isOpen) {
            fetchData();
        }
    }, [isOpen, fetchData]);

    const handleRestoreCard = async (cardId: string) => {
        try {
            await updateCard(cardId, { isArchived: false });
            setArchivedCards(archivedCards.filter(c => c.id !== cardId));
        } catch (error) {
            console.error('Error restoring card:', error);
        }
    };

    const handleDeleteCardPermanent = async (cardId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette carte ?')) return;
        try {
            await deleteCardPermanent(cardId);
            setArchivedCards(archivedCards.filter(c => c.id !== cardId));
        } catch (error) {
            console.error('Error deleting card permanently:', error);
        }
    };

    const handleRestoreList = async (listId: string) => {
        try {
            await restoreList(listId);
            setArchivedLists(archivedLists.filter(l => l.id !== listId));
        } catch (error) {
            console.error('Error restoring list:', error);
        }
    };

    const handleDeleteListPermanent = async (listId: string) => {
        if (!confirm('Êtes-vous sûr de vouloir supprimer définitivement cette liste et toutes ses cartes ?')) return;
        try {
            await deleteListPermanent(listId);
            setArchivedLists(archivedLists.filter(l => l.id !== listId));
        } catch (error) {
            console.error('Error deleting list permanently:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-800">Éléments archivés</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-500"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex px-6 border-b">
                    <button
                        onClick={() => setActiveTab('cards')}
                        className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'cards'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Cartes
                    </button>
                    <button
                        onClick={() => setActiveTab('lists')}
                        className={`px-6 py-3 text-sm font-semibold transition-colors border-b-2 ${activeTab === 'lists'
                            ? 'border-blue-600 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            }`}
                    >
                        Listes
                    </button>
                </div>

                {/* List Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : (
                        <>
                            {activeTab === 'cards' ? (
                                archivedCards.length === 0 ? (
                                    <p className="text-center text-gray-500 py-12">Aucune carte archivée</p>
                                ) : (
                                    archivedCards.map(card => (
                                        <div key={card.id} className="group bg-gray-50 border rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{card.title}</h4>
                                                <p className="text-xs text-gray-500 mt-1">Archivée depuis la liste : {card.list?.title}</p>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleRestoreCard(card.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                >
                                                    Restaurer
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCardPermanent(card.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )
                            ) : (
                                archivedLists.length === 0 ? (
                                    <p className="text-center text-gray-500 py-12">Aucune liste archivée</p>
                                ) : (
                                    archivedLists.map(list => (
                                        <div key={list.id} className="group bg-gray-50 border rounded-lg p-4 flex items-center justify-between hover:border-blue-200 transition-colors">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-semibold text-gray-900 truncate">{list.title}</h4>
                                            </div>
                                            <div className="flex items-center gap-2 ml-4">
                                                <button
                                                    onClick={() => handleRestoreList(list.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                >
                                                    Restaurer
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteListPermanent(list.id)}
                                                    className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                >
                                                    Supprimer
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )
                            )}
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t text-right">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Fermer
                    </button>
                </div>
            </div>
        </div>
    );
}

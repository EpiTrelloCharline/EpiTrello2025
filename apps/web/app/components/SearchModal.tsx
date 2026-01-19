
import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { searchBoard } from '@/lib/api';

type SearchModalProps = {
    boardId: string;
    onClose: () => void;
    onCardClick: (cardId: string) => void;
};

type SearchResult = {
    cards: any[];
    comments: any[];
    boards: any[];
};

export function SearchModal({ boardId, onClose, onCardClick }: SearchModalProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult>({ cards: [], comments: [], boards: [] });
    const [isSearching, setIsSearching] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();

        // Close on Escape
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [onClose]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (!query.trim()) {
                setResults({ cards: [], comments: [], boards: [] });
                return;
            }

            setIsSearching(true);
            try {
                const data = await searchBoard(boardId, query);
                setResults(data);
            } catch (error) {
                console.error('Search failed:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query, boardId]);

    const highlightText = (text: string, highlight: string) => {
        if (!highlight.trim()) return text;
        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <mark key={i} className="bg-yellow-200 text-black rounded px-0.5">{part}</mark>
            ) : (
                part
            )
        );
    };

    if (typeof document === 'undefined') return null;

    return createPortal(
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-20">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

            <div className="relative bg-white rounded-lg shadow-2xl w-full max-w-2xl mx-4 flex flex-col max-h-[80vh]">
                <div className="p-4 border-b flex items-center gap-3">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Rechercher des cartes, commentaires..."
                        className="flex-1 text-lg outline-none text-gray-800 placeholder-gray-400"
                    />
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <span className="text-2xl">&times;</span>
                    </button>
                </div>

                <div className="overflow-y-auto p-4 space-y-6">
                    {isSearching ? (
                        <div className="text-center text-gray-500 py-8">Recherche en cours...</div>
                    ) : query.trim() && results.cards.length === 0 && results.comments.length === 0 && results.boards.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">Aucun résultat trouvé pour &quot;{query}&quot;</div>
                    ) : (
                        <>
                            {results.boards.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tableaux</h3>
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {results.boards.map((board: any) => (
                                            <a
                                                key={board.id}
                                                href={`/boards/${board.id}`}
                                                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-200 transition-colors"
                                            >
                                                <div
                                                    className="w-8 h-8 rounded flex-shrink-0"
                                                    style={{
                                                        backgroundColor: board.backgroundColor || '#0079bf',
                                                        backgroundImage: board.backgroundImage ? `url(${board.backgroundImage})` : 'none',
                                                        backgroundSize: 'cover'
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-800 text-sm truncate">
                                                        {highlightText(board.title, query)}
                                                    </div>
                                                </div>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {results.cards.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Cartes</h3>
                                    <div className="space-y-2">
                                        {results.cards.map((card: any) => (
                                            <div
                                                key={card.id}
                                                onClick={() => {
                                                    onCardClick(card.id);
                                                    onClose();
                                                }}
                                                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-200 transition-colors group"
                                            >
                                                <div className="font-medium text-gray-800 mb-1">
                                                    {highlightText(card.title, query)}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                                                        {card.list?.title || 'Liste inconnue'}
                                                    </span>
                                                    {card.description && (
                                                        <span className="truncate max-w-md">
                                                            - {highlightText(card.description.substring(0, 100), query)}...
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {results.comments.length > 0 && (
                                <div>
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Commentaires</h3>
                                    <div className="space-y-2">
                                        {results.comments.map((comment: any) => (
                                            <div
                                                key={comment.id}
                                                onClick={() => {
                                                    onCardClick(comment.cardId);
                                                    onClose();
                                                }}
                                                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border border-transparent hover:border-blue-200 transition-colors"
                                            >
                                                <div className="text-sm text-gray-800 mb-1">
                                                    {highlightText(comment.content, query)}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Sur la carte <span className="font-medium text-gray-700">{comment.card.title}</span> &bull; par {comment.user.name || comment.user.email}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}

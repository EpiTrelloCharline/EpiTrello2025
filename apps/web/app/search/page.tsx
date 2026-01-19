'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { globalSearch } from '@/lib/api';
import Link from 'next/link';

export default function SearchPage() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const [results, setResults] = useState<{
        cards: any[];
        comments: any[];
        boards: any[];
    }>({ cards: [], comments: [], boards: [] });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (query) {
            const performSearch = async () => {
                setLoading(true);
                try {
                    const data = await globalSearch(query);
                    setResults(data);
                } catch (error) {
                    console.error('Global search failed:', error);
                } finally {
                    setLoading(false);
                }
            };
            performSearch();
        }
    }, [query]);

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

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="max-w-5xl mx-auto px-6 pt-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/workspaces" className="text-gray-500 hover:text-gray-700">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Résultats pour &quot;<span className="text-blue-600">{query}</span>&quot;
                    </h1>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                        <p className="text-gray-500">Recherche en cours...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Column 1: Boards & Comments */}
                        <div className="lg:col-span-1 space-y-8">
                            {/* Boards */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Tableaux</h2>
                                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                        {results.boards.length}
                                    </span>
                                </div>
                                {results.boards.length > 0 ? (
                                    <div className="grid gap-3">
                                        {results.boards.map((board) => (
                                            <Link
                                                key={board.id}
                                                href={`/boards/${board.id}`}
                                                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all group"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded shadow-inner flex-shrink-0"
                                                    style={{
                                                        backgroundColor: board.backgroundColor || '#0079bf',
                                                        backgroundImage: board.backgroundImage ? `url(${board.backgroundImage})` : 'none',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition: 'center'
                                                    }}
                                                />
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-gray-900 truncate group-hover:text-blue-600">
                                                        {highlightText(board.title, query)}
                                                    </div>
                                                    <div className="text-xs text-gray-500 truncate">
                                                        {board.workspace?.name}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Aucun tableau trouvé</p>
                                )}
                            </section>

                            {/* Comments */}
                            <section>
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Commentaires</h2>
                                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                        {results.comments.length}
                                    </span>
                                </div>
                                {results.comments.length > 0 ? (
                                    <div className="space-y-3">
                                        {results.comments.map((comment) => (
                                            <div
                                                key={comment.id}
                                                className="p-3 bg-white border border-gray-200 rounded-lg"
                                            >
                                                <div className="text-sm text-gray-800 mb-2 italic">
                                                    &quot;{highlightText(comment.content, query)}&quot;
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="text-xs text-gray-500">
                                                        Par <span className="font-medium text-gray-700">{comment.user.name || comment.user.email}</span>
                                                    </div>
                                                    <Link
                                                        href={`/boards/${comment.card.list.board.id}?card=${comment.card.id}`}
                                                        className="text-xs text-blue-500 hover:underline"
                                                    >
                                                        Voir la carte
                                                    </Link>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 italic">Aucun commentaire trouvé</p>
                                )}
                            </section>
                        </div>

                        {/* Column 2: Cards (Main Results) */}
                        <div className="lg:col-span-2">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Cartes</h2>
                                <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">
                                    {results.cards.length}
                                </span>
                            </div>
                            {results.cards.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {results.cards.map((card) => (
                                        <Link
                                            key={card.id}
                                            href={`/boards/${card.list.board.id}?card=${card.id}`}
                                            className="p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-md transition-all flex flex-col h-full group"
                                        >
                                            <div className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                {highlightText(card.title, query)}
                                            </div>

                                            {card.description && (
                                                <div className="text-sm text-gray-600 mb-4 line-clamp-2">
                                                    {highlightText(card.description, query)}
                                                </div>
                                            )}

                                            <div className="mt-auto pt-4 border-t border-gray-50 flex flex-wrap items-center gap-2">
                                                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                                                    Dans
                                                </span>
                                                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded">
                                                    {card.list.board.title}
                                                </span>
                                                <span className="text-gray-300 transform rotate-12">/</span>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {card.list.title}
                                                </span>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-gray-400 italic">Aucune carte trouvée</p>
                            )}
                        </div>
                    </div>
                )}

                {!loading && query && results.cards.length === 0 && results.comments.length === 0 && results.boards.length === 0 && (
                    <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900">Aucun résultat trouvé</h3>
                        <p className="mt-1 text-sm text-gray-500">Essayez avec d&apos;autres mots-clés ou vérifiez l&apos;orthographe.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

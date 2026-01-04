import React, { useState, useEffect } from 'react';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';

type Comment = {
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    user: {
        id: string;
        name: string | null;
        avatar: string | null;
    };
};

type ActivitySectionProps = {
    cardId: string;
    currentUser: {
        id: string;
        name?: string;
        avatar?: string | null;
    };
};

export function ActivitySection({ cardId, currentUser }: ActivitySectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load comments
    useEffect(() => {
        loadComments();
    }, [cardId]);

    const loadComments = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3001/cards/${cardId}/comments`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to load comments');
            }

            const data = await response.json();
            setComments(data);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError('Impossible de charger les commentaires');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddComment = async (content: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3001/cards/${cardId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to add comment');
            }

            const newComment = await response.json();
            setComments([newComment, ...comments]);
        } catch (err) {
            console.error('Error adding comment:', err);
            throw err;
        }
    };

    const handleUpdateComment = async (commentId: string, content: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ content }),
            });

            if (!response.ok) {
                throw new Error('Failed to update comment');
            }

            const updatedComment = await response.json();
            setComments(comments.map(c => c.id === commentId ? updatedComment : c));
        } catch (err) {
            console.error('Error updating comment:', err);
            throw err;
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await fetch(`http://localhost:3001/comments/${commentId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete comment');
            }

            setComments(comments.filter(c => c.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
            throw err;
        }
    };

    return (
        <div className="mt-8 border-t border-gray-300 pt-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-semibold text-[#172b4d]">Activité</h3>
            </div>

            {/* Comment Input */}
            <div className="mb-6">
                <CommentInput
                    userAvatar={currentUser.avatar}
                    userName={currentUser.name}
                    onSubmit={handleAddComment}
                />
            </div>

            {/* Comments List */}
            <div className="space-y-4">
                {isLoading && (
                    <div className="text-center py-8">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        <p className="text-sm text-gray-500 mt-2">Chargement des commentaires...</p>
                    </div>
                )}

                {error && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">{error}</p>
                        <button
                            onClick={loadComments}
                            className="text-sm text-red-600 hover:text-red-800 underline mt-1"
                        >
                            Réessayer
                        </button>
                    </div>
                )}

                {!isLoading && !error && comments.length === 0 && (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm text-gray-500">Aucun commentaire pour le moment</p>
                        <p className="text-xs text-gray-400 mt-1">Soyez le premier à commenter cette carte</p>
                    </div>
                )}

                {!isLoading && !error && comments.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        currentUserId={currentUser.id}
                        onUpdate={handleUpdateComment}
                        onDelete={handleDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
}

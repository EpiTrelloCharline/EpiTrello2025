import React, { useState, useEffect, useCallback } from 'react';
import { CommentInput } from './CommentInput';
import { CommentItem } from './CommentItem';
import {
    Comment,
    getComments,
    createComment,
    updateComment,
    deleteComment
} from '@/lib/api';

/** Props of ActivitySection */
interface ActivitySectionProps {
    cardId: string;
    currentUser: {
        id: string;
        name?: string;
        avatar?: string | null;
    };
}

/**
 * Component displaying the activity section of a card
 * Manages comments (reading, creating, updating, deleting)
 */
export function ActivitySection({ cardId, currentUser }: ActivitySectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    /**
     * Loads comments from the API
     */
    const loadComments = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getComments(cardId);
            setComments(data);
        } catch (err) {
            console.error('Error loading comments:', err);
            setError('Impossible de charger les commentaires');
        } finally {
            setIsLoading(false);
        }
    }, [cardId]);

    // Initial load
    useEffect(() => {
        loadComments();
    }, [cardId, loadComments]);

    /**
     * Adds a new comment
     */
    const handleAddComment = async (content: string) => {
        try {
            const newComment = await createComment(cardId, { content });
            setComments((prev) => [newComment, ...prev]);
        } catch (err) {
            console.error('Error adding comment:', err);
            throw err;
        }
    };

    /**
     * Updates an existing comment
     */
    const handleUpdateComment = async (commentId: string, content: string) => {
        try {
            const updatedComment = await updateComment(commentId, { content });
            setComments((prev) =>
                prev.map((c) => (c.id === commentId ? updatedComment : c))
            );
        } catch (err) {
            console.error('Error updating comment:', err);
            throw err;
        }
    };

    /**
     * Deletes a comment
     */
    const handleDeleteComment = async (commentId: string) => {
        try {
            await deleteComment(commentId);
            setComments((prev) => prev.filter((c) => c.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
            throw err;
        }
    };

    const sortedComments = [...comments].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return (
        <div className="mt-8 border-t border-gray-300 pt-6">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1 flex justify-between items-center">
                    <h3 className="font-semibold text-[#172b4d]">Activité</h3>
                </div>
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
                        <p className="text-sm text-gray-500 mt-2">Chargement...</p>
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

                {!isLoading && !error && sortedComments.length === 0 && (
                    <div className="text-center py-8">
                        <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <p className="text-sm text-gray-500">Aucun commentaire pour le moment</p>
                    </div>
                )}

                {!isLoading && !error && sortedComments.map(comment => (
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

import React, { useState } from 'react';

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

type CommentItemProps = {
    comment: Comment;
    currentUserId: string;
    onUpdate: (commentId: string, content: string) => Promise<void>;
    onDelete: (commentId: string) => Promise<void>;
};

export function CommentItem({ comment, currentUserId, onUpdate, onDelete }: CommentItemProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const isOwnComment = comment.user.id === currentUserId;

    const handleUpdate = async () => {
        if (!editContent.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onUpdate(comment.id, editContent);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to update comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        setIsSubmitting(true);
        try {
            await onDelete(comment.id);
        } catch (error) {
            console.error('Failed to delete comment:', error);
            setIsSubmitting(false);
        }
    };

    const getRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'à l\'instant';
        if (diffMins < 60) return `il y a ${diffMins} min`;
        if (diffHours < 24) return `il y a ${diffHours}h`;
        if (diffDays < 7) return `il y a ${diffDays}j`;
        
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="flex gap-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
                {comment.user.avatar ? (
                    <img
                        src={comment.user.avatar}
                        alt={comment.user.name || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {comment.user.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>

            {/* Comment Content */}
            <div className="flex-1 min-w-0">
                <div className="bg-white rounded-lg border border-gray-200 p-3">
                    {/* Header */}
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-[#172b4d]">
                            {comment.user.name || 'Utilisateur'}
                        </span>
                        <span className="text-xs text-gray-500">
                            {getRelativeTime(comment.createdAt)}
                        </span>
                        {comment.updatedAt !== comment.createdAt && (
                            <span className="text-xs text-gray-400">(modifié)</span>
                        )}
                    </div>

                    {/* Content */}
                    {isEditing ? (
                        <div className="mt-2">
                            <textarea
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#172b4d] transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none focus:outline-none"
                                rows={3}
                                autoFocus
                            />
                            <div className="mt-2 flex gap-2">
                                <button
                                    onClick={handleUpdate}
                                    disabled={!editContent.trim() || isSubmitting}
                                    className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 font-medium text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                                >
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                                <button
                                    onClick={() => {
                                        setEditContent(comment.content);
                                        setIsEditing(false);
                                    }}
                                    className="text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                                >
                                    Annuler
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-[#172b4d] whitespace-pre-wrap break-words">
                            {comment.content}
                        </p>
                    )}
                </div>

                {/* Actions - Only show for own comments */}
                {isOwnComment && !isEditing && (
                    <div className="mt-1 flex gap-2 text-xs">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="text-gray-600 hover:text-gray-800 hover:underline transition-colors"
                        >
                            Modifier
                        </button>
                        <span className="text-gray-300">•</span>
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="text-gray-600 hover:text-red-600 hover:underline transition-colors"
                        >
                            Supprimer
                        </button>
                    </div>
                )}

                {/* Delete Confirmation */}
                {showDeleteConfirm && (
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800 mb-2">
                            Êtes-vous sûr de vouloir supprimer ce commentaire ?
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="bg-red-600 text-white px-3 py-1.5 rounded hover:bg-red-700 font-medium text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600"
                            >
                                {isSubmitting ? 'Suppression...' : 'Supprimer'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
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

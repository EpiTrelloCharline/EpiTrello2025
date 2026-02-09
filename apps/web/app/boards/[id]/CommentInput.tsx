import React, { useState } from 'react';

type CommentInputProps = {
    userAvatar?: string | null;
    userName?: string;
    onSubmit: (content: string) => Promise<void>;
};

export function CommentInput({ userAvatar, userName, onSubmit }: CommentInputProps) {
    const [content, setContent] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = async () => {
        if (!content.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            await onSubmit(content);
            setContent('');
            setIsFocused(false);
        } catch (error) {
            console.error('Failed to submit comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex gap-3">
            {/* User Avatar */}
            <div className="flex-shrink-0">
                {userAvatar ? (
                    <img
                        src={userAvatar}
                        alt={userName || 'User'}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm">
                        {userName?.charAt(0).toUpperCase() || 'U'}
                    </div>
                )}
            </div>

            {/* Comment Input */}
            <div className="flex-1">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onKeyDown={handleKeyDown}
                    placeholder="Écrire un commentaire..."
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-[#172b4d] placeholder-gray-400 transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none focus:outline-none"
                    rows={isFocused ? 3 : 1}
                />

                {/* Action Buttons - Only show when focused */}
                {isFocused && (
                    <div className="mt-2 flex items-center gap-2">
                        <button
                            onClick={handleSubmit}
                            disabled={!content.trim() || isSubmitting}
                            className="bg-blue-600 text-white px-4 py-1.5 rounded hover:bg-blue-700 font-medium text-sm transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600"
                        >
                            {isSubmitting ? 'Envoi...' : 'Enregistrer'}
                        </button>
                        <button
                            onClick={() => {
                                setContent('');
                                setIsFocused(false);
                            }}
                            className="text-gray-700 px-3 py-1.5 rounded hover:bg-gray-100 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
                        >
                            Annuler
                        </button>
                        <span className="text-xs text-gray-500 ml-auto">
                            Ctrl/Cmd + Entrée pour envoyer
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}

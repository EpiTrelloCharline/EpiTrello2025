'use client';

import { useEffect, useState } from 'react';
import { Attachment, getCardAttachments, deleteAttachment, setCardCover, uploadAttachment } from '@/app/api/attachments';
import { AttachmentItem } from './AttachmentItem';

type AttachmentsSectionProps = {
    cardId: string;
    currentCoverId?: string | null;
    refreshTrigger: number;
    onCoverSet: () => void;
    onAttachmentsChange?: (count: number) => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function AttachmentsSection({ cardId, currentCoverId, refreshTrigger, onCoverSet, onAttachmentsChange }: AttachmentsSectionProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [loading, setLoading] = useState(true);
    const [lightboxImage, setLightboxImage] = useState<string | null>(null);

    useEffect(() => {
        loadAttachments();
    }, [cardId, refreshTrigger]);

    const loadAttachments = async () => {
        try {
            const data = await getCardAttachments(cardId);
            setAttachments(data);
            onAttachmentsChange?.(data.length);
        } catch (error) {
            console.error('Error loading attachments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (attachmentId: string) => {
        console.log('handleDelete called with attachmentId:', attachmentId);

        try {
            console.log('Calling deleteAttachment API...');
            await deleteAttachment(attachmentId);
            console.log('Attachment deleted successfully');

            const newAttachments = attachments.filter(a => a.id !== attachmentId);
            console.log('New attachments list:', newAttachments);

            setAttachments(newAttachments);
            onAttachmentsChange?.(newAttachments.length);

            // If deleted attachment was the cover, notify parent
            if (attachmentId === currentCoverId) {
                console.log('Deleted attachment was the cover, notifying parent');
                onCoverSet();
            }
        } catch (error) {
            console.error('Error deleting attachment:', error);
            alert('Erreur lors de la suppression de la pièce jointe');
        }
    };

    const handleSetCover = async (attachmentId: string) => {
        try {
            await setCardCover(cardId, { attachmentId, coverSize: 'normal' });
            onCoverSet();
        } catch (error) {
            console.error('Error setting cover:', error);
            alert('Erreur lors de la définition de la couverture');
        }
    };

    const handleRemoveCover = async () => {
        try {
            await setCardCover(cardId, { attachmentId: null, coverColor: null });
            onCoverSet();
        } catch (error) {
            console.error('Error removing cover:', error);
            alert('Erreur lors de la suppression de la couverture');
        }
    };

    if (loading) {
        return (
            <div className="mb-6">
                <div className="ml-9 text-sm text-gray-500">Chargement des pièces jointes...</div>
            </div>
        );
    }

    if (attachments.length === 0) {
        return null;
    }

    // Separate images from documents
    const images = attachments.filter(a => a.mimeType.startsWith('image/'));
    const documents = attachments.filter(a => !a.mimeType.startsWith('image/'));

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const getFileIcon = (mimeType: string) => {
        if (mimeType.includes('pdf')) {
            return (
                <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
            );
        }
        if (mimeType.includes('word') || mimeType.includes('document')) {
            return (
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
            );
        }
        if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('7z')) {
            return (
                <svg className="w-8 h-8 text-yellow-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
                </svg>
            );
        }
        return (
            <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z" />
            </svg>
        );
    };

    return (
        <>
            {/* Images Gallery */}
            {images.length > 0 && (
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3 ml-9 mr-9">
                        <h4 className="text-sm font-semibold text-gray-700">Pièces jointes</h4>
                        <label
                            htmlFor="attachment-add"
                            className="px-3 py-1.5 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded text-sm font-medium cursor-pointer transition-colors"
                        >
                            Ajouter
                        </label>
                        <input
                            type="file"
                            id="attachment-add"
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={async (e) => {
                                const files = Array.from(e.target.files || []);
                                for (const file of files) {
                                    try {
                                        await uploadAttachment(cardId, file);
                                    } catch (error) {
                                        console.error('Error uploading:', error);
                                    }
                                }
                                loadAttachments();
                                e.target.value = '';
                            }}
                        />
                    </div>
                    <div className="ml-9 mr-9 grid grid-cols-2 md:grid-cols-3 gap-3">
                        {images.map(attachment => (
                            <AttachmentItem
                                key={attachment.id}
                                attachment={attachment}
                                isCover={currentCoverId === attachment.id}
                                onSetCover={() => handleSetCover(attachment.id)}
                                onRemoveCover={handleRemoveCover}
                                onDelete={() => handleDelete(attachment.id)}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Documents List */}
            {documents.length > 0 && (
                <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3 ml-9">Documents</h4>
                    <div className="ml-9 space-y-2">
                        {documents.map(attachment => (
                            <div
                                key={attachment.id}
                                className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors group"
                            >
                                {getFileIcon(attachment.mimeType)}
                                <div className="flex-1 min-w-0">
                                    <a
                                        href={`${API_URL}/${attachment.url}`}
                                        download={attachment.name}
                                        className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                                    >
                                        {attachment.name}
                                    </a>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(attachment.size)} • {new Date(attachment.createdAt).toLocaleDateString('fr-FR')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => handleDelete(attachment.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded transition-all"
                                    title="Supprimer"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Lightbox for images */}
            {lightboxImage && (
                <div
                    className="fixed inset-0 z-[300] bg-black/90 flex items-center justify-center p-4"
                    onClick={() => setLightboxImage(null)}
                >
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
                        onClick={() => setLightboxImage(null)}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    <img
                        src={lightboxImage}
                        alt="Preview"
                        className="max-w-full max-h-full object-contain"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}

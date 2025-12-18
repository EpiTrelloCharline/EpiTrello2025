'use client';

import { useState, useEffect } from 'react';
import { Attachment, getCardAttachments, uploadAttachment, setCardCover } from '@/app/api/attachments';

type CoverPopupProps = {
    cardId: string;
    currentCoverId?: string | null;
    currentCoverColor?: string | null;
    currentCoverSize?: string;
    anchorEl: HTMLElement | null;
    onClose: () => void;
    onCoverSet: () => void;
};

const COVER_COLORS = [
    '#61BD4F', // Green
    '#F2D600', // Yellow
    '#FF9F1A', // Orange
    '#EB5A46', // Red
    '#C377E0', // Purple
    '#0079BF', // Blue
    '#00C2E0', // Sky
    '#51E898', // Lime
    '#FF78CB', // Pink
    '#344563', // Dark
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export function CoverPopup({
    cardId,
    currentCoverId,
    currentCoverColor,
    currentCoverSize = 'normal',
    anchorEl,
    onClose,
    onCoverSet,
}: CoverPopupProps) {
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const [selectedSize, setSelectedSize] = useState(currentCoverSize);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        loadAttachments();
    }, [cardId]);

    const loadAttachments = async () => {
        try {
            const data = await getCardAttachments(cardId);
            // Only show images
            setAttachments(data.filter(a => a.mimeType.startsWith('image/')));
        } catch (error) {
            console.error('Error loading attachments:', error);
        }
    };

    const handleSizeChange = async (size: string) => {
        setSelectedSize(size);
        try {
            await setCardCover(cardId, { coverSize: size });
            onCoverSet();
        } catch (error) {
            console.error('Error setting cover size:', error);
        }
    };

    const handleColorSelect = async (color: string) => {
        try {
            await setCardCover(cardId, { coverColor: color, coverSize: selectedSize, attachmentId: null });
            onCoverSet();
        } catch (error) {
            console.error('Error setting color cover:', error);
        }
    };

    const handleAttachmentSelect = async (attachmentId: string) => {
        try {
            await setCardCover(cardId, { attachmentId, coverSize: selectedSize, coverColor: null });
            onCoverSet();
        } catch (error) {
            console.error('Error setting attachment cover:', error);
        }
    };

    const handleRemoveCover = async () => {
        try {
            await setCardCover(cardId, { attachmentId: null, coverColor: null, coverSize: 'normal' });
            onCoverSet();
            onClose();
        } catch (error) {
            console.error('Error removing cover:', error);
        }
    };

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const newAttachment = await uploadAttachment(cardId, file);
            await setCardCover(cardId, { attachmentId: newAttachment.id, coverSize: selectedSize, coverColor: null });
            onCoverSet();
            loadAttachments();
        } catch (error) {
            console.error('Error uploading cover:', error);
            alert('Erreur lors de l\'upload de l\'image');
        } finally {
            setUploading(false);
        }
    };

    if (!anchorEl) return null;

    const rect = anchorEl.getBoundingClientRect();
    const top = rect.top - 200;
    const left = rect.left - 320; // Décalage vers la gauche (largeur de la popup)

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 z-[250]"
                onClick={onClose}
            />

            {/* Popup */}
            <div
                className="fixed z-[251] bg-white rounded-lg shadow-xl w-80 p-4 max-h-[90vh] overflow-y-auto"
                style={{
                    top: `${top}px`,
                    left: `${left}px`,
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold text-gray-700 text-center flex-1">Couverture</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 p-1"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Size Selection */}
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Taille</h4>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => handleSizeChange('normal')}
                            className={`p-2 border-2 rounded hover:border-blue-500 transition-colors ${selectedSize === 'normal' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                        >
                            <div className="bg-gray-300 h-8 rounded-t mb-1"></div>
                            <div className="text-xs text-gray-600 text-center">Normal</div>
                        </button>
                        <button
                            onClick={() => handleSizeChange('full')}
                            className={`p-2 border-2 rounded hover:border-blue-500 transition-colors ${selectedSize === 'full' ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                                }`}
                        >
                            <div className="bg-gray-300 h-12 rounded mb-1"></div>
                            <div className="text-xs text-gray-600 text-center">Pleine</div>
                        </button>
                    </div>
                </div>

                {/* Colors */}
                <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-600 mb-2">Couleurs</h4>
                    <div className="grid grid-cols-5 gap-2">
                        {COVER_COLORS.map((color) => (
                            <button
                                key={color}
                                onClick={() => handleColorSelect(color)}
                                className={`h-8 rounded hover:opacity-80 transition-opacity ${currentCoverColor === color ? 'ring-2 ring-blue-500 ring-offset-2' : ''
                                    }`}
                                style={{ backgroundColor: color }}
                                title={color}
                            />
                        ))}
                    </div>
                </div>

                {/* Attachments */}
                {attachments.length > 0 && (
                    <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-600 mb-2">Pièces jointes</h4>
                        <div className="grid grid-cols-3 gap-2 max-h-32 overflow-y-auto">
                            {attachments.map((attachment) => (
                                <button
                                    key={attachment.id}
                                    onClick={() => handleAttachmentSelect(attachment.id)}
                                    className={`aspect-video rounded overflow-hidden hover:opacity-80 transition-opacity ${currentCoverId === attachment.id ? 'ring-2 ring-blue-500' : ''
                                        }`}
                                >
                                    <img
                                        src={`${API_URL}/${attachment.url}`}
                                        alt={attachment.name}
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload */}
                <div className="mb-4">
                    <input
                        type="file"
                        id="cover-upload"
                        className="hidden"
                        accept="image/*"
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                    <label
                        htmlFor="cover-upload"
                        className={`block w-full text-center py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 cursor-pointer transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                    >
                        {uploading ? 'Upload en cours...' : 'Uploader une image de couverture'}
                    </label>
                </div>

                {/* Remove Cover */}
                {(currentCoverId || currentCoverColor) && (
                    <button
                        onClick={handleRemoveCover}
                        className="w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded text-sm font-medium transition-colors"
                    >
                        Retirer la couverture
                    </button>
                )}
            </div>
        </>
    );
}

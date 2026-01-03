'use client';

import { useState, useRef } from 'react';
import { uploadAttachment } from '@/app/api/attachments';

type AttachmentUploadZoneProps = {
    cardId: string;
    onUploadComplete: () => void;
};

export function AttachmentUploadZone({ cardId, onUploadComplete }: AttachmentUploadZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFileUpload(files[0]);
        }
    };

    const handleFileUpload = async (file: File) => {
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Simulate progress for better UX
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 100);

            await uploadAttachment(cardId, file);
            
            clearInterval(progressInterval);
            setUploadProgress(100);
            
            // Wait a bit before completing
            setTimeout(() => {
                onUploadComplete();
                setIsUploading(false);
                setUploadProgress(0);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 500);
        } catch (error) {
            console.error('Error uploading attachment:', error);
            alert('Échec de l\'upload du fichier');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className="mb-4">
            <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={handleButtonClick}
                className={`
                    border-2 border-dashed rounded-lg p-6 text-center cursor-pointer
                    transition-colors duration-200
                    ${isDragging
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
                    }
                    ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
                `}
            >
                {isUploading ? (
                    <div className="space-y-2">
                        <div className="flex items-center justify-center">
                            <svg
                                className="animate-spin h-8 w-8 text-blue-500"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        </div>
                        <p className="text-sm text-gray-600">Upload en cours... {uploadProgress}%</p>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                        >
                            <path
                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                strokeWidth={2}
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <div className="text-sm text-gray-600">
                            <span className="font-medium text-blue-600 hover:text-blue-500">
                                Cliquez pour choisir un fichier
                            </span>
                            {' '}ou glissez-déposez
                        </div>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, PDF, DOC, etc. (Max 10MB)
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

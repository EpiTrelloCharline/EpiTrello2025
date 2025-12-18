import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { uploadAttachment } from '@/app/api/attachments';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type AttachmentItemProps = {
    attachment: {
        id: string;
        name: string;
        url: string;
        mimeType: string;
        createdAt: string;
    };
    isCover: boolean;
    onSetCover: () => void;
    onRemoveCover: () => void;
    onDelete: () => void;
};

export function AttachmentItem({ attachment, isCover, onSetCover, onRemoveCover, onDelete }: AttachmentItemProps) {
    const [showMenu, setShowMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node) &&
                buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
                setShowMenu(false);
            }
        };

        if (showMenu) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showMenu]);

    useEffect(() => {
        if (showMenu && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setMenuPosition({
                top: rect.bottom + window.scrollY + 4,
                left: rect.left + window.scrollX // Aligné à gauche du bouton
            });
        }
    }, [showMenu]);

    return (
        <>
            <div className="flex items-center gap-3 p-2 bg-gray-50 hover:bg-gray-100 rounded transition-colors group">
                {/* Thumbnail */}
                <div className="w-20 h-14 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img
                        src={attachment.url.startsWith('http') ? attachment.url : `${API_URL}/${attachment.url}`}
                        alt={attachment.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            const fullUrl = attachment.url.startsWith('http') ? attachment.url : `${API_URL}/${attachment.url}`;
                            console.error('Image load error:', fullUrl);
                            console.log('Full attachment object:', attachment);
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center"><svg class="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"/></svg></div>';
                        }}
                    />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <a
                            href={attachment.url.startsWith('http') ? attachment.url : `${API_URL}/${attachment.url}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate"
                        >
                            {attachment.name}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        {isCover && (
                            <span className="flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                                </svg>
                                Couverture
                            </span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                    {/* Options menu */}
                    <button
                        ref={buttonRef}
                        onClick={() => setShowMenu(!showMenu)}
                        className="p-1.5 hover:bg-gray-200 rounded transition-colors opacity-0 group-hover:opacity-100"
                        title="Options"
                    >
                        <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Dropdown menu using portal */}
            {showMenu && typeof document !== 'undefined' && createPortal(
                <div
                    ref={menuRef}
                    className="fixed w-56 bg-gray-800 rounded-lg shadow-xl py-2 z-[9999]"
                    style={{
                        top: `${menuPosition.top}px`,
                        left: `${menuPosition.left}px`
                    }}
                >
                    {isCover ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Remove cover button clicked');
                                setShowMenu(false);
                                onRemoveCover();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                            Remove cover
                        </button>
                    ) : (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                console.log('Set cover button clicked');
                                setShowMenu(false);
                                onSetCover();
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                        >
                            Définir comme couverture
                        </button>
                    )}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            console.log('Delete button clicked, onDelete:', typeof onDelete);
                            setShowMenu(false);
                            if (typeof onDelete === 'function') {
                                onDelete();
                            } else {
                                console.error('onDelete is not a function:', onDelete);
                            }
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                    >
                        Supprimer
                    </button>
                </div>,
                document.body
            )}
        </>
    );
}

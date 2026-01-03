'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useState, useEffect, useRef, forwardRef } from 'react';
import { createPortal } from 'react-dom';
import ContextMenu from '@/app/components/ContextMenu';
import { CardLabelPicker } from './CardLabelPicker';
import { CardMemberAvatars } from './CardMemberAvatars';
import { DueDateBadge } from './DueDateBadge';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

type Label = {
    id: string;
    name: string;
    color: string;
};

type User = {
    id: string;
    name: string | null;
    email: string;
};

type Card = {
    id: string;
    listId: string;
    title: string;
    position: any;
    coverId?: string | null;
    coverUrl?: string;
    coverColor?: string | null;
    coverSize?: string;
    labels?: Label[];
    members?: User[];
    dueDate?: string | null;
    isDone?: boolean;
};

type DraggableCardProps = {
    card: Card;
    boardId: string;
    onDelete: (cardId: string) => void;
    onUpdate: (cardId: string, data: { title?: string }) => void;
    onClick?: () => void;
    isDragDisabled?: boolean;
    onLabelsUpdated?: () => void;
    onDuplicate?: (cardId: string) => void;
};

export function DraggableCard({ card, boardId, onDelete, onUpdate, onClick, isDragDisabled, onLabelsUpdated, onDuplicate }: DraggableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id, disabled: isDragDisabled });

    const [isEditing, setIsEditing] = useState(false);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
    const [showLabelPicker, setShowLabelPicker] = useState(false);
    const [editTitle, setEditTitle] = useState(card.title);
    const [editPos, setEditPos] = useState({ top: 0, left: 0, width: 0 });
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextPos, setContextPos] = useState({ x: 0, y: 0 });

    const cardRef = useRef<HTMLElement | null>(null);
    const labelButtonRef = useRef<HTMLButtonElement | null>(null);

    // Reset title when card changes
    useEffect(() => {
        setEditTitle(card.title);
    }, [card.title]);

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    function handleSave() {
        if (editTitle.trim() !== card.title) {
            onUpdate(card.id, { title: editTitle });
        }
        setIsEditing(false);
    }

    // Combine refs
    const setRefs = (node: HTMLElement | null) => {
        setNodeRef(node);
        cardRef.current = node;
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            setEditPos({
                top: rect.top,
                left: rect.left,
                width: rect.width,
            });
            setIsEditing(true);
        }
    };

    return (
        <>
            <div
                ref={setRefs}
                style={style}
                {...attributes}
                {...listeners}
                className="bg-white p-2 rounded-lg shadow-sm border-b border-gray-200 hover:border-blue-500 cursor-pointer group relative focus:outline-none focus:ring-2 focus:ring-blue-500"
                onClick={onClick}
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setContextPos({ x: e.clientX, y: e.clientY });
                    setShowContextMenu(true);
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        onClick?.();
                    }
                }}
            >
                {/* Cover - Image or Color */}
                {(card.coverUrl || card.coverColor) && (
                    <div className="-m-2 mb-2">
                        {card.coverSize === 'full' ? (
                            // Full cover - compact background with overlay text
                            <div
                                className="h-16 rounded-lg flex items-end p-2"
                                style={{
                                    backgroundColor: card.coverColor || undefined,
                                    backgroundImage: card.coverUrl
                                        ? `url(${card.coverUrl.startsWith('http') ? card.coverUrl : `${API_URL}/${card.coverUrl}`})`
                                        : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            >
                                <span className="text-sm font-semibold text-white drop-shadow-lg">
                                    {card.title}
                                </span>
                            </div>
                        ) : (
                            // Normal cover - small header band only
                            <div
                                className="h-8 w-full rounded-t-lg"
                                style={{
                                    backgroundColor: card.coverColor || undefined,
                                    backgroundImage: card.coverUrl
                                        ? `url(${card.coverUrl.startsWith('http') ? card.coverUrl : `${API_URL}/${card.coverUrl}`})`
                                        : undefined,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                }}
                            />
                        )}
                    </div>
                )}

                {/* Content - only show if not full cover */}
                {card.coverSize !== 'full' && (
                    <>
                        {/* Labels - compact colored bars */}
                        {card.labels && card.labels.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                                {card.labels.map(label => (
                                    <div
                                        key={label.id}
                                        className="h-2 w-10 rounded-sm"
                                        style={{ backgroundColor: label.color }}
                                        title={label.name}
                                    />
                                ))}
                            </div>
                        )}
                        <span className="text-sm text-black block min-h-[1.5em] break-words">{card.title}</span>

                        {/* Due Date Badge and Member Avatars Row */}
                        <div className="mt-2 flex items-center justify-between gap-2">
                            {/* Due Date Badge */}
                            {(card.dueDate || card.isDone) && (
                                <DueDateBadge dueDate={card.dueDate} isDone={card.isDone} />
                            )}

                            {/* Member Avatars */}
                            {card.members && card.members.length > 0 && (
                                <div className="ml-auto">
                                    <CardMemberAvatars members={card.members} />
                                </div>
                            )}
                        </div>
                    </>
                )}
                <button
                    className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 focus:opacity-100 h-7 w-7 flex items-center justify-center hover:bg-gray-100 rounded-md text-black z-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={handleEditClick}
                    aria-label="Modifier la carte"
                >
                    ✎
                </button>
            </div>

            {showLabelPicker && (
                <CardLabelPicker
                    cardId={card.id}
                    boardId={boardId}
                    currentLabels={card.labels || []}
                    onClose={() => setShowLabelPicker(false)}
                    onLabelsUpdated={onLabelsUpdated}
                    anchorEl={labelButtonRef.current}
                />
            )}

            {isEditing && typeof document !== 'undefined' && createPortal(
                <div className="fixed inset-0 z-[100] flex items-start justify-start">
                    {/* Overlay */}
                    <div
                        className="absolute inset-0 bg-black/60"
                        onClick={() => setIsEditing(false)}
                    />

                    {showArchiveConfirm ? (
                        <div className="fixed inset-0 z-[150] flex items-center justify-center pointer-events-none">
                            <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-4 pointer-events-auto">
                                <h3 className="text-lg font-semibold mb-2 text-[#172b4d]">Archiver la carte ?</h3>
                                <p className="text-gray-600 mb-6 text-sm">Êtes-vous sûr de vouloir archiver cette carte ?</p>
                                <div className="flex justify-end gap-3">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowArchiveConfirm(false);
                                        }}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded text-sm font-medium"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(card.id);
                                            setIsEditing(false);
                                        }}
                                        className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded text-sm font-medium"
                                    >
                                        Archiver
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Editor Container positioned exactly over the card */
                        <div
                            className="absolute z-10"
                            style={{
                                top: editPos.top,
                                left: editPos.left,
                                width: editPos.width
                            }}
                        >
                            {/* Textarea */}
                            <div className="bg-white rounded-lg shadow-xl mb-2">
                                <textarea
                                    className="w-full p-2 rounded-lg border-none focus:ring-0 text-sm text-[#172b4d] resize-none h-24"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    autoFocus
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSave();
                                        }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                />
                            </div>

                            {/* Save Button */}
                            <button
                                className="bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 mb-2"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleSave();
                                }}
                            >
                                Enregistrer
                            </button>

                            {/* Sidebar Actions (Floating right) */}
                            <div className="absolute left-full top-0 ml-2 w-max flex flex-col gap-1">
                                <SidebarButton
                                    icon={<path d="M4 4h16v12h-16zM4 2c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-12c0-1.1-.9-2-2-2h-16zM8 10h8v2h-8z" />}
                                    label="Ouvrir la carte"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(false);
                                        onClick?.();
                                    }}
                                />
                                <SidebarButton
                                    ref={labelButtonRef}
                                    icon={<path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z" />}
                                    label="Modifier les étiquettes"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowLabelPicker(true);
                                    }}
                                />
                                <SidebarButton icon={<path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />} label="Modifier les membres" />
                                <SidebarButton icon={<path d="M4 4h16v10h-16zM4 2c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2v-10c0-1.1-.9-2-2-2h-16z" />} label="Modifier la couverture" />
                                <SidebarButton icon={<path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />} label="Modifier les dates" />
                                <SidebarButton icon={<path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v3zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z" />} label="Déplacer" />
                                <SidebarButton icon={<path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />} label="Copier la carte" />
                                <SidebarButton icon={<path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />} label="Copier le lien" />
                                <SidebarButton
                                    icon={<path d="M20.54 5.23l-1.39-1.68C18.88 3.21 18.47 3 18 3H6c-.47 0-.88.21-1.16.55L3.46 5.23C3.17 5.57 3 6.02 3 6.5V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6.5c0-.48-.17-.93-.46-1.27zM12 17.5L6.5 12H10v-2h4v2h3.5L12 17.5zM5.12 5l.81-1h12.12l.81 1H5.12z" />}
                                    label="Archiver"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowArchiveConfirm(true);
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>,
                document.body
            )}

            {showContextMenu && (
                <ContextMenu
                    x={contextPos.x}
                    y={contextPos.y}
                    onClose={() => setShowContextMenu(false)}
                    items={[
                        {
                            id: 'edit',
                            label: 'Modifier',
                            onClick: () => {
                                // open inline editor
                                if (cardRef.current) {
                                    const rect = cardRef.current.getBoundingClientRect();
                                    setEditPos({ top: rect.top, left: rect.left, width: rect.width });
                                }
                                setIsEditing(true);
                            }
                        },
                        {
                            id: 'open',
                            label: 'Ouvrir',
                            onClick: () => {
                                onClick?.();
                            }
                        },
                        {
                            id: 'duplicate',
                            label: 'Dupliquer',
                            onClick: () => {
                                onDuplicate?.(card.id);
                            }
                        },
                        {
                            id: 'archive',
                            label: 'Archiver',
                            onClick: () => {
                                setShowArchiveConfirm(true);
                            },
                            danger: true,
                        }
                    ]}
                />
            )}
        </>
    );
}

const SidebarButton = forwardRef<HTMLButtonElement, { icon: React.ReactNode; label: string; onClick?: (e: React.MouseEvent) => void }>(
    function SidebarButton({ icon, label, onClick }, ref) {
        return (
            <button
                ref={ref}
                className="bg-black/60 text-white px-3 py-1.5 rounded hover:bg-black/80 text-left text-sm flex items-center gap-2 transition-colors backdrop-blur-sm whitespace-nowrap"
                onClick={onClick}
            >
                <svg className="w-4 h-4 fill-current text-gray-300" viewBox="0 0 24 24">
                    {icon}
                </svg>
                <span>{label}</span>
            </button>
        );
    }
);

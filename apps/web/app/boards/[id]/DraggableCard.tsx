'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type Card = {
    id: string;
    listId: string;
    title: string;
    position: any;
};

type DraggableCardProps = {
    card: Card;
};

export function DraggableCard({ card }: DraggableCardProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: card.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="bg-white p-2 rounded-lg shadow-sm border-b border-gray-200 hover:border-blue-500 cursor-pointer group relative"
        >
            <span className="text-sm text-[#172b4d]">{card.title}</span>
            <button
                className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded text-gray-400"
                onClick={(e) => {
                    e.stopPropagation();
                    // Edit functionality can be added later
                }}
            >
                ✎
            </button>
        </div>
    );
}

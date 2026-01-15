'use client';

import { DragOverlay as DndKitDragOverlay, defaultDropAnimationSideEffects, DropAnimation } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';

type Card = {
  id: string;
  listId: string;
  title: string;
  position: string;
  labels?: { id: string; name: string; color: string }[];
  members?: { id: string; name: string | null; email: string }[];
  dueDate?: string | null;
  isDone?: boolean;
  coverColor?: string | null;
  coverUrl?: string;
  coverSize?: string;
};

type List = {
  id: string;
  title: string;
  position: number;
};

interface CardOverlayProps {
  card: Card;
}

interface ListOverlayProps {
  list: List;
  cardCount: number;
}

interface DragOverlayComponentProps {
  activeType: 'card' | 'list' | null;
  activeItem: Card | List | null;
  cardCount?: number;
}

const dropAnimation: DropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: '0.5',
      },
    },
  }),
};

// Card preview during drag
function CardOverlay({ card }: CardOverlayProps) {
  return (
    <div 
      className="bg-white rounded-lg shadow-xl p-3 min-w-[250px] max-w-[272px] cursor-grabbing border-2 border-blue-500 rotate-3 scale-105"
      style={{ 
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Cover color */}
      {card.coverColor && (
        <div 
          className="h-8 -mx-3 -mt-3 mb-2 rounded-t-lg"
          style={{ backgroundColor: card.coverColor }}
        />
      )}

      {/* Cover image */}
      {card.coverUrl && card.coverSize === 'half' && (
        <div 
          className="h-20 -mx-3 -mt-3 mb-2 rounded-t-lg bg-cover bg-center"
          style={{ backgroundImage: `url(${card.coverUrl})` }}
        />
      )}

      {/* Labels */}
      {card.labels && card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.slice(0, 4).map((label) => (
            <span
              key={label.id}
              className="px-2 py-0.5 rounded text-xs font-medium text-white truncate max-w-[80px]"
              style={{ backgroundColor: label.color }}
              title={label.name}
            >
              {label.name}
            </span>
          ))}
          {card.labels.length > 4 && (
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-gray-300 text-gray-700">
              +{card.labels.length - 4}
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <p className="text-sm font-medium text-gray-900 line-clamp-2">
        {card.title}
      </p>

      {/* Footer with members & due date */}
      <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
        {/* Due date */}
        {card.dueDate && (
          <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded ${
            card.isDone 
              ? 'bg-green-100 text-green-700'
              : new Date(card.dueDate) < new Date()
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600'
          }`}>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {new Date(card.dueDate).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })}
          </span>
        )}

        {/* Members */}
        {card.members && card.members.length > 0 && (
          <div className="flex -space-x-2">
            {card.members.slice(0, 3).map((member) => (
              <div
                key={member.id}
                className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-medium border-2 border-white"
                title={member.name || member.email}
              >
                {(member.name || member.email)[0].toUpperCase()}
              </div>
            ))}
            {card.members.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs font-medium border-2 border-white">
                +{card.members.length - 3}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// List preview during drag
function ListOverlay({ list, cardCount }: ListOverlayProps) {
  return (
    <div 
      className="bg-[#f1f2f4] rounded-xl p-3 min-w-[272px] max-w-[272px] shadow-xl cursor-grabbing border-2 border-blue-500 rotate-2 scale-105"
      style={{
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
      }}
    >
      {/* Header */}
      <div className="px-2 py-2 mb-1">
        <h3 className="font-semibold text-sm text-[#172b4d]">{list.title}</h3>
      </div>

      {/* Placeholder content */}
      <div className="space-y-2 px-1">
        {Array.from({ length: Math.min(cardCount, 3) }).map((_, i) => (
          <div 
            key={i}
            className="bg-white rounded-lg p-3 shadow-sm animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
        {cardCount > 3 && (
          <p className="text-xs text-gray-500 text-center py-1">
            +{cardCount - 3} autres cartes
          </p>
        )}
        {cardCount === 0 && (
          <p className="text-xs text-gray-400 text-center py-2">
            Liste vide
          </p>
        )}
      </div>
    </div>
  );
}

export function DragOverlayComponent({ 
  activeType, 
  activeItem, 
  cardCount = 0 
}: DragOverlayComponentProps) {
  if (!activeType || !activeItem) return null;

  return (
    <DndKitDragOverlay 
      dropAnimation={dropAnimation}
      modifiers={[restrictToWindowEdges]}
    >
      {activeType === 'card' && (
        <CardOverlay card={activeItem as Card} />
      )}
      {activeType === 'list' && (
        <ListOverlay list={activeItem as List} cardCount={cardCount} />
      )}
    </DndKitDragOverlay>
  );
}

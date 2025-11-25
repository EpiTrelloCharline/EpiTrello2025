'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useDroppable
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api, getCardsByList, createCard, moveCard } from '@/lib/api';
import { DraggableCard } from './DraggableCard';

type List = { id: string; title: string; position: number };
type Card = { id: string; listId: string; title: string; position: string };

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const [lists, setLists] = useState<List[]>([]);
  const [cardsByList, setCardsByList] = useState<Record<string, Card[]>>({});
  const [title, setTitle] = useState('');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [previousCardsByList, setPreviousCardsByList] = useState<Record<string, Card[]>>({});
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  useEffect(() => {
    if (!token || !params?.id) return;

    api(`/lists?boardId=${params.id}`).then(r => r.json()).then(setLists);
  }, [token, params?.id]);

  useEffect(() => {
    async function loadCards() {
      const results = await Promise.all(
        lists.map(async (list) => {
          const cards = await getCardsByList(list.id);
          return [list.id, cards] as const;
        })
      );

      const map: Record<string, Card[]> = {};
      for (const [listId, cards] of results) {
        map[listId] = cards;
      }
      setCardsByList(map);
    }

    if (lists.length > 0) {
      loadCards();
    }
  }, [lists]);

  const ids = useMemo(() => lists.map(l => l.id), [lists]);

  async function createList() {
    if (!title.trim()) return;

    const after = lists.length ? lists[lists.length - 1].id : undefined;
    const r = await api('/lists', { method: 'POST', body: JSON.stringify({ boardId: params.id, title, after }) });
    const l = await r.json();
    setLists(prev => [...prev, l]);
    setTitle('');
  }

  // Helper: Find card location in state
  function findCardLocation(
    cardId: string,
    state: Record<string, Card[]>
  ): { listId: string; index: number } | null {
    for (const [listId, cards] of Object.entries(state)) {
      const index = cards.findIndex((c) => c.id === cardId);
      if (index !== -1) {
        return { listId, index };
      }
    }
    return null;
  }

  // Helper: Compute new position based on surrounding cards
  function computeNewPosition(cards: Card[], index: number): number {
    if (cards.length === 0) return 1;
    if (index === 0) {
      // Before first card
      const firstPos = parseFloat(cards[0].position);
      return firstPos - 1;
    }
    if (index >= cards.length) {
      // After last card
      const lastPos = parseFloat(cards[cards.length - 1].position);
      return lastPos + 1;
    }
    // Between two cards
    const prevPos = parseFloat(cards[index - 1].position);
    const nextPos = parseFloat(cards[index].position);
    return (prevPos + nextPos) / 2;
  }

  // Unified drag handler for both lists and cards
  function handleDragStart(event: DragStartEvent) {
    const draggedId = event.active.id as string;

    // Check if it's a card
    const cardLocation = findCardLocation(draggedId, cardsByList);
    if (cardLocation) {
      setActiveCardId(draggedId);
      setPreviousCardsByList(JSON.parse(JSON.stringify(cardsByList)));
    }
    // If it's a list, we don't need to do anything special
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const draggedId = active.id as string;
    const overId = over.id as string;

    // Check if we're dragging a card
    const cardLocation = findCardLocation(draggedId, cardsByList);

    if (cardLocation) {
      // CARD DRAGGING
      setActiveCardId(null);

      const { listId: sourceListId, index: sourceIndex } = cardLocation;
      let targetListId: string;
      let targetIndex: number;

      // Check if dropping over another card
      const targetCardLocation = findCardLocation(overId, cardsByList);

      if (targetCardLocation) {
        targetListId = targetCardLocation.listId;
        targetIndex = targetCardLocation.index;
      } else if (overId.startsWith('list-')) {
        targetListId = overId.replace('list-', '');
        const targetCards = cardsByList[targetListId] || [];
        targetIndex = targetCards.length;
      } else {
        return;
      }

      if (sourceListId === targetListId && sourceIndex === targetIndex) return;

      // Optimistic update
      const newState = { ...cardsByList };
      const sourceCards = [...(newState[sourceListId] || [])];
      const [movedCard] = sourceCards.splice(sourceIndex, 1);
      movedCard.listId = targetListId;

      if (sourceListId === targetListId) {
        const adjustedIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
        sourceCards.splice(adjustedIndex, 0, movedCard);
        newState[sourceListId] = sourceCards;
      } else {
        newState[sourceListId] = sourceCards;
        const targetCards = [...(newState[targetListId] || [])];
        targetCards.splice(targetIndex, 0, movedCard);
        newState[targetListId] = targetCards;
      }

      setCardsByList(newState);

      const finalCards = newState[targetListId];
      const finalIndex = finalCards.findIndex((c) => c.id === draggedId);
      const newPosition = computeNewPosition(finalCards, finalIndex);

      try {
        await moveCard(draggedId, targetListId, newPosition);
      } catch (error) {
        console.error('Failed to move card:', error);
        setCardsByList(previousCardsByList);
        alert('Failed to move card. Changes have been reverted.');
      }
    } else {
      // LIST DRAGGING
      if (active.id === over.id) return;

      const oldIndex = lists.findIndex(l => l.id === active.id);
      if (oldIndex === -1) return;

      const newIndex = lists.findIndex(l => l.id === over.id);
      if (newIndex === -1) return;

      const next = arrayMove(lists, oldIndex, newIndex);
      const updated = next.map((l, i) => ({ ...l, position: i + 1 }));
      setLists(updated);

      await api('/lists/move', {
        method: 'POST', body: JSON.stringify({
          listId: active.id, boardId: params.id, newPosition: updated.find(l => l.id === active.id)!.position
        })
      });
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0079bf]">
      {/* Header du board */}
      <div className="h-12 bg-black/20 backdrop-blur-sm flex items-center px-4 text-white font-bold">
        Trello Clone
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="h-full flex items-start gap-4">
            <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
              {lists.map(l => (
                <Column key={l.id} id={l.id} title={l.title} cards={cardsByList[l.id] ?? []} setCardsByList={setCardsByList} />
              ))}
            </SortableContext>

            {/* Formulaire création liste */}
            <div className="min-w-[272px] bg-white/25 rounded-xl p-3 hover:bg-white/20 transition-colors">
              {title ? (
                <div className="bg-[#f1f2f4] p-2 rounded-lg">
                  <input
                    autoFocus
                    className="w-full px-2 py-1 text-sm border-2 border-blue-600 rounded mb-2 focus:outline-none"
                    placeholder="Enter list title..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') createList();
                      if (e.key === 'Escape') setTitle('');
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700" onClick={createList}>Add list</button>
                    <button className="text-gray-600 hover:text-gray-800" onClick={() => setTitle('')}>✕</button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full text-left text-white font-medium flex items-center gap-2 px-2 py-1"
                  onClick={() => setTitle(' ')} // Hack to show input
                >
                  <span>+</span> Add another list
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </div>
    </div>
  );
}

// ——— Composant colonne sortable ———
function Column({ id, title, cards, setCardsByList }: { id: string; title: string; cards: Card[]; setCardsByList: React.Dispatch<React.SetStateAction<Record<string, Card[]>>> }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: `list-${id}` });
  const style = { transform: CSS.Translate.toString(transform), transition };
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');

  async function handleAddCard() {
    const title = newCardTitle.trim();
    if (!title) return;

    // carte optimiste
    const tempId = `temp-${Date.now()}`;
    const optimisticCard: Card = {
      id: tempId,
      listId: id,
      title,
      position: '0', // default
    };

    setCardsByList((prev) => {
      const currentCards = Array.isArray(prev[id]) ? prev[id] : [];
      return {
        ...prev,
        [id]: [...currentCards, optimisticCard],
      };
    });

    setNewCardTitle('');
    setIsAdding(false);

    try {
      const created = await createCard(id, title);

      // Remplacer la temp par la vraie carte
      setCardsByList((prev) => {
        const currentCards = Array.isArray(prev[id]) ? prev[id] : [];
        return {
          ...prev,
          [id]: currentCards.map((c) =>
            c.id === tempId ? created : c
          ),
        };
      });
    } catch (e) {
      // rollback en cas d'erreur
      setCardsByList((prev) => {
        const currentCards = Array.isArray(prev[id]) ? prev[id] : [];
        return {
          ...prev,
          [id]: currentCards.filter((c) => c.id !== tempId),
        };
      });
      alert('Failed to create card');
    }
  }

  return (
    <div ref={setNodeRef} style={style}
      className="min-w-[272px] max-w-[272px] bg-[#f1f2f4] rounded-xl p-2 shadow-sm flex flex-col max-h-full">
      <div {...attributes} {...listeners} className="font-semibold text-sm text-[#172b4d] px-2 py-2 mb-1 flex justify-between items-center cursor-grab active:cursor-grabbing">
        {title}
        <button className="hover:bg-gray-200 p-1 rounded text-gray-500" onClick={(e) => e.stopPropagation()}>•••</button>
      </div>

      <div ref={setDroppableRef} className="space-y-2 overflow-y-auto flex-1 min-h-[100px] px-1 custom-scrollbar">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {Array.isArray(cards) && cards.map((card) => (
            <DraggableCard key={card.id} card={card} />
          ))}
        </SortableContext>
      </div>

      <div className="mt-2 px-1">
        {isAdding ? (
          <div className="add-card-inline">
            <textarea
              autoFocus
              className="w-full bg-white border-none shadow-sm rounded-lg p-2 text-sm mb-2 resize-none focus:ring-2 focus:ring-blue-600"
              placeholder="Enter a title for this card..."
              rows={3}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddCard();
                }
                if (e.key === 'Escape') setIsAdding(false);
              }}
            />
            <div className="flex items-center gap-2">
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700" onClick={handleAddCard}>Add card</button>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsAdding(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button
            className="w-full text-left text-[#5e6c84] hover:bg-[#091e4214] hover:text-[#172b4d] p-2 rounded text-sm flex items-center gap-2 transition-colors"
            onClick={() => setIsAdding(true)}
          >
            <span>+</span> Add a card
          </button>
        )}
      </div>
    </div>
  );
}


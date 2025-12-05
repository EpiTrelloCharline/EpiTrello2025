'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api, getCardsByList, createCard, moveCard, updateCard, getLabelsByBoard } from '@/lib/api';
import { DraggableCard } from './DraggableCard';
import { CardDetailModal } from './CardDetailModal';
import { BoardMembers } from './BoardMembers';

type List = { id: string; title: string; position: number };
type Label = { id: string; name: string; color: string };
type Member = { id: string; userId: string; role: string; user: { id: string; name: string | null; email: string } };
type Card = {
  id: string;
  listId: string;
  title: string;
  position: string;
  labels?: Label[];
  members?: any[]; // User objects
};
type User = { id: string; name: string | null; email: string };

type Board = {
  id: string;
  title: string;
  workspaceId: string;
  labels: Label[];
  members: Member[];
};

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const [lists, setLists] = useState<List[]>([]);
  const [cardsByList, setCardsByList] = useState<Record<string, Card[]>>({});
  const [title, setTitle] = useState('');
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const [previousCardsByList, setPreviousCardsByList] = useState<Record<string, Card[]>>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [labels, setLabels] = useState<Label[]>([]);
  const [labelsRefreshTrigger, setLabelsRefreshTrigger] = useState(0);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [board, setBoard] = useState<Board | null>(null);

  const isFiltering = searchTerm.trim() !== "";
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const fetchBoardData = () => {
    if (!token || !params?.id) return;

    // Fetch Board Details (for labels/members)
    api(`/boards/${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch board');
        return r.json();
      })
      .then(data => setBoard(data))
      .catch(console.error);

    api(`/lists?boardId=${params.id}`)
      .then(r => {
        if (!r.ok) throw new Error('Failed to fetch lists');
        return r.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setLists(data);
        } else {
          setLists([]);
        }
      })
      .catch(err => {
        console.error(err);
        setLists([]);
      });

    // Load board labels
    loadLabels();
  };

  useEffect(() => {
    fetchBoardData();
  }, [token, params?.id]);

  const loadLabels = async () => {
    if (!params?.id) return;
    try {
      const boardLabels = await getLabelsByBoard(params.id);
      setLabels(boardLabels);
    } catch (error) {
      console.error('Failed to load labels:', error);
    }
  };

  useEffect(() => {
    async function loadCards() {
      const results = await Promise.all(
        lists.map(async (list) => {
          let cards: Card[] = [];
          try {
            const result = await getCardsByList(list.id);
            if (Array.isArray(result)) {
              cards = result;
            }
          } catch (e) {
            console.error(`Failed to load cards for list ${list.id}`, e);
          }
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

  function cardMatchesSearch(card: Card) {
    if (searchTerm.trim() !== "") {
      const text = searchTerm.trim().toLowerCase();
      if (!card.title.toLowerCase().includes(text)) return false;
    }
    return true;
  }

  const filteredCardsByList = useMemo(() => {
    return Object.fromEntries(
      Object.entries(cardsByList).map(([listId, cards]) => [
        listId,
        cards.filter(card => cardMatchesSearch(card)),
      ])
    );
  }, [cardsByList, searchTerm]);

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
    if (isFiltering) return; // Disable drag when filtering

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
        alert('Échec du déplacement de la carte. Les modifications ont été annulées.');
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

  // Handle card deletion
  async function handleDeleteCard(cardId: string) {
    const cardLocation = findCardLocation(cardId, cardsByList);
    if (!cardLocation) return;

    const { listId } = cardLocation;

    // Optimistic update
    setPreviousCardsByList(JSON.parse(JSON.stringify(cardsByList)));
    setCardsByList(prev => ({
      ...prev,
      [listId]: prev[listId].filter(c => c.id !== cardId)
    }));

    try {
      await api(`/cards/${cardId}`, { method: 'DELETE' });
    } catch (error) {
      console.error('Failed to delete card:', error);
      setCardsByList(previousCardsByList);
      alert('Échec de la suppression de la carte. Les modifications ont été annulées.');
    }
  }

  // Handle card update
  async function handleUpdateCard(cardId: string, data: { title?: string }) {
    const cardLocation = findCardLocation(cardId, cardsByList);
    if (!cardLocation) return;

    const { listId } = cardLocation;

    // Optimistic update
    setPreviousCardsByList(JSON.parse(JSON.stringify(cardsByList)));
    setCardsByList(prev => ({
      ...prev,
      [listId]: prev[listId].map(c => c.id === cardId ? { ...c, ...data } : c)
    }));

    try {
      await api(`/cards/${cardId}`, {
        method: 'PATCH',
        body: JSON.stringify(data)
      });
    } catch (error) {
      console.error('Failed to update card:', error);
      setCardsByList(previousCardsByList);
      alert('Échec de la mise à jour de la carte. Les modifications ont été annulées.');
    }
  }

  async function handleSaveCardDetails(data: { title: string; description: string }) {
    if (!selectedCard) return;

    // Optimistic update
    setPreviousCardsByList(JSON.parse(JSON.stringify(cardsByList)));
    setCardsByList(prev => ({
      ...prev,
      [selectedCard.listId]: prev[selectedCard.listId].map(c =>
        c.id === selectedCard.id ? { ...c, ...data } : c
      )
    }));

    try {
      await updateCard(selectedCard.id, data);
      setSelectedCard(null);
    } catch (error) {
      console.error('Failed to update card details:', error);
      setCardsByList(previousCardsByList);
      alert('Échec de la mise à jour des détails de la carte. Les modifications ont été annulées.');
    }
  }

  return (
    <div className="h-screen flex flex-col bg-[#0079bf]">
      {/* Header du board */}
      <div className="h-auto min-h-12 bg-black/20 backdrop-blur-sm flex flex-col md:flex-row items-center px-4 py-2 text-white gap-4">
        <div className="font-bold text-lg">Epi Trello</div>

        {/* Board Members & Invite */}
        {board && (
          <BoardMembers
            board={board}
            members={board.members}
            onMemberAdded={fetchBoardData}
          />
        )}

        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Rechercher une carte..."
            className="bg-white/20 text-white placeholder-white/70 px-3 py-1.5 rounded text-sm border border-transparent focus:border-blue-300 focus:outline-none focus:bg-white/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Clear Search */}
          {searchTerm.trim() !== "" && (
            <button
              onClick={() => setSearchTerm("")}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white transition-colors"
            >
              ✕ Effacer
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="h-full flex items-start gap-4">
            <SortableContext items={ids} strategy={horizontalListSortingStrategy}>
              {lists.map(l => (
                <Column
                  key={l.id}
                  id={l.id}
                  title={l.title}
                  cards={filteredCardsByList[l.id] ?? []}
                  setCardsByList={setCardsByList}
                  onDeleteCard={handleDeleteCard}
                  onUpdateCard={handleUpdateCard}
                  onCardClick={setSelectedCard}
                  labelsRefreshTrigger={labelsRefreshTrigger}
                  isDragDisabled={isFiltering}
                />
              ))}
            </SortableContext>

            {/* Formulaire création liste */}
            <div className="min-w-[272px] bg-white/25 rounded-xl p-3 hover:bg-white/20 transition-colors">
              {title ? (
                <div className="bg-[#f1f2f4] p-2 rounded-lg">
                  <input
                    autoFocus
                    className="w-full px-2 py-1 text-sm border-2 border-blue-600 rounded mb-2 focus:outline-none"
                    placeholder="Saisissez le titre de la liste..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') createList();
                      if (e.key === 'Escape') setTitle('');
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700" onClick={createList}>Ajouter une liste</button>
                    <button className="text-gray-600 hover:text-gray-800" onClick={() => setTitle('')}>✕</button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full text-left text-white font-medium flex items-center gap-2 px-2 py-1"
                  onClick={() => setTitle(' ')} // Hack to show input
                >
                  <span>+</span> Ajouter une autre liste
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </div>

      {selectedCard && params?.id && (
        <CardDetailModal
          card={selectedCard}
          boardId={params.id}
          availableLabels={(Array.isArray(labels) ? labels : []).map(l => ({ ...l, boardId: params.id }))}
          onClose={() => setSelectedCard(null)}
          onSave={handleSaveCardDetails}
          onLabelsChange={() => setLabelsRefreshTrigger(Date.now())}
        />
      )}
    </div>
  );
}

// ——— Composant colonne sortable ———
function Column({ id, title, cards, setCardsByList, onDeleteCard, onUpdateCard, onCardClick, labelsRefreshTrigger, isDragDisabled }: {
  id: string;
  title: string;
  cards: Card[];
  setCardsByList: React.Dispatch<React.SetStateAction<Record<string, Card[]>>>;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, data: { title?: string }) => void;
  onCardClick: (card: Card) => void;
  labelsRefreshTrigger?: number;
  isDragDisabled: boolean;
}) {
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
      alert('Échec de la création de la carte');
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
            <DraggableCard
              key={card.id}
              card={card}
              onDelete={onDeleteCard}
              onUpdate={onUpdateCard}
              onClick={() => onCardClick(card)}
              refreshTrigger={labelsRefreshTrigger}
              isDragDisabled={isDragDisabled}
            />
          ))}
        </SortableContext>
      </div>

      <div className="mt-2 px-1">
        {isAdding ? (
          <div className="add-card-inline">
            <textarea
              autoFocus
              className="w-full bg-white border-none shadow-sm rounded-lg p-2 text-sm mb-2 resize-none focus:ring-2 focus:ring-blue-600"
              placeholder="Saisissez un titre pour cette carte..."
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
              <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700" onClick={handleAddCard}>Ajouter une carte</button>
              <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsAdding(false)}>✕</button>
            </div>
          </div>
        ) : (
          <button
            className="w-full text-left text-[#5e6c84] hover:bg-[#091e4214] hover:text-[#172b4d] p-2 rounded text-sm flex items-center gap-2 transition-colors"
            onClick={() => setIsAdding(true)}
          >
            <span>+</span> Ajouter une carte
          </button>
        )}
      </div>
    </div>
  );
}


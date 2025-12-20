'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  DragOverEvent,
  useDroppable,
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api, getCardsByList, createCard, moveCard, updateCard, updateList, deleteList } from '@/lib/api';
import { DraggableCard } from './DraggableCard';
import { CardDetailModal } from './CardDetailModal';
import { BoardMembers } from './BoardMembers';
import { ActivitySidebar } from './ActivitySidebar';
import { ListSkeleton } from '@/app/components/ListSkeleton';

type List = { id: string; title: string; position: number };
type Label = { id: string; name: string; color: string };
type Member = { id: string; userId: string; role: string; user: { id: string; name: string | null; email: string } };
type User = { id: string; name: string | null; email: string };
type Card = {
  id: string;
  listId: string;
  title: string;
  position: string;
  labels?: Label[];
  members?: User[]; // Card members are User objects from the API
  dueDate?: string | null;
  isDone?: boolean;
};

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
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [board, setBoard] = useState<Board | null>(null);

  // Activity Sidebar State
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);

  const isFiltering = searchTerm.trim() !== "" || selectedLabelIds.length > 0 || selectedMemberIds.length > 0;
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Debug log
  useEffect(() => {
    console.log('BoardPage mounted, params:', params, 'params.id:', params?.id);
  }, [params]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchBoardData = useCallback(() => {
    if (!token || !params?.id) return;

    setIsLoading(true);

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
      })
      .finally(() => {
        // We might want to keep loading true until cards are loaded too, 
        // but for now let's just show lists skeleton until lists are fetched
      });
  }, [token, params?.id, setBoard, setLists]);

  useEffect(() => {
    fetchBoardData();
  }, [fetchBoardData]);

  useEffect(() => {
    async function loadCards() {
      if (lists.length === 0) {
        setIsLoading(false);
        return;
      }

      const results = await Promise.all(
        lists.map(async (list) => {
          let cards: Card[] = [];
          try {
            const result = await getCardsByList(list.id);
            if (Array.isArray(result)) {
              // Transform the label structure: API returns { labels: [{ label: {...} }] }
              // but we need { labels: [{...}] }
              cards = result.map(card => ({
                ...card,
                labels: card.labels?.map((cl: any) => cl.label) || []
              }));
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
      setIsLoading(false);
    }

    loadCards();
  }, [lists]);

  const ids = useMemo(() => lists.map(l => l.id), [lists]);

  async function createList() {
    if (!title.trim()) return;

    console.log('createList called, params:', params, 'boardId:', params?.id);

    if (!params?.id) {
      console.error('Board ID is undefined!');
      alert('Erreur: ID du board non trouvé');
      return;
    }

    const after = lists.length ? lists[lists.length - 1].id : undefined;
    const r = await api('/lists', { method: 'POST', body: JSON.stringify({ boardId: params.id, title, after }) });
    const l = await r.json();
    setLists(prev => [...prev, l]);
    setTitle('');
  }

  const cardMatchesFilters = useCallback((card: Card) => {
    if (searchTerm.trim() !== "") {
      const text = searchTerm.trim().toLowerCase();
      if (!card.title.toLowerCase().includes(text)) return false;
    }

    if (selectedLabelIds.length > 0) {
      const cardLabelIds = card.labels?.map(l => l.id) ?? [];
      const hasLabel = selectedLabelIds.some(id => cardLabelIds.includes(id));
      if (!hasLabel) return false;
    }

    if (selectedMemberIds.length > 0) {
      // card.members are Users, so we check their IDs
      const cardMemberIds = card.members?.map(m => m.id) ?? [];
      const hasMember = selectedMemberIds.some(id => cardMemberIds.includes(id));
      if (!hasMember) return false;
    }

    return true;
  }, [searchTerm, selectedLabelIds, selectedMemberIds]);

  const filteredCardsByList = useMemo(() => {
    return Object.fromEntries(
      Object.entries(cardsByList).map(([listId, cards]) => [
        listId,
        cards.filter(card => cardMatchesFilters(card)),
      ])
    );
  }, [cardsByList, cardMatchesFilters]);

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
    setCardsByList(prev => {
      const listCards = prev[selectedCard.listId] || [];
      return {
        ...prev,
        [selectedCard.listId]: listCards.map(c =>
          c.id === selectedCard.id ? { ...c, ...data } : c
        )
      };
    });

    try {
      await updateCard(selectedCard.id, data);
      setSelectedCard(null);
    } catch (error) {
      console.error('Failed to update card details:', error);
      setCardsByList(previousCardsByList);
      alert('Échec de la mise à jour des détails de la carte. Les modifications ont été annulées.');
    }
  }

  async function handleUpdateList(listId: string, newTitle: string) {
    if (!newTitle.trim()) return;

    // Optimistic update
    const previousLists = [...lists];
    setLists(prev => prev.map(l => l.id === listId ? { ...l, title: newTitle } : l));

    try {
      await updateList(listId, newTitle);
    } catch (error) {
      console.error('Failed to update list:', error);
      setLists(previousLists);
      alert('Échec de la mise à jour de la liste. Les modifications ont été annulées.');
    }
  }

  async function handleDeleteList(listId: string) {
    // Optimistic update
    const previousLists = [...lists];
    const previousCards = { ...cardsByList };

    setLists(prev => prev.filter(l => l.id !== listId));
    setCardsByList(prev => {
      const newState = { ...prev };
      delete newState[listId];
      return newState;
    });

    try {
      await deleteList(listId);
    } catch (error) {
      console.error('Failed to delete list:', error);
      setLists(previousLists);
      setCardsByList(previousCards);
      alert('Échec de la suppression de la liste. Les modifications ont été annulées.');
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

        {/* Activity Button */}
        <button
          onClick={() => setIsActivitySidebarOpen(true)}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm transition-colors text-white focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Voir l'historique des activités"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="hidden md:inline">Historique</span>
        </button>

        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Rechercher une carte..."
            className="bg-white/20 text-white placeholder-white/70 px-3 py-1.5 rounded text-sm border border-transparent focus:border-blue-300 focus:outline-none focus:bg-white/30 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />



          {/* Member Filter */}
          {board?.members && board.members.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium opacity-80">Membres:</span>
              <div className="flex -space-x-2 overflow-hidden p-1">
                {board.members.map(member => {
                  const isSelected = selectedMemberIds.includes(member.userId);
                  return (
                    <button
                      key={member.id}
                      onClick={() => {
                        setSelectedMemberIds(prev =>
                          isSelected ? prev.filter(id => id !== member.userId) : [...prev, member.userId]
                        );
                      }}
                      className={`relative w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-300 ${isSelected ? 'border-blue-400 z-10 scale-110' : 'border-transparent hover:z-10 hover:scale-105'
                        }`}
                      style={{ backgroundColor: '#dfe1e6', color: '#172b4d' }}
                      title={member.user.name || member.user.email}
                    >
                      {member.user.name ? member.user.name[0].toUpperCase() : member.user.email[0].toUpperCase()}
                      {isSelected && (
                        <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full w-3 h-3 border border-white"></div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Clear Filters */}
          {isFiltering && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLabelIds([]);
                setSelectedMemberIds([]);
              }}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded text-white transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              Effacer filtres
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
            {isLoading ? (
              <>
                <ListSkeleton />
                <ListSkeleton />
                <ListSkeleton />
              </>
            ) : (
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
                    onUpdateList={handleUpdateList}
                    onDeleteList={handleDeleteList}
                    isDragDisabled={isFiltering}
                    boardId={params.id}
                  />
                ))}
              </SortableContext>
            )}

            {/* Formulaire création liste */}
            <div className="min-w-[272px] bg-white/25 rounded-xl p-3 hover:bg-white/20 transition-colors">
              {title ? (
                <div className="bg-[#f1f2f4] p-2 rounded-lg">
                  <input
                    autoFocus
                    className="w-full px-2 py-1 text-sm text-gray-900 bg-white border-2 border-blue-600 rounded mb-2 focus:outline-none"
                    placeholder="Saisissez le titre de la liste..."
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') createList();
                      if (e.key === 'Escape') setTitle('');
                    }}
                  />
                  <div className="flex items-center gap-2">
                    <button className="bg-blue-600 text-white px-3 py-1.5 rounded text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600" onClick={createList}>Ajouter une liste</button>
                    <button className="text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded" onClick={() => setTitle('')}>✕</button>
                  </div>
                </div>
              ) : (
                <button
                  className="w-full text-left text-white font-medium flex items-center gap-2 px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
                  onClick={() => setTitle(' ')} // Hack to show input
                >
                  <span>+</span> Ajouter une autre liste
                </button>
              )}
            </div>
          </div>
        </DndContext>
      </div>

      {selectedCard && (
        <CardDetailModal
          card={selectedCard}
          boardId={params.id}
          onClose={() => setSelectedCard(null)}
          onSave={handleSaveCardDetails}
          onLabelsUpdated={() => {
            // Refetch cards to get updated labels
            const listId = selectedCard.listId;
            getCardsByList(listId).then(result => {
              if (Array.isArray(result)) {
                const transformedCards = result.map(card => ({
                  ...card,
                  labels: card.labels?.map((cl: any) => cl.label) || []
                }));
                setCardsByList(prev => ({ ...prev, [listId]: transformedCards }));
              }
            });
          }}
        />
      )}

      {/* Activity Sidebar */}
      {params?.id && (
        <ActivitySidebar
          boardId={params.id}
          isOpen={isActivitySidebarOpen}
          onClose={() => setIsActivitySidebarOpen(false)}
        />
      )}
    </div>
  );
}

// ——— Composant colonne sortable ———
function Column({ id, title, cards, setCardsByList, onDeleteCard, onUpdateCard, onCardClick, onUpdateList, onDeleteList, isDragDisabled, boardId }: {
  id: string;
  title: string;
  cards: Card[];
  setCardsByList: React.Dispatch<React.SetStateAction<Record<string, Card[]>>>;
  onDeleteCard: (cardId: string) => void;
  onUpdateCard: (cardId: string, data: { title?: string }) => void;
  onCardClick: (card: Card) => void;
  onUpdateList: (listId: string, newTitle: string) => void;
  onDeleteList: (listId: string) => void;
  isDragDisabled: boolean;
  boardId: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const { setNodeRef: setDroppableRef } = useDroppable({ id: `list-${id}` });
  const style = { transform: CSS.Translate.toString(transform), transition };
  const [isAdding, setIsAdding] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  function handleSaveTitle() {
    const trimmed = editedTitle.trim();
    if (trimmed && trimmed !== title) {
      onUpdateList(id, trimmed);
    }
    setIsEditingTitle(false);
    setEditedTitle(title);
  }

  function handleCancelEdit() {
    setIsEditingTitle(false);
    setEditedTitle(title);
  }

  function handleConfirmDelete() {
    onDeleteList(id);
    setShowDeleteConfirm(false);
  }

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
      console.log('Created card from API:', created);

      // Remplacer la temp par la vraie carte, en transformant les labels
      const transformedCard = {
        ...created,
        title: created.title || title,  // Ensure title is present
        listId: created.listId || id,    // Ensure listId is present
        labels: created.labels?.map((cl: any) => cl.label || cl) || []
      };
      console.log('Transformed card:', transformedCard);

      setCardsByList((prev) => {
        const currentCards = Array.isArray(prev[id]) ? prev[id] : [];
        return {
          ...prev,
          [id]: currentCards.map((c) =>
            c.id === tempId ? transformedCard : c
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


      {/* Header with inline editing */}
      <div className="px-2 py-2 mb-1 flex justify-between items-center gap-2">
        {/* Title - editable and draggable */}
        {isEditingTitle ? (
          <input
            autoFocus
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSaveTitle();
              if (e.key === 'Escape') handleCancelEdit();
            }}
            onBlur={handleSaveTitle}
            className="flex-1 font-semibold text-sm text-[#172b4d] px-2 py-1 border-2 border-blue-600 rounded focus:outline-none bg-white"
          />
        ) : (
          <div className="flex-1 px-2 py-1">
            <div
              {...attributes}
              {...listeners}
              className="font-semibold text-sm text-[#172b4d] cursor-grab active:cursor-grabbing"
            >
              {title}
            </div>
          </div>
        )}

        {/* Menu button */}
        <div className="relative">
          <button
            className="hover:bg-gray-200 p-1 rounded text-gray-500"
            onClick={(e) => {
              e.stopPropagation();
              setShowMenu(!showMenu);
            }}
          >
            •••
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white shadow-lg rounded-lg py-2 z-50 min-w-[200px] border border-gray-200">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                onClick={() => {
                  setShowMenu(false);
                  setIsEditingTitle(true);
                }}
              >
                Renommer la liste
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-red-600"
                onClick={() => {
                  setShowMenu(false);
                  setShowDeleteConfirm(true);
                }}
              >
                Supprimer la liste
              </button>
            </div>
          )}
        </div>
      </div>


      {/* Delete confirmation */}
      {showDeleteConfirm && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-2 mx-1">
          <p className="text-sm text-red-800 mb-2">Êtes-vous sûr de vouloir supprimer cette liste ?</p>
          <div className="flex gap-2">
            <button
              className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
              onClick={handleConfirmDelete}
            >
              Confirmer
            </button>
            <button
              className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-300"
              onClick={() => setShowDeleteConfirm(false)}
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div ref={setDroppableRef} className="space-y-2 overflow-y-auto flex-1 min-h-[100px] px-1 custom-scrollbar">
        <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
          {Array.isArray(cards) && cards.map((card) => (
            <DraggableCard
              key={card.id}
              card={card}
              boardId={boardId}
              onDelete={onDeleteCard}
              onUpdate={onUpdateCard}
              onClick={() => onCardClick(card)}
              isDragDisabled={isDragDisabled}
              onLabelsUpdated={() => {
                // Refetch cards to get updated labels
                getCardsByList(id).then(result => {
                  if (Array.isArray(result)) {
                    setCardsByList(prev => ({ ...prev, [id]: result }));
                  }
                });
              }}
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


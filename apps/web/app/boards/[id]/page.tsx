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
  KeyboardSensor,
  closestCorners,
  MeasuringStrategy
} from '@dnd-kit/core';
import { SortableContext, horizontalListSortingStrategy, verticalListSortingStrategy, arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api, getCardsByList, createCard, moveCard, updateCard, updateList, deleteList, batchMoveCards, batchMoveLists, updateBoard, CardPositionUpdate, ListPositionUpdate } from '@/lib/api';
import { DraggableCard } from './DraggableCard';
import { CardDetailModal } from './CardDetailModal';
import { BoardMembers } from './BoardMembers';
import { ActivitySidebar } from './ActivitySidebar';
import { ListSkeleton } from '@/app/components/ListSkeleton';
import { useWebSocket } from '@/app/context/WebSocketContext';
import BoardSettingsMenu, { getTextColor } from './BoardSettingsMenu';
import { SearchModal } from '@/app/components/SearchModal';
import { NotificationBell } from '@/app/components/NotificationBell';
import { FilterPopover, DateFilterType } from './FilterPopover';
import { useDragAndDrop } from '@/app/hooks/useDragAndDrop';
import { DragOverlayComponent } from './DragOverlayComponent';

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
  coverColor?: string | null;
  coverUrl?: string;
  coverSize?: string;
  priority?: string | null;
  size?: string | null;
};

type Board = {
  id: string;
  title: string;
  workspaceId: string;
  labels: Label[];
  members: Member[];
  backgroundColor?: string | null;
  backgroundImage?: string | null;
};

export default function BoardPage() {
  const params = useParams<{ id: string }>();
  const [lists, setLists] = useState<List[]>([]);
  const [cardsByList, setCardsByList] = useState<Record<string, Card[]>>({});
  const [title, setTitle] = useState('');
  const [previousCardsByList, setPreviousCardsByList] = useState<Record<string, Card[]>>({});
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // WebSocket hook
  const { socket, isConnected, joinBoard, leaveBoard } = useWebSocket();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>([]);
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('none');
  const [board, setBoard] = useState<Board | null>(null);

  // Activity Sidebar State
  const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  const isFiltering = searchTerm.trim() !== "" || selectedLabelIds.length > 0 || selectedMemberIds.length > 0 || dateFilter !== 'none';
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  // Debug log
  useEffect(() => {
    console.log('BoardPage mounted, params:', params, 'params.id:', params?.id);
  }, [params]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Increased for better touch support
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Advanced Drag & Drop hook
  const {
    activeId,
    activeType,
    activeItem,
    isSyncing,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    findCard,
    findListContainingCard,
  } = useDragAndDrop({
    lists,
    cardsByList,
    boardId: params?.id || '',
    setLists,
    setCardsByList,
    isFiltering,
  });

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

  // Join board via WebSocket
  useEffect(() => {
    if (params?.id && isConnected) {
      joinBoard(params.id);
      console.log('Joined board via WebSocket:', params.id);

      return () => {
        leaveBoard(params.id);
        console.log('Left board via WebSocket:', params.id);
      };
    }
  }, [params?.id, isConnected, joinBoard, leaveBoard]);

  // Listen to WebSocket events
  useEffect(() => {
    if (!socket) return;

    // Card events
    const handleCardCreated = (data: { card: Card; listId: string }) => {
      console.log('Card created event:', data);
      setCardsByList(prev => {
        const currentCards = prev[data.listId] || [];
        // Check if card already exists (avoid duplicates)
        if (currentCards.some(c => c.id === data.card.id)) {
          return prev;
        }
        return {
          ...prev,
          [data.listId]: [...currentCards, data.card],
        };
      });
    };

    const handleCardMoved = (data: { card: Card; fromListId: string; toListId: string }) => {
      console.log('Card moved event:', data);
      setCardsByList(prev => {
        const newState = { ...prev };

        // Remove from source list
        if (newState[data.fromListId]) {
          newState[data.fromListId] = newState[data.fromListId].filter(c => c.id !== data.card.id);
        }

        // Add to target list or update if already exists
        if (newState[data.toListId]) {
          const existingIndex = newState[data.toListId].findIndex(c => c.id === data.card.id);
          if (existingIndex !== -1) {
            newState[data.toListId][existingIndex] = data.card;
          } else {
            newState[data.toListId] = [...newState[data.toListId], data.card];
          }
        } else {
          newState[data.toListId] = [data.card];
        }

        return newState;
      });
    };

    const handleCardUpdated = (data: { card: Card }) => {
      console.log('Card updated event:', data);
      setCardsByList(prev => {
        const listId = data.card.listId;
        if (!prev[listId]) return prev;

        return {
          ...prev,
          [listId]: prev[listId].map(c =>
            c.id === data.card.id ? { ...c, ...data.card } : c
          ),
        };
      });

      // Update selected card if it's the one being edited
      setSelectedCard(current =>
        current?.id === data.card.id ? { ...current, ...data.card } : current
      );
    };

    const handleCardDeleted = (data: { cardId: string; listId: string }) => {
      console.log('Card deleted event:', data);
      setCardsByList(prev => ({
        ...prev,
        [data.listId]: (prev[data.listId] || []).filter(c => c.id !== data.cardId),
      }));

      // Close modal if deleted card was selected
      setSelectedCard(current =>
        current?.id === data.cardId ? null : current
      );
    };

    // List events
    const handleListCreated = (data: { list: List }) => {
      console.log('List created event:', data);
      setLists(prev => {
        // Avoid duplicates
        if (prev.some(l => l.id === data.list.id)) {
          return prev;
        }
        return [...prev, data.list];
      });
      setCardsByList(prev => ({
        ...prev,
        [data.list.id]: [],
      }));
    };

    const handleListUpdated = (data: { list: List }) => {
      console.log('List updated event:', data);
      setLists(prev =>
        prev.map(l => l.id === data.list.id ? data.list : l)
      );
    };

    const handleListDeleted = (data: { listId: string }) => {
      console.log('List deleted event:', data);
      setLists(prev => prev.filter(l => l.id !== data.listId));
      setCardsByList(prev => {
        const newState = { ...prev };
        delete newState[data.listId];
        return newState;
      });
    };

    // Handle batch updates from other clients
    const handleBoardUpdated = (data: { type: string; cards?: { cardId: string; listId: string; position: number }[]; lists?: { listId: string; position: number }[] }) => {
      console.log('Board updated event:', data);

      if (data.type === 'batch-cards-moved' && data.cards) {
        // Update card positions
        setCardsByList(prev => {
          const newState = { ...prev };

          for (const update of data.cards!) {
            // Find and update card position
            for (const listId of Object.keys(newState)) {
              const cardIndex = newState[listId].findIndex(c => c.id === update.cardId);
              if (cardIndex !== -1) {
                const card = newState[listId][cardIndex];

                // If card moved to different list
                if (card.listId !== update.listId) {
                  // Remove from old list
                  newState[listId] = newState[listId].filter(c => c.id !== update.cardId);
                  // Add to new list
                  const updatedCard = { ...card, listId: update.listId, position: String(update.position) };
                  newState[update.listId] = [...(newState[update.listId] || []), updatedCard];
                } else {
                  // Update position in same list
                  newState[listId][cardIndex] = { ...card, position: String(update.position) };
                }
                break;
              }
            }
          }

          // Sort cards by position in each list
          for (const listId of Object.keys(newState)) {
            newState[listId] = newState[listId].sort((a, b) => parseFloat(a.position) - parseFloat(b.position));
          }

          return newState;
        });
      }

      if (data.type === 'batch-lists-moved' && data.lists) {
        // Update list positions
        setLists(prev => {
          const newLists = prev.map(list => {
            const update = data.lists!.find(u => u.listId === list.id);
            return update ? { ...list, position: update.position } : list;
          });
          return newLists.sort((a, b) => a.position - b.position);
        });
      }
    };

    // Register event listeners
    socket.on('cardCreated', handleCardCreated);
    socket.on('cardMoved', handleCardMoved);
    socket.on('cardUpdated', handleCardUpdated);
    socket.on('cardDeleted', handleCardDeleted);
    socket.on('listCreated', handleListCreated);
    socket.on('listUpdated', handleListUpdated);
    socket.on('listDeleted', handleListDeleted);
    socket.on('boardUpdated', handleBoardUpdated);

    // Cleanup
    return () => {
      socket.off('cardCreated', handleCardCreated);
      socket.off('cardMoved', handleCardMoved);
      socket.off('cardUpdated', handleCardUpdated);
      socket.off('cardDeleted', handleCardDeleted);
      socket.off('listCreated', handleListCreated);
      socket.off('listUpdated', handleListUpdated);
      socket.off('listDeleted', handleListDeleted);
      socket.off('boardUpdated', handleBoardUpdated);
    };
  }, [socket]);

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

    // Only add locally if WebSocket is not connected (fallback)
    // The WebSocket 'listCreated' event will handle the update when connected
    if (!socket?.connected) {
      setLists(prev => [...prev, l]);
    }
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

    // Date filter logic
    if (dateFilter !== 'none') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const endOfWeek = new Date(today);
      endOfWeek.setDate(today.getDate() + (7 - today.getDay()));

      switch (dateFilter) {
        case 'overdue':
          if (!card.dueDate) return false;
          const dueDate = new Date(card.dueDate);
          if (dueDate >= today || card.isDone) return false;
          break;
        case 'dueToday':
          if (!card.dueDate) return false;
          const dueDateToday = new Date(card.dueDate);
          const dueDateOnlyToday = new Date(dueDateToday.getFullYear(), dueDateToday.getMonth(), dueDateToday.getDate());
          if (dueDateOnlyToday.getTime() !== today.getTime()) return false;
          break;
        case 'dueThisWeek':
          if (!card.dueDate) return false;
          const dueDateWeek = new Date(card.dueDate);
          if (dueDateWeek < today || dueDateWeek > endOfWeek) return false;
          break;
        case 'noDueDate':
          if (card.dueDate) return false;
          break;
        case 'completed':
          if (!card.isDone) return false;
          break;
      }
    }

    return true;
  }, [searchTerm, selectedLabelIds, selectedMemberIds, dateFilter]);

  const filteredCardsByList = useMemo(() => {
    return Object.fromEntries(
      Object.entries(cardsByList).map(([listId, cards]) => [
        listId,
        cards.filter(card => cardMatchesFilters(card)),
      ])
    );
  }, [cardsByList, cardMatchesFilters]);

  // Helper: Find card location in state (kept for other functions)
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

  async function handleBackgroundChange(backgroundColor: string | null, backgroundImage: string | null) {
    if (!board) return;

    try {
      const updatedBoard = await updateBoard(board.id, { backgroundColor, backgroundImage });
      setBoard(updatedBoard);
    } catch (error) {
      console.error('Failed to update board background:', error);
      alert('Échec de la mise à jour de l\'apparence du board.');
    }
  }

  async function handleTitleChange(newTitle: string) {
    if (!board || !newTitle.trim()) return;

    const previousBoard = { ...board };

    // Optimistic update
    setBoard(prev => prev ? { ...prev, title: newTitle } : prev);

    try {
      const updatedBoard = await updateBoard(board.id, { title: newTitle });
      setBoard(updatedBoard);
    } catch (error) {
      console.error('Failed to update board title:', error);
      setBoard(previousBoard);
      alert('Échec de la mise à jour du titre du board.');
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

  // Calculate text color based on background
  const textColor = board?.backgroundColor ? getTextColor(board.backgroundColor) : '#ffffff';
  const backgroundStyle = board?.backgroundColor
    ? { background: board.backgroundColor }
    : board?.backgroundImage
      ? { backgroundImage: `url(${board.backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
      : { backgroundColor: '#0079bf' };

  return (
    <div className="h-screen flex flex-col" style={backgroundStyle}>
      {/* Board Header */}
      <div className="relative z-50 h-auto min-h-12 bg-black/20 backdrop-blur-sm flex flex-col md:flex-row items-center px-4 py-2 gap-4" style={{ color: textColor }}>
        <div className="font-bold text-lg">Epi Trello</div>

        {/* Board Title */}
        {board && (
          <div className="font-semibold text-lg bg-white/10 px-3 py-1 rounded" title={board.title}>
            {board.title}
          </div>
        )}

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
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
          title="Voir l'historique des activités"
          style={{ color: textColor }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="hidden md:inline">Historique</span>
        </button>

        {/* Notifications Bell */}
        <div className="bg-white/20 rounded-full hover:bg-white/30 transition-colors">
          <NotificationBell boardId={params.id} />
        </div>

        {/* Board Settings Menu */}
        {board && (
          <BoardSettingsMenu
            boardId={board.id}
            boardTitle={board.title}
            currentBackgroundColor={board.backgroundColor}
            currentBackgroundImage={board.backgroundImage}
            onBackgroundChange={handleBackgroundChange}
            onTitleChange={handleTitleChange}
          />
        )}

        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Rechercher une carte..."
            className="bg-white/20 placeholder-white/70 px-3 py-1.5 rounded text-sm border border-transparent focus:border-blue-300 focus:outline-none focus:bg-white/30 transition-all"
            style={{ color: textColor }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          {/* Filter Popover */}
          {board && (
            <FilterPopover
              labels={board.labels || []}
              members={board.members || []}
              selectedLabelIds={selectedLabelIds}
              selectedMemberIds={selectedMemberIds}
              dateFilter={dateFilter}
              onLabelToggle={(labelId) => {
                setSelectedLabelIds(prev =>
                  prev.includes(labelId) ? prev.filter(id => id !== labelId) : [...prev, labelId]
                );
              }}
              onMemberToggle={(memberId) => {
                setSelectedMemberIds(prev =>
                  prev.includes(memberId) ? prev.filter(id => id !== memberId) : [...prev, memberId]
                );
              }}
              onDateFilterChange={setDateFilter}
              onClearAll={() => {
                setSearchTerm("");
                setSelectedLabelIds([]);
                setSelectedMemberIds([]);
                setDateFilter('none');
              }}
              textColor={textColor}
            />
          )}

          {/* Clear Filters Button */}
          {isFiltering && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedLabelIds([]);
                setSelectedMemberIds([]);
                setDateFilter('none');
              }}
              className="text-xs bg-white/20 hover:bg-white/30 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
              style={{ color: textColor }}
            >
              Effacer filtres
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-x-auto overflow-y-hidden p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
          measuring={{
            droppable: {
              strategy: MeasuringStrategy.Always,
            },
          }}
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
                    isCardDragging={activeType === 'card'}
                    activeCardId={activeId as string}
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

          {/* Drag Overlay for smooth visual feedback */}
          <DragOverlayComponent
            activeType={activeType}
            activeItem={activeItem}
            cardCount={activeType === 'list' && activeId ? (cardsByList[activeId as string] || []).length : 0}
          />
        </DndContext>

        {/* Syncing indicator */}
        {isSyncing && (
          <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-50">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Synchronisation...
          </div>
        )}
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

      {isSearchModalOpen && params?.id && (
        <SearchModal
          boardId={params.id}
          onClose={() => setIsSearchModalOpen(false)}
          onCardClick={(cardId) => {
            const cardLoc = findCardLocation(cardId, cardsByList);
            if (cardLoc) {
              const card = cardsByList[cardLoc.listId][cardLoc.index];
              setSelectedCard(card);
            } else {
              api(`/cards/${cardId}`).then(r => r.json()).then(card => {
                if (card && card.id) setSelectedCard(card);
              });
            }
          }}
        />
      )}
    </div>
  );
}

// ——— Composant colonne sortable ———
function Column({ id, title, cards, setCardsByList, onDeleteCard, onUpdateCard, onCardClick, onUpdateList, onDeleteList, isDragDisabled, boardId, isCardDragging, activeCardId }: {
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
  isCardDragging?: boolean;
  activeCardId?: string;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({ id: `list-${id}` });
  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };
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

      <div
        ref={setDroppableRef}
        className={`space-y-2 overflow-y-auto flex-1 min-h-[100px] px-1 custom-scrollbar rounded-lg transition-colors duration-200 ${isOver && isCardDragging ? 'bg-blue-100/50 ring-2 ring-blue-400 ring-inset' : ''
          }`}
      >
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
              isDragOverlay={activeCardId === card.id}
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

        {/* Empty state indicator when dragging over empty list */}
        {cards.length === 0 && isOver && isCardDragging && (
          <div className="h-16 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50/50 flex items-center justify-center">
            <span className="text-sm text-blue-500">Déposer ici</span>
          </div>
        )}
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


'use client';

import { useState, useCallback, useRef } from 'react';
import { 
  DragStartEvent, 
  DragEndEvent, 
  DragOverEvent,
  UniqueIdentifier,
  CollisionDetection,
  pointerWithin,
  rectIntersection,
  getFirstCollision
} from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { batchMoveCards, batchMoveLists, CardPositionUpdate, ListPositionUpdate } from '@/lib/api';

type Card = {
  id: string;
  listId: string;
  title: string;
  position: string;
  labels?: any[];
  members?: any[];
  dueDate?: string | null;
  isDone?: boolean;
};

type List = {
  id: string;
  title: string;
  position: number;
};

type DragType = 'card' | 'list' | null;

interface UseDragAndDropOptions {
  lists: List[];
  cardsByList: Record<string, Card[]>;
  boardId: string;
  setLists: React.Dispatch<React.SetStateAction<List[]>>;
  setCardsByList: React.Dispatch<React.SetStateAction<Record<string, Card[]>>>;
  isFiltering: boolean;
}

export function useDragAndDrop({
  lists,
  cardsByList,
  boardId,
  setLists,
  setCardsByList,
  isFiltering,
}: UseDragAndDropOptions) {
  // Active drag state
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [activeType, setActiveType] = useState<DragType>(null);
  const [overId, setOverId] = useState<UniqueIdentifier | null>(null);

  // For rollback on error
  const previousStateRef = useRef<{
    lists: List[];
    cardsByList: Record<string, Card[]>;
  } | null>(null);

  // Track if we're currently syncing with server
  const [isSyncing, setIsSyncing] = useState(false);

  // Find which list contains a card
  const findListContainingCard = useCallback(
    (cardId: string): string | null => {
      for (const [listId, cards] of Object.entries(cardsByList)) {
        if (cards.some((c) => c.id === cardId)) {
          return listId;
        }
      }
      return null;
    },
    [cardsByList]
  );

  // Find card by ID
  const findCard = useCallback(
    (cardId: string): Card | null => {
      for (const cards of Object.values(cardsByList)) {
        const card = cards.find((c) => c.id === cardId);
        if (card) return card;
      }
      return null;
    },
    [cardsByList]
  );

  // Get active card/list for overlay
  const getActiveItem = useCallback((): Card | List | null => {
    if (!activeId) return null;
    
    if (activeType === 'card') {
      return findCard(activeId as string);
    }
    
    if (activeType === 'list') {
      return lists.find((l) => l.id === activeId) || null;
    }
    
    return null;
  }, [activeId, activeType, findCard, lists]);

  // Custom collision detection for better UX
  const collisionDetection: CollisionDetection = useCallback(
    (args) => {
      // First, check if we're over a droppable container (list)
      const pointerCollisions = pointerWithin(args);
      const collisions = pointerCollisions.length > 0 
        ? pointerCollisions 
        : rectIntersection(args);

      let overId = getFirstCollision(collisions, 'id');

      if (overId != null) {
        // If we're over a list container, find the closest card within it
        if (overId.toString().startsWith('list-')) {
          const listId = overId.toString().replace('list-', '');
          const cards = cardsByList[listId] || [];
          
          // Filter draggables to only cards in this list
          const cardIds = cards.map((c) => c.id);
          const cardCollisions = collisions.filter((c) => 
            cardIds.includes(c.id as string)
          );
          
          if (cardCollisions.length > 0) {
            overId = cardCollisions[0].id;
          }
        }
      }

      return collisions;
    },
    [cardsByList]
  );

  // Handle drag start
  const handleDragStart = useCallback(
    (event: DragStartEvent) => {
      if (isFiltering) return;

      const { active } = event;
      const id = active.id as string;

      // Store previous state for rollback
      previousStateRef.current = {
        lists: [...lists],
        cardsByList: JSON.parse(JSON.stringify(cardsByList)),
      };

      // Determine if dragging a card or list
      const isCard = findListContainingCard(id) !== null;
      
      setActiveId(id);
      setActiveType(isCard ? 'card' : 'list');
    },
    [isFiltering, lists, cardsByList, findListContainingCard]
  );

  // Handle drag over (live reordering)
  const handleDragOver = useCallback(
    (event: DragOverEvent) => {
      if (isFiltering) return;

      const { active, over } = event;
      if (!over) return;

      const activeId = active.id as string;
      const overId = over.id as string;

      setOverId(overId);

      // Only handle card dragging for over events
      if (activeType !== 'card') return;

      const activeListId = findListContainingCard(activeId);
      
      // Determine target list
      let overListId: string | null = null;
      
      if (overId.startsWith('list-')) {
        overListId = overId.replace('list-', '');
      } else {
        overListId = findListContainingCard(overId);
      }

      if (!activeListId || !overListId) return;

      // If card is being moved to a different list
      if (activeListId !== overListId) {
        setCardsByList((prev) => {
          const activeCards = [...(prev[activeListId] || [])];
          const overCards = [...(prev[overListId!] || [])];

          const activeIndex = activeCards.findIndex((c) => c.id === activeId);
          if (activeIndex === -1) return prev;

          // Remove from source
          const [movedCard] = activeCards.splice(activeIndex, 1);
          movedCard.listId = overListId!;

          // Find insert position in target list
          let insertIndex = overCards.length;
          
          if (!overId.startsWith('list-')) {
            const overIndex = overCards.findIndex((c) => c.id === overId);
            if (overIndex !== -1) {
              insertIndex = overIndex;
            }
          }

          overCards.splice(insertIndex, 0, movedCard);

          return {
            ...prev,
            [activeListId]: activeCards,
            [overListId!]: overCards,
          };
        });
      } else {
        // Same list reordering
        if (activeId === overId || overId.startsWith('list-')) return;

        setCardsByList((prev) => {
          const cards = [...(prev[activeListId] || [])];
          const activeIndex = cards.findIndex((c) => c.id === activeId);
          const overIndex = cards.findIndex((c) => c.id === overId);

          if (activeIndex === -1 || overIndex === -1) return prev;
          if (activeIndex === overIndex) return prev;

          return {
            ...prev,
            [activeListId]: arrayMove(cards, activeIndex, overIndex),
          };
        });
      }
    },
    [isFiltering, activeType, findListContainingCard, setCardsByList]
  );

  // Handle drag end
  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event;

      setActiveId(null);
      setActiveType(null);
      setOverId(null);

      if (isFiltering || !over) {
        // Rollback if filtering or no target
        if (previousStateRef.current) {
          setLists(previousStateRef.current.lists);
          setCardsByList(previousStateRef.current.cardsByList);
        }
        return;
      }

      const activeId = active.id as string;
      const overId = over.id as string;

      if (activeId === overId) return;

      // Determine what type of drag ended
      const wasCardDrag = previousStateRef.current 
        ? Object.values(previousStateRef.current.cardsByList).some(
            (cards) => cards.some((c) => c.id === activeId)
          )
        : false;

      setIsSyncing(true);

      try {
        if (wasCardDrag) {
          // Build batch update for cards
          const cardsToUpdate: CardPositionUpdate[] = [];
          const affectedLists = new Set<string>();

          // Find all affected lists
          for (const [listId, cards] of Object.entries(cardsByList)) {
            const prevCards = previousStateRef.current?.cardsByList[listId] || [];
            
            // Check if this list was affected
            const hasChanges = 
              cards.length !== prevCards.length ||
              cards.some((c, i) => c.id !== prevCards[i]?.id || c.listId !== prevCards[i]?.listId);

            if (hasChanges) {
              affectedLists.add(listId);
            }
          }

          // Also check previous lists that might now be empty
          if (previousStateRef.current) {
            for (const listId of Object.keys(previousStateRef.current.cardsByList)) {
              if (!cardsByList[listId] || cardsByList[listId].length === 0) {
                const prevCards = previousStateRef.current.cardsByList[listId];
                if (prevCards && prevCards.length > 0) {
                  affectedLists.add(listId);
                }
              }
            }
          }

          // Build updates for affected lists
          const affectedListsArray = Array.from(affectedLists);
          for (const listId of affectedListsArray) {
            const cards = cardsByList[listId] || [];
            cards.forEach((card, index) => {
              cardsToUpdate.push({
                cardId: card.id,
                listId: listId,
                position: index + 1,
              });
            });
          }

          if (cardsToUpdate.length > 0) {
            await batchMoveCards(cardsToUpdate, boardId);
          }

          // Update positions in local state
          setCardsByList((prev) => {
            const newState = { ...prev };
            for (const listId of Object.keys(newState)) {
              newState[listId] = newState[listId].map((c, i) => ({
                ...c,
                position: String(i + 1),
              }));
            }
            return newState;
          });
        } else {
          // List reordering
          const oldIndex = lists.findIndex((l) => l.id === activeId);
          const newIndex = lists.findIndex((l) => l.id === overId);

          if (oldIndex === -1 || newIndex === -1 || oldIndex === newIndex) {
            return;
          }

          const reorderedLists = arrayMove(lists, oldIndex, newIndex);
          const updatedLists = reorderedLists.map((l, i) => ({
            ...l,
            position: i + 1,
          }));

          setLists(updatedLists);

          const listsToUpdate: ListPositionUpdate[] = updatedLists.map((l) => ({
            listId: l.id,
            position: l.position,
          }));

          await batchMoveLists(boardId, listsToUpdate);
        }
      } catch (error) {
        console.error('Failed to sync drag changes:', error);
        
        // Rollback on error
        if (previousStateRef.current) {
          setLists(previousStateRef.current.lists);
          setCardsByList(previousStateRef.current.cardsByList);
        }
        
        alert('Échec de la synchronisation. Les modifications ont été annulées.');
      } finally {
        setIsSyncing(false);
        previousStateRef.current = null;
      }
    },
    [isFiltering, boardId, lists, cardsByList, setLists, setCardsByList]
  );

  // Handle drag cancel
  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setActiveType(null);
    setOverId(null);

    // Rollback to previous state
    if (previousStateRef.current) {
      setLists(previousStateRef.current.lists);
      setCardsByList(previousStateRef.current.cardsByList);
      previousStateRef.current = null;
    }
  }, [setLists, setCardsByList]);

  return {
    // State
    activeId,
    activeType,
    overId,
    isSyncing,
    
    // Derived
    activeItem: getActiveItem(),
    
    // Handlers
    handleDragStart,
    handleDragOver,
    handleDragEnd,
    handleDragCancel,
    collisionDetection,
    
    // Helpers
    findCard,
    findListContainingCard,
  };
}

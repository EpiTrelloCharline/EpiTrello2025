import { SearchQueryDto } from '@epitrello/validation';

export function api(path: string, init?: RequestInit) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`http://localhost:3001${path}`, {
    ...init,
    headers: {
      ...headers,
      ...(init?.headers || {}),
    },
  });
}


export async function getCardsByList(listId: string) {
  const res = await api(`/cards?listId=${listId}`);
  return res.json();
}

export async function createCard(listId: string, title: string) {
  const res = await api('/cards', {
    method: 'POST',
    body: JSON.stringify({ listId, title }),
  });
  return res.json();
}

export async function moveCard(cardId: string, listId: string, newPosition: number) {
  const res = await api('/cards/move', {
    method: 'POST',
    body: JSON.stringify({ cardId, listId, newPosition }),
  });
  return res.json();
}

// Batch move cards - optimized for drag & drop
export type CardPositionUpdate = {
  cardId: string;
  listId: string;
  position: number;
};

export async function batchMoveCards(cards: CardPositionUpdate[], boardId?: string) {
  const res = await api('/cards/batch-move', {
    method: 'POST',
    body: JSON.stringify({ cards, boardId }),
  });
  return res.json();
}

// Batch move lists - optimized for drag & drop
export type ListPositionUpdate = {
  listId: string;
  position: number;
};

export async function batchMoveLists(boardId: string, lists: ListPositionUpdate[]) {
  const res = await api('/lists/batch-move', {
    method: 'POST',
    body: JSON.stringify({ boardId, lists }),
  });
  return res.json();
}

export async function deleteCard(cardId: string) {
  const res = await api(`/cards/${cardId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function updateCard(cardId: string, data: { title?: string; description?: string; isArchived?: boolean; listId?: string; position?: string; dueDate?: string; isDone?: boolean; priority?: string; size?: string }) {
  const res = await api(`/cards/${cardId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function updateList(listId: string, title: string) {
  const res = await api(`/lists/${listId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function deleteList(listId: string) {
  const res = await api(`/lists/${listId}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Board
export async function updateBoard(boardId: string, data: { title?: string; backgroundColor?: string | null; backgroundImage?: string | null }) {
  const res = await api(`/boards/${boardId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

// Checklists
export async function getChecklists(cardId: string) {
  const res = await api(`/cards/${cardId}/checklists`);
  return res.json();
}

export async function createChecklist(cardId: string, title: string) {
  const res = await api(`/cards/${cardId}/checklists`, {
    method: 'POST',
    body: JSON.stringify({ title }),
  });
  return res.json();
}

export async function updateChecklist(checklistId: string, data: { title?: string }) {
  const res = await api(`/checklists/${checklistId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteChecklist(checklistId: string) {
  const res = await api(`/checklists/${checklistId}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Checklist Items
export async function createChecklistItem(checklistId: string, content: string) {
  const res = await api(`/checklists/${checklistId}/items`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return res.json();
}

export async function updateChecklistItem(itemId: string, data: { content?: string; checked?: boolean }) {
  const res = await api(`/checklist-items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteChecklistItem(itemId: string) {
  const res = await api(`/checklist-items/${itemId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function searchBoard(boardId: string, query: string) {
  const queryDto: SearchQueryDto = { q: query, boardId };
  const params = new URLSearchParams(queryDto as any);
  const res = await api(`/search?${params.toString()}`);
  return res.json();
}

export async function globalSearch(query: string) {
  const queryDto: SearchQueryDto = { q: query };
  const params = new URLSearchParams(queryDto as any);
  const res = await api(`/search?${params.toString()}`);
  return res.json();
}

// Archive/Restore/Delete Permanent
export async function getArchivedLists(boardId: string) {
  const res = await api(`/lists?boardId=${boardId}&archived=true`);
  return res.json();
}

export async function getArchivedCards(boardId: string) {
  const res = await api(`/cards/archived?boardId=${boardId}`);
  return res.json();
}

export async function deleteCardPermanent(cardId: string) {
  const res = await api(`/cards/${cardId}/permanent`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function deleteListPermanent(listId: string) {
  const res = await api(`/lists/${listId}/permanent`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function restoreList(listId: string, title?: string) {
  const res = await api(`/lists/${listId}`, {
    method: 'PATCH',
    body: JSON.stringify({ title, isArchived: false }),
  });
  return res.json();
}

// Notifications
export interface Notification {
  id: string;
  type: string;
  message: string;
  userId: string;
  boardId: string;
  entityId?: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    email: string;
    name: string | null;
  };
  board?: {
    id: string;
    title: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export interface GetNotificationsParams {
  unreadOnly?: boolean;
  boardId?: string;
  limit?: number;
  offset?: number;
}

export async function getNotifications(params?: GetNotificationsParams): Promise<NotificationsResponse> {
  const queryParams = new URLSearchParams();

  if (params?.unreadOnly !== undefined) {
    queryParams.append('unreadOnly', String(params.unreadOnly));
  }
  if (params?.boardId) {
    queryParams.append('boardId', params.boardId);
  }
  if (params?.limit !== undefined) {
    queryParams.append('limit', String(params.limit));
  }
  if (params?.offset !== undefined) {
    queryParams.append('offset', String(params.offset));
  }

  const queryString = queryParams.toString();
  const res = await api(`/notifications${queryString ? `?${queryString}` : ''}`);
  return res.json();
}

export async function getUnreadNotificationsCount(boardId?: string): Promise<{ count: number }> {
  const queryParams = boardId ? `?boardId=${boardId}` : '';
  const res = await api(`/notifications/unread-count${queryParams}`);
  return res.json();
}

export async function markNotificationAsRead(notificationId: string): Promise<{ message: string }> {
  const res = await api(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
  });
  return res.json();
}

export async function markAllNotificationsAsRead(boardId?: string): Promise<{ message: string }> {
  const queryParams = boardId ? `?boardId=${boardId}` : '';
  const res = await api(`/notifications/mark-all-read${queryParams}`, {
    method: 'PATCH',
  });
  return res.json();
}

export async function deleteNotification(notificationId: string): Promise<{ message: string }> {
  const res = await api(`/notifications/${notificationId}`, {
    method: 'DELETE',
  });
  return res.json();
}

// Comments
export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    avatar: string | null;
  };
}

export interface Activity {
  id: string;
  type: 'CREATE_CARD' | 'DELETE_CARD' | 'MOVE_CARD' | 'UPDATE_DESCRIPTION' | 'ADD_LABEL';
  entityId: string;
  details?: string;
  createdAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
}

export async function getCardActivities(cardId: string, limit: number = 20, offset: number = 0): Promise<Activity[]> {
  const res = await api(`/cards/${cardId}/activities?limit=${limit}&offset=${offset}`);
  if (!res.ok) {
    throw new Error('Failed to load activities');
  }
  return res.json();
}

export interface CreateCommentDto {
  content: string;
}

export interface UpdateCommentDto {
  content: string;
}

export async function getComments(cardId: string): Promise<Comment[]> {
  const res = await api(`/cards/${cardId}/comments`);
  if (!res.ok) {
    throw new Error('Failed to load comments');
  }
  return res.json();
}

export async function createComment(cardId: string, data: CreateCommentDto): Promise<Comment> {
  const res = await api(`/cards/${cardId}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to add comment');
  }
  return res.json();
}

export async function updateComment(commentId: string, data: UpdateCommentDto): Promise<Comment> {
  const res = await api(`/comments/${commentId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Failed to update comment');
  }
  return res.json();
}

export async function deleteComment(commentId: string): Promise<void> {
  const res = await api(`/comments/${commentId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete comment');
  }
}

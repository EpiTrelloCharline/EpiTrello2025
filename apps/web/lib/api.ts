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

export async function deleteCard(cardId: string) {
  const res = await api(`/cards/${cardId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function updateCard(cardId: string, data: { title?: string; description?: string; isArchived?: boolean; listId?: string; position?: string }) {
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
  const params = new URLSearchParams({ boardId, q: query });
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

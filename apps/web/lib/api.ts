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

// Labels API
export async function getLabelsByBoard(boardId: string) {
  const res = await api(`/labels?boardId=${boardId}`);
  return res.json();
}

export async function createLabel(boardId: string, name: string, color: string) {
  const res = await api('/labels', {
    method: 'POST',
    body: JSON.stringify({ boardId, name, color }),
  });
  return res.json();
}

export async function updateLabel(labelId: string, data: { name?: string; color?: string }) {
  const res = await api(`/labels/${labelId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function deleteLabel(labelId: string) {
  const res = await api(`/labels/${labelId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function assignLabel(labelId: string, cardId: string) {
  const res = await api(`/labels/${labelId}/assign/${cardId}`, {
    method: 'POST',
  });
  return res.json();
}

export async function unassignLabel(labelId: string, cardId: string) {
  const res = await api(`/labels/${labelId}/unassign/${cardId}`, {
    method: 'DELETE',
  });
  return res.json();
}

export async function getCardLabels(cardId: string) {
  const res = await api(`/labels/card/${cardId}`);
  return res.json();
}

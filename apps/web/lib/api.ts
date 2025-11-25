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

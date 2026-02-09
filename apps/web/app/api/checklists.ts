const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type ChecklistItem = {
    id: string;
    checklistId: string;
    content: string;
    checked: boolean;
    position: string;
    createdAt: string;
    updatedAt: string;
};

export type Checklist = {
    id: string;
    cardId: string;
    title: string;
    position: string;
    createdAt: string;
    updatedAt: string;
    items: ChecklistItem[];
};

/**
 * Create a new checklist for a card
 */
export async function createChecklist(cardId: string, title: string): Promise<Checklist> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards/${cardId}/checklists`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error('Failed to create checklist');
    }

    return response.json();
}

/**
 * Update a checklist title
 */
export async function updateChecklist(checklistId: string, title: string): Promise<Checklist> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/checklists/${checklistId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title }),
    });

    if (!response.ok) {
        throw new Error('Failed to update checklist');
    }

    return response.json();
}

/**
 * Delete a checklist
 */
export async function deleteChecklist(checklistId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/checklists/${checklistId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete checklist');
    }
}

/**
 * Create a new checklist item
 */
export async function createChecklistItem(checklistId: string, content: string): Promise<ChecklistItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/checklists/${checklistId}/items`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
    });

    if (!response.ok) {
        throw new Error('Failed to create checklist item');
    }

    return response.json();
}

/**
 * Update a checklist item
 */
export async function updateChecklistItem(
    itemId: string,
    data: { content?: string; checked?: boolean }
): Promise<ChecklistItem> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/checklist-items/${itemId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to update checklist item');
    }

    return response.json();
}

/**
 * Delete a checklist item
 */
export async function deleteChecklistItem(itemId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/checklist-items/${itemId}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete checklist item');
    }
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type Attachment = {
    id: string;
    cardId: string;
    name: string;
    mimeType: string;
    size: number;
    url: string;
    uploadedById: string;
    createdAt: string;
    updatedAt: string;
};

/**
 * Get all attachments for a card
 */
export async function getCardAttachments(cardId: string): Promise<Attachment[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/cards/${cardId}/attachments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to fetch attachments');
    }

    return response.json();
}

/**
 * Upload a new attachment to a card
 */
export async function uploadAttachment(cardId: string, file: File): Promise<Attachment> {
    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_URL}/cards/${cardId}/attachments`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    if (!response.ok) {
        throw new Error('Failed to upload attachment');
    }

    return response.json();
}

/**
 * Delete an attachment
 */
export async function deleteAttachment(attachmentId: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/attachments/${attachmentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Failed to delete attachment');
    }
}

/**
 * Set a card cover (either an attachment id, a color, or both)
 */
export async function updateCardCover(
    cardId: string,
    data: {
        attachmentId?: string | null;
        coverSize?: string;
        coverColor?: string | null;
    }
): Promise<any> {
    const token = localStorage.getItem('token');
    // Using PATCH /cards/:id as a fallback or specific endpoint if it exists
    // The previous implementation used /attachments/:id/cover which seems incorrect for the UI usage
    const response = await fetch(`${API_URL}/cards/${cardId}/cover`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to set card cover');
    }

    return response.json();
}

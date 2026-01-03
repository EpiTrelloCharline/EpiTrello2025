const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export type Attachment = {
    id: string;
    cardId: string;
    filename: string;
    originalName: string;
    mimetype: string;
    size: number;
    url: string;
    isCover: boolean;
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
 * Set an attachment as the card cover
 */
export async function setCardCover(attachmentId: string, isCover: boolean): Promise<Attachment> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/attachments/${attachmentId}/cover`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ isCover }),
    });

    if (!response.ok) {
        throw new Error('Failed to set card cover');
    }

    return response.json();
}

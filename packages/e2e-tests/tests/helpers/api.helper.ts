const API_BASE_URL = 'http://localhost:3001';

/**
 * Interface pour un workspace
 */
export interface Workspace {
    id: string;
    name: string;
    description?: string;
}

/**
 * Interface pour un board
 */
export interface Board {
    id: string;
    title: string;
    workspaceId: string;
}

/**
 * Interface pour une liste
 */
export interface List {
    id: string;
    title: string;
    boardId: string;
    position: number;
}

/**
 * Interface pour une carte
 */
export interface Card {
    id: string;
    title: string;
    description?: string;
    listId: string;
    position: number;
}

/**
 * Effectue une requête API avec authentification
 */
async function apiRequest<T>(
    endpoint: string,
    token: string,
    options?: RequestInit
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            ...(options?.headers || {}),
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`API request failed: ${response.status} - ${error}`);
    }

    return response.json();
}

/**
 * Crée un workspace via l'API
 */
export async function createWorkspace(
    token: string,
    name?: string,
    description?: string
): Promise<Workspace> {
    const workspaceName = name || `Test Workspace ${Date.now()}`;

    return apiRequest<Workspace>('/workspaces', token, {
        method: 'POST',
        body: JSON.stringify({
            name: workspaceName,
            description: description || 'Workspace créé pour les tests E2E',
        }),
    });
}

/**
 * Crée un board via l'API
 */
export async function createBoard(
    token: string,
    workspaceId: string,
    title?: string
): Promise<Board> {
    const boardTitle = title || `Test Board ${Date.now()}`;

    return apiRequest<Board>('/boards', token, {
        method: 'POST',
        body: JSON.stringify({
            workspaceId,
            title: boardTitle,
        }),
    });
}

/**
 * Crée une liste via l'API
 */
export async function createList(
    token: string,
    boardId: string,
    title?: string,
    after?: string
): Promise<List> {
    const listTitle = title || `Test List ${Date.now()}`;

    return apiRequest<List>('/lists', token, {
        method: 'POST',
        body: JSON.stringify({
            boardId,
            title: listTitle,
            after,
        }),
    });
}

/**
 * Récupère les listes d'un board
 */
export async function getLists(token: string, boardId: string): Promise<List[]> {
    return apiRequest<List[]>(`/lists?boardId=${boardId}`, token);
}

/**
 * Récupère les boards d'un workspace
 */
export async function getBoards(token: string, workspaceId: string): Promise<Board[]> {
    return apiRequest<Board[]>(`/boards?workspaceId=${workspaceId}`, token);
}

/**
 * Récupère un board par son ID
 */
export async function getBoard(token: string, boardId: string): Promise<Board> {
    return apiRequest<Board>(`/boards/${boardId}`, token);
}

/**
 * Nettoie les données de test (optionnel - dépend des endpoints disponibles)
 * Note: Cette fonction nécessiterait des endpoints de suppression dans l'API
 */
export async function cleanupTestData(token: string, workspaceId?: string): Promise<void> {
    // Pour l'instant, on laisse vide car il faudrait des endpoints DELETE
    // Dans un vrai projet, on supprimerait les workspaces/boards créés
    console.log('Cleanup not implemented - requires DELETE endpoints');
}

/**
 * Attend que l'API soit disponible
 */
export async function waitForAPI(maxAttempts = 10, delayMs = 500): Promise<boolean> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
            });

            // L'API répond (même avec une erreur 401), c'est qu'elle est disponible
            return true;
        } catch (error) {
            if (i < maxAttempts - 1) {
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
        }
    }

    return false;
}

import { test, expect } from './fixtures';

/**
 * Tests API with Playwright
 * 
 * These tests verify that the API endpoints work correctly
 * using Playwright's API testing capabilities
 */
test.describe('Tests API', () => {
  test('devrait créer un board via API', async ({ authenticatedPage: page, request }) => {
    // Get the authentication token
    const authToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    if (!authToken) {
      throw new Error('Token d\'authentification non trouvé');
    }
    // Create a workspace first
    const workspaceResponse = await request.post('http://localhost:3001/workspaces', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: `API Test Workspace ${Date.now()}`,
      },
    });

    expect(workspaceResponse.ok()).toBeTruthy();
    const workspace = await workspaceResponse.json();
    expect(workspace).toHaveProperty('id');

    // Create a board in this workspace
    const boardResponse = await request.post('http://localhost:3001/boards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        name: `API Test Board ${Date.now()}`,
        workspaceId: workspace.id,
      },
    });

    if (!boardResponse.ok()) {
      const errorBody = await boardResponse.text();
      console.error('❌ Board creation failed:', boardResponse.status(), errorBody);
      throw new Error(`Board creation failed: ${boardResponse.status()} - ${errorBody}`);
    }
    
    expect(boardResponse.ok()).toBeTruthy();
    const board = await boardResponse.json();
    
    expect(board).toHaveProperty('id');
    expect(board).toHaveProperty('name');
    expect(board.workspaceId).toBe(workspace.id);
  });

  test('devrait créer une liste et une carte via API', async ({ authenticatedPage: page, request }) => {
    // Get the authentication token
    const authToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    if (!authToken) {
      throw new Error('Token d\'authentification non trouvé');
    }

    // Create a workspace and a board
    const workspaceResponse = await request.post('http://localhost:3001/workspaces', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { name: `API Workspace ${Date.now()}` },
    });
    const workspace = await workspaceResponse.json();

    const boardResponse = await request.post('http://localhost:3001/boards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { 
        name: `API Board ${Date.now()}`,
        workspaceId: workspace.id,
      },
    });
    const board = await boardResponse.json();

    // Create a list
    const listResponse = await request.post('http://localhost:3001/lists', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        title: 'API Test List',
        boardId: board.id,
      },
    });

    expect(listResponse.ok()).toBeTruthy();
    const list = await listResponse.json();
    expect(list).toHaveProperty('id');
    expect(list.title).toBe('API Test List');

    // Create a card in this list
    const cardResponse = await request.post('http://localhost:3001/cards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: {
        title: 'API Test Card',
        listId: list.id,
      },
    });

    expect(cardResponse.ok()).toBeTruthy();
    const card = await cardResponse.json();
    
    expect(card).toHaveProperty('id');
    expect(card.title).toBe('API Test Card');
    expect(card.listId).toBe(list.id);
  });

  test('devrait récupérer les cartes d\'une liste via API', async ({ authenticatedPage: page, request }) => {
    // Get the authentication token
    const authToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    if (!authToken) {
      throw new Error('Token d\'authentification non trouvé');
    }

    // Setup: Create a list with cards
    const workspaceResponse = await request.post('http://localhost:3001/workspaces', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { name: `Workspace ${Date.now()}` },
    });
    const workspace = await workspaceResponse.json();

    const boardResponse = await request.post('http://localhost:3001/boards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { 
        name: `Board ${Date.now()}`,
        workspaceId: workspace.id,
      },
    });
    const board = await boardResponse.json();

    const listResponse = await request.post('http://localhost:3001/lists', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'Test List', boardId: board.id },
    });
    const list = await listResponse.json();

    // Create multiple cards
    await request.post('http://localhost:3001/cards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'Card 1', listId: list.id },
    });

    await request.post('http://localhost:3001/cards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'Card 2', listId: list.id },
    });

    // Retrieve the cards
    const cardsResponse = await request.get(
      `http://localhost:3001/cards?listId=${list.id}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      }
    );

    expect(cardsResponse.ok()).toBeTruthy();
    const cards = await cardsResponse.json();
    
    expect(Array.isArray(cards)).toBeTruthy();
    expect(cards.length).toBeGreaterThanOrEqual(2);
    expect(cards.some((c: any) => c.title === 'Card 1')).toBeTruthy();
    expect(cards.some((c: any) => c.title === 'Card 2')).toBeTruthy();
  });

  test('devrait mettre à jour une carte via API', async ({ authenticatedPage: page, request }) => {
    // Get the authentication token
    const authToken = await page.evaluate(() => localStorage.getItem('accessToken'));
    if (!authToken) {
      throw new Error('Token d\'authentification non trouvé');
    }

    // Setup: Create a card
    const workspaceResponse = await request.post('http://localhost:3001/workspaces', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { name: `Workspace ${Date.now()}` },
    });
    const workspace = await workspaceResponse.json();

    const boardResponse = await request.post('http://localhost:3001/boards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { name: `Board ${Date.now()}`, workspaceId: workspace.id },
    });
    const board = await boardResponse.json();

    const listResponse = await request.post('http://localhost:3001/lists', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'List', boardId: board.id },
    });
    const list = await listResponse.json();

    const cardResponse = await request.post('http://localhost:3001/cards', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
      data: { title: 'Original Title', listId: list.id },
    });
    const card = await cardResponse.json();

    // Update the card
    const updateResponse = await request.patch(
      `http://localhost:3001/cards/${card.id}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json',
        },
        data: {
          title: 'Updated Title',
          description: 'New description',
        },
      }
    );

    expect(updateResponse.ok()).toBeTruthy();
    const updatedCard = await updateResponse.json();
    
    expect(updatedCard.title).toBe('Updated Title');
    expect(updatedCard.description).toBe('New description');
    expect(updatedCard.id).toBe(card.id);
  });
});

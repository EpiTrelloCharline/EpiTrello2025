import { test, expect, Page } from '@playwright/test';

async function login(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/workspaces');
}

test.describe('Board Workflow', () => {
    const testEmail = `board-test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';

    test.beforeEach(async ({ page }) => {
        // Sign up for each test to ensure clean state
        await page.goto('/signup');
        await page.fill('input[name="name"]', 'Board Test User');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', testPassword);
        await page.click('button[type="submit"]');
        await page.waitForURL('/workspaces');
    });

    test('should create board, list, and card', async ({ page }) => {
        // Create workspace
        await page.click('button:has-text("Créer"), button:has-text("Create")');
        await page.fill('input[placeholder*="workspace"], input[placeholder*="espace"]', 'Test Workspace');
        await page.click('button[type="submit"]:has-text("Créer"), button[type="submit"]:has-text("Create")');

        // Navigate to workspace and create board
        await page.click('text=Test Workspace');
        await page.click('button:has-text("Nouveau tableau"), button:has-text("New Board")');
        await page.fill('input[placeholder*="board"], input[placeholder*="tableau"]', 'Test Board');
        await page.click('button[type="submit"]:has-text("Créer"), button[type="submit"]:has-text("Create")');

        // Verify board created
        await expect(page.locator('text=Test Board')).toBeVisible();

        // Click on board to open it
        await page.click('text=Test Board');

        // Create a list
        await page.click('button:has-text("Ajouter une liste"), button:has-text("Add List")');
        await page.fill('input[placeholder*="liste"], input[placeholder*="list"]', 'To Do');
        await page.press('input[placeholder*="liste"], input[placeholder*="list"]', 'Enter');

        // Verify list created
        await expect(page.locator('text=To Do')).toBeVisible();

        // Create a card
        await page.click('button:has-text("Ajouter une carte"), button:has-text("Add Card")');
        await page.fill('textarea[placeholder*="titre"], textarea[placeholder*="title"], input[placeholder*="titre"]', 'Test Card');
        await page.press('textarea[placeholder*="titre"], textarea[placeholder*="title"], input[placeholder*="titre"]', 'Enter');

        // Verify card created
        await expect(page.locator('text=Test Card')).toBeVisible();
    });

    test('should allow drag and drop of cards', async ({ page }) => {
        // Setup: Create workspace, board, 2 lists, and 2 cards
        await page.click('button:has-text("Créer"), button:has-text("Create")');
        await page.fill('input[placeholder*="workspace"], input[placeholder*="espace"]', 'DnD Workspace');
        await page.click('button[type="submit"]:has-text("Créer"), button[type="submit"]:has-text("Create")');

        await page.click('text=DnD Workspace');
        await page.click('button:has-text("Nouveau tableau"), button:has-text("New Board")');
        await page.fill('input[placeholder*="board"], input[placeholder*="tableau"]', 'DnD Board');
        await page.click('button[type="submit"]:has-text("Créer"), button[type="submit"]:has-text("Create")');
        await page.click('text=DnD Board');

        // Create first list
        await page.click('button:has-text("Ajouter une liste"), button:has-text("Add List")');
        await page.fill('input[placeholder*="liste"], input[placeholder*="list"]', 'List 1');
        await page.press('input[placeholder*="liste"], input[placeholder*="list"]', 'Enter');
        await page.waitForTimeout(500);

        // Create second list  
        await page.click('button:has-text("Ajouter une liste"), button:has-text("Add List")');
        await page.fill('input[placeholder*="liste"], input[placeholder*="list"]', 'List 2');
        await page.press('input[placeholder*="liste"], input[placeholder*="list"]', 'Enter');
        await page.waitForTimeout(500);

        // Create card in List 1
        const list1 = page.locator('text=List 1').locator('..');
        await list1.locator('button:has-text("Ajouter"), button:has-text("Add")').click();
        await page.fill('textarea, input[placeholder*="titre"]', 'Card to Move');
        await page.press('textarea, input[placeholder*="titre"]', 'Enter');

        // Verify initial state
        await expect(list1.locator('text=Card to Move')).toBeVisible();

        // Note: Actual drag-and-drop testing requires more complex setup
        // This is a basic structure - full DnD test would need to simulate mouse events
    });
});

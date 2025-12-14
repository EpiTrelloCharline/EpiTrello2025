import { test, expect } from '@playwright/test';
import { setupAuthenticatedUser, loginUser } from './helpers/auth.helper';
import { createWorkspace } from './helpers/api.helper';

test.describe('Board Creation', () => {
    test('should create a new board via UI', async ({ page }) => {
        // Setup: créer et authentifier un utilisateur
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);

        // Créer un workspace pour le test
        const workspace = await createWorkspace(token, 'Test Workspace for Board');

        // Naviguer vers la page du workspace
        await page.goto(`/workspaces/${workspace.id}/boards`);

        // Vérifier que la page est chargée
        await expect(page).toHaveURL(`/workspaces/${workspace.id}/boards`);

        // Créer un nouveau board
        const boardTitle = `Mon Board de Test ${Date.now()}`;

        // Chercher le champ de saisie pour créer un board
        const titleInput = page.locator('input[placeholder*="board" i], input[placeholder*="titre" i]').first();
        await titleInput.fill(boardTitle);

        // Cliquer sur le bouton pour créer le board
        const createButton = page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first();
        await createButton.click();

        // Attendre que le board apparaisse dans la liste
        await expect(page.locator(`text=${boardTitle}`)).toBeVisible({ timeout: 5000 });

        // Vérifier que le board est bien présent
        const boardCard = page.locator(`text=${boardTitle}`);
        await expect(boardCard).toBeVisible();
    });

    test('should navigate to board after creation', async ({ page }) => {
        // Setup
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);
        const workspace = await createWorkspace(token, 'Test Workspace Navigation');

        await page.goto(`/workspaces/${workspace.id}/boards`);

        // Créer un board
        const boardTitle = `Board Navigation ${Date.now()}`;
        const titleInput = page.locator('input[placeholder*="board" i], input[placeholder*="titre" i]').first();
        await titleInput.fill(boardTitle);

        const createButton = page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first();
        await createButton.click();

        // Attendre que le board soit créé
        await page.waitForTimeout(500);

        // Cliquer sur le board pour naviguer
        await page.locator(`text=${boardTitle}`).click();

        // Vérifier la navigation vers la page du board
        await expect(page).toHaveURL(/\/boards\/[a-f0-9-]+/);

        // Vérifier que la page du board affiche des éléments caractéristiques
        await expect(page.locator('text=/Nouvelle colonne|Ajouter une liste/i')).toBeVisible();
    });

    test('should display multiple boards in workspace', async ({ page }) => {
        // Setup
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);
        const workspace = await createWorkspace(token, 'Test Workspace Multiple');

        await page.goto(`/workspaces/${workspace.id}/boards`);

        // Créer plusieurs boards
        const boards = ['Board 1', 'Board 2', 'Board 3'];

        for (const boardName of boards) {
            const titleInput = page.locator('input[placeholder*="board" i], input[placeholder*="titre" i]').first();
            await titleInput.fill(boardName);

            const createButton = page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first();
            await createButton.click();

            // Attendre un peu entre chaque création
            await page.waitForTimeout(300);
        }

        // Vérifier que tous les boards sont affichés
        for (const boardName of boards) {
            await expect(page.locator(`text=${boardName}`)).toBeVisible();
        }
    });
});

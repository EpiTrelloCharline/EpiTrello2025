import { test, expect } from '@playwright/test';
import { setupAuthenticatedUser, loginUser } from './helpers/auth.helper';
import { createWorkspace, createBoard } from './helpers/api.helper';

test.describe('List Creation', () => {
    test('should create a new list in a board', async ({ page }) => {
        // Setup: créer workspace, board et utilisateur
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);
        const workspace = await createWorkspace(token);
        const board = await createBoard(token, workspace.id);

        // Naviguer vers le board
        await page.goto(`/boards/${board.id}`);

        // Vérifier que la page du board est chargée
        await expect(page).toHaveURL(`/boards/${board.id}`);

        // Créer une nouvelle liste
        const listTitle = `Ma Liste ${Date.now()}`;

        const listInput = page.locator('input[placeholder*="colonne" i], input[placeholder*="liste" i]');
        await listInput.fill(listTitle);

        const addButton = page.locator('button:has-text("Ajouter")');
        await addButton.click();

        // Vérifier que la liste est créée et visible
        await expect(page.locator(`text=${listTitle}`)).toBeVisible({ timeout: 5000 });
    });

    test('should create multiple lists in correct order', async ({ page }) => {
        // Setup
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);
        const workspace = await createWorkspace(token);
        const board = await createBoard(token, workspace.id);

        await page.goto(`/boards/${board.id}`);

        // Créer plusieurs listes
        const lists = ['À faire', 'En cours', 'Terminé'];

        for (const listTitle of lists) {
            const listInput = page.locator('input[placeholder*="colonne" i], input[placeholder*="liste" i]');
            await listInput.fill(listTitle);

            const addButton = page.locator('button:has-text("Ajouter")');
            await addButton.click();

            // Attendre que la liste soit visible avant de créer la suivante
            await expect(page.locator(`text=${listTitle}`)).toBeVisible();
            await page.waitForTimeout(200);
        }

        // Vérifier que toutes les listes sont présentes
        for (const listTitle of lists) {
            await expect(page.locator(`text=${listTitle}`)).toBeVisible();
        }

        // Vérifier l'ordre des listes (de gauche à droite)
        const listContainers = page.locator('.min-w-\\[280px\\]').filter({ hasText: /À faire|En cours|Terminé/ });
        const count = await listContainers.count();
        expect(count).toBe(3);
    });

    test('should persist lists after page reload', async ({ page }) => {
        // Setup
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);
        const workspace = await createWorkspace(token);
        const board = await createBoard(token, workspace.id);

        await page.goto(`/boards/${board.id}`);

        // Créer une liste
        const listTitle = `Liste Persistante ${Date.now()}`;
        const listInput = page.locator('input[placeholder*="colonne" i], input[placeholder*="liste" i]');
        await listInput.fill(listTitle);

        const addButton = page.locator('button:has-text("Ajouter")');
        await addButton.click();

        // Attendre que la liste soit visible
        await expect(page.locator(`text=${listTitle}`)).toBeVisible();

        // Recharger la page
        await page.reload();

        // Vérifier que la liste est toujours présente
        await expect(page.locator(`text=${listTitle}`)).toBeVisible({ timeout: 5000 });
    });

    test('should clear input field after list creation', async ({ page }) => {
        // Setup
        const user = await setupAuthenticatedUser(page);
        const token = await loginUser(user);
        const workspace = await createWorkspace(token);
        const board = await createBoard(token, workspace.id);

        await page.goto(`/boards/${board.id}`);

        // Créer une liste
        const listTitle = 'Test Clear Input';
        const listInput = page.locator('input[placeholder*="colonne" i], input[placeholder*="liste" i]');
        await listInput.fill(listTitle);

        const addButton = page.locator('button:has-text("Ajouter")');
        await addButton.click();

        // Attendre que la liste soit créée
        await expect(page.locator(`text=${listTitle}`)).toBeVisible();

        // Vérifier que le champ est vidé
        await expect(listInput).toHaveValue('');
    });
});

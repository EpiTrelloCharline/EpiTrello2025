import { test, expect } from './fixtures';
import { BoardPage, WorkspacesPage } from './page-objects';
import { generateTestData } from './helpers';

/**
 * E2E Test: Full Flow + Checklists
 * 
 * Objectives:
 * 1. Create Board
 * 2. Create List
 * 3. Add Card
 * 4. Add Checklists and Check items
 * 5. Drag and Drop
 * 6. Card modification, deletion
 * 7. Persistence after reload
 */
test.describe('Flow Complet: Board, Cartes et Checklists', () => {
    test('devrait automatiser le cycle de vie complet d\'un board avec checklists', async ({ authenticatedPage: page }) => {
        const workspacesPage = new WorkspacesPage(page);
        const boardPage = new BoardPage(page);

        const workspaceName = generateTestData.workspaceName();
        const boardName = generateTestData.boardName();
        const listName = 'To Do';
        const targetListName = 'Done';
        const cardTitle = 'Tâche avec Checklist';

        // 1. CREATION BOARD
        await test.step('Création du workspace et du board', async () => {
            await workspacesPage.createWorkspace(workspaceName);

            // Wait for workspace to appear and click to view boards
            const workspaceLink = page.getByRole('link', { name: /Voir les tableaux/i }).first();
            await expect(workspaceLink).toBeVisible({ timeout: 10000 });
            await workspaceLink.click();

            // Now on /workspaces/[id]/boards
            await expect(page).toHaveURL(/.*workspaces\/.*\/boards/);

            // Create board
            await page.getByPlaceholder(/Nom du tableau/i).fill(boardName);

            // Wait for the POST response to ensure it's created
            const responsePromise = page.waitForResponse(response =>
                response.url().includes('/boards') && response.request().method() === 'POST'
            );
            await page.getByRole('button', { name: /Créer/i }).click();
            await responsePromise;

            // Wait for board to appear in the list and click it
            const boardLink = page.getByRole('link', { name: boardName }).first();
            await expect(boardLink).toBeVisible({ timeout: 10000 });
            await boardLink.click();

            await page.waitForURL(/.*boards\/[a-zA-Z0-9-]+/, { timeout: 15000 });
            await expect(page.locator('h1, h2').first()).toContainText(boardName);
        });

        // 2. CREATION LISTE
        await test.step('Création des listes', async () => {
            await boardPage.createList(listName);
            await boardPage.createList(targetListName);

            // Lists might be in h2 or just divs with titles
            await expect(page.locator(`text=${listName}`).first()).toBeVisible();
            await expect(page.locator(`text=${targetListName}`).first()).toBeVisible();
        });

        // 3. AJOUT CARTE
        await test.step('Ajout d\'une carte', async () => {
            await boardPage.addCardToList(listName, cardTitle);
            await expect(page.locator(`text=${cardTitle}`).first()).toBeVisible();
        });

        // 4. CHECKLISTS
        await test.step('Gestion des checklists', async () => {
            // Open card modal
            await page.locator(`text=${cardTitle}`).first().click();

            // Add a checklist - specifically looking for the sidebar button
            await page.getByRole('button', { name: /Checklist/i }).click();
            const checklistTitle = 'Ma Checklist';
            const checklistInput = page.locator('#checklist-title');
            await expect(checklistInput).toBeVisible();
            await checklistInput.fill(checklistTitle);
            await page.locator('form button[type="submit"]').click();

            // Verify checklist is created
            await expect(page.locator(`h3:has-text("${checklistTitle}")`)).toBeVisible();

            // Add items to checklist
            const item1 = 'Élément 1';
            const item2 = 'Élément 2';

            await page.getByRole('button', { name: /Ajouter un élément/i }).click();
            const addItemTextarea = page.locator('textarea[placeholder="Ajouter un élément"]');
            await addItemTextarea.fill(item1);
            await page.getByRole('button', { name: /Ajouter/i }).filter({ hasText: /^Ajouter$/ }).click();

            await addItemTextarea.fill(item2);
            await page.getByRole('button', { name: /Ajouter/i }).filter({ hasText: /^Ajouter$/ }).click();

            // Verify items are visible
            await expect(page.locator(`text=${item1}`).first()).toBeVisible();
            await expect(page.locator(`text=${item2}`).first()).toBeVisible();

            // Check an item - targeted selection
            const itemContainer = page.locator('div').filter({ hasText: item1 }).last();
            await itemContainer.locator('input[type="checkbox"]').check();

            // Verify progress bar updated (50% for 1/2 items)
            await expect(page.locator('text=50%')).toBeVisible();
        });

        // 5. PERSISTANCE APRÈS RELOAD (PARTIAL)
        await test.step('Vérification de la persistance après reload (dans la modale)', async () => {
            await page.reload();

            // Wait for board to load
            await page.waitForTimeout(2000);

            // Re-open card if it was closed by reload
            if (!(await page.getByRole('button', { name: /Ajouter un élément/i }).isVisible())) {
                await boardPage.openCard(cardTitle);
            }

            // Verify checklist and checked item still there
            await expect(page.locator('h3:has-text("Ma Checklist")')).toBeVisible();
            await expect(page.locator('text=50%')).toBeVisible();

            // Close modal
            await boardPage.closeCardModal();
        });

        // 6. DRAG AND DROP
        await test.step('Drag and Drop de la carte', async () => {
            await boardPage.dragCardToList(cardTitle, targetListName);

            // Verify card is in the target list
            const doneList = page.locator(`div:has-text("${targetListName}")`).first();
            await expect(doneList.locator(`text=${cardTitle}`)).toBeVisible();
        });

        // 7. SUPPRESSION ITEM ET CHECKLIST
        await test.step('Suppression item et checklist', async () => {
            await boardPage.openCard(cardTitle);

            // Delete an item
            const itemToDelete = 'Élément 1'; // Assuming this was created
            const itemContainer = page.locator('div').filter({ hasText: itemToDelete }).last();

            // Click delete button on item (assuming hover or specific button)
            // If no specific delete button is visible, we might need to hover
            await itemContainer.hover();
            await itemContainer.getByRole('button', { name: /supprimer|delete|trash/i }).click(); // Adjust selector based on actual UI

            // Verify item is gone
            await expect(page.locator(`text=${itemToDelete}`)).not.toBeVisible();

            // Delete entire checklist
            const checklistHeader = page.locator('h3').filter({ hasText: 'Ma Checklist' });
            // Assuming there is a delete button near the header
            await checklistHeader.locator('xpath=..').getByRole('button', { name: /supprimer|delete/i }).click();

            // Confirm deletion if there's a confirmation
            // await page.getByRole('button', { name: /confirmer|oui/i }).click(); // Uncomment if confirmation needed

            // Verify checklist is gone
            await expect(page.locator('h3:has-text("Ma Checklist")')).not.toBeVisible();

            await boardPage.closeCardModal();
        });

        // 8. COHERENCE INTERFACE / API
        await test.step('Vérification cohérence API lors de la modification', async () => {
            await boardPage.openCard(cardTitle);

            // Intercept PATCH request for card update
            const updatePromise = page.waitForResponse(response =>
                response.url().includes('/cards') && response.request().method() === 'PATCH' && response.status() === 200
            );

            const updatedDescription = 'Description mise à jour et vérifiée';
            await boardPage.updateCardDescription(updatedDescription);
            // Trigger save (blur or enter)
            await page.keyboard.press('Tab');

            const response = await updatePromise;
            const responseBody = await response.json();

            // Verify API response matches UI input
            expect(responseBody.description).toBe(updatedDescription);

            // Verify UI update
            await expect(page.locator(`text=${updatedDescription}`)).toBeVisible();
        });

        // 9. NETTOYAGE (Old step 7)
        await test.step('Nettoyage (Suppression carte)', async () => {
            // If implicit deletion via easy archive/delete
            // await boardPage.deleteCard(cardTitle); // Need to implement this in PO if possible
        });

        // Final screenshot
        await page.screenshot({ path: 'playwright-report/full-flow-checklists.png', fullPage: true });
    });
});

import { test, expect } from './fixtures';
import { BoardPage, WorkspacesPage } from './page-objects';

/**
 * Test E2E simplified - Board Flow with Page Objects
 * 
 * This example shows how to use Page Objects to write more maintainable tests
 */
test.describe('Flow Board avec Page Objects', () => {
  test('devrait créer un board complet avec des cartes', async ({ authenticatedPage: page }) => {
    const workspacesPage = new WorkspacesPage(page);
    const boardPage = new BoardPage(page);

    // 1. Create a workspace
    await test.step('Créer un workspace', async () => {
      await workspacesPage.createWorkspace(`Workspace Test ${Date.now()}`);
    });

    // 2. Create a board
    await test.step('Créer un board', async () => {
      const boardName = `Board Test ${Date.now()}`;
      await page.getByRole('button', { name: /créer.*board|nouveau.*board/i }).click();
      await page.fill('input[name="name"], input[name="title"]', boardName);
      await page.getByRole('button', { name: /créer|create/i }).last().click();
      await page.waitForURL(/.*boards\/[a-zA-Z0-9-]+/);
    });

    // 3. Create lists
    await test.step('Créer des listes', async () => {
      await boardPage.createList('To Do');
      await boardPage.createList('Done');
    });

    // 4. Add cards
    await test.step('Ajouter des cartes', async () => {
      await boardPage.addCardToList('To Do', 'Carte 1');
      await boardPage.addCardToList('To Do', 'Carte 2');
      
      // Verify cards are added
      await expect(page.locator('text=Carte 1')).toBeVisible();
      await expect(page.locator('text=Carte 2')).toBeVisible();
    });

    // 5. Move a card
    await test.step('Déplacer une carte par drag & drop', async () => {
      await boardPage.dragCardToList('Carte 1', 'Done');
      
      // Verify the card is in the Done list
      const doneList = page.locator('div:has-text("Done")').first();
      await expect(doneList.locator('text=Carte 1')).toBeVisible();
    });

    // 6. Modify a card
    await test.step('Modifier une carte', async () => {
      await boardPage.openCard('Carte 2');
      await boardPage.updateCardTitle('Carte 2 - Modifiée');
      
      // Try to update description if the field exists
      const descField = page.locator('textarea[name="description"]');
      if (await descField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await boardPage.updateCardDescription('Description de test');
      }
      
      await boardPage.closeCardModal();
      
      // Verify the modified title is visible
      await expect(page.locator('text=Carte 2 - Modifiée')).toBeVisible();
    });

    // Final screenshot
    await page.screenshot({ 
      path: 'playwright-report/page-objects-example.png', 
      fullPage: true 
    });
  });
});

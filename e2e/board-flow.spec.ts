import { test, expect } from './fixtures';

/**
 * Complete E2E Test - Board → Cards Flow
 * 
 * This test automates the complete flow as follows:
 * 1. Create a workspace
 * 2. Create a board
 * 3. Create lists
 * 4. Add cards
 * 5. Drag and drop cards
 * 6. Edit cards
 */
test.describe('Flow complet Board → Cartes', () => {
  test('devrait permettre de créer un board, des listes, des cartes, faire du drag&drop et modifier une carte', async ({ authenticatedPage: page }) => {
    // 1. CREATION OF A WORKSPACE
    test.step('Création d\'un workspace', async () => {
      // Be sure we are on the workspaces page
      await expect(page).toHaveURL(/.*workspaces/);
      
      // Click the button to create a new workspace
      await page.getByRole('button', { name: /créer un espace de travail/i }).click();
      await page.waitForTimeout(500);
      
      // Fill the workspace name
      const workspaceName = `Test Workspace ${Date.now()}`;
      await page.locator('input[type="text"]').first().fill(workspaceName);
      
      // Submit the form
      await page.locator('button[type="submit"]').click();
      
      // Wait for the workspace to be created and visible
      await page.waitForTimeout(2000);
      await expect(page.locator(`text=${workspaceName}`)).toBeVisible({ timeout: 10000 });
    });

    // 2. CREATION OF A BOARD
    test.step('Création d\'un board', async () => {
      // Click the button to create a new board
      await page.getByRole('button', { name: /créer.*board|nouveau.*board|create.*board/i }).click();
      
      // Fill the board name
      const boardName = `Test Board ${Date.now()}`;
      await page.fill('input[name="name"], input[name="title"], input[placeholder*="board" i], input[placeholder*="nom" i]', boardName);
      
      // Submit the form
      await page.getByRole('button', { name: /créer|create|ajouter|add/i }).last().click();
      
      // Wait for the redirect to the board
      await page.waitForURL(/.*boards\/[a-zA-Z0-9-]+/, { timeout: 10000 });
      
      // Verify that the board name is displayed
      await expect(page.locator(`h1:has-text("${boardName}"), h2:has-text("${boardName}")`)).toBeVisible();
    });

    // 3. CREATION OF LISTS
    const list1Name = 'To Do';
    const list2Name = 'In Progress';
    const list3Name = 'Done';

    test.step('Création de la première liste (To Do)', async () => {
      // Click the button to add a new list
      await page.getByRole('button', { name: /ajouter.*liste|add.*list|créer.*liste|nouvelle liste/i }).click();
      
      // Fill the list name
      await page.fill('input[name="title"], input[name="name"], input[placeholder*="liste" i], input[placeholder*="list" i]', list1Name);
      
      // Validate the creation (Enter or button)
      await page.keyboard.press('Enter');
      
      // Wait for the list to be created
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${list1Name}`).first()).toBeVisible();
    });

    test.step('Création de la deuxième liste (In Progress)', async () => {
      await page.getByRole('button', { name: /ajouter.*liste|add.*list|créer.*liste|nouvelle liste/i }).click();
      await page.fill('input[name="title"], input[name="name"], input[placeholder*="liste" i], input[placeholder*="list" i]', list2Name);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${list2Name}`).first()).toBeVisible();
    });

    test.step('Création de la troisième liste (Done)', async () => {
      await page.getByRole('button', { name: /ajouter.*liste|add.*list|créer.*liste|nouvelle liste/i }).click();
      await page.fill('input[name="title"], input[name="name"], input[placeholder*="liste" i], input[placeholder*="list" i]', list3Name);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${list3Name}`).first()).toBeVisible();
    });

    // 4. ADDING CARDS
    const card1Title = 'Tâche 1: Installer Playwright';
    const card2Title = 'Tâche 2: Créer les tests';
    const card3Title = 'Tâche 3: Exécuter les tests';

    test.step('Ajout de la première carte dans To Do', async () => {
      // Localization of the To Do list
      const todoList = page.locator(`div:has-text("${list1Name}")`).first();
      await todoList.getByRole('button', { name: /ajouter.*carte|add.*card|nouvelle carte/i }).click();
      
      // Fill the card title
      await page.fill('textarea[name="title"], input[name="title"], textarea[placeholder*="carte" i], input[placeholder*="card" i]', card1Title);
      
      // Validate the creation
      await page.keyboard.press('Enter');
      
      // Wait for the card to be created
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${card1Title}`)).toBeVisible();
    });

    test.step('Ajout de la deuxième carte dans To Do', async () => {
      const todoList = page.locator(`div:has-text("${list1Name}")`).first();
      await todoList.getByRole('button', { name: /ajouter.*carte|add.*card|nouvelle carte/i }).click();
      await page.fill('textarea[name="title"], input[name="title"], textarea[placeholder*="carte" i], input[placeholder*="card" i]', card2Title);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${card2Title}`)).toBeVisible();
    });

    test.step('Ajout de la troisième carte dans To Do', async () => {
      const todoList = page.locator(`div:has-text("${list1Name}")`).first();
      await todoList.getByRole('button', { name: /ajouter.*carte|add.*card|nouvelle carte/i }).click();
      await page.fill('textarea[name="title"], input[name="title"], textarea[placeholder*="carte" i], input[placeholder*="card" i]', card3Title);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
      await expect(page.locator(`text=${card3Title}`)).toBeVisible();
    });

    // 5. DRAG AND DROP
    test.step('Déplacer la première carte de "To Do" vers "In Progress"', async () => {
      // Locate the first card
      const card = page.locator(`text=${card1Title}`).first();
      
      // Locate the target list
      const targetList = page.locator(`div:has-text("${list2Name}")`).first();
      
      // Get the positions
      const cardBox = await card.boundingBox();
      const targetBox = await targetList.boundingBox();
      
      if (cardBox && targetBox) {
        // Perform the drag and drop
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
        await page.waitForTimeout(500);
        await page.mouse.up();
        
        // Wait for the drag and drop to complete
        await page.waitForTimeout(2000);
        
        // Verify that the card is now in "In Progress"
        const inProgressList = page.locator(`div:has-text("${list2Name}")`).first();
        await expect(inProgressList.locator(`text=${card1Title}`)).toBeVisible();
      }
    });

    test.step('Déplacer la deuxième carte de "To Do" vers "Done"', async () => {
      const card = page.locator(`text=${card2Title}`).first();
      const targetList = page.locator(`div:has-text("${list3Name}")`).first();
      
      const cardBox = await card.boundingBox();
      const targetBox = await targetList.boundingBox();
      
      if (cardBox && targetBox) {
        await page.mouse.move(cardBox.x + cardBox.width / 2, cardBox.y + cardBox.height / 2);
        await page.mouse.down();
        await page.mouse.move(targetBox.x + targetBox.width / 2, targetBox.y + targetBox.height / 2, { steps: 10 });
        await page.waitForTimeout(500);
        await page.mouse.up();
        
        await page.waitForTimeout(2000);
        
        const doneList = page.locator(`div:has-text("${list3Name}")`).first();
        await expect(doneList.locator(`text=${card2Title}`)).toBeVisible();
      }
    });

    // 6. CARD MODIFICATION
    test.step('Modifier la troisième carte', async () => {
      // Click to open the card details
      await page.locator(`text=${card3Title}`).first().click();
      
      // Wait for the modal to open
      await page.waitForTimeout(1000);
      
      // Modify the title
      const newTitle = 'Tâche 3: Tests E2E réussis ✅';
      const titleInput = page.locator('input[value*="Tâche 3"], textarea:has-text("Tâche 3"), input:has-text("Tâche 3")').first();
      await titleInput.clear();
      await titleInput.fill(newTitle);
      
      // Add a description if available
      const descriptionField = page.locator('textarea[name="description"], textarea[placeholder*="description" i], textarea[placeholder*="ajouter" i]').first();
      if (await descriptionField.isVisible({ timeout: 1000 }).catch(() => false)) {
        await descriptionField.fill('Description ajoutée par le test E2E Playwright. Test de modification de carte réussi!');
      }
      
      // Save changes
      const saveButton = page.getByRole('button', { name: /sauvegarder|save|enregistrer/i });
      if (await saveButton.isVisible({ timeout: 1000 }).catch(() => false)) {
        await saveButton.click();
      }
      
      // Close the modal (Escape or close button)
      await page.keyboard.press('Escape');
      
      // Wait for the changes to be saved
      await page.waitForTimeout(1000);
      
      // Verify that the new title is displayed
      await expect(page.locator(`text=${newTitle}`)).toBeVisible();
    });

    // Final screenshot for the report
    await page.screenshot({ path: 'playwright-report/final-board-state.png', fullPage: true });
  });
});

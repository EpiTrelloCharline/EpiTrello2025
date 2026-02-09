import { test, expect } from './fixtures';

/**
 * Test E2E realistic - Simplified flow adapted to the real application
 * 
 * This test follows the real application flow:
 * 1. Create a workspace
 * 2. Navigate to its boards
 * 3. Create a board
 */
test.describe('Flow réaliste - Création Workspace et Board', () => {
  test('devrait créer un workspace et un board', async ({ authenticatedPage: page }) => {
    // Verify we are on the workspaces page
    await expect(page).toHaveURL(/.*workspaces/);
    
    await test.step('1. Créer un workspace', async () => {
      // Wait for the page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Click the button to create a new workspace
      await page.getByRole('button', { name: /créer un espace de travail/i }).click();
      await page.waitForTimeout(500);
      
      // Fill the workspace name
      const workspaceName = `Test WS ${Date.now()}`;
      await page.locator('input[type="text"]').first().fill(workspaceName);
      
      // Submit
      await page.locator('button[type="submit"]').click();
      
      // Wait for creation
      await page.waitForTimeout(2000);
      
      // Verify the workspace appears
      await expect(page.locator(`text=${workspaceName}`)).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ Workspace "${workspaceName}" créé`);
    });

    await test.step('2. Naviguer vers les boards du workspace', async () => {
      // Click on the link to see boards
      await page.getByRole('link', { name: /voir les tableaux/i }).first().click();
      
      // Wait for navigation
      await page.waitForURL(/.*\/workspaces\/.*\/boards/, { timeout: 10000 });
      
      // Verify we are on the boards page
      await expect(page.locator('h1')).toContainText('Tableaux');
      
      console.log('✅ Navigation vers les boards réussie');
    });

    await test.step('3. Créer un board', async () => {
      // wait for the page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // fill the board name
      const boardName = `Test Board ${Date.now()}`;
      await page.locator('input[placeholder*="Nom du tableau"]').fill(boardName);
      
      // Click on Create
      await page.getByRole('button', { name: /créer/i }).click();
      
      // Wait for creation
      await page.waitForTimeout(2000);
      
      // Verify the board appears
      await expect(page.locator(`text=${boardName}`)).toBeVisible({ timeout: 5000 });
      
      console.log(`✅ Board "${boardName}" créé`);
    });

    await test.step('4. Ouvrir le board créé', async () => {
      // Click on the first board link
      await page.locator('a[href^="/boards/"]').first().click();
      
      // Wait for navigation to the board
      await page.waitForURL(/.*\/boards\/[a-zA-Z0-9-]+$/, { timeout: 10000 });
      
      console.log('✅ Board ouvert avec succès');
    });

    // Final screenshot
    await page.screenshot({ 
      path: 'playwright-report/realistic-flow-success.png', 
      fullPage: true 
    });
  });
});

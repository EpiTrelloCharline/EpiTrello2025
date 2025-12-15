import { test, expect } from './fixtures';

/**
 * Minimum test for authentication
 */
test.describe('Test d\'authentification', () => {
  test('devrait s\'authentifier correctement', async ({ authenticatedPage: page }) => {
    // Verify redirection to /workspaces
    await expect(page).toHaveURL(/.*workspaces/);
    
    // Verify that the token is stored
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeTruthy();
    expect(token).not.toBeNull();
    
    console.log('✅ Authentification réussie !');
  });
});

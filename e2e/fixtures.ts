import { test as base, expect, Page } from '@playwright/test';

/**
 * Type for authenticated fixtures
 */
type AuthenticatedFixtures = {
  authenticatedPage: Page;
};

/**
 * Custom fixture to handle authentication
 */
export const test = base.extend<AuthenticatedFixtures>({
  /**
   * Automatically authenticated context for each test
   */
  authenticatedPage: async ({ page }, use) => {
    // Create a unique test user for each run
    const timestamp = Date.now();
    const testUser = {
      email: `test-${timestamp}@example.com`,
      password: 'TestPassword123!',
      name: `Test User ${timestamp}`,
    };

    // Navigate to the registration page
    await page.goto('/login');
    
    // Wait for the page to load
    await page.waitForLoadState('networkidle');
    
    // Check if we are on the login mode and switch to registration
    const pageTitle = await page.locator('h1').textContent();
    if (pageTitle?.includes('Connexion')) {
      // Click the link to switch to registration
      await page.locator('text=Pas encore de compte ?').click();
      await page.waitForTimeout(500);
    }

    // Fill the registration form
    await page.locator('input[type="text"]').fill(testUser.name);
    await page.locator('input[type="email"]').fill(testUser.email);
    await page.locator('input[type="password"]').fill(testUser.password);
    
    // Submit the form
    await page.locator('button[type="submit"]').click();
    
    // Wait for the redirect to /workspaces
    await page.waitForURL('**/workspaces', { timeout: 10000 });
    
    // Verify that the token is stored
    const token = await page.evaluate(() => localStorage.getItem('accessToken'));
    expect(token).toBeTruthy();

    // Use the authenticated page
    await use(page);
    
    // Cleanup (optional) - logout
    await page.evaluate(() => localStorage.removeItem('accessToken'));
  },
});

export { expect };

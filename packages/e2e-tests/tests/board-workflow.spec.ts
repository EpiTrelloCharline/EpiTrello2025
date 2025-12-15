import { test, expect } from '@playwright/test';

test.describe('Board Workflow', () => {
    const testEmail = `board-test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';

    test.beforeEach(async ({ page }) => {
        // Sign up for each test to ensure clean state
        await page.goto('/login');
        // Click on "S'inscrire" button to toggle to signup mode
        await page.getByText("Pas encore de compte ? S'inscrire").click();
        await page.fill('input[name="name"]', 'Board Test User');
        await page.fill('input[name="email"]', testEmail);
        await page.fill('input[name="password"]', testPassword);
        await page.click('button[type="submit"]');
        await page.waitForURL('/workspaces');
    });

    test('should reach workspaces page after signup', async ({ page }) => {
        // Verify we're on the workspaces page
        await expect(page.getByText('Espaces de travail')).toBeVisible();

        // Verify create workspace button exists
        await expect(page.getByText('Créer un espace de travail')).toBeVisible();
    });
});

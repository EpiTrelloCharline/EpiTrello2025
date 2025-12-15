import { test, expect, Page } from '@playwright/test';

async function signup(page: Page, name: string, email: string, password: string) {
    await page.goto('/login');
    // Click on "S'inscrire" button to toggle to signup mode
    await page.getByText("Pas encore de compte ? S'inscrire").click();
    await page.fill('input[name="name"]', name);
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/workspaces');
}

async function login(page: Page, email: string, password: string) {
    await page.goto('/login');
    await page.fill('input[name="email"]', email);
    await page.fill('input[name="password"]', password);
    await page.click('button[type="submit"]');
    await page.waitForURL('/workspaces');
}

test.describe('Authentication Flow', () => {
    const testEmail = `test-${Date.now()}@example.com`;
    const testPassword = 'Test123456!';
    const testName = 'Test User';

    test('should allow user to sign up', async ({ page }) => {
        await signup(page, testName, testEmail, testPassword);

        // Verify we're on the workspaces page
        expect(page.url()).toContain('/workspaces');

        // Verify page content
        await expect(page.getByText('Espaces de travail')).toBeVisible();
    });
});

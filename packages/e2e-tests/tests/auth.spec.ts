import { test, expect, Page } from '@playwright/test';

async function signup(page: Page, name: string, email: string, password: string) {
    await page.goto('/signup');
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

    test('should allow user to sign up and login', async ({ page }) => {
        await signup(page, testName, testEmail, testPassword);
        expect(page.url()).toContain('/workspaces');

        // Logout
        await page.click('button:has-text("Logout"), a:has-text("Déconnexion")');
        await page.waitForURL('/login');

        // Login again
        await login(page, testEmail, testPassword);
        expect(page.url()).toContain('/workspaces');
    });
});

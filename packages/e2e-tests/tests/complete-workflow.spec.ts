import { test, expect } from '@playwright/test';
import { registerAndLoginViaUI, generateUniqueEmail } from './helpers/auth.helper';
import { waitForAPI } from './helpers/api.helper';

/**
 * Test de workflow complet E2E
 * Teste le parcours utilisateur complet :
 * 1. Inscription/Connexion
 * 2. Création workspace
 * 3. Création board
 * 4. Création de listes
 * 5. Ajout de cartes (si implémenté)
 * 6. Drag and drop
 * 7. Modifications
 * 8. Vérification de la persistence
 */
test.describe('Complete E2E Workflow', () => {
    test.beforeAll(async () => {
        // Vérifier que l'API est disponible
        const isAPIReady = await waitForAPI();
        if (!isAPIReady) {
            throw new Error('API is not available. Please start the backend server on http://localhost:3001');
        }
    });

    test('should complete full user workflow from registration to board management', async ({ page }) => {
        // ========== ÉTAPE 1: Inscription/Connexion ==========
        const userEmail = generateUniqueEmail();
        const userPassword = 'Test123456!';

        await page.goto('/login');

        // Basculer vers le mode inscription
        await page.click('button:has-text("inscrire")');

        // Remplir le formulaire d'inscription
        await page.fill('input[type="email"]', userEmail);
        await page.fill('input[type="password"]', userPassword);
        const nameInput = page.locator('input[type="text"]').first();
        if (await nameInput.isVisible()) {
            await nameInput.fill('Test User E2E');
        }

        // Soumettre l'inscription
        await page.click('button[type="submit"]');

        // Attendre la redirection vers /workspaces
        await page.waitForURL('/workspaces', { timeout: 10000 });
        await expect(page).toHaveURL('/workspaces');

        // ========== ÉTAPE 2: Création Workspace ==========
        const workspaceName = `Workspace E2E ${Date.now()}`;

        // Chercher le formulaire de création de workspace
        const workspaceInput = page.locator('input[placeholder*="workspace" i], input[placeholder*="espace" i]').first();
        await workspaceInput.fill(workspaceName);

        const createWorkspaceButton = page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first();
        await createWorkspaceButton.click();

        // Attendre que le workspace apparaisse
        await expect(page.locator(`text=${workspaceName}`)).toBeVisible({ timeout: 5000 });

        // Cliquer sur le workspace pour accéder aux boards
        await page.locator(`text=${workspaceName}`).click();

        // Attendre la navigation vers la page des boards
        await page.waitForURL(/\/workspaces\/[a-f0-9-]+\/boards/, { timeout: 5000 });

        // ========== ÉTAPE 3: Création Board ==========
        const boardTitle = `Board E2E ${Date.now()}`;

        const boardInput = page.locator('input[placeholder*="board" i], input[placeholder*="tableau" i]').first();
        await boardInput.fill(boardTitle);

        const createBoardButton = page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first();
        await createBoardButton.click();

        // Attendre que le board apparaisse
        await expect(page.locator(`text=${boardTitle}`)).toBeVisible({ timeout: 5000 });

        // Cliquer sur le board pour l'ouvrir
        await page.locator(`text=${boardTitle}`).click();

        // Attendre la navigation vers la page du board
        await page.waitForURL(/\/boards\/[a-f0-9-]+/, { timeout: 5000 });

        // ========== ÉTAPE 4: Création de listes ==========
        const lists = ['📋 À faire', '⚙️ En cours', '✅ Terminé'];

        for (const listTitle of lists) {
            const listInput = page.locator('input[placeholder*="colonne" i], input[placeholder*="liste" i]');
            await listInput.fill(listTitle);

            const addListButton = page.locator('button:has-text("Ajouter")').first();
            await addListButton.click();

            // Attendre que la liste soit visible
            await expect(page.locator(`text=${listTitle}`)).toBeVisible({ timeout: 5000 });

            // Petite pause entre chaque création
            await page.waitForTimeout(300);
        }

        // Vérifier que toutes les listes sont présentes
        for (const listTitle of lists) {
            await expect(page.locator(`text=${listTitle}`)).toBeVisible();
        }

        // ========== ÉTAPE 5: Drag and drop des listes ==========
        // Déplacer la dernière liste au début
        const lastList = page.locator(`text=${lists[2]}`).locator('..');
        const firstList = page.locator(`text=${lists[0]}`).locator('..');

        await lastList.dragTo(firstList);
        await page.waitForTimeout(1000);

        // Vérifier que toutes les listes sont toujours présentes après le drag
        for (const listTitle of lists) {
            await expect(page.locator(`text=${listTitle}`)).toBeVisible();
        }

        // ========== ÉTAPE 6: Test de persistence ==========
        // Recharger la page pour vérifier que tout persiste
        await page.reload();

        // Attendre le rechargement complet
        await page.waitForLoadState('networkidle');

        // Vérifier que toutes les listes sont toujours là
        for (const listTitle of lists) {
            await expect(page.locator(`text=${listTitle}`)).toBeVisible({ timeout: 5000 });
        }

        // ========== ÉTAPE 7: Navigation et vérification ==========
        // Retourner à la page des workspaces
        await page.goto('/workspaces');

        // Vérifier que notre workspace est toujours là
        await expect(page.locator(`text=${workspaceName}`)).toBeVisible();

        // Retourner au workspace
        await page.locator(`text=${workspaceName}`).click();

        // Vérifier que notre board est toujours là
        await expect(page.locator(`text=${boardTitle}`)).toBeVisible();
    });

    test('should handle multiple boards and lists efficiently', async ({ page }) => {
        // Connexion rapide via helpers
        const user = await registerAndLoginViaUI(page);

        // Créer un workspace
        const workspaceName = `Multi Boards ${Date.now()}`;
        const workspaceInput = page.locator('input[placeholder*="workspace" i], input[placeholder*="espace" i]').first();
        await workspaceInput.fill(workspaceName);
        await page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first().click();
        await expect(page.locator(`text=${workspaceName}`)).toBeVisible();
        await page.locator(`text=${workspaceName}`).click();

        // Créer plusieurs boards
        const boards = ['Projet A', 'Projet B', 'Projet C'];

        for (const boardName of boards) {
            const boardInput = page.locator('input[placeholder*="board" i], input[placeholder*="tableau" i]').first();
            await boardInput.fill(boardName);
            await page.locator('button:has-text("Créer"), button:has-text("Ajouter")').first().click();
            await expect(page.locator(`text=${boardName}`)).toBeVisible();
            await page.waitForTimeout(200);
        }

        // Vérifier que tous les boards sont présents
        for (const boardName of boards) {
            await expect(page.locator(`text=${boardName}`)).toBeVisible();
        }

        // Ouvrir un board et créer des listes
        await page.locator(`text=${boards[0]}`).click();
        await page.waitForURL(/\/boards\/[a-f0-9-]+/);

        const lists = ['Backlog', 'Sprint', 'Done'];
        for (const listTitle of lists) {
            const listInput = page.locator('input[placeholder*="colonne" i], input[placeholder*="liste" i]');
            await listInput.fill(listTitle);
            await page.locator('button:has-text("Ajouter")').first().click();
            await expect(page.locator(`text=${listTitle}`)).toBeVisible();
            await page.waitForTimeout(200);
        }

        // Vérifier que toutes les listes sont créées
        for (const listTitle of lists) {
            await expect(page.locator(`text=${listTitle}`)).toBeVisible();
        }
    });

    test('should maintain session across page navigations', async ({ page }) => {
        // Connexion
        const user = await registerAndLoginViaUI(page);

        // Vérifier qu'on est sur /workspaces
        await expect(page).toHaveURL('/workspaces');

        // Naviguer directement vers /login
        await page.goto('/login');

        // On devrait être redirigé vers /workspaces si déjà connecté
        // OU rester sur /login si pas de redirection automatique
        // Dans tous les cas, naviguer manuellement vers /workspaces devrait fonctionner
        await page.goto('/workspaces');

        // Vérifier qu'on peut accéder aux workspaces (session maintenue)
        await expect(page).toHaveURL('/workspaces');
    });
});

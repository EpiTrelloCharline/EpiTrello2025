# 🧪 Guide : Ajouter de nouveaux tests E2E

Ce guide vous explique comment étendre la suite de tests E2E Playwright.

---

## 📚 Table des matières

1. [Créer un nouveau test simple](#1-créer-un-nouveau-test-simple)
2. [Utiliser les fixtures d'authentification](#2-utiliser-les-fixtures-dauthentification)
3. [Utiliser les Page Objects](#3-utiliser-les-page-objects)
4. [Utiliser les helpers](#4-utiliser-les-helpers)
5. [Tester les API](#5-tester-les-api)
6. [Organiser les tests avec describe](#6-organiser-les-tests-avec-describe)
7. [Utiliser les steps pour la lisibilité](#7-utiliser-les-steps-pour-la-lisibilité)
8. [Ajouter des screenshots personnalisés](#8-ajouter-des-screenshots-personnalisés)

---

## 1. Créer un nouveau test simple

Créez un fichier `e2e/mon-test.spec.ts` :

```typescript
import { test, expect } from './fixtures';

test.describe('Mon nouveau test', () => {
  test('devrait faire quelque chose', async ({ authenticatedPage: page }) => {
    // Votre code de test ici
    await page.goto('/boards');
    await expect(page).toHaveURL(/.*boards/);
  });
});
```

**Points clés :**
- Importez toujours `test` et `expect` depuis `./fixtures`
- Utilisez `authenticatedPage` pour avoir un utilisateur déjà connecté
- Playwright attend automatiquement les éléments

---

## 2. Utiliser les fixtures d'authentification

### Authentification automatique (recommandé)
```typescript
import { test, expect } from './fixtures';

test('mon test', async ({ authenticatedPage: page }) => {
  // Page déjà authentifiée avec un utilisateur unique
  // Accédez directement aux routes protégées
  await page.goto('/workspaces');
  await expect(page.locator('h1')).toContainText('Workspaces');
});
```

### Sans authentification
```typescript
import { test as base, expect } from '@playwright/test';

test('page publique', async ({ page }) => {
  await page.goto('/login');
  // Test de la page de login
});
```

---

## 3. Utiliser les Page Objects

Les Page Objects rendent vos tests plus maintenables :

```typescript
import { test, expect } from './fixtures';
import { BoardPage, WorkspacesPage } from './page-objects';

test('exemple avec Page Objects', async ({ authenticatedPage: page }) => {
  const workspacesPage = new WorkspacesPage(page);
  const boardPage = new BoardPage(page);

  // Créer un workspace
  await workspacesPage.createWorkspace('Mon Workspace');

  // Créer des listes et cartes facilement
  await boardPage.createList('À faire');
  await boardPage.addCardToList('À faire', 'Ma tâche');
  
  // Drag & drop simplifié
  await boardPage.dragCardToList('Ma tâche', 'En cours');
  
  // Vérifier
  const list = page.locator('div:has-text("En cours")');
  await expect(list.locator('text=Ma tâche')).toBeVisible();
});
```

### Étendre les Page Objects

Ajoutez vos propres méthodes dans `e2e/page-objects.ts` :

```typescript
export class BoardPage {
  // ... méthodes existantes ...

  async archiveCard(cardTitle: string) {
    await this.openCard(cardTitle);
    await this.page.getByRole('button', { name: /archiver|archive/i }).click();
    await this.page.waitForTimeout(1000);
  }

  async addLabel(cardTitle: string, labelName: string) {
    await this.openCard(cardTitle);
    await this.page.getByRole('button', { name: /labels/i }).click();
    await this.page.locator(`text=${labelName}`).click();
  }
}
```

---

## 4. Utiliser les helpers

Les helpers fournissent des fonctions utilitaires réutilisables :

```typescript
import { test, expect } from './fixtures';
import { 
  waitForApiResponse, 
  takeScreenshot, 
  retry,
  generateTestData 
} from './helpers';

test('exemple avec helpers', async ({ authenticatedPage: page }) => {
  // Générer des données de test
  const boardName = generateTestData.boardName();
  
  // Attendre une requête API
  const responsePromise = waitForApiResponse(page, '/api/boards');
  await page.getByRole('button', { name: /créer board/i }).click();
  await responsePromise;
  
  // Prendre un screenshot personnalisé
  await takeScreenshot(page, 'après-création-board');
  
  // Retry une opération
  await retry(async () => {
    const element = page.locator('text=Mon Board');
    await expect(element).toBeVisible();
  });
});
```

### Ajouter vos propres helpers

Dans `e2e/helpers.ts` :

```typescript
/**
 * Vérifie qu'un élément contient un texte spécifique
 */
export async function expectTextInElement(
  page: Page,
  selector: string,
  expectedText: string
) {
  const element = page.locator(selector);
  await expect(element).toContainText(expectedText);
}

/**
 * Compte le nombre d'éléments correspondant à un sélecteur
 */
export async function countElements(page: Page, selector: string) {
  return page.locator(selector).count();
}
```

---

## 5. Tester les API

Tests API avec Playwright (plus rapides que les tests UI) :

```typescript
import { test, expect } from './fixtures';

test.describe('Tests API Cards', () => {
  let authToken: string;
  let workspaceId: string;
  let boardId: string;
  let listId: string;

  test.beforeAll(async ({ authenticatedPage: page }) => {
    // Récupérer le token
    authToken = await page.evaluate(() => 
      localStorage.getItem('accessToken') || ''
    );

    // Créer les ressources nécessaires
    const { request } = page;
    
    const wsRes = await request.post('http://localhost:3001/workspaces', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { name: 'Test Workspace' },
    });
    workspaceId = (await wsRes.json()).id;

    const boardRes = await request.post('http://localhost:3001/boards', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { name: 'Test Board', workspaceId },
    });
    boardId = (await boardRes.json()).id;

    const listRes = await request.post('http://localhost:3001/lists', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { title: 'Test List', boardId },
    });
    listId = (await listRes.json()).id;
  });

  test('devrait créer une carte', async ({ request }) => {
    const response = await request.post('http://localhost:3001/cards', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { title: 'Ma carte', listId },
    });

    expect(response.ok()).toBeTruthy();
    const card = await response.json();
    expect(card).toHaveProperty('id');
    expect(card.title).toBe('Ma carte');
  });

  test('devrait mettre à jour une carte', async ({ request }) => {
    // Créer une carte
    const createRes = await request.post('http://localhost:3001/cards', {
      headers: { 'Authorization': `Bearer ${authToken}` },
      data: { title: 'Carte originale', listId },
    });
    const card = await createRes.json();

    // Mettre à jour
    const updateRes = await request.patch(
      `http://localhost:3001/cards/${card.id}`,
      {
        headers: { 'Authorization': `Bearer ${authToken}` },
        data: { title: 'Carte modifiée' },
      }
    );

    expect(updateRes.ok()).toBeTruthy();
    const updated = await updateRes.json();
    expect(updated.title).toBe('Carte modifiée');
  });
});
```

---

## 6. Organiser les tests avec describe

Utilisez `describe` pour grouper vos tests :

```typescript
import { test, expect } from './fixtures';

test.describe('Gestion des cartes', () => {
  test.describe('Création de cartes', () => {
    test('devrait créer une carte simple', async ({ authenticatedPage }) => {
      // ...
    });

    test('devrait créer une carte avec description', async ({ authenticatedPage }) => {
      // ...
    });
  });

  test.describe('Modification de cartes', () => {
    test('devrait modifier le titre', async ({ authenticatedPage }) => {
      // ...
    });

    test('devrait modifier la description', async ({ authenticatedPage }) => {
      // ...
    });
  });
});
```

---

## 7. Utiliser les steps pour la lisibilité

Les steps rendent les rapports plus clairs :

```typescript
import { test, expect } from './fixtures';

test('flow complet avec steps', async ({ authenticatedPage: page }) => {
  await test.step('1. Créer un workspace', async () => {
    // Code pour créer le workspace
  });

  await test.step('2. Créer un board', async () => {
    // Code pour créer le board
  });

  await test.step('3. Ajouter une liste', async () => {
    // Code pour ajouter une liste
  });

  await test.step('4. Vérifier le résultat', async () => {
    // Assertions
    await expect(page.locator('text=Ma liste')).toBeVisible();
  });
});
```

**Avantages :**
- Meilleure lisibilité dans les rapports
- Facilite le debugging
- Permet de voir exactement où un test échoue

---

## 8. Ajouter des screenshots personnalisés

```typescript
import { test } from './fixtures';

test('avec screenshots', async ({ authenticatedPage: page }) => {
  // Screenshot avant l'action
  await page.screenshot({ 
    path: 'playwright-report/avant-action.png' 
  });

  // Action
  await page.click('button');

  // Screenshot après l'action
  await page.screenshot({ 
    path: 'playwright-report/apres-action.png',
    fullPage: true  // Capture toute la page
  });

  // Screenshot d'un élément spécifique
  await page.locator('.board').screenshot({ 
    path: 'playwright-report/board-only.png' 
  });
});
```

---

## 🎯 Exemple complet : Tester les labels

Créez `e2e/labels.spec.ts` :

```typescript
import { test, expect } from './fixtures';
import { BoardPage, WorkspacesPage } from './page-objects';
import { generateTestData } from './helpers';

test.describe('Gestion des labels', () => {
  test('devrait créer et assigner un label à une carte', async ({ authenticatedPage: page }) => {
    const workspacesPage = new WorkspacesPage(page);
    const boardPage = new BoardPage(page);

    // Setup
    await test.step('Créer workspace et board', async () => {
      await workspacesPage.createWorkspace(generateTestData.workspaceName());
      await page.getByRole('button', { name: /créer.*board/i }).click();
      await page.fill('input[name="name"]', generateTestData.boardName());
      await page.getByRole('button', { name: /créer/i }).last().click();
      await page.waitForURL(/.*boards/);
    });

    await test.step('Créer une liste et une carte', async () => {
      await boardPage.createList('To Do');
      await boardPage.addCardToList('To Do', 'Ma tâche');
    });

    await test.step('Créer un label', async () => {
      // Ouvrir les paramètres du board
      await page.getByRole('button', { name: /menu|settings/i }).click();
      await page.getByRole('button', { name: /labels/i }).click();
      
      // Créer un nouveau label
      await page.getByRole('button', { name: /nouveau label/i }).click();
      await page.fill('input[name="name"]', 'Important');
      await page.locator('[data-color="red"]').click();
      await page.getByRole('button', { name: /créer/i }).click();
      
      await expect(page.locator('text=Important')).toBeVisible();
    });

    await test.step('Assigner le label à la carte', async () => {
      await boardPage.openCard('Ma tâche');
      await page.getByRole('button', { name: /labels/i }).click();
      await page.locator('text=Important').click();
      
      // Vérifier que le label est assigné
      await expect(page.locator('.card-labels').locator('text=Important')).toBeVisible();
    });

    // Screenshot final
    await page.screenshot({ 
      path: 'playwright-report/carte-avec-label.png' 
    });
  });
});
```

---

## 🚀 Commandes pour tester

```bash
# Tester un fichier spécifique
pnpm exec playwright test mon-test.spec.ts

# Tester avec un pattern
pnpm exec playwright test --grep "labels"

# Mode UI pour développer
pnpm test:e2e:ui

# Mode debug
pnpm test:e2e:debug
```

---

**Bonne continuation avec vos tests ! 🎯**

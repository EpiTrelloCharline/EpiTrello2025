# Tests E2E avec Playwright

Ce projet contient des tests E2E (End-to-End) automatisés avec Playwright pour tester le flow complet de l'application EpiTrello.

## 📋 Prérequis

Avant d'exécuter les tests, assurez-vous que :

1. Les dépendances sont installées :
   ```bash
   pnpm install
   ```

2. **Les packages sont compilés (IMPORTANT) :**
   ```bash
   pnpm build
   ```
   Cela compile le package `@epitrello/validation` nécessaire à l'API.

3. L'API backend est démarrée :
   ```bash
   pnpm dev:api
   # ou: pnpm --filter api dev
   ```
   L'API doit être accessible sur `http://localhost:3001`

4. L'application web est démarrée :
   ```bash
   pnpm dev:web
   # ou: pnpm --filter web dev
   ```
   L'application doit être accessible sur `http://localhost:3000`

## 🚀 Installation des navigateurs Playwright

Première fois ? Installez les navigateurs nécessaires :

```bash
pnpm exec playwright install
```

Ou pour installer seulement Chromium :

```bash
pnpm exec playwright install chromium
```

## 🧪 Exécution des tests

### Exécuter tous les tests (mode headless)
```bash
pnpm test:e2e
```

### Exécuter les tests avec interface graphique
```bash
pnpm test:e2e:ui
```

### Exécuter les tests en mode headed (voir le navigateur)
```bash
pnpm test:e2e:headed
```

### Déboguer les tests
```bash
pnpm test:e2e:debug
```

### Exécuter un test spécifique
```bash
pnpm exec playwright test board-flow.spec.ts
```

## 📊 Rapport HTML

Après l'exécution des tests, un rapport HTML est automatiquement généré dans le dossier `playwright-report/`.

Pour visualiser le rapport :

```bash
pnpm test:e2e:report
```

Le rapport contient :
- ✅ Résultats de chaque test (succès/échec)
- 📸 Screenshots en cas d'échec
- 🎥 Vidéos des tests échoués
- 📝 Traces détaillées pour le debugging
- ⏱️ Temps d'exécution de chaque test

## 📁 Structure des tests

```
e2e/
├── fixtures.ts           # Fixtures personnalisées (authentification)
├── page-objects.ts       # Page Object Models pour la réutilisation
└── board-flow.spec.ts    # Test E2E complet du flow board → cartes
```

## 🎯 Scénario de test couvert

Le test `board-flow.spec.ts` couvre le flow complet suivant :

1. ✅ **Authentification** : Création automatique d'un utilisateur de test
2. ✅ **Création de workspace** : Création d'un nouveau workspace
3. ✅ **Création de board** : Création d'un nouveau board
4. ✅ **Création de listes** : Ajout de 3 listes (To Do, In Progress, Done)
5. ✅ **Ajout de cartes** : Création de 3 cartes dans la liste "To Do"
6. ✅ **Drag & Drop** : Déplacement de cartes entre les listes
7. ✅ **Modification de carte** : Édition du titre et de la description d'une carte

## ⚙️ Configuration

La configuration Playwright se trouve dans `playwright.config.ts`.

Vous pouvez personnaliser :
- Les timeouts
- Les navigateurs à tester
- Le nombre de workers (parallélisation)
- Les retries en cas d'échec
- Les options de rapport

## 🐛 Debugging

### Mode UI interactif
Le mode UI permet de :
- Voir les tests en temps réel
- Déboguer pas à pas
- Inspecter les locators
- Voir les screenshots

```bash
pnpm test:e2e:ui
```

### Mode Debug
Le mode debug permet de :
- Mettre des breakpoints
- Exécuter pas à pas
- Inspecter le DOM

```bash
pnpm test:e2e:debug
```

### Traces
En cas d'échec, les traces sont automatiquement enregistrées dans `test-results/`.
Vous pouvez les visualiser avec :

```bash
pnpm exec playwright show-trace test-results/[nom-du-test]/trace.zip
```

## 📝 Ajout de nouveaux tests

Pour ajouter de nouveaux tests :

1. Créez un fichier `.spec.ts` dans le dossier `e2e/`
2. Importez les fixtures et page objects
3. Écrivez vos tests avec `test()` et `expect()`

Exemple :

```typescript
import { test, expect } from './fixtures';

test.describe('Mon nouveau test', () => {
  test('devrait faire quelque chose', async ({ authenticatedPage: page }) => {
    // Votre test ici
    await page.goto('/boards');
    await expect(page).toHaveURL(/.*boards/);
  });
});
```

## 🔧 Variables d'environnement

Vous pouvez personnaliser l'URL de base en définissant la variable d'environnement :

```bash
BASE_URL=http://localhost:3000 pnpm test:e2e
```

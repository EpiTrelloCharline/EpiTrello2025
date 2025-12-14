# Tests E2E EpiTrello

Tests end-to-end automatisés pour l'application EpiTrello utilisant Playwright.

## Prérequis

- **Docker** démarré (Postgres, Redis, Mailhog)
- **API backend** en cours d'exécution sur `http://localhost:3001`
- **Frontend** en cours d'exécution sur `http://localhost:3000`
- **Node.js** et **pnpm** installés

## Installation

```bash
cd packages/e2e-tests
pnpm install
pnpm exec playwright install
```

## Lancement des services

Avant de lancer les tests, assurez-vous que tous les services sont démarrés :

**Terminal 1 - Docker:**
```bash
cd /home/charline/EpiTrello2025
sudo docker-compose up -d
```

**Terminal 2 - API:**
```bash
cd apps/api
pnpm install
pnpm prisma migrate dev
pnpm start:dev
```

**Terminal 3 - Frontend:**
```bash
cd apps/web
pnpm install
pnpm dev
```

## Lancer les tests

**Tous les tests:**
```bash
pnpm test
```

**Mode interactif (UI):**
```bash
pnpm test:ui
```

**Mode headed (navigateur visible):**
```bash
pnpm test:headed
```

**Test spécifique:**
```bash
pnpm test tests/board-creation.spec.ts
```

**Mode debug:**
```bash
pnpm test:debug
```

## Voir les rapports

Après exécution des tests, un rapport HTML est généré automatiquement :

```bash
pnpm test:report
```

Le rapport s'ouvrira dans votre navigateur par défaut. Il contient :
- ✅ Résultats de tous les tests
- 📸 Screenshots des échecs
- 🎥 Vidéos des tests en échec
- 📊 Traces détaillées pour debugging

Le rapport est disponible dans : `playwright-report/index.html`

## Structure des tests

```
tests/
├── helpers/
│   ├── auth.helper.ts       # Helpers d'authentification
│   └── api.helper.ts        # Helpers pour appels API
├── board-creation.spec.ts   # Tests création de boards
├── list-creation.spec.ts    # Tests création de listes
├── card-operations.spec.ts  # Tests opérations sur cartes
├── drag-and-drop.spec.ts    # Tests drag & drop
└── complete-workflow.spec.ts # Test workflow complet E2E
```

## Tests couverts

### 1. Création de Board (`board-creation.spec.ts`)
- ✅ Création d'un board via UI
- ✅ Navigation vers le board créé
- ✅ Affichage de plusieurs boards

### 2. Création de Liste (`list-creation.spec.ts`)
- ✅ Création d'une liste dans un board
- ✅ Création de plusieurs listes dans l'ordre
- ✅ Persistence des listes après rechargement
- ✅ Vidage du champ de saisie après création

### 3. Opérations sur Cartes (`card-operations.spec.ts`)
- ✅ Création de carte dans une liste
- ✅ Modification du titre de carte
- ✅ Modification de la description
- ✅ Persistence des modifications

### 4. Drag and Drop (`drag-and-drop.spec.ts`)
- ✅ Réorganisation des listes par drag & drop
- ✅ Persistence de l'ordre après rechargement
- ✅ Gestion de multiples opérations de drag
- ✅ Robustesse en cas de drag échoué

### 5. Workflow Complet (`complete-workflow.spec.ts`)
- ✅ Inscription/Connexion utilisateur
- ✅ Création workspace
- ✅ Création board
- ✅ Création de listes
- ✅ Drag and drop
- ✅ Vérification de persistence
- ✅ Navigation entre les pages

## Configuration

La configuration Playwright se trouve dans `playwright.config.ts`. Vous pouvez ajuster :

- **Timeout** : Durée maximale par test (défaut: 30s)
- **Retries** : Nombre de tentatives en cas d'échec (défaut: 1)
- **Workers** : Parallélisation des tests (défaut: 1)
- **Navigateurs** : Chromium, Firefox, Webkit

## Troubleshooting

### ❌ Erreur "Cannot connect to API"

Vérifiez que l'API est démarrée :
```bash
curl http://localhost:3001/auth/login
```

### ❌ Erreur "Page timeout"

- Augmentez le timeout dans `playwright.config.ts`
- Vérifiez que le frontend est accessible sur `http://localhost:3000`

### ❌ Tests qui échouent de manière intermittente

- Augmentez les `waitForTimeout` dans les tests
- Vérifiez les `waitForTimeout` et remplacez-les par des `waitFor` sur des éléments spécifiques

### ❌ Base de données corrompue

Réinitialisez la base :
```bash
cd apps/api
pnpm prisma migrate reset
pnpm prisma migrate dev
```

## Bonnes pratiques

1. **Isolation** : Chaque test crée ses propres données (users, workspaces, boards)
2. **Cleanup** : Les tests utilisent des emails/noms uniques pour éviter les conflits
3. **Attente** : Utiliser `waitFor` plutôt que `waitForTimeout` quand possible
4. **Assertions** : Toujours vérifier la visibilité des éléments avant interaction
5. **Screenshots** : Automatiquement capturés en cas d'échec

## CI/CD

Pour intégrer dans un pipeline CI/CD :

```yaml
- name: Run E2E Tests
  run: |
    docker-compose up -d
    cd apps/api && pnpm start:dev &
    cd apps/web && pnpm dev &
    cd packages/e2e-tests && pnpm test
```

## Ressources

- [Documentation Playwright](https://playwright.dev)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [Debugging Tests](https://playwright.dev/docs/debug)

# Guide Rapide - Tests E2E

## Démarrage Rapide

### 1. Installation des dépendances

```bash
cd packages/e2e-tests
pnpm install
pnpm exec playwright install chromium
```

### 2. Démarrer les services requis

**Terminal 1 - Docker:**
```bash
sudo docker-compose up -d
```

**Terminal 2 - API:**
```bash
cd apps/api
pnpm start:dev
```

**Terminal 3 - Frontend:**
```bash
cd apps/web
pnpm dev
```

### 3. Lancer les tests

**Option A - Script automatique (recommandé):**
```bash
cd packages/e2e-tests
./run-e2e-tests.sh
```

**Option B - Commandes manuelles:**
```bash
cd packages/e2e-tests

# Tous les tests
pnpm test

# Un seul fichier
pnpm test tests/board-creation.spec.ts

# Mode UI interactif
pnpm test:ui
```

### 4. Voir le rapport HTML

```bash
pnpm test:report
```

Le rapport s'ouvre automatiquement dans le navigateur.

## Structure des Tests

```
tests/
├── board-creation.spec.ts     (3 tests)
├── list-creation.spec.ts      (4 tests)
├── card-operations.spec.ts    (4 tests)
├── drag-and-drop.spec.ts      (4 tests)
└── complete-workflow.spec.ts  (3 tests)

Total: 19 tests
```

## Exemples de Commandes

```bash
# Lancer uniquement les tests de workflow complet
pnpm test tests/complete-workflow.spec.ts

# Lancer en mode debug (pause automatique)
pnpm test:debug tests/board-creation.spec.ts

# Lancer avec navigateur visible
pnpm test:headed

# Lancer tous les tests et voir le rapport
pnpm test && pnpm test:report
```

## Résultats Attendus

✅ **19 tests** doivent passer
📊 **Rapport HTML** généré dans `playwright-report/`
🎥 **Vidéos** des échecs (si applicable)
📸 **Screenshots** des échecs (si applicable)

## Troubleshooting Rapide

**Erreur: Cannot connect to API**
→ Vérifiez que l'API tourne: `curl http://localhost:3001`

**Erreur: Page timeout**
→ Vérifiez que le frontend tourne: `curl http://localhost:3000`

**Tests qui échouent aléatoirement**
→ Augmentez les timeouts dans `playwright.config.ts`

Pour plus de détails, consultez le [README.md](README.md) complet.

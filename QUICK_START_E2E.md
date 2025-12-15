# 🚀 Guide Rapide - Tests E2E Playwright

## Installation rapide

```bash
# 1. Installer les dépendances
pnpm install

# 2. Compiler les packages (IMPORTANT)
pnpm build

# 3. Installer les navigateurs Playwright
pnpm exec playwright install chromium
```

## Lancer les tests

### Option 1 : Script automatique (recommandé)
```bash
./run-e2e-tests.sh
```

Le script vérifie automatiquement que l'API et le frontend sont démarrés avant d'exécuter les tests.

**Options disponibles :**
- `./run-e2e-tests.sh` → Tests en mode headless
- `./run-e2e-tests.sh ui` → Mode UI interactif
- `./run-e2e-tests.sh headed` → Voir le navigateur
- `./run-e2e-tests.sh debug` → Mode debug
- `./run-e2e-tests.sh report` → Voir le rapport

### Option 2 : Manuellement

1. **Compiler les packages** (une fois)
   ```bash
   pnpm build
   ```

2. **Démarrer l'API** (terminal 1)
   ```bash
   pnpm dev:api
   ```

3. **Démarrer le frontend** (terminal 2)
   ```bash
   pnpm dev:web
   ```

4. **Exécuter les tests** (terminal 3)
   ```bash
   pnpm test:e2e
   ```

5. **Voir le rapport HTML**
   ```bash
   pnpm test:e2e:report
   ```

## 📊 Rapport HTML

Après l'exécution, le rapport se trouve dans `playwright-report/`.

Il contient :
- ✅ Résultats détaillés de chaque test
- 📸 Screenshots des échecs
- 🎥 Vidéos des tests échoués
- 📝 Traces pour le debugging
- ⏱️ Temps d'exécution

## 🎯 Tests disponibles

### `board-flow.spec.ts` - Test complet détaillé
Test E2E complet avec toutes les étapes :
1. ✅ Création workspace
2. ✅ Création board
3. ✅ Création de 3 listes
4. ✅ Ajout de 3 cartes
5. ✅ Drag & drop entre listes
6. ✅ Modification de carte

### `board-flow-simple.spec.ts` - Exemple avec Page Objects
Version simplifiée utilisant les Page Object Models.

## 🐛 En cas de problème

1. **Tests échouent** → Vérifiez que l'API et le frontend sont démarrés
2. **Navigateurs manquants** → `pnpm exec playwright install chromium`
3. **Port 3000/3001 occupé** → Libérez les ports ou modifiez `playwright.config.ts`

## 📚 Documentation complète

Voir `E2E_TESTS_README.md` pour plus de détails.

## ✨ Mode UI (recommandé pour développer)

```bash
pnpm test:e2e:ui
```

Permet de :
- ⏯️ Exécuter pas à pas
- 👁️ Voir les tests en direct
- 🔍 Inspecter les éléments
- 🐛 Déboguer facilement

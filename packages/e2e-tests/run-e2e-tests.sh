#!/bin/bash

# Script pour exécuter les tests E2E et générer le rapport HTML
# Usage: ./run-e2e-tests.sh

set -e

echo "🧪 EpiTrello - Exécution des Tests E2E"
echo "======================================"
echo ""

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: Veuillez exécuter ce script depuis packages/e2e-tests/"
    exit 1
fi

# Vérifier que l'API est disponible
echo "🔍 Vérification de l'API sur http://localhost:3001..."
if ! curl -s http://localhost:3001/auth/login -X POST -H "Content-Type: application/json" -d '{}' > /dev/null 2>&1; then
    echo "❌ Erreur: L'API n'est pas accessible sur http://localhost:3001"
    echo "   Veuillez démarrer l'API avec:"
    echo "   cd apps/api && pnpm start:dev"
    exit 1
fi
echo "✅ API disponible"

# Vérifier que le frontend est disponible
echo "🔍 Vérification du frontend sur http://localhost:3000..."
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "❌ Erreur: Le frontend n'est pas accessible sur http://localhost:3000"
    echo "   Veuillez démarrer le frontend avec:"
    echo "   cd apps/web && pnpm dev"
    exit 1
fi
echo "✅ Frontend disponible"

echo ""
echo "🚀 Lancement des tests E2E..."
echo ""

# Exécuter les tests
pnpm test

# Récupérer le code de sortie
TEST_EXIT_CODE=$?

echo ""
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "✅ Tous les tests ont réussi!"
else
    echo "⚠️  Certains tests ont échoué (code: $TEST_EXIT_CODE)"
fi

# Générer et ouvrir le rapport HTML
echo ""
echo "📊 Génération du rapport HTML..."
if [ -d "playwright-report" ]; then
    echo "✅ Rapport généré: playwright-report/index.html"
    echo ""
    echo "Pour voir le rapport, exécutez:"
    echo "  pnpm test:report"
    echo ""
    echo "Ou ouvrez directement:"
    echo "  firefox playwright-report/index.html"
else
    echo "⚠️  Aucun rapport trouvé"
fi

# Afficher le résumé
echo ""
echo "======================================"
echo "📝 Résumé"
echo "======================================"
echo "Tests exécutés: Voir le rapport HTML"
echo "Rapport: playwright-report/index.html"
echo "Résultats JSON: test-results.json"
echo ""

exit $TEST_EXIT_CODE

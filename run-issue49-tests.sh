#!/bin/bash

# Script to run E2E tests for EpiTrello
# Usage: ./run-issue49-tests.sh [options]

set -e

echo "=========================================="
echo "🧪 Tests E2E - Issue #49"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a service is accessible
check_service() {
    local url=$1
    local name=$2
    
    if curl -s --head --request GET "$url" | grep "200\|302\|404" > /dev/null; then
        echo -e "${GREEN}✓${NC} $name est accessible sur $url"
        return 0
    else
        echo -e "${RED}✗${NC} $name n'est PAS accessible sur $url"
        return 1
    fi
}

# Function to check if @epitrello/validation is compiled
check_validation_compiled() {
    if [ -d "packages/validation/dist" ] && [ "$(ls -A packages/validation/dist)" ]; then
        echo -e "${GREEN}✓${NC} Package @epitrello/validation est compilé"
        return 0
    else
        echo -e "${YELLOW}⚠${NC} Package @epitrello/validation n'est pas compilé"
        return 1
    fi
}

echo "📋 Vérification des prérequis..."
echo ""

# Verify @epitrello/validation package
if ! check_validation_compiled; then
    echo ""
    echo "Compilation du package @epitrello/validation..."
    pnpm build
    echo ""
fi

# Verify services
API_OK=false
WEB_OK=false

if check_service "http://localhost:3001/health" "API Backend"; then
    API_OK=true
fi

if check_service "http://localhost:3000" "Frontend Web"; then
    WEB_OK=true
fi

echo ""

# If services are not running, display commands
if [ "$API_OK" = false ] || [ "$WEB_OK" = false ]; then
    echo -e "${YELLOW}⚠ Certains services ne sont pas accessibles${NC}"
    echo ""
    echo "Lancez les services dans des terminaux séparés :"
    echo ""
    if [ "$API_OK" = false ]; then
        echo "  Terminal 1 (API) :"
        echo "  $ cd apps/api && pnpm run start:dev"
        echo ""
    fi
    if [ "$WEB_OK" = false ]; then
        echo "  Terminal 2 (Web) :"
        echo "  $ cd apps/web && pnpm run dev"
        echo ""
    fi
    echo "Puis relancez ce script."
    echo ""
    exit 1
fi

echo "=========================================="
echo "🚀 Lancement des tests..."
echo "=========================================="
echo ""

# Parse command line arguments
HEADED=""
DEBUG=""
WORKERS="1"

while [[ $# -gt 0 ]]; do
    case $1 in
        --headed)
            HEADED="--headed"
            shift
            ;;
        --debug)
            DEBUG="--debug"
            shift
            ;;
        --workers)
            WORKERS="$2"
            shift 2
            ;;
        *)
            echo "Option inconnue: $1"
            echo "Usage: $0 [--headed] [--debug] [--workers N]"
            exit 1
            ;;
    esac
done

# Run tests
echo "Exécution du test complet issue #49..."
echo ""

if [ -n "$DEBUG" ]; then
    pnpm exec playwright test complete-flow-issue49.spec.ts $DEBUG
elif [ -n "$HEADED" ]; then
    pnpm exec playwright test complete-flow-issue49.spec.ts $HEADED
else
    pnpm exec playwright test complete-flow-issue49.spec.ts --workers="$WORKERS"
fi

TEST_EXIT_CODE=$?

echo ""
echo "=========================================="

if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✅ Tests réussis !${NC}"
    echo "=========================================="
    echo ""
    echo "📊 Rapport HTML disponible :"
    echo "   pnpm exec playwright show-report"
    echo ""
    echo "🖼️  Screenshot final :"
    echo "   playwright-report/complete-flow-issue49-final.png"
    echo ""
    echo "📁 Résultats JSON :"
    echo "   playwright-report/results.json"
    echo ""
else
    echo -e "${RED}❌ Tests échoués${NC}"
    echo "=========================================="
    echo ""
    echo "🔍 Pour déboguer :"
    echo "   $0 --debug"
    echo ""
    echo "📹 Vidéos et screenshots disponibles dans :"
    echo "   test-results/"
    echo ""
fi

echo "=========================================="
exit $TEST_EXIT_CODE

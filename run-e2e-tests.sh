#!/bin/bash

# Script to run E2E tests for EpiTrello
# Usage: ./run-e2e-tests.sh [option]
# Options:
#   ui       - Run tests in interactive UI mode
#   headed   - Run tests in headed mode (visible browser)
#   debug    - Run tests in debug mode
#   report   - Show the HTML report
#   (empty)  - Run tests in headless mode (default)

set -e

# Colors for messages
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}=====================================${NC}"
echo -e "${BLUE}  Tests E2E Playwright - EpiTrello  ${NC}"
echo -e "${BLUE}=====================================${NC}\n"

# Check if the validation package is built
echo -e "${YELLOW}⏳ Vérification du package @epitrello/validation...${NC}"
if [ ! -d "packages/validation/dist" ]; then
    echo -e "${YELLOW}⚠️  Le package @epitrello/validation n'est pas compilé${NC}"
    echo -e "${YELLOW}💡 Compilation en cours...${NC}"
    pnpm build
    echo -e "${GREEN}✓ Package compilé${NC}\n"
else
    echo -e "${GREEN}✓ Package @epitrello/validation compilé${NC}\n"
fi

# Verify that the API is running
echo -e "${YELLOW}⏳ Vérification que l'API est accessible...${NC}"
if ! curl -s http://localhost:3001 > /dev/null 2>&1; then
    echo -e "${RED}❌ L'API n'est pas accessible sur http://localhost:3001${NC}"
    echo -e "${YELLOW}💡 Démarrez l'API avec: pnpm --filter api dev${NC}"
    exit 1
fi
echo -e "${GREEN}✓ API accessible${NC}\n"

# Verify that the frontend is running
echo -e "${YELLOW}⏳ Vérification que le frontend est accessible...${NC}"
if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${RED}❌ Le frontend n'est pas accessible sur http://localhost:3000${NC}"
    echo -e "${YELLOW}💡 Démarrez le frontend avec: pnpm --filter web dev${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Frontend accessible${NC}\n"

# Verify Playwright browsers are installed
if [ ! -d "$HOME/.cache/ms-playwright" ] && [ ! -d "$HOME/Library/Caches/ms-playwright" ]; then
    echo -e "${YELLOW}⚠️  Les navigateurs Playwright ne semblent pas installés${NC}"
    echo -e "${YELLOW}💡 Installation des navigateurs...${NC}"
    pnpm exec playwright install chromium
    echo -e "${GREEN}✓ Navigateurs installés${NC}\n"
fi

# Run tests based on the option
case "$1" in
    ui)
        echo -e "${BLUE}🚀 Lancement des tests en mode UI interactif...${NC}\n"
        pnpm test:e2e:ui
        ;;
    headed)
        echo -e "${BLUE}🚀 Lancement des tests en mode headed...${NC}\n"
        pnpm test:e2e:headed
        ;;
    debug)
        echo -e "${BLUE}🚀 Lancement des tests en mode debug...${NC}\n"
        pnpm test:e2e:debug
        ;;
    report)
        echo -e "${BLUE}📊 Ouverture du rapport HTML...${NC}\n"
        pnpm test:e2e:report
        ;;
    *)
        echo -e "${BLUE}🚀 Lancement des tests en mode headless...${NC}\n"
        pnpm test:e2e
        
        # If tests passed or failed, show appropriate message
        if [ $? -eq 0 ]; then
            echo -e "\n${GREEN}=====================================${NC}"
            echo -e "${GREEN}  ✓ Tous les tests ont réussi !${NC}"
            echo -e "${GREEN}=====================================${NC}\n"
            echo -e "${BLUE}📊 Pour voir le rapport HTML, exécutez:${NC}"
            echo -e "   ${YELLOW}pnpm test:e2e:report${NC}\n"
        else
            echo -e "\n${RED}=====================================${NC}"
            echo -e "${RED}  ✗ Certains tests ont échoué${NC}"
            echo -e "${RED}=====================================${NC}\n"
            echo -e "${BLUE}📊 Pour voir le rapport d'erreurs:${NC}"
            echo -e "   ${YELLOW}pnpm test:e2e:report${NC}\n"
        fi
        ;;
esac

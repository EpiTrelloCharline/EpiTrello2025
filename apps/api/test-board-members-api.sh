#!/bin/bash

# Script de test pour les endpoints Board Members API
# Usage: ./test-board-members-api.sh

# Configuration
API_URL="http://localhost:3001"
WORKSPACE_ID=""
BOARD_ID=""
TOKEN_OWNER=""
TOKEN_MEMBER=""
INVITE_EMAIL=""

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🧪 Tests API Board Members"
echo "================================"
echo ""

# Fonction pour afficher les résultats
print_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✓ $2${NC}"
    else
        echo -e "${RED}✗ $2${NC}"
    fi
}

# Test 1: Lister les membres d'un board (membre standard)
echo -e "${YELLOW}Test 1: GET /boards/:id/members (membre autorisé)${NC}"
if [ -z "$TOKEN_OWNER" ] || [ -z "$BOARD_ID" ]; then
    echo "⚠️  Veuillez configurer TOKEN_OWNER et BOARD_ID"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$API_URL/boards/$BOARD_ID/members" \
        -H "Authorization: Bearer $TOKEN_OWNER")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Liste des membres récupérée avec succès"
        echo "Réponse:"
        echo "$BODY" | jq '.'
    else
        print_result 1 "Erreur HTTP $HTTP_CODE"
        echo "$BODY"
    fi
fi
echo ""

# Test 2: Lister les membres sans être membre du board
echo -e "${YELLOW}Test 2: GET /boards/:id/members (non-membre)${NC}"
echo "Attendu: 403 Forbidden"
# À tester avec un token d'un utilisateur qui n'est pas membre du board
echo "⚠️  Test manuel requis avec un token d'utilisateur non-membre"
echo ""

# Test 3: Inviter un membre (OWNER)
echo -e "${YELLOW}Test 3: POST /boards/:id/invite (OWNER)${NC}"
if [ -z "$TOKEN_OWNER" ] || [ -z "$BOARD_ID" ] || [ -z "$INVITE_EMAIL" ]; then
    echo "⚠️  Veuillez configurer TOKEN_OWNER, BOARD_ID et INVITE_EMAIL"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/invite" \
        -H "Authorization: Bearer $TOKEN_OWNER" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$INVITE_EMAIL\", \"role\": \"MEMBER\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
        print_result 0 "Membre invité avec succès"
        echo "Réponse:"
        echo "$BODY" | jq '.'
    else
        print_result 1 "Erreur HTTP $HTTP_CODE"
        echo "$BODY"
    fi
fi
echo ""

# Test 4: Inviter un membre déjà présent
echo -e "${YELLOW}Test 4: POST /boards/:id/invite (membre déjà présent)${NC}"
echo "Attendu: 400 Bad Request"
if [ -z "$TOKEN_OWNER" ] || [ -z "$BOARD_ID" ] || [ -z "$INVITE_EMAIL" ]; then
    echo "⚠️  Veuillez configurer TOKEN_OWNER, BOARD_ID et INVITE_EMAIL"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/invite" \
        -H "Authorization: Bearer $TOKEN_OWNER" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$INVITE_EMAIL\", \"role\": \"MEMBER\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "400" ]; then
        print_result 0 "Erreur 400 correctement retournée (membre déjà présent)"
    else
        print_result 1 "Code HTTP inattendu: $HTTP_CODE"
    fi
    echo "$BODY"
fi
echo ""

# Test 5: Inviter un membre (MEMBER sans permissions)
echo -e "${YELLOW}Test 5: POST /boards/:id/invite (MEMBER sans permissions)${NC}"
echo "Attendu: 403 Forbidden"
if [ -z "$TOKEN_MEMBER" ] || [ -z "$BOARD_ID" ] || [ -z "$INVITE_EMAIL" ]; then
    echo "⚠️  Veuillez configurer TOKEN_MEMBER, BOARD_ID et INVITE_EMAIL"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/invite" \
        -H "Authorization: Bearer $TOKEN_MEMBER" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"test@example.com\", \"role\": \"MEMBER\"}")
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "403" ]; then
        print_result 0 "Erreur 403 correctement retournée (permissions insuffisantes)"
    else
        print_result 1 "Code HTTP inattendu: $HTTP_CODE"
    fi
    echo "$BODY"
fi
echo ""

# Test 6: Inviter un utilisateur inexistant
echo -e "${YELLOW}Test 6: POST /boards/:id/invite (utilisateur inexistant)${NC}"
echo "Attendu: 404 Not Found"
if [ -z "$TOKEN_OWNER" ] || [ -z "$BOARD_ID" ]; then
    echo "⚠️  Veuillez configurer TOKEN_OWNER et BOARD_ID"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/invite" \
        -H "Authorization: Bearer $TOKEN_OWNER" \
        -H "Content-Type: application/json" \
        -d '{"email": "nonexistent@example.com", "role": "MEMBER"}')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "404" ]; then
        print_result 0 "Erreur 404 correctement retournée (utilisateur inexistant)"
    else
        print_result 1 "Code HTTP inattendu: $HTTP_CODE"
    fi
    echo "$BODY"
fi
echo ""

# Test 7: Validation du format email
echo -e "${YELLOW}Test 7: POST /boards/:id/invite (email invalide)${NC}"
echo "Attendu: 400 Bad Request"
if [ -z "$TOKEN_OWNER" ] || [ -z "$BOARD_ID" ]; then
    echo "⚠️  Veuillez configurer TOKEN_OWNER et BOARD_ID"
else
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/boards/$BOARD_ID/invite" \
        -H "Authorization: Bearer $TOKEN_OWNER" \
        -H "Content-Type: application/json" \
        -d '{"email": "invalid-email", "role": "MEMBER"}')
    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
    BODY=$(echo "$RESPONSE" | sed '$d')
    
    if [ "$HTTP_CODE" = "400" ]; then
        print_result 0 "Erreur 400 correctement retournée (email invalide)"
    else
        print_result 1 "Code HTTP inattendu: $HTTP_CODE"
    fi
    echo "$BODY"
fi
echo ""

echo "================================"
echo "Tests terminés"

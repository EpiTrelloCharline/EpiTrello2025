#!/bin/bash

# Script de test rapide des permissions
# Ce script teste les scénarios de base

API_URL="http://localhost:3001"

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Test Rapide du Système de Permissions"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Test 1: Vérifier que l'API est accessible
echo "🔍 Test 1: Vérification de l'API..."
if curl -s -o /dev/null -w "%{http_code}" "$API_URL" | grep -q "404\|200"; then
    echo "✅ API accessible sur $API_URL"
else
    echo "❌ API non accessible. Assurez-vous qu'elle est démarrée."
    exit 1
fi
echo ""

# Test 2: Créer un utilisateur de test
echo "🔍 Test 2: Création d'un utilisateur de test..."
REGISTER_RESPONSE=$(curl -s -X POST "$API_URL/auth/register" \
    -H "Content-Type: application/json" \
    -d '{"email":"testuser'$(date +%s)'@test.com","name":"Test User","password":"test123"}')

if echo "$REGISTER_RESPONSE" | grep -q "accessToken"; then
    echo "✅ Utilisateur créé avec succès"
    TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"accessToken":"[^"]*' | cut -d'"' -f4)
    USER_ID=$(echo "$REGISTER_RESPONSE" | grep -o '"id":"[^"]*' | cut -d'"' -f4)
    echo "   User ID: $USER_ID"
else
    echo "⚠️  Réponse: $REGISTER_RESPONSE"
fi
echo ""

# Test 3: Tester l'accès sans token (devrait échouer)
echo "🔍 Test 3: Accès sans authentification..."
NO_AUTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/boards")
HTTP_CODE=$(echo "$NO_AUTH_RESPONSE" | tail -n1)

if [ "$HTTP_CODE" = "401" ]; then
    echo "✅ Accès refusé sans token (401) - Correct!"
else
    echo "⚠️  Status code: $HTTP_CODE (attendu: 401)"
fi
echo ""

# Test 4: Créer un workspace avec token
if [ ! -z "$TOKEN" ]; then
    echo "🔍 Test 4: Création d'un workspace..."
    WS_RESPONSE=$(curl -s -X POST "$API_URL/workspaces" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"name":"Test Workspace","description":"Test"}')
    
    if echo "$WS_RESPONSE" | grep -q '"id"'; then
        echo "✅ Workspace créé avec succès"
        WS_ID=$(echo "$WS_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
        echo "   Workspace ID: $WS_ID"
    else
        echo "⚠️  Réponse: $WS_RESPONSE"
    fi
    echo ""
    
    # Test 5: Créer un board
    if [ ! -z "$WS_ID" ]; then
        echo "🔍 Test 5: Création d'un board..."
        BOARD_RESPONSE=$(curl -s -X POST "$API_URL/boards" \
            -H "Authorization: Bearer $TOKEN" \
            -H "Content-Type: application/json" \
            -d '{"workspaceId":"'$WS_ID'","title":"Test Board"}')
        
        if echo "$BOARD_RESPONSE" | grep -q '"id"'; then
            echo "✅ Board créé avec succès"
            BOARD_ID=$(echo "$BOARD_RESPONSE" | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
            echo "   Board ID: $BOARD_ID"
        else
            echo "⚠️  Réponse: $BOARD_RESPONSE"
        fi
        echo ""
        
        # Test 6: Lire le board (devrait fonctionner - l'utilisateur est membre)
        if [ ! -z "$BOARD_ID" ]; then
            echo "🔍 Test 6: Lecture du board avec BoardReadGuard..."
            READ_RESPONSE=$(curl -s -w "\n%{http_code}" "$API_URL/boards/$BOARD_ID" \
                -H "Authorization: Bearer $TOKEN")
            HTTP_CODE=$(echo "$READ_RESPONSE" | tail -n1)
            
            if [ "$HTTP_CODE" = "200" ]; then
                echo "✅ Lecture autorisée (200) - BoardReadGuard fonctionne!"
            else
                echo "⚠️  Status code: $HTTP_CODE"
                echo "   Réponse: $(echo "$READ_RESPONSE" | head -n-1)"
            fi
            echo ""
            
            # Test 7: Créer une liste (devrait fonctionner - l'utilisateur est owner)
            echo "🔍 Test 7: Création d'une liste avec BoardWriteGuard..."
            LIST_RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$API_URL/lists" \
                -H "Authorization: Bearer $TOKEN" \
                -H "Content-Type: application/json" \
                -d '{"boardId":"'$BOARD_ID'","title":"Test List"}')
            HTTP_CODE=$(echo "$LIST_RESPONSE" | tail -n1)
            
            if [ "$HTTP_CODE" = "201" ] || [ "$HTTP_CODE" = "200" ]; then
                echo "✅ Liste créée (${HTTP_CODE}) - BoardWriteGuard fonctionne!"
                LIST_ID=$(echo "$LIST_RESPONSE" | head -n-1 | grep -o '"id":"[^"]*' | head -1 | cut -d'"' -f4)
                echo "   List ID: $LIST_ID"
            else
                echo "⚠️  Status code: $HTTP_CODE"
                echo "   Réponse: $(echo "$LIST_RESPONSE" | head -n-1)"
            fi
            echo ""
        fi
    fi
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  Tests Terminés"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Pour tester les permissions OBSERVER:"
echo "   1. Ouvrez Prisma Studio: cd apps/api && npx prisma studio"
echo "   2. Créez un autre utilisateur"
echo "   3. Ajoutez-le au board avec role='OBSERVER'"
echo "   4. Testez qu'il peut lire mais pas écrire"
echo ""

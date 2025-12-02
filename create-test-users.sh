#!/bin/bash

# Script pour créer des utilisateurs de test pour la fonctionnalité Board Members
# Usage: ./create-test-users.sh

echo "🚀 Création d'utilisateurs de test pour EpiTrello..."
echo ""

API_URL="http://localhost:3001"

# Couleurs pour l'affichage
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Fonction pour créer un utilisateur
create_user() {
    local name=$1
    local email=$2
    local password=$3
    
    echo -n "Création de $name ($email)... "
    
    response=$(curl -s -X POST "$API_URL/auth/register" \
        -H "Content-Type: application/json" \
        -d "{\"name\":\"$name\",\"email\":\"$email\",\"password\":\"$password\"}")
    
    if echo "$response" | grep -q "id"; then
        echo -e "${GREEN}✓ Créé${NC}"
        return 0
    elif echo "$response" | grep -q "already exists"; then
        echo -e "${YELLOW}⚠ Existe déjà${NC}"
        return 0
    else
        echo -e "${RED}✗ Erreur${NC}"
        echo "$response"
        return 1
    fi
}

# Vérifier que l'API est accessible
echo "Vérification de la connexion à l'API..."
if ! curl -s "$API_URL/auth/login" > /dev/null 2>&1; then
    echo -e "${RED}✗ L'API n'est pas accessible sur $API_URL${NC}"
    echo "Assurez-vous que le backend est lancé (cd apps/api && npm run start:dev)"
    exit 1
fi
echo -e "${GREEN}✓ API accessible${NC}"
echo ""

# Créer les utilisateurs de test
echo "Création des utilisateurs de test:"
echo "=================================="

create_user "Alice Admin" "alice@epitrello.com" "password123"
create_user "Bob Builder" "bob@epitrello.com" "password123"
create_user "Charlie Collaborateur" "charlie@epitrello.com" "password123"
create_user "Diana Developer" "diana@epitrello.com" "password123"
create_user "Eve Observer" "eve@epitrello.com" "password123"
create_user "Frank Frontend" "frank@epitrello.com" "password123"
create_user "Grace Backend" "grace@epitrello.com" "password123"

echo ""
echo "=================================="
echo -e "${GREEN}✓ Utilisateurs de test créés!${NC}"
echo ""
echo "📝 Identifiants de connexion (tous ont le mot de passe: password123):"
echo "  • alice@epitrello.com"
echo "  • bob@epitrello.com"
echo "  • charlie@epitrello.com"
echo "  • diana@epitrello.com"
echo "  • eve@epitrello.com"
echo "  • frank@epitrello.com"
echo "  • grace@epitrello.com"
echo ""
echo "🎯 Prochaines étapes:"
echo "  1. Connectez-vous sur http://localhost:3000"
echo "  2. Créez un workspace et un board"
echo "  3. Invitez ces utilisateurs à votre board"
echo "  4. Testez les différents rôles (OWNER, ADMIN, MEMBER, OBSERVER)"
echo ""

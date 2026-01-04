# Guide de test manuel - Checklists API

Ce guide vous aidera à tester manuellement tous les endpoints de l'API Checklists.

## Prérequis

1. Le serveur API doit être démarré (`npm run start:dev` dans `/apps/api`)
2. Vous devez avoir un token JWT valide
3. Vous devez avoir un ID de carte existante

## Variables d'environnement pour les tests

```bash
# Remplacez ces valeurs par les vôtres
export API_URL="http://localhost:3001"
export TOKEN="your_jwt_token_here"
export CARD_ID="your_card_id_here"
```

## Tests des endpoints Checklists

### 1. Créer une checklist

```bash
curl -X POST $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Ma première checklist"
  }'
```

**Résultat attendu:** 
- Status: 201 Created
- Retourne la checklist créée avec un ID, position = 0, et items = []

**Sauvegarder l'ID de la checklist:**
```bash
export CHECKLIST_ID="checklist_id_from_response"
```

---

### 2. Récupérer toutes les checklists d'une carte

```bash
curl -X GET $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN"
```

**Résultat attendu:**
- Status: 200 OK
- Retourne un tableau avec la checklist créée précédemment

---

### 3. Mettre à jour une checklist

```bash
curl -X PATCH $API_URL/checklists/$CHECKLIST_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Checklist renommée"
  }'
```

**Résultat attendu:**
- Status: 200 OK
- Le titre est mis à jour

---

## Tests des endpoints Items

### 4. Créer un item dans la checklist

```bash
curl -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Premier item à faire"
  }'
```

**Résultat attendu:**
- Status: 201 Created
- Retourne l'item créé avec checked = false, position = 0

**Sauvegarder l'ID de l'item:**
```bash
export ITEM_ID="item_id_from_response"
```

---

### 5. Créer plusieurs items

```bash
# Item 2
curl -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Deuxième item"
  }'

# Item 3
curl -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Troisième item"
  }'
```

**Vérification:**
```bash
curl -X GET $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN"
```

**Résultat attendu:**
- Les 3 items sont listés dans l'ordre (position croissante)

---

### 6. Cocher un item

```bash
curl -X PATCH $API_URL/checklist-items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "checked": true
  }'
```

**Résultat attendu:**
- Status: 200 OK
- L'item a maintenant checked = true

---

### 7. Renommer un item

```bash
curl -X PATCH $API_URL/checklist-items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Item renommé et coché"
  }'
```

**Résultat attendu:**
- Status: 200 OK
- Le contenu est mis à jour, checked reste à true

---

### 8. Décocher un item

```bash
curl -X PATCH $API_URL/checklist-items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "checked": false
  }'
```

**Résultat attendu:**
- Status: 200 OK
- L'item a maintenant checked = false

---

### 9. Supprimer un item

```bash
curl -X DELETE $API_URL/checklist-items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Résultat attendu:**
- Status: 200 OK
- L'item est supprimé

**Vérification:**
```bash
curl -X GET $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN"
```
L'item supprimé ne devrait plus apparaître.

---

### 10. Supprimer une checklist

```bash
curl -X DELETE $API_URL/checklists/$CHECKLIST_ID \
  -H "Authorization: Bearer $TOKEN"
```

**Résultat attendu:**
- Status: 200 OK
- La checklist et tous ses items restants sont supprimés

**Vérification finale:**
```bash
curl -X GET $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN"
```
La liste devrait être vide ou ne plus contenir la checklist supprimée.

---

## Tests de sécurité

### 11. Tester l'accès sans authentification

```bash
curl -X GET $API_URL/cards/$CARD_ID/checklists
```

**Résultat attendu:**
- Status: 401 Unauthorized

---

### 12. Tester l'accès à une carte d'un autre board

Créez une checklist avec un CARD_ID d'une carte sur laquelle vous n'avez pas de droits:

```bash
curl -X POST $API_URL/cards/invalid_card_id/checklists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test unauthorized"
  }'
```

**Résultats attendus:**
- Status: 403 Forbidden (si la carte existe mais vous n'y avez pas accès)
- Status: 404 Not Found (si la carte n'existe pas)

---

## Tests de validation

### 13. Créer une checklist sans titre

```bash
curl -X POST $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Résultat attendu:**
- Status: 400 Bad Request
- Message d'erreur de validation

---

### 14. Créer un item sans contenu

```bash
curl -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Résultat attendu:**
- Status: 400 Bad Request
- Message d'erreur de validation

---

### 15. Mettre à jour un item avec un type invalide

```bash
curl -X PATCH $API_URL/checklist-items/$ITEM_ID \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "checked": "not a boolean"
  }'
```

**Résultat attendu:**
- Status: 400 Bad Request
- Message d'erreur de validation

---

## Scénario complet

Voici un script bash complet pour tester tout le flux :

```bash
#!/bin/bash

# Configuration
export API_URL="http://localhost:3001"
export TOKEN="your_token_here"
export CARD_ID="your_card_id_here"

echo "=== Test Checklists API ==="
echo ""

# 1. Créer une checklist
echo "1. Création d'une checklist..."
RESPONSE=$(curl -s -X POST $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Tests automatisés"}')
echo $RESPONSE | jq .
CHECKLIST_ID=$(echo $RESPONSE | jq -r '.id')
echo "CHECKLIST_ID: $CHECKLIST_ID"
echo ""

# 2. Ajouter des items
echo "2. Ajout de 3 items..."
RESPONSE1=$(curl -s -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Écrire les tests"}')
ITEM_ID_1=$(echo $RESPONSE1 | jq -r '.id')

curl -s -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Exécuter les tests"}' | jq .

curl -s -X POST $API_URL/checklists/$CHECKLIST_ID/items \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content": "Corriger les bugs"}' | jq .
echo ""

# 3. Afficher la checklist
echo "3. Affichage de la checklist complète..."
curl -s -X GET $API_URL/cards/$CARD_ID/checklists \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

# 4. Cocher un item
echo "4. Cocher le premier item..."
curl -s -X PATCH $API_URL/checklist-items/$ITEM_ID_1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"checked": true}' | jq .
echo ""

# 5. Supprimer la checklist
echo "5. Suppression de la checklist..."
curl -s -X DELETE $API_URL/checklists/$CHECKLIST_ID \
  -H "Authorization: Bearer $TOKEN" | jq .
echo ""

echo "=== Tests terminés ==="
```

**Note:** Ce script nécessite `jq` pour formater le JSON. Installez-le avec `sudo apt install jq` ou `brew install jq`.

# 🧪 Guide de Test des Permissions

Ce document explique comment tester manuellement le système de permissions avec Postman, Thunder Client, ou Insomnia.

## 🚀 Lancement Rapide avec le Script Automatisé

**Le moyen le plus simple** est d'utiliser le script de test automatisé :

```bash
node test-permissions-complete.js
```

Ce script teste automatiquement **tous les scénarios** et affiche un rapport détaillé.

**Résultat attendu** : 20/20 tests passés ✅

---

## 📝 Tests Manuels avec Postman/Thunder Client

Si vous préférez tester manuellement avec un client HTTP, suivez ce guide.

### Prérequis

1. **API démarrée** : `cd apps/api && npm run start:dev`
2. **Client HTTP** : Postman, Thunder Client (VS Code), ou Insomnia
3. **Base de données** : Docker containers running

---

## Étape 1️⃣ : Créer les Utilisateurs

### 1.1 Créer OWNER

```http
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "owner@test.com",
  "name": "Owner User",
  "password": "test123"
}
```

**Réponse attendue** :
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cmim0nny1000c2l56gcsi4331",
    "email": "owner@test.com"
  }
}
```

📝 **Sauvegarder** : `accessToken` et `user.id`

### 1.2 Créer MEMBER

```http
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "member@test.com",
  "name": "Member User",
  "password": "test123"
}
```

📝 **Sauvegarder** : `accessToken` et `user.id`

### 1.3 Créer OBSERVER

```http
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "observer@test.com",
  "name": "Observer User",
  "password": "test123"
}
```

📝 **Sauvegarder** : `accessToken` et `user.id`

### 1.4 Créer NON-MEMBER

```http
POST http://localhost:3001/auth/register
Content-Type: application/json

{
  "email": "random@test.com",
  "name": "Random User",
  "password": "test123"
}
```

📝 **Sauvegarder** : `accessToken` et `user.id`

---

## Étape 2️⃣ : Créer Workspace et Board

### 2.1 Créer un Workspace

```http
POST http://localhost:3001/workspaces
Authorization: Bearer <OWNER_TOKEN>
Content-Type: application/json

{
  "name": "Test Workspace",
  "description": "Pour tester les permissions"
}
```

📝 **Sauvegarder** : `id` du workspace

### 2.2 Créer un Board

```http
POST http://localhost:3001/boards
Authorization: Bearer <OWNER_TOKEN>
Content-Type: application/json

{
  "workspaceId": "<WORKSPACE_ID>",
  "title": "Test Board"
}
```

📝 **Sauvegarder** : `id` du board

---

## Étape 3️⃣ : Ajouter les Membres au Board

### Option A : Via Prisma Studio (Recommandé)

```bash
cd apps/api
npx prisma studio
```

1. Ouvrir la table `BoardMember`
2. Cliquer sur "Add record"
3. Créer les entrées suivantes :

| boardId | userId | role |
|---------|--------|------|
| `<BOARD_ID>` | `<OWNER_USER_ID>` | `OWNER` |
| `<BOARD_ID>` | `<MEMBER_USER_ID>` | `MEMBER` |
| `<BOARD_ID>` | `<OBSERVER_USER_ID>` | `OBSERVER` |

⚠️ **Ne PAS ajouter** le NON-MEMBER au board !

### Option B : Via SQL (Alternative)

```sql
-- Connectez-vous à la base de données
INSERT INTO "BoardMember" ("id", "boardId", "userId", "role")
VALUES 
  (gen_random_uuid(), '<BOARD_ID>', '<OWNER_USER_ID>', 'OWNER'),
  (gen_random_uuid(), '<BOARD_ID>', '<MEMBER_USER_ID>', 'MEMBER'),
  (gen_random_uuid(), '<BOARD_ID>', '<OBSERVER_USER_ID>', 'OBSERVER');
```

---

## Étape 4️⃣ : Créer une Liste

```http
POST http://localhost:3001/lists
Authorization: Bearer <OWNER_TOKEN>
Content-Type: application/json

{
  "boardId": "<BOARD_ID>",
  "title": "Test List"
}
```

📝 **Sauvegarder** : `id` de la liste

---

## Étape 5️⃣ : Tester les Droits d'ÉCRITURE

### ✅ Test 1 : OWNER peut créer une carte

```http
POST http://localhost:3001/cards
Authorization: Bearer <OWNER_TOKEN>
Content-Type: application/json

{
  "listId": "<LIST_ID>",
  "title": "Card créée par OWNER"
}
```

**Résultat attendu** : ✅ Status 201, carte créée

---

### ✅ Test 2 : MEMBER peut créer une carte

```http
POST http://localhost:3001/cards
Authorization: Bearer <MEMBER_TOKEN>
Content-Type: application/json

{
  "listId": "<LIST_ID>",
  "title": "Card créée par MEMBER"
}
```

**Résultat attendu** : ✅ Status 201, carte créée

---

### ❌ Test 3 : OBSERVER ne peut PAS créer une carte

```http
POST http://localhost:3001/cards
Authorization: Bearer <OBSERVER_TOKEN>
Content-Type: application/json

{
  "listId": "<LIST_ID>",
  "title": "Card créée par OBSERVER"
}
```

**Résultat attendu** : ❌ Status 403
```json
{
  "statusCode": 403,
  "message": "Vous n'avez pas les droits pour cette action"
}
```

---

### ❌ Test 4 : NON-MEMBER ne peut PAS créer une carte

```http
POST http://localhost:3001/cards
Authorization: Bearer <NONMEMBER_TOKEN>
Content-Type: application/json

{
  "listId": "<LIST_ID>",
  "title": "Card créée par NON-MEMBER"
}
```

**Résultat attendu** : ❌ Status 403
```json
{
  "statusCode": 403,
  "message": "Vous n'êtes pas membre de ce board"
}
```

---

### ✅ Test 5 : MEMBER peut modifier une carte

```http
PATCH http://localhost:3001/cards/<CARD_ID>
Authorization: Bearer <MEMBER_TOKEN>
Content-Type: application/json

{
  "title": "Card modifiée par MEMBER"
}
```

**Résultat attendu** : ✅ Status 200, carte modifiée

---

### ❌ Test 6 : OBSERVER ne peut PAS modifier une carte

```http
PATCH http://localhost:3001/cards/<CARD_ID>
Authorization: Bearer <OBSERVER_TOKEN>
Content-Type: application/json

{
  "title": "Card modifiée par OBSERVER"
}
```

**Résultat attendu** : ❌ Status 403

---

### ✅ Test 7 : MEMBER peut supprimer une carte

```http
DELETE http://localhost:3001/cards/<CARD_ID>
Authorization: Bearer <MEMBER_TOKEN>
```

**Résultat attendu** : ✅ Status 200, carte supprimée

---

### ❌ Test 8 : OBSERVER ne peut PAS créer une liste

```http
POST http://localhost:3001/lists
Authorization: Bearer <OBSERVER_TOKEN>
Content-Type: application/json

{
  "boardId": "<BOARD_ID>",
  "title": "Liste créée par OBSERVER"
}
```

**Résultat attendu** : ❌ Status 403

---

## Étape 6️⃣ : Tester les Droits de LECTURE

### ✅ Test 9 : OWNER peut lire les cartes

```http
GET http://localhost:3001/cards?listId=<LIST_ID>
Authorization: Bearer <OWNER_TOKEN>
```

**Résultat attendu** : ✅ Status 200, liste des cartes

---

### ✅ Test 10 : MEMBER peut lire les cartes

```http
GET http://localhost:3001/cards?listId=<LIST_ID>
Authorization: Bearer <MEMBER_TOKEN>
```

**Résultat attendu** : ✅ Status 200, liste des cartes

---

### ✅ Test 11 : OBSERVER peut lire les cartes

```http
GET http://localhost:3001/cards?listId=<LIST_ID>
Authorization: Bearer <OBSERVER_TOKEN>
```

**Résultat attendu** : ✅ Status 200, liste des cartes

---

### ❌ Test 12 : NON-MEMBER ne peut PAS lire les cartes

```http
GET http://localhost:3001/cards?listId=<LIST_ID>
Authorization: Bearer <NONMEMBER_TOKEN>
```

**Résultat attendu** : ❌ Status 403

---

### ✅ Test 13 : OBSERVER peut lire le board

```http
GET http://localhost:3001/boards/<BOARD_ID>
Authorization: Bearer <OBSERVER_TOKEN>
```

**Résultat attendu** : ✅ Status 200, détails du board

---

### ❌ Test 14 : NON-MEMBER ne peut PAS lire le board

```http
GET http://localhost:3001/boards/<BOARD_ID>
Authorization: Bearer <NONMEMBER_TOKEN>
```

**Résultat attendu** : ❌ Status 403

---

## 📊 Tableau Récapitulatif

| Test | Endpoint | Rôle | Résultat Attendu |
|------|----------|------|------------------|
| 1 | POST /cards | OWNER | ✅ 201 |
| 2 | POST /cards | MEMBER | ✅ 201 |
| 3 | POST /cards | OBSERVER | ❌ 403 |
| 4 | POST /cards | NON-MEMBER | ❌ 403 |
| 5 | PATCH /cards/:id | MEMBER | ✅ 200 |
| 6 | PATCH /cards/:id | OBSERVER | ❌ 403 |
| 7 | DELETE /cards/:id | MEMBER | ✅ 200 |
| 8 | POST /lists | OBSERVER | ❌ 403 |
| 9 | GET /cards | OWNER | ✅ 200 |
| 10 | GET /cards | MEMBER | ✅ 200 |
| 11 | GET /cards | OBSERVER | ✅ 200 |
| 12 | GET /cards | NON-MEMBER | ❌ 403 |
| 13 | GET /boards/:id | OBSERVER | ✅ 200 |
| 14 | GET /boards/:id | NON-MEMBER | ❌ 403 |

---

## 🎯 Checklist de Vérification

- [ ] Les 4 utilisateurs sont créés
- [ ] Le workspace et le board sont créés
- [ ] Les membres sont ajoutés au board avec les bons rôles
- [ ] OWNER peut lire et écrire ✅
- [ ] MEMBER peut lire et écrire ✅
- [ ] OBSERVER peut lire mais PAS écrire ✅
- [ ] NON-MEMBER ne peut ni lire ni écrire ✅
- [ ] Les messages d'erreur sont en français ✅
- [ ] Les status codes sont corrects (200/201 pour succès, 403 pour refus) ✅

---

## 💡 Conseils Postman

### Créer des Environnements

Dans Postman, créez 4 environnements :

**Environment: OWNER**
- `token` = `<OWNER_TOKEN>`
- `boardId` = `<BOARD_ID>`
- `listId` = `<LIST_ID>`

**Environment: MEMBER**
- `token` = `<MEMBER_TOKEN>`
- `boardId` = `<BOARD_ID>`
- `listId` = `<LIST_ID>`

**Environment: OBSERVER**
- `token` = `<OBSERVER_TOKEN>`
- `boardId` = `<BOARD_ID>`
- `listId` = `<LIST_ID>`

**Environment: NON-MEMBER**
- `token` = `<NONMEMBER_TOKEN>`
- `boardId` = `<BOARD_ID>`
- `listId` = `<LIST_ID>`

### Utiliser les Variables

Dans vos requêtes :

```http
POST http://localhost:3001/cards
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "listId": "{{listId}}",
  "title": "Test Card"
}
```

Changez simplement d'environnement pour tester avec différents rôles !

---

## 🚀 Script Automatisé

Pour gagner du temps, utilisez le script de test complet :

```bash
node test-permissions-complete.js
```

Ce script :
- ✅ Crée automatiquement les 4 utilisateurs
- ✅ Crée le workspace et le board
- ✅ Ajoute les membres avec les bons rôles
- ✅ Exécute tous les tests (20 tests)
- ✅ Affiche un rapport détaillé

**Résultat attendu** : 20/20 tests passés ✅

---

**Dernière mise à jour** : 30 novembre 2025

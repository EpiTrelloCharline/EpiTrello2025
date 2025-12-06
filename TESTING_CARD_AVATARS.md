# 🧪 Guide de test - Avatars des membres sur les cartes

## Prérequis

Avant de tester, assurez-vous que :
- ✅ L'API backend est lancée (`pnpm run dev` dans `apps/api`)
- ✅ Le frontend est lancé (`pnpm run dev` dans `apps/web`)
- ✅ Vous avez un compte utilisateur et êtes connecté
- ✅ Vous avez au moins un board avec des listes
- ✅ Vous avez plusieurs utilisateurs dans votre base de données

## 🏗️ Configuration du test

### 1. Créer des utilisateurs de test (si nécessaire)

Si vous n'avez pas encore d'utilisateurs, créez-en quelques-uns :

```bash
# Depuis la racine du projet
./create-test-users.sh
```

Ou manuellement via l'API :
```bash
# Utilisateur 1
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@test.com",
    "password": "password123",
    "name": "John Doe"
  }'

# Utilisateur 2
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@test.com",
    "password": "password123",
    "name": "Jane Smith"
  }'

# Utilisateur 3
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice.wonderland@test.com",
    "password": "password123",
    "name": "Alice"
  }'

# Utilisateur 4 (sans nom)
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Ajouter des membres au board

Avant de pouvoir assigner des membres aux cartes, ajoutez-les au board :

```bash
# Récupérer votre token
TOKEN="your_access_token_here"

# Récupérer les IDs des utilisateurs
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/users | jq

# Ajouter un membre au board
curl -X POST http://localhost:3001/boards/{boardId}/members \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user_id_here",
    "role": "MEMBER"
  }'
```

### 3. Assigner des membres aux cartes

#### Option A : Via Prisma Studio (recommandé pour les tests)

```bash
# Depuis apps/api/
npx prisma studio
```

1. Ouvrez la table `_CardToUser` (table de jointure)
2. Créez de nouvelles relations entre Card et User
3. Ajoutez plusieurs UserIds pour une même CardId

#### Option B : Via SQL direct

```sql
-- Connectez-vous à votre base de données
psql -d your_database_name

-- Vérifier les IDs disponibles
SELECT id, title FROM "Card" LIMIT 5;
SELECT id, email, name FROM "User" LIMIT 5;

-- Assigner des membres à une carte
-- Note: La table _CardToUser est générée automatiquement par Prisma
-- Format: _CardToUser (A: Card.id, B: User.id)

-- Assigner 3 membres à la carte 1
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_1', 'user_id_1');
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_1', 'user_id_2');
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_1', 'user_id_3');

-- Assigner 5 membres à la carte 2 (pour tester "+2")
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_2', 'user_id_1');
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_2', 'user_id_2');
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_2', 'user_id_3');
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_2', 'user_id_4');
INSERT INTO "_CardToUser" ("A", "B") VALUES ('card_id_2', 'user_id_5');
```

---

## 🎯 Scénarios de test

### Test 1 : Carte sans membre ⭐

**Objectif** : Vérifier que les avatars ne s'affichent pas quand il n'y a pas de membre

**Étapes** :
1. Créez une nouvelle carte ou trouvez une carte sans membre
2. Ouvrez le board dans le navigateur
3. Observez la carte

**Résultat attendu** :
- ✅ Pas de section d'avatars visible sous le titre
- ✅ La carte affiche uniquement le titre et éventuellement les labels

---

### Test 2 : Carte avec 1 membre ⭐

**Objectif** : Vérifier l'affichage d'un seul avatar

**Étapes** :
1. Assignez 1 membre à une carte (via Prisma Studio)
2. Rafraîchissez le board dans le navigateur
3. Observez la carte

**Résultat attendu** :
- ✅ 1 avatar circulaire affiché
- ✅ Initiales correctes (ex: "JD" pour "John Doe")
- ✅ Couleur de fond cohérente
- ✅ Bordure blanche visible
- ✅ Hover : tooltip avec le nom complet

---

### Test 3 : Carte avec 2 membres ⭐⭐

**Objectif** : Vérifier l'affichage de plusieurs avatars avec overlap

**Étapes** :
1. Assignez 2 membres à une carte
2. Rafraîchissez le board
3. Observez la carte et l'espacement

**Résultat attendu** :
- ✅ 2 avatars affichés
- ✅ Légère superposition (negative margin)
- ✅ Chaque avatar a une couleur différente
- ✅ Les deux avatars restent cliquables/hover-able
- ✅ Tooltips fonctionnent pour les deux

---

### Test 4 : Carte avec 3 membres ⭐⭐

**Objectif** : Vérifier la limite de 3 avatars affichés

**Étapes** :
1. Assignez exactement 3 membres à une carte
2. Rafraîchissez le board
3. Observez la carte

**Résultat attendu** :
- ✅ Exactement 3 avatars affichés
- ✅ Pas de "+0" affiché
- ✅ Tous les avatars sont visibles et distincts
- ✅ Layout propre et aligné

---

### Test 5 : Carte avec 4+ membres ⭐⭐⭐

**Objectif** : Vérifier l'affichage du compteur "+X"

**Étapes** :
1. Assignez 5 membres à une carte
2. Rafraîchissez le board
3. Observez la carte et le compteur

**Résultat attendu** :
- ✅ Exactement 3 avatars affichés
- ✅ Un badge "+2" affiché après les avatars
- ✅ Le badge a un style distinct (fond gris)
- ✅ Hover sur "+2" : tooltip "2 autres membres"

---

### Test 6 : Initiales correctes ⭐⭐

**Objectif** : Vérifier la logique d'extraction des initiales

**Étapes** :
1. Créez/assignez des membres avec différents formats de noms :
   - Nom complet : "John Doe" → "JD"
   - Nom simple : "Alice" → "A"
   - Nom composé : "Jean-Pierre Dupont" → "JD"
   - Email seulement : "test@example.com" → "T"
2. Rafraîchissez le board
3. Vérifiez les initiales sur chaque carte

**Résultat attendu** :
- ✅ "John Doe" → "JD"
- ✅ "Alice" → "A"
- ✅ "Jean-Pierre Dupont" → "JD" (premier et dernier)
- ✅ "test@example.com" → "T"

---

**Bon test ! 🧪**

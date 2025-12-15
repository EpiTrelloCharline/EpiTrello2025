# 🧪 Tests Manuels - Board Members & Invite

## Pré-requis

Avant de commencer les tests, assurez-vous que :
- ✅ L'API backend est lancée (`cd apps/api && pnpm run start:dev`)
- ✅ L'application web est lancée (`cd apps/web && pnpm run dev`)
- ✅ Vous avez au moins 2 comptes utilisateurs créés
- ✅ Vous avez un workspace avec au moins un board

## Test 1 : Affichage des Membres

### Objectif
Vérifier que les membres du board sont correctement affichés

### Étapes
1. Se connecter avec un utilisateur
2. Naviguer vers un board
3. Observer le header du board

### Résultat attendu
- ✅ Les avatars des membres sont visibles
- ✅ Chaque avatar affiche les initiales correctes
- ✅ Les couleurs des avatars sont différentes
- ✅ Au hover, un tooltip apparaît avec le nom/email et le rôle
- ✅ Si plus de 5 membres, affichage du compteur "+X"

---

## Test 2 : Ouverture du Modal d'Invitation

### Objectif
Vérifier que le modal d'invitation s'ouvre correctement

### Étapes
1. Dans le header, cliquer sur le bouton "Inviter"

### Résultat attendu
- ✅ Le modal s'ouvre au-dessus du bouton
- ✅ Le modal contient :
  - Un titre "Inviter un membre"
  - Un input pour l'email
  - Un bouton "Inviter"
  - Un bouton "Annuler"
  - Une note informative
- ✅ Le focus est automatiquement sur l'input email

---

## Test 3 : Invitation d'un Utilisateur Existant

### Objectif
Inviter un utilisateur qui existe dans le système

### Étapes
1. Ouvrir le modal d'invitation
2. Entrer l'email d'un utilisateur existant (qui n'est pas déjà membre)
3. Cliquer sur "Inviter"

### Résultat attendu
- ✅ Un indicateur de chargement apparaît
- ✅ Un message de succès vert s'affiche : "Membre invité avec succès!"
- ✅ Le modal se ferme automatiquement après 2 secondes
- ✅ La liste des membres se rafraîchit
- ✅ Le nouvel avatar du membre apparaît dans la liste

---

## Test 4 : Invitation d'un Email Inexistant

### Objectif
Tenter d'inviter un utilisateur qui n'existe pas

### Étapes
1. Ouvrir le modal d'invitation
2. Entrer un email qui n'existe pas (ex: `nonexistent@test.com`)
3. Cliquer sur "Inviter"

### Résultat attendu
- ✅ Un message d'erreur rouge s'affiche
- ✅ Le message indique : "Utilisateur non trouvé. Cet email n'existe pas dans le système."
- ✅ Le modal reste ouvert
- ✅ L'input reste éditable

---

## Test 5 : Invitation d'un Membre Déjà Présent

### Objectif
Tenter d'inviter un utilisateur déjà membre du workspace

### Étapes
1. Ouvrir le modal d'invitation
2. Entrer l'email d'un utilisateur déjà membre
3. Cliquer sur "Inviter"

### Résultat attendu
- ✅ Un message d'erreur rouge s'affiche
- ✅ Le message indique : "Cet utilisateur est déjà membre du workspace."
- ✅ Le modal reste ouvert

---

## Test 6 : Annulation de l'Invitation

### Objectif
Vérifier que l'annulation fonctionne correctement

### Étapes
1. Ouvrir le modal d'invitation
2. Entrer un email (ou non)
3. Cliquer sur "Annuler"

### Résultat attendu
- ✅ Le modal se ferme immédiatement
- ✅ L'email entré est effacé
- ✅ Aucune erreur ou message ne persiste

---

## Test 7 : Affichage avec Plus de 5 Membres

### Objectif
Vérifier l'affichage du compteur "+X"

### Étapes
1. S'assurer que le board a plus de 5 membres
2. Observer le header

### Résultat attendu
- ✅ Les 5 premiers membres sont affichés
- ✅ Un avatar gris avec "+X" apparaît (X = nombre de membres restants)
- ✅ Le tooltip du "+X" affiche "+X autres membres"

---

## Test 8 : Génération des Initiales

### Objectif
Vérifier que les initiales sont correctement générées

### Cas à tester

#### Cas 1 : Nom complet (2+ mots)
- Utilisateur : "John Doe"
- Initiales attendues : "JD"

#### Cas 2 : Nom simple (1 mot)
- Utilisateur : "Alice"
- Initiales attendues : "A"

#### Cas 3 : Pas de nom (email seulement)
- Utilisateur : email "bob@test.com", name = null
- Initiales attendues : "B"

#### Cas 4 : Nom avec 3+ mots
- Utilisateur : "Jean Paul Martin"
- Initiales attendues : "JM" (premier + dernier)

---

## Test 9 : Permissions

### Objectif
Vérifier que seuls les OWNER/ADMIN peuvent inviter

### Étapes
1. Se connecter avec un utilisateur MEMBER (pas ADMIN/OWNER)
2. Naviguer vers un board
3. Tenter d'inviter un membre

### Résultat attendu
- ✅ Un message d'erreur approprié s'affiche
- ✅ Le message indique un problème de permissions
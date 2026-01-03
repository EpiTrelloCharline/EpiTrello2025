# Guide de Test - WebSocket Real-Time

## Prérequis

1. Base de données PostgreSQL en cours d'exécution
2. Backend API démarré
3. Frontend web démarré

## Démarrage

### Backend (Terminal 1)
```bash
cd apps/api
pnpm run start:dev
```

Le backend devrait démarrer sur `http://localhost:3001`

### Frontend (Terminal 2)
```bash
cd apps/web
pnpm run dev
```

Le frontend devrait démarrer sur `http://localhost:3000`

## Tests à effectuer

### 1. Test de connexion WebSocket

1. Ouvrez la console développeur (F12)
2. Connectez-vous à l'application
3. Ouvrez un board
4. Vérifiez dans la console les messages suivants:
   - "WebSocket connected"
   - "Joined board: [boardId]"

### 2. Test de création de carte en temps réel

**Étapes:**
1. Ouvrez le même board dans deux navigateurs/onglets différents (utilisez Chrome + Firefox ou mode incognito)
2. Connectez-vous avec des utilisateurs différents dans chaque navigateur
3. Dans le navigateur 1: Créez une nouvelle carte
4. Dans le navigateur 2: Observez la carte apparaître automatiquement sans refresh

**Attendu:** La carte apparaît instantanément dans le navigateur 2

### 3. Test de déplacement de carte en temps réel

**Étapes:**
1. Avec les deux navigateurs toujours ouverts sur le même board
2. Dans le navigateur 1: Déplacez une carte vers une autre liste (drag & drop)
3. Dans le navigateur 2: Observez la carte se déplacer automatiquement

**Attendu:** 
- La carte disparaît de la liste source et apparaît dans la liste destination
- L'animation est fluide (pas de saut)

### 4. Test de modification de carte en temps réel

**Étapes:**
1. Dans le navigateur 1: Cliquez sur une carte pour ouvrir les détails
2. Modifiez le titre ou la description
3. Sauvegardez avec le bouton "Enregistrer"
4. Dans le navigateur 2: Observez les modifications apparaître

**Attendu:** Le titre de la carte est mis à jour en temps réel

### 5. Test de gestion des conflits d'édition

**Étapes:**
1. Dans le navigateur 1: Ouvrez une carte en mode édition
2. Dans le navigateur 2: Ouvrez la même carte en mode édition
3. Dans le navigateur 2: Observez le bandeau jaune d'avertissement

**Attendu:**
- Un bandeau jaune s'affiche dans le navigateur 2
- Le message indique: "[Nom utilisateur] est en train d'éditer cette carte. Vos modifications pourraient être écrasées."

### 6. Test de création/suppression de liste en temps réel

**Étapes:**
1. Dans le navigateur 1: Créez une nouvelle liste
2. Dans le navigateur 2: Observez la liste apparaître
3. Dans le navigateur 1: Supprimez la liste
4. Dans le navigateur 2: Observez la liste disparaître

**Attendu:** Création et suppression visibles instantanément

### 7. Test du flux d'activités en temps réel

**Étapes:**
1. Dans le navigateur 1: Cliquez sur le bouton "Historique" pour ouvrir le panneau d'activités
2. Dans le navigateur 2: Effectuez plusieurs actions (créer carte, déplacer carte, etc.)
3. Dans le navigateur 1: Observez les activités apparaître en temps réel

**Attendu:**
- Les nouvelles activités apparaissent automatiquement
- Les activités s'affichent avec un scroll automatique

### 8. Test de déconnexion/reconnexion

**Étapes:**
1. Ouvrez un board
2. Dans la console réseau (Network tab), simulez une déconnexion en désactivant le réseau
3. Réactivez le réseau après quelques secondes
4. Effectuez une action (créer une carte)

**Attendu:**
- Socket.IO reconnecte automatiquement
- Les événements sont à nouveau reçus
- Message "WebSocket connected" dans la console

### 9. Test de performance (plusieurs utilisateurs)

**Étapes:**
1. Ouvrez le même board dans 3-4 onglets différents
2. Effectuez des actions rapides dans un onglet (créer 5-10 cartes rapidement)
3. Observez les autres onglets

**Attendu:**
- Toutes les cartes apparaissent dans tous les onglets
- Pas de lag significatif
- Pas de doublons

### 10. Test de filtrage (comportement désactivé pendant le filtrage)

**Étapes:**
1. Appliquez un filtre (recherche ou sélection de label/membre)
2. Essayez de déplacer une carte (drag & drop)

**Attendu:**
- Le drag & drop est désactivé pendant le filtrage
- Un message ou comportement empêche le déplacement

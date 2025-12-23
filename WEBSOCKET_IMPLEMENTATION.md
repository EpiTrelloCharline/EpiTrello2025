# WebSocket Real-Time Implementation

## Vue d'ensemble

Le système de temps réel a été implémenté en utilisant Socket.IO pour remplacer le polling et permettre des mises à jour en temps réel sur tous les boards.

## Architecture

### Backend (NestJS)

#### Gateway WebSocket (`apps/api/src/boards/boards.gateway.ts`)
- Point d'entrée pour toutes les connexions WebSocket
- Gère les salles (rooms) par board pour diffuser les événements uniquement aux utilisateurs concernés
- Implémente la gestion des conflits d'édition

#### Événements émis par le serveur:

1. **Card Events**
   - `cardCreated`: Quand une carte est créée
   - `cardMoved`: Quand une carte est déplacée (même liste ou entre listes)
   - `cardUpdated`: Quand une carte est modifiée (titre, description, etc.)
   - `cardDeleted`: Quand une carte est archivée/supprimée

2. **List Events**
   - `listCreated`: Quand une liste est créée
   - `listUpdated`: Quand une liste est modifiée (titre ou position)
   - `listDeleted`: Quand une liste est archivée/supprimée

3. **Activity Events**
   - `activityCreated`: Quand une nouvelle activité est enregistrée

4. **Editing Conflict Events**
   - `cardEditingStarted`: Quand un utilisateur commence à éditer une carte
   - `cardEditingEnded`: Quand un utilisateur finit d'éditer une carte

#### Services modifiés

Les services suivants ont été modifiés pour émettre des événements WebSocket:

1. **CardsService** (`apps/api/src/cards/cards.service.ts`)
   - Émet `cardCreated` après création
   - Émet `cardMoved` après déplacement
   - Émet `cardUpdated` après modification
   - Émet `cardDeleted` après archivage

2. **ListsService** (`apps/api/src/lists/lists.service.ts`)
   - Émet `listCreated` après création
   - Émet `listUpdated` après modification
   - Émet `listDeleted` après archivage

3. **ActivitiesService** (`apps/api/src/activities/activities.service.ts`)
   - Émet `activityCreated` après chaque activité enregistrée

### Frontend (Next.js)

#### WebSocket Context (`apps/web/app/context/WebSocketContext.tsx`)
- Gère la connexion WebSocket globale
- Fournit des méthodes pour rejoindre/quitter des boards
- Gère les conflits d'édition de cartes

#### Composants modifiés

1. **BoardPage** (`apps/web/app/boards/[id]/page.tsx`)
   - Rejoint automatiquement la salle du board via WebSocket
   - Écoute tous les événements de carte et de liste
   - Met à jour l'état local en temps réel

2. **ActivitySidebar** (`apps/web/app/boards/[id]/ActivitySidebar.tsx`)
   - Écoute les événements `activityCreated`
   - Affichage instantané des nouvelles activités

3. **CardDetailModal** (`apps/web/app/boards/[id]/CardDetailModal.tsx`)
   - Détecte les conflits d'édition
   - Affiche un avertissement si quelqu'un d'autre édite la carte
   - Notifie les autres utilisateurs de l'édition en cours

## Gestion des conflits

### Stratégie: "Last Write Wins" avec avertissement

1. **Détection**: Quand un utilisateur ouvre une carte pour l'éditer, le système notifie les autres utilisateurs
2. **Avertissement**: Les autres utilisateurs voient un bandeau jaune indiquant qui est en train d'éditer
3. **Résolution**: La dernière modification sauvegardée est celle qui persiste (pas de verrouillage bloquant)

### Implémentation

```typescript
// Lors de l'ouverture d'une carte
startEditingCard(boardId, cardId, userId, userName)
  .then(response => {
    if (response.conflict) {
      // Afficher l'avertissement
      setConflictEditor(response.editor);
    }
  });

// Lors de la fermeture
endEditingCard(boardId, cardId, userId);
```

## Rooms WebSocket

Les utilisateurs sont automatiquement ajoutés à une room spécifique au board:
- Format de room: `board:{boardId}`
- Permet de limiter la diffusion des événements aux utilisateurs concernés

## Avantages de l'implémentation

1. **Performance**: Moins de requêtes HTTP
2. **Temps réel**: Les changements sont visibles instantanément pour tous les utilisateurs
3. **Scalabilité**: Les WebSockets sont plus efficaces pour les mises à jour fréquentes
4. **UX améliorée**: Les utilisateurs voient les modifications des autres en temps réel
5. **Conflits gérés**: Système simple d'avertissement pour éviter les écrasements involontaires

## Configuration

### Backend
- Les WebSockets sont configurés dans `BoardsGateway`
- CORS est déjà configuré dans `main.ts`

### Frontend
- Variable d'environnement: `NEXT_PUBLIC_API_URL` (définie dans `.env.local`)
- Le provider WebSocket doit être dans le layout racine

## Utilisation

### Pour tester:
1. Ouvrez le même board dans deux navigateurs/onglets différents
2. Créez/déplacez/modifiez une carte dans un onglet
3. Observez les changements apparaître instantanément dans l'autre onglet
4. Ouvrez la même carte dans les deux onglets pour voir l'avertissement de conflit
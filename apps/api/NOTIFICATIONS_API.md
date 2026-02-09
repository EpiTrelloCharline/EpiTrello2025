# API Notifications

## Vue d'ensemble

L'API Notifications permet de notifier les utilisateurs des événements importants qui se produisent dans leurs boards (création de cartes, ajout de labels, etc.).

## Modèle de données

### Notification

```prisma
model Notification {
  id          String           @id @default(cuid())
  type        NotificationType
  message     String
  userId      String
  boardId     String
  entityId    String?          // ID de l'entité liée (carte, label, etc.)
  isRead      Boolean          @default(false)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  user        User             @relation(fields: [userId], references: [id], onDelete: Cascade)
  board       Board            @relation(fields: [boardId], references: [id], onDelete: Cascade)
}
```

### Types de notifications

```typescript
enum NotificationType {
  CARD_CREATED      // Carte créée
  CARD_UPDATED      // Carte mise à jour
  CARD_DELETED      // Carte archivée
  CARD_MOVED        // Carte déplacée
  LABEL_ADDED       // Label ajouté à une carte
  LABEL_REMOVED     // Label retiré d'une carte
  MEMBER_ADDED      // Membre ajouté au board
  MEMBER_REMOVED    // Membre retiré du board
  COMMENT_ADDED     // Commentaire ajouté
  ASSIGNED          // Utilisateur assigné à une carte
  MENTIONED         // Utilisateur mentionné dans un commentaire
  DUE_DATE_SOON     // Date d'échéance proche
  CHECKLIST_COMPLETED // Checklist terminée
}
```

## WebSocket (Push Notifications)

Les notifications sont automatiquement poussées via WebSocket quand l'utilisateur est connecté.

### Connexion

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001/notifications', {
  auth: {
    token: 'votre-jwt-token'
  }
});
```

### Événements reçus

| Événement | Description | Payload |
|-----------|-------------|---------|
| `notification` | Nouvelle notification | `{ id, type, message, ... }` |
| `unreadCount` | Compteur mis à jour | `{ count: number }` |
| `notificationRead` | Notification marquée lue | `{ notificationId }` |
| `allNotificationsRead` | Toutes lues | `{}` |

### Exemple d'utilisation

```javascript
socket.on('notification', (notification) => {
  console.log('Nouvelle notification:', notification);
  // Afficher une toast, mettre à jour l'UI, etc.
});

socket.on('unreadCount', ({ count }) => {
  // Mettre à jour le badge de notifications
  updateNotificationBadge(count);
});
```

## Endpoints

### GET /notifications

Récupère les notifications de l'utilisateur authentifié.

**Authentification:** Requise (JWT)

**Query Parameters:**
- `unreadOnly` (boolean, optionnel) - Retourner uniquement les notifications non lues
- `boardId` (string, optionnel) - Filtrer par board spécifique
- `limit` (number, optionnel, défaut: 50) - Nombre max de notifications à retourner
- `offset` (number, optionnel, défaut: 0) - Décalage pour la pagination

**Exemple de requête:**
```bash
GET /notifications?unreadOnly=true&limit=20
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
{
  "notifications": [
    {
      "id": "clx123abc",
      "type": "CARD_CREATED",
      "message": "Nouvelle carte \"Implémenter login\" créée dans \"To Do\"",
      "userId": "user123",
      "boardId": "board456",
      "entityId": "card789",
      "isRead": false,
      "createdAt": "2025-12-17T10:30:00Z",
      "updatedAt": "2025-12-17T10:30:00Z",
      "user": {
        "id": "user123",
        "email": "user@example.com",
        "name": "John Doe"
      },
      "board": {
        "id": "board456",
        "title": "Project Sprint 1"
      }
    }
  ],
  "total": 42,
  "hasMore": true
}
```

---

### GET /notifications/unread-count

Retourne le nombre de notifications non lues.

**Authentification:** Requise (JWT)

**Query Parameters:**
- `boardId` (string, optionnel) - Filtrer par board spécifique

**Exemple de requête:**
```bash
GET /notifications/unread-count
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
{
  "count": 5
}
```

---

### PATCH /notifications/:id/read

Marque une notification comme lue.

**Authentification:** Requise (JWT)

**Paramètres URL:**
- `id` (string, requis) - ID de la notification

**Exemple de requête:**
```bash
PATCH /notifications/clx123abc/read
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
{
  "message": "Notification marked as read"
}
```

---

### PATCH /notifications/mark-all-read

Marque toutes les notifications comme lues.

**Authentification:** Requise (JWT)

**Query Parameters:**
- `boardId` (string, optionnel) - Marquer uniquement les notifications d'un board spécifique

**Exemple de requête:**
```bash
PATCH /notifications/mark-all-read?boardId=board456
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
{
  "message": "All notifications marked as read"
}
```

---

### DELETE /notifications/:id

Supprime une notification.

**Authentification:** Requise (JWT)

**Paramètres URL:**
- `id` (string, requis) - ID de la notification

**Exemple de requête:**
```bash
DELETE /notifications/clx123abc
Authorization: Bearer <token>
```

**Réponse (200 OK):**
```json
{
  "message": "Notification deleted"
}
```

---

## Événements déclenchant des notifications

### Cartes

- **Création de carte** (`CARD_CREATED`)
  - Tous les membres du board sauf le créateur reçoivent une notification
  
- **Mise à jour de carte** (`CARD_UPDATED`)
  - Notifié quand la description change
  
- **Déplacement de carte** (`CARD_MOVED`)
  - Notifié quand une carte change de liste
  
- **Archivage de carte** (`CARD_DELETED`)
  - Notifié quand une carte est archivée

### Assignation de membres

- **Assignation à une carte** (`ASSIGNED`)
  - L'utilisateur assigné reçoit une notification
  - Auto-assignation ne déclenche pas de notification

- **Retrait d'une carte** (`MEMBER_REMOVED`)
  - L'utilisateur retiré reçoit une notification

### Mentions

- **Mention dans un commentaire** (`MENTIONED`)
  - Format: `@userId` dans le contenu du commentaire
  - L'utilisateur mentionné reçoit une notification

### Labels

- **Ajout de label** (`LABEL_ADDED`)
  - Tous les membres du board sauf l'auteur reçoivent une notification
  
- **Retrait de label** (`LABEL_REMOVED`)
  - Tous les membres du board sauf l'auteur reçoivent une notification

## Routes Card Members

### GET /cards/:id/members

Récupère les membres d'une carte.

**Authentification:** Requise (JWT)

**Réponse (200 OK):**
```json
[
  {
    "id": "user123",
    "name": "John Doe",
    "email": "john@example.com",
    "avatar": null
  }
]
```

---

### POST /cards/:id/members

Assigne un membre à une carte. Déclenche une notification `ASSIGNED`.

**Authentification:** Requise (JWT)

**Body:**
```json
{
  "userId": "user123"
}
```

**Réponse (200 OK):** La carte mise à jour avec ses membres.

---

### DELETE /cards/:id/members/:userId

Retire un membre d'une carte. Déclenche une notification `MEMBER_REMOVED`.

**Authentification:** Requise (JWT)

**Réponse (200 OK):** La carte mise à jour avec ses membres.

## Intégration Frontend

### Polling (Simple)

```typescript
// Récupérer les notifications toutes les 30 secondes
setInterval(async () => {
  const response = await fetch('/notifications?unreadOnly=true', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await response.json();
  updateNotificationBadge(data.total);
}, 30000);
```

### Afficher le compteur

```typescript
async function getUnreadCount() {
  const response = await fetch('/notifications/unread-count', {
    headers: { Authorization: `Bearer ${token}` }
  });
  const { count } = await response.json();
  return count;
}
```

### Marquer comme lu au clic

```typescript
async function markAsRead(notificationId: string) {
  await fetch(`/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` }
  });
}
```

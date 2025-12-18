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
  COMMENT_ADDED     // Commentaire ajouté (future feature)
}
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

### Labels

- **Ajout de label** (`LABEL_ADDED`)
  - Tous les membres du board sauf l'auteur reçoivent une notification
  
- **Retrait de label** (`LABEL_REMOVED`)
  - Tous les membres du board sauf l'auteur reçoivent une notification

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

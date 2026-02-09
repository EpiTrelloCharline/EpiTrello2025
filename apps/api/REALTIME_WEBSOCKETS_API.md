# API - Moteur Temps Réel (WebSockets)

## Vue d'ensemble

Cette documentation décrit l'implémentation du moteur temps réel utilisant WebSockets (Socket.io) pour l'application EpiTrello.

## Architecture

### Module Global WebSockets

Le module `WebSocketsModule` est un module global qui fournit le `WebSocketsGateway` à toute l'application.

```
apps/api/src/websockets/
├── index.ts                  # Exports
├── websockets.module.ts      # Module global
└── websockets.gateway.ts     # Gateway principal
```

## Configuration

Le gateway WebSocket est configuré avec les options suivantes :

```typescript
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/',
  transports: ['websocket', 'polling'],
})
```

## Événements WebSocket

### Événements de Connexion

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `joinBoard` | Client → Server | Rejoindre la room d'un board |
| `leaveBoard` | Client → Server | Quitter la room d'un board |
| `joinUserRoom` | Client → Server | Rejoindre la room personnelle (notifications) |
| `leaveUserRoom` | Client → Server | Quitter la room personnelle |

### Événements de Cartes

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `card_move` | Server → Client | Une carte a été déplacée |
| `card_created` | Server → Client | Une carte a été créée |
| `card_updated` | Server → Client | Une carte a été mise à jour |
| `card_deleted` | Server → Client | Une carte a été supprimée |

### Événements de Commentaires

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `comment_add` | Server → Client | Un commentaire a été ajouté |
| `comment_updated` | Server → Client | Un commentaire a été modifié |
| `comment_deleted` | Server → Client | Un commentaire a été supprimé |

### Événements de Notifications

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `notification_new` | Server → Client | Nouvelle notification |

### Événements de Listes

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `list_created` | Server → Client | Une liste a été créée |
| `list_updated` | Server → Client | Une liste a été mise à jour |
| `list_deleted` | Server → Client | Une liste a été supprimée |

### Événements de Board

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `board_updated` | Server → Client | Le board a été mis à jour |

### Événements d'Édition Collaborative

| Événement | Direction | Description |
|-----------|-----------|-------------|
| `startEditingCard` | Client → Server | Début d'édition d'une carte |
| `endEditingCard` | Client → Server | Fin d'édition d'une carte |
| `cardEditingStarted` | Server → Client | Un utilisateur commence à éditer |
| `cardEditingEnded` | Server → Client | Un utilisateur termine l'édition |

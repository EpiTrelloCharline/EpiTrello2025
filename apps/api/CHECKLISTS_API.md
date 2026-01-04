# API Checklists Documentation

## Vue d'ensemble

L'API Checklists permet de gérer les listes de vérification (checklists) et leurs items associés aux cartes du board.

## Modèles de données

### Checklist
```typescript
{
  id: string          // ID unique (cuid)
  cardId: string      // ID de la carte parente
  title: string       // Titre de la checklist
  position: Decimal   // Position pour l'ordre d'affichage
  createdAt: DateTime
  updatedAt: DateTime
  items: ChecklistItem[] // Items de la checklist
}
```

### ChecklistItem
```typescript
{
  id: string          // ID unique (cuid)
  checklistId: string // ID de la checklist parente
  content: string     // Contenu de l'item
  checked: boolean    // État coché/décoché (default: false)
  position: Decimal   // Position pour l'ordre d'affichage
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Endpoints

### Checklists

#### GET /cards/:id/checklists
Récupère toutes les checklists d'une carte.

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de la carte

**Réponse:** `200 OK`
```json
[
  {
    "id": "checklist_id",
    "cardId": "card_id",
    "title": "To Do List",
    "position": 0,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "items": [
      {
        "id": "item_id",
        "checklistId": "checklist_id",
        "content": "Task 1",
        "checked": false,
        "position": 0,
        "createdAt": "2026-01-01T00:00:00.000Z",
        "updatedAt": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
]
```

**Erreurs possibles:**
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cette carte
- `404 Not Found` - Carte non trouvée

---

#### POST /cards/:id/checklists
Crée une nouvelle checklist pour une carte.

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de la carte

**Body:**
```json
{
  "title": "To Do List"
}
```

**Validation:**
- `title` : string, requis, non vide

**Réponse:** `201 Created`
```json
{
  "id": "checklist_id",
  "cardId": "card_id",
  "title": "To Do List",
  "position": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "items": []
}
```

**Erreurs possibles:**
- `400 Bad Request` - Données de validation invalides
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cette carte
- `404 Not Found` - Carte non trouvée

---

#### PATCH /checklists/:id
Met à jour une checklist.

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de la checklist

**Body:**
```json
{
  "title": "Updated Title"
}
```

**Validation:**
- `title` : string, optionnel

**Réponse:** `200 OK`
```json
{
  "id": "checklist_id",
  "cardId": "card_id",
  "title": "Updated Title",
  "position": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z",
  "items": []
}
```

**Erreurs possibles:**
- `400 Bad Request` - Données de validation invalides
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cette checklist
- `404 Not Found` - Checklist non trouvée

---

#### DELETE /checklists/:id
Supprime une checklist et tous ses items.

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de la checklist

**Réponse:** `200 OK`
```json
{
  "id": "checklist_id",
  "cardId": "card_id",
  "title": "To Do List",
  "position": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**Erreurs possibles:**
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cette checklist
- `404 Not Found` - Checklist non trouvée

---

### Items de Checklist

#### POST /checklists/:id/items
Ajoute un item à une checklist.

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de la checklist

**Body:**
```json
{
  "content": "Complete documentation"
}
```

**Validation:**
- `content` : string, requis, non vide

**Réponse:** `201 Created`
```json
{
  "id": "item_id",
  "checklistId": "checklist_id",
  "content": "Complete documentation",
  "checked": false,
  "position": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**Erreurs possibles:**
- `400 Bad Request` - Données de validation invalides
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cette checklist
- `404 Not Found` - Checklist non trouvée

---

#### PATCH /checklist-items/:id
Met à jour un item de checklist (cocher/décocher, renommer).

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de l'item

**Body:**
```json
{
  "content": "Updated content",
  "checked": true
}
```

**Validation:**
- `content` : string, optionnel
- `checked` : boolean, optionnel

**Réponse:** `200 OK`
```json
{
  "id": "item_id",
  "checklistId": "checklist_id",
  "content": "Updated content",
  "checked": true,
  "position": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**Erreurs possibles:**
- `400 Bad Request` - Données de validation invalides
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cet item
- `404 Not Found` - Item non trouvé

---

#### DELETE /checklist-items/:id
Supprime un item de checklist.

**Authentification:** Requise (JWT)

**Paramètres:**
- `id` (path) - ID de l'item

**Réponse:** `200 OK`
```json
{
  "id": "item_id",
  "checklistId": "checklist_id",
  "content": "Task to remove",
  "checked": false,
  "position": 0,
  "createdAt": "2026-01-01T00:00:00.000Z",
  "updatedAt": "2026-01-01T00:00:00.000Z"
}
```

**Erreurs possibles:**
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas accès à cet item
- `404 Not Found` - Item non trouvé

---

## Sécurité et Permissions

Tous les endpoints vérifient que l'utilisateur est membre du board auquel appartient la carte avant d'autoriser toute opération.

La hiérarchie des vérifications est :
1. **Card** → List → Board → Members
2. **Checklist** → Card → List → Board → Members
3. **ChecklistItem** → Checklist → Card → List → Board → Members


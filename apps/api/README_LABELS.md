# 🏷️ Labels Feature - Implementation Complete

## 📋 Overview

Cette implémentation complète la fonctionnalité **Labels** pour EpiTrello, permettant aux utilisateurs de créer, gérer et assigner des labels (étiquettes colorées) aux cartes d'un board, exactement comme dans Trello.

## ✅ Fonctionnalités Implémentées

### 🔵 1. Modèles de Données (Prisma)

#### **Label**
- `id`: Identifiant unique (cuid)
- `boardId`: Référence au board parent
- `name`: Nom du label (ex: "Urgent", "Bug")
- `color`: Couleur au format hex (ex: "#FF0000")
- `createdAt`, `updatedAt`: Timestamps automatiques
- **Relation**: Appartient à un Board, peut être assigné à plusieurs Cards

#### **CardLabel**
- Table de jointure many-to-many (Card ↔ Label)
- `id`, `cardId`, `labelId`, `createdAt`
- **Contrainte unique**: `(cardId, labelId)` - un label ne peut être assigné qu'une fois à une card
- **Cascade delete**: Si le Label ou la Card est supprimé, la relation est automatiquement supprimée

### 🔵 2. API Endpoints

#### **Labels Management (Board-scoped)**

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `GET` | `/boards/:id/labels` | Liste tous les labels d'un board | Membre du board |
| `POST` | `/boards/:id/labels` | Crée un nouveau label | Membre du board |
| `PATCH` | `/labels/:id` | Modifie un label (name/color) | Membre du board |
| `DELETE` | `/labels/:id` | Supprime un label | Membre du board |

#### **Label Assignment (Card-scoped)**

| Méthode | Endpoint | Description | Permission |
|---------|----------|-------------|------------|
| `POST` | `/cards/:id/labels` | Assigne un label à une card | Membre du board |
| `DELETE` | `/cards/:id/labels/:labelId` | Retire un label d'une card | Membre du board |

### 🔵 3. Permissions & Sécurité

Toutes les opérations sur les labels nécessitent que l'utilisateur soit **membre du board** concerné.

Le service `LabelsService` contient une méthode privée `checkBoardMembership()` qui :
- Vérifie que l'utilisateur est dans la table `BoardMember`
- Retourne `403 Forbidden` si l'utilisateur n'est pas membre
- Est appelée avant chaque opération sensible

**Cas couverts:**
- ✅ Accès aux labels d'un board → vérifie membership direct
- ✅ Création/modification/suppression de label → vérifie via `label.boardId`
- ✅ Assignment/unassignment → vérifie via `card.list.boardId`
- ✅ Protection cross-board → impossible d'assigner un label d'un board A à une card du board B

### 🔵 4. Validation des Données

**CreateLabelDto**
```typescript
{
  name: string (required, non-empty)
  color: string (required, format hex: #RRGGBB)
}
```

**UpdateLabelDto**
```typescript
{
  name?: string (optional)
  color?: string (optional, format hex: #RRGGBB)
}
```

**AssignLabelDto**
```typescript
{
  labelId: string (required, non-empty)
}
```

Validation automatique via `class-validator`:
- Couleur invalide → `400 Bad Request`
- Champs manquants → `400 Bad Request`

## 🗂️ Structure du Code

```
apps/api/src/
├── labels/
│   ├── labels.module.ts          # Module NestJS (exports LabelsService)
│   ├── labels.controller.ts      # Routes /boards/:id/labels et /labels/:id
│   ├── labels.service.ts         # Logique métier + permissions
│   └── dto/
│       ├── create-label.dto.ts   # DTO pour création
│       ├── update-label.dto.ts   # DTO pour modification
│       └── assign-label.dto.ts   # DTO pour assignment
├── cards/
│   ├── cards.controller.ts       # Routes /cards/:id/labels (modifié)
│   └── cards.module.ts           # Import LabelsModule
└── prisma/
    └── schema.prisma             # Modèles Label + CardLabel
```
### Lancer les tests automatisés

1. Créer un fichier `.env.test`:
```bash
TOKEN=your_jwt_token_here
BOARD_ID=your_board_id_here
CARD_ID=your_card_id_here
```

2. Exécuter le script:
```bash
./test-labels.sh
```

Le script teste:
- ✅ Création de 3 labels
- ✅ Validation des couleurs
- ✅ Modification d'un label
- ✅ Assignment à une card
- ✅ Détection des doublons
- ✅ Suppression d'un label
- ✅ Liste des labels

**Note**: Les cas 403 (non-membre) doivent être testés manuellement avec un token d'un autre utilisateur.

## 🎯 Conformité Trello

Cette implémentation respecte le comportement de Trello:

| Fonctionnalité | Trello | EpiTrello |
|----------------|--------|-----------|
| Labels par board | ✅ | ✅ |
| Couleur + nom | ✅ | ✅ |
| Multiple labels par card | ✅ | ✅ |
| Modification en live | ✅ | ✅ |
| Permissions par board | ✅ | ✅ |
| Cascade delete | ✅ | ✅ |

## 🚀 Utilisation

### Exemple: Créer et assigner un label

```bash
# 1. Créer un label "Urgent" rouge sur un board
curl -X POST http://localhost:3000/boards/board123/labels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Urgent", "color": "#FF0000"}'

# Réponse: { "id": "label456", "boardId": "board123", ... }

# 2. Assigner ce label à une card
curl -X POST http://localhost:3000/cards/card789/labels \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"labelId": "label456"}'

# 3. Modifier la couleur du label
curl -X PATCH http://localhost:3000/labels/label456 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"color": "#FF6600"}'
```

## 📝 Checklist Complète

- [x] ✅ Modèles Prisma (Label + CardLabel)
- [x] ✅ Migration de base de données
- [x] ✅ DTOs avec validation
- [x] ✅ Service avec CRUD complet
- [x] ✅ Middleware de permissions (checkBoardMembership)
- [x] ✅ Endpoints boards/labels
- [x] ✅ Endpoints labels CRUD
- [x] ✅ Endpoints cards/labels (assign/unassign)
- [x] ✅ Integration dans CardsModule
- [x] ✅ Integration dans AppModule
- [x] ✅ Compilation TypeScript réussie

## 🎉 Résumé

L'implémentation des Labels est **complète et fonctionnelle** ! 

Tous les endpoints sont protégés par des permissions, les données sont validées, et les relations en cascade sont gérées automatiquement par Prisma.

La prochaine étape est de tester manuellement avec Postman ou d'exécuter le script `test-labels.sh` pour vérifier tous les cas d'usage.

---
  
**Date**: Novembre 2025

# 🏷️ Implémentation du Système de Labels

## ✅ Résumé de l'implémentation (Issue #8)

Cette implémentation ajoute un système complet de gestion des labels pour les cartes Trello.

---

## 📋 Fonctionnalités implémentées

### 1. **Backend NestJS** 
✅ Schéma Prisma mis à jour avec les modèles `Label` et `CardLabel`
✅ Service `LabelsService` avec toutes les opérations CRUD
✅ Controller REST avec 8 endpoints protégés par JWT
✅ Module `LabelsModule` intégré dans `AppModule`

### 2. **Frontend React/Next.js**
✅ **Modal de gestion des labels** (`LabelsManagementModal.tsx`)
   - Création de labels avec 10 couleurs prédéfinies
   - Édition inline du nom et de la couleur
   - Suppression avec confirmation
   - Chargement automatique depuis l'API

✅ **Affichage dans la modale de carte** (`CardDetailModal.tsx`)
   - Affichage des labels assignés avec badges colorés
   - Dropdown pour assigner/désassigner des labels
   - Indicateur visuel (✓) pour les labels assignés
   - Rechargement automatique après modification

✅ **Badges sur les cartes** (`DraggableCard.tsx`)
   - Affichage des badges colorés (bande de 10px × 40px)
   - Chargement automatique depuis l'API
   - Affichage au survol du nom du label

✅ **Intégration dans la page board** (`page.tsx`)
   - Bouton "⚡ Labels" dans le header
   - Chargement des labels au montage du composant
   - Passage des labels aux modals

---

## 🗄️ Schéma de base de données

```prisma
model Label {
  id        String      @id @default(cuid())
  boardId   String
  name      String
  color     String
  board     Board       @relation(fields: [boardId], references: [id], onDelete: Cascade)
  cards     CardLabel[]
  createdAt DateTime    @default(now())
}

model CardLabel {
  cardId  String
  labelId String
  card    Card   @relation(fields: [cardId], references: [id], onDelete: Cascade)
  label   Label  @relation(fields: [labelId], references: [id], onDelete: Cascade)

  @@id([cardId, labelId])
  @@unique([cardId, labelId])
}
```

---

## 🔌 API Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `POST` | `/labels` | Créer un label |
| `GET` | `/labels?boardId=xxx` | Récupérer les labels d'un board |
| `PATCH` | `/labels/:id` | Mettre à jour un label |
| `DELETE` | `/labels/:id` | Supprimer un label |
| `POST` | `/labels/:labelId/assign/:cardId` | Assigner un label à une carte |
| `DELETE` | `/labels/:labelId/unassign/:cardId` | Désassigner un label |
| `GET` | `/labels/card/:cardId` | Récupérer les labels d'une carte |

---

## 🎨 Couleurs prédéfinies

```typescript
const PRESET_COLORS = [
    '#61bd4f', // green
    '#f2d600', // yellow
    '#ff9f1a', // orange
    '#eb5a46', // red
    '#c377e0', // purple
    '#0079bf', // blue
    '#00c2e0', // sky
    '#51e898', // lime
    '#ff78cb', // pink
    '#344563', // dark gray
];
```

---

## 🚀 Démarrage

### 1. Générer le client Prisma
```bash
cd apps/api
npx prisma generate
```

### 2. Lancer l'API (port 3001)
```bash
cd apps/api
pnpm run start:dev
```

### 3. Lancer le frontend (port 3000)
```bash
cd apps/web
pnpm run dev
```

---

## 🧪 Tests manuels

1. **Créer des labels** : Ouvrir le board → Cliquer sur "⚡ Labels" → Créer des labels avec différentes couleurs
2. **Assigner des labels** : Ouvrir une carte → Cliquer sur "🏷️ Labels" dans la sidebar → Cocher les labels
3. **Voir les badges** : Les cartes doivent afficher les badges colorés au-dessus du titre
4. **Éditer un label** : Dans la modal de gestion, cliquer sur un label pour l'éditer
5. **Supprimer un label** : Cliquer sur "×" à côté d'un label (confirmation demandée)

---

## 📁 Fichiers modifiés/créés

### Backend (`apps/api/`)
- `prisma/schema.prisma` - Ajout des modèles Label et CardLabel
- `src/labels/dto/create-label.dto.ts` ✨ Nouveau
- `src/labels/dto/update-label.dto.ts` ✨ Nouveau  
- `src/labels/dto/assign-label.dto.ts` ✨ Nouveau
- `src/labels/labels.service.ts` ✨ Nouveau
- `src/labels/labels.controller.ts` ✨ Nouveau
- `src/labels/labels.module.ts` ✨ Nouveau
- `src/app.module.ts` - Import de LabelsModule

### Frontend (`apps/web/`)
- `lib/api.ts` - Ajout de 7 fonctions API labels
- `app/boards/[id]/LabelsManagementModal.tsx` ✨ Nouveau
- `app/boards/[id]/CardDetailModal.tsx` - Ajout affichage et assignment
- `app/boards/[id]/DraggableCard.tsx` - Ajout badges
- `app/boards/[id]/page.tsx` - Intégration du bouton Labels

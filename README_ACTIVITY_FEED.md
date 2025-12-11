# 📊 Activity Feed UI - Documentation complète

## 🎯 Vue d'ensemble

Cette fonctionnalité ajoute une **sidebar coulissante** pour afficher l'historique des activités d'un board Trello. Elle inclut des **icônes différenciées** pour chaque type d'action et un **scroll automatique** vers les nouvelles entrées.

### ✅ Fonctionnalités implémentées

1. ✨ **Sidebar coulissante** avec animation fluide et overlay
2. 🎨 **Icônes différentes** selon le type d'action
3. 📜 **Scroll automatique** vers les nouvelles entrées
4. 🔄 **Polling automatique** toutes les 10 secondes
5. 📱 **Design responsive** (mobile, tablette, desktop)

---

## 📚 Documentation disponible


### 🔧 Documentation technique
➡️ **[ACTIVITY_FEED_UI.md](./ACTIVITY_FEED_UI.md)**
- Détails techniques du composant
- API utilisée
- Format des dates
- UX/UI Features
- Améliorations futures

### 🧪 Guide de test
➡️ **[TESTING_ACTIVITY_FEED.md](./TESTING_ACTIVITY_FEED.md)**
- 10 scénarios de test détaillés
- Checklist complète
- Commandes de debug
- Bugs connus et limitations

---

## 🚀 Quick Start

### Prérequis
```bash
# API (port 3001)
cd apps/api
pnpm dev

# Frontend (port 3000)
cd apps/web
pnpm dev
```

### Utilisation
1. Connectez-vous à l'application
2. Ouvrez un board
3. Cliquez sur le bouton **"📊 Historique"** dans le header
4. La sidebar s'ouvre avec l'historique des activités

---

## 📂 Fichiers principaux

### Code source
```
apps/web/app/boards/[id]/
├── ActivitySidebar.tsx    ⭐ Nouveau composant (230 lignes)
└── page.tsx               ✏️ Modifié (30 lignes ajoutées)
```

### Documentation
```
├── README_ACTIVITY_FEED.md              (ce fichier)
├── ACTIVITY_FEED_UI.md                  (doc technique)
├── TESTING_ACTIVITY_FEED.md             (guide de test)
```

---

## 🎨 Preview

### Sidebar fermée
Le bouton "📊 Historique" apparaît dans le header du board.

### Sidebar ouverte
Une sidebar de 384px glisse depuis la droite avec :
- Header bleu avec gradient
- Liste des activités avec icônes
- Scrollbar personnalisée
- Bouton actualiser en bas

### Types d'activités
| Icône | Action |
|-------|--------|
| ➕ | Création de carte |
| 🗑️ | Suppression de carte |
| ↔️ | Déplacement de carte |
| 📝 | Modification de description |
| 🏷️ | Ajout d'étiquette |

---

## 🔌 API

### Endpoint utilisé
```
GET /boards/:id/activity
```

### Réponse
```typescript
Activity[] = [
  {
    id: string;
    boardId: string;
    userId: string;
    type: ActivityType;
    entityId: string;
    details: string | null;
    createdAt: string;
    user: {
      id: string;
      name: string | null;
      email: string;
    };
  }
]
```

---

## ✅ Tests

### Test rapide (2 minutes)
1. Ouvrir la sidebar → ✅ Animation fluide
2. Observer les icônes → ✅ Différentes par type
3. Créer une carte → ✅ Scroll automatique vers la nouvelle entrée

### Tests complets
Consultez **[TESTING_ACTIVITY_FEED.md](./TESTING_ACTIVITY_FEED.md)** pour les 8 scénarios détaillés.
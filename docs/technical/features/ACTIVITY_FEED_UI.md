# 📊 Activity Feed UI - Historique des Activités

## 🎯 Fonctionnalités implémentées

### ✅ Sidebar coulissante
- **Animation fluide** : Transition de 300ms avec overlay semi-transparent
- **Design moderne** : Header avec gradient bleu, carte avec ombres et bordures
- **Responsive** : Largeur fixe de 384px (w-96) qui s'adapte à tous les écrans

### ✅ Icônes différenciées par type d'action
Les icônes sont automatiquement assignées selon le type d'activité :

| Type d'activité | Icône | Description |
|----------------|-------|-------------|
| `CREATE_CARD` | ➕ | Création d'une carte |
| `DELETE_CARD` | 🗑️ | Suppression d'une carte |
| `MOVE_CARD` | ↔️ | Déplacement d'une carte |
| `UPDATE_DESCRIPTION` | 📝 | Modification de description |
| `ADD_LABEL` | 🏷️ | Ajout d'une étiquette |

### ✅ Scroll automatique vers les nouvelles entrées
- **Détection intelligente** : Compare le nombre d'activités avant/après le fetch
- **Scroll fluide** : Utilise `scrollIntoView` avec `behavior: 'smooth'`
- **Auto-refresh** : Polling toutes les 10 secondes pour récupérer les nouvelles activités

## 📂 Fichiers créés/modifiés

### Nouveaux fichiers
- **`apps/web/app/boards/[id]/ActivitySidebar.tsx`** : Composant principal de la sidebar d'activités

### Fichiers modifiés
- **`apps/web/app/boards/[id]/page.tsx`** :
  - Import du composant `ActivitySidebar`
  - Ajout du state `isActivitySidebarOpen`
  - Bouton "Historique" dans le header
  - Intégration du composant dans le rendu

## 🔄 Fonctionnement

### 1. Ouverture de la sidebar
```tsx
<button onClick={() => setIsActivitySidebarOpen(true)}>
  📊 Historique
</button>
```

### 2. Récupération des activités
```typescript
// Endpoint API utilisé
GET /boards/:id/activity

// Réponse attendue
[
  {
    id: string,
    boardId: string,
    userId: string,
    type: ActivityType,
    entityId: string,
    details: string | null,
    createdAt: string,
    user: { id, name, email }
  }
]
```

### 3. Polling automatique
- Fetch initial à l'ouverture
- Refresh toutes les 10 secondes
- Nettoyage de l'intervalle à la fermeture

### 4. Scroll automatique
```typescript
if (data.length > previousCountRef.current) {
  setTimeout(() => {
    activitiesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);
}
```

## 🎯 Format de dates

Le composant affiche les dates de manière intelligente :
- **Moins d'1 min** : "À l'instant"
- **Moins d'1h** : "Il y a X min"
- **Moins de 24h** : "Il y a Xh"
- **1 jour** : "Hier"
- **Moins de 7 jours** : "Il y a X jours"
- **Plus de 7 jours** : "25 nov à 14:30"

## 🎨 Custom Scrollbar

La sidebar utilise une scrollbar personnalisée :
```css
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e0;
  border-radius: 10px;
}
```

## 📱 UX/UI Features

1. **Loading state** : Spinner pendant le chargement initial
2. **Empty state** : Message explicatif quand aucune activité
3. **Overlay cliquable** : Ferme la sidebar en cliquant à l'extérieur
4. **Bouton ESC** : Support du clavier (via overlay)
5. **States visuels** : Hover, disabled, loading

## 🔧 Utilisation

```tsx
import { ActivitySidebar } from './ActivitySidebar';

// Dans votre composant
const [isActivitySidebarOpen, setIsActivitySidebarOpen] = useState(false);

// Bouton pour ouvrir
<button onClick={() => setIsActivitySidebarOpen(true)}>
  Historique
</button>

// Composant
<ActivitySidebar
  boardId={boardId}
  isOpen={isActivitySidebarOpen}
  onClose={() => setIsActivitySidebarOpen(false)}
/>
```

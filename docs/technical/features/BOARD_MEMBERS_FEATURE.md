# Board Members & Invite Feature

## 📋 Description

Cette fonctionnalité permet d'afficher la liste des membres d'un board et d'inviter de nouveaux membres au workspace associé au board.

## ✨ Fonctionnalités implémentées

### 1. Affichage des membres du board
- **Avatars avec initiales** : Chaque membre est affiché avec un avatar coloré contenant ses initiales
- **Couleurs dynamiques** : Chaque utilisateur a une couleur unique basée sur son ID
- **Limite d'affichage** : Les 5 premiers membres sont affichés, avec un compteur "+X" pour les autres
- **Tooltip informatif** : Au survol, affichage du nom/email et du rôle du membre
- **Responsive** : S'adapte aux différentes tailles d'écran

### 2. Invitation de nouveaux membres
- **Bouton "Inviter"** : Accessible dans le header du board
- **Modal d'invitation** : 
  - Input pour saisir l'email
  - Validation du format email
  - Boutons Inviter/Annuler
- **Gestion des erreurs** :
  - ❌ Email non trouvé : "Utilisateur non trouvé. Cet email n'existe pas dans le système."
  - ❌ Membre déjà présent : "Cet utilisateur est déjà membre du workspace."
  - ❌ Autres erreurs : Affichage du message d'erreur de l'API
- **Message de succès** : Confirmation visuelle après invitation réussie
- **Rafraîchissement auto** : La liste des membres est automatiquement mise à jour

## 📁 Fichiers créés/modifiés

### Nouveaux fichiers
- `apps/web/app/boards/[id]/BoardMembers.tsx` : Composant principal pour l'affichage et l'invitation

### Fichiers modifiés
- `apps/web/app/boards/[id]/page.tsx` : Intégration du composant BoardMembers dans le header

## 🔧 Détails techniques

### Types TypeScript
```typescript
type Member = {
  id: string;
  userId: string;
  role: string;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
};
```

### API utilisée
- **GET** `/boards/:id` - Récupère les informations du board (incluant les membres)
- **POST** `/workspaces/:workspaceId/invite` - Invite un membre au workspace
  - Body: `{ email: string, role: 'MEMBER' }`

### Fonctionnalités clés du composant

#### Génération d'initiales
```typescript
const getInitials = (name: string | null, email: string) => {
  if (name) {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  }
  return email[0].toUpperCase();
};
```

#### Couleurs d'avatar dynamiques
- 15 couleurs pré-définies
- Attribution basée sur un hash de l'userId
- Garantit la consistance des couleurs pour un même utilisateur

## 🎨 Design

- **Style Trello-like** : Inspiré de l'interface Trello
- **Effets visuels** :
  - Hover effects avec scale
  - Transitions smooth
  - Shadow pour les avatars
  - Overlay semi-transparent pour le modal
- **Couleurs** :
  - Fond du header : `bg-black/20` avec backdrop-blur
  - Bouton invite : `bg-white/20` hover `bg-white/30`
  - Modal : fond blanc avec shadow
  - Erreurs : rouge (#ef4444) avec fond rouge clair
  - Succès : vert (#10b981) avec fond vert clair

## 🚀 Utilisation

1. Naviguer vers un board
2. Dans le header, voir la liste des membres avec leurs avatars
3. Cliquer sur "Inviter" pour ouvrir le modal
4. Saisir l'email d'un utilisateur existant
5. Cliquer sur "Inviter" pour envoyer l'invitation
6. La liste des membres se met à jour automatiquement

## ⚠️ Limitations connues

- L'utilisateur doit **déjà avoir un compte** pour être invité (pas d'auto-création)
- L'invitation se fait au niveau du **workspace**, pas directement au board
- Seuls les OWNER et ADMIN du workspace peuvent inviter
- Les membres du workspace ont automatiquement accès aux boards du workspace

## 🔐 Permissions requises

- **Lecture** : Tout membre du board peut voir les autres membres
- **Invitation** : Seuls les OWNER et ADMIN du workspace peuvent inviter


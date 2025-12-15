# Feature: Avatars des membres sur les cartes (#26)

## Résumé

Implémentation de l'affichage des avatars des membres assignés sur chaque carte du board Trello.

## Modifications apportées

### 1. Nouveau composant: `CardMemberAvatars.tsx`

**Localisation**: `apps/web/app/boards/[id]/CardMemberAvatars.tsx`

**Fonctionnalités**:
- ✅ Affichage de max 3 avatars par défaut
- ✅ Affichage de "+X" pour les membres supplémentaires
- ✅ Avatars circulaires avec initiales
- ✅ Couleurs uniques et cohérentes par membre (basées sur leur ID)
- ✅ Tooltips au survol affichant le nom complet ou l'email du membre
- ✅ Layout responsive avec Tailwind CSS
- ✅ Animation au survol (scale)
- ✅ Gestion élégante des noms (initiales extraites du nom ou de l'email)

**Détails techniques**:
- Palette de 10 couleurs prédéfinies pour une bonne lisibilité
- Support des noms complets (prend les initiales du prénom et nom) et des emails

### 2. Intégration dans `DraggableCard.tsx`

**Modifications**:
- Import du nouveau composant `CardMemberAvatars`
- Ajout du type `User` pour définir la structure des membres
- Mise à jour du type `Card` pour inclure `members?: User[]`
- Affichage conditionnel des avatars sous le titre de la carte

### 3. Mise à jour des types dans `page.tsx`

**Modifications**:
- Réorganisation des types pour plus de clarté
- Déplacement du type `User` avant le type `Card`
- Distinction claire entre `Member` (BoardMember avec rôle) et `User` (membre de carte)

## Architecture des données

```
Board
  └─ members: BoardMember[] (avec rôle: OWNER, ADMIN, MEMBER, OBSERVER)
       └─ user: User

Card
  └─ members: User[] (relation many-to-many simple)
```

**Note**: L'API retourne déjà les membres avec `include: { members: true }` dans `cards.service.ts`.

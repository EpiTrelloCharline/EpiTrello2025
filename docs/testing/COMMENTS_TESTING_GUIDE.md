# Guide de Test Rapide - Commentaires de Carte

## 🚀 Démarrage

### 1. Démarrer le backend
```bash
cd apps/api
npm run start:dev
```

### 2. Démarrer le frontend
```bash
cd apps/web
npm run dev
```

### 3. Accéder à l'application
Ouvrir http://localhost:3000 dans votre navigateur

## ✅ Checklist de Test

### Test 1 : Affichage de la Section Activité
- [ ] Se connecter à l'application
- [ ] Ouvrir un board
- [ ] Cliquer sur une carte pour ouvrir la modale
- [ ] Faire défiler jusqu'en bas
- [ ] **Résultat attendu** : Une section "Activité" avec une icône horloge est visible

### Test 2 : Ajout d'un Commentaire
- [ ] Dans la section Activité, cliquer sur le champ "Écrire un commentaire..."
- [ ] **Résultat attendu** : Le champ s'agrandit et affiche les boutons d'action
- [ ] Taper un commentaire de test : "Ceci est mon premier commentaire"
- [ ] Cliquer sur "Enregistrer"
- [ ] **Résultat attendu** : 
  - Le commentaire apparaît immédiatement en haut de la liste
  - L'avatar de l'utilisateur est affiché
  - La date "à l'instant" est affichée
  - Le champ de saisie est réinitialisé

### Test 3 : Dates Relatives
- [ ] Ajouter plusieurs commentaires avec des intervalles de temps
- [ ] **Résultat attendu** : Les dates s'affichent correctement :
  - "à l'instant" pour un nouveau commentaire
  - "il y a X min" après quelques minutes
  - "il y a Xh" après une heure
  - "il y a Xj" après un jour

### Test 4 : Édition d'un Commentaire
- [ ] Sur votre propre commentaire, cliquer sur "Modifier"
- [ ] **Résultat attendu** : Le commentaire se transforme en zone de texte éditable
- [ ] Modifier le texte : "Commentaire modifié"
- [ ] Cliquer sur "Enregistrer"
- [ ] **Résultat attendu** :
  - Le commentaire est mis à jour
  - Un badge "(modifié)" apparaît à côté de la date

### Test 5 : Annulation d'Édition
- [ ] Sur votre commentaire, cliquer sur "Modifier"
- [ ] Modifier le texte
- [ ] Cliquer sur "Annuler"
- [ ] **Résultat attendu** : Le commentaire revient à son état original

### Test 6 : Suppression d'un Commentaire
- [ ] Sur votre commentaire, cliquer sur "Supprimer"
- [ ] **Résultat attendu** : Une boîte de confirmation rouge apparaît
- [ ] Cliquer sur "Supprimer" dans la confirmation
- [ ] **Résultat attendu** : Le commentaire disparaît de la liste

### Test 7 : Annulation de Suppression
- [ ] Sur votre commentaire, cliquer sur "Supprimer"
- [ ] Cliquer sur "Annuler" dans la confirmation
- [ ] **Résultat attendu** : Le commentaire reste visible

### Test 8 : Raccourci Clavier
- [ ] Cliquer dans le champ de saisie
- [ ] Taper un commentaire
- [ ] Appuyer sur `Ctrl + Entrée` (ou `Cmd + Entrée` sur Mac)
- [ ] **Résultat attendu** : Le commentaire est envoyé immédiatement

### Test 9 : Permissions (Multi-utilisateurs)
#### Avec le premier utilisateur :
- [ ] Ajouter un commentaire

#### Avec un deuxième utilisateur (différent) :
- [ ] Se connecter avec un autre compte
- [ ] Ouvrir la même carte
- [ ] **Résultat attendu** : 
  - Le commentaire de l'autre utilisateur est visible
  - Pas de boutons "Modifier" ou "Supprimer" sur le commentaire de l'autre utilisateur
  - Seuls vos propres commentaires ont ces boutons

### Test 10 : État Vide
- [ ] Ouvrir une carte sans commentaires
- [ ] **Résultat attendu** :
  - Message "Aucun commentaire pour le moment"
  - Message "Soyez le premier à commenter cette carte"
  - Icône illustrative

### Test 11 : Gestion des Erreurs
#### Test API indisponible :
- [ ] Arrêter le backend
- [ ] Rafraîchir la page et ouvrir une carte
- [ ] **Résultat attendu** : Message d'erreur avec bouton "Réessayer"

### Test 12 : Validation des Champs
- [ ] Essayer d'envoyer un commentaire vide
- [ ] **Résultat attendu** : Le bouton "Enregistrer" est désactivé

- [ ] Taper uniquement des espaces
- [ ] **Résultat attendu** : Le bouton "Enregistrer" reste désactivé

### Test 13 : Long Contenu
- [ ] Ajouter un commentaire très long (plusieurs paragraphes)
- [ ] **Résultat attendu** : 
  - Le texte s'affiche correctement avec retours à la ligne
  - Pas de débordement horizontal

### Test 14 : Avatars
#### Avec avatar :
- [ ] Si votre utilisateur a un avatar, vérifier qu'il s'affiche correctement

#### Sans avatar :
- [ ] Si votre utilisateur n'a pas d'avatar
- [ ] **Résultat attendu** : 
  - Avatar généré avec la première lettre du nom
  - Fond dégradé bleu-violet

### Test 15 : Rechargement de Page
- [ ] Ajouter plusieurs commentaires
- [ ] Rafraîchir la page
- [ ] Rouvrir la carte
- [ ] **Résultat attendu** : Tous les commentaires sont toujours présents

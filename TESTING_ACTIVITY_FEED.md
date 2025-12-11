# 🧪 Guide de Test - Activity Feed UI

## 🚀 Démarrage rapide

### Prérequis
1. Avoir l'API lancée sur le port 3001
2. Avoir le frontend lancé sur le port 3000
3. Être connecté avec un utilisateur valide

### Lancer les serveurs
```bash
# Terminal 1 - API
cd apps/api
pnpm dev

# Terminal 2 - Frontend
cd apps/web
pnpm dev
```

## 📋 Scénarios de test

### Test 1 : Affichage de la sidebar ✅

**Objectif** : Vérifier que la sidebar s'ouvre correctement

**Étapes** :
1. Naviguer vers un board existant
2. Cliquer sur le bouton "📊 Historique" dans le header
3. Vérifier que la sidebar apparaît depuis la droite avec une animation fluide
4. Vérifier que l'overlay semi-transparent apparaît

**Résultat attendu** :
- ✅ Sidebar visible avec transition smooth
- ✅ Overlay cliquable présent
- ✅ Header avec gradient bleu et titre "Historique"

---

### Test 2 : Affichage des activités ✅

**Objectif** : Vérifier que les activités s'affichent correctement

**Étapes** :
1. Ouvrir la sidebar d'activités
2. Observer la liste des activités

**Résultat attendu** :
- ✅ Chaque activité affiche :
  - Une icône selon le type d'action
  - Le nom de l'utilisateur
  - La description de l'action
  - Le timestamp formaté
- ✅ Si aucune activité : message "Aucune activité pour le moment"
- ✅ Pendant le chargement : spinner animé

---

### Test 3 : Icônes différenciées ✅

**Objectif** : Vérifier que chaque type d'action a sa propre icône

**Étapes** :
1. Créer une nouvelle carte ➕
2. Déplacer une carte ↔️
3. Ajouter une étiquette 🏷️
4. Modifier une description 📝
5. Supprimer une carte 🗑️
6. Ouvrir la sidebar

**Résultat attendu** :
- ✅ Chaque action affiche une icône unique
- ✅ Les icônes sont :
  - ➕ pour CREATE_CARD
  - 🗑️ pour DELETE_CARD
  - ↔️ pour MOVE_CARD
  - 📝 pour UPDATE_DESCRIPTION
  - 🏷️ pour ADD_LABEL

---

### Test 4 : Scroll automatique vers nouvelles entrées ✅

**Objectif** : Vérifier que la sidebar scroll automatiquement vers les nouvelles activités

**Étapes** :
1. Ouvrir la sidebar (avec historique existant)
2. Dans un autre onglet/fenêtre, effectuer une action (créer une carte)
3. Attendre 10 secondes (polling automatique)
4. Observer le comportement

**Résultat attendu** :
- ✅ La nouvelle activité apparaît en haut de la liste
- ✅ La sidebar scroll automatiquement vers la nouvelle entrée
- ✅ L'animation de scroll est fluide

---

### Test 5 : Fermeture de la sidebar ✅

**Objectif** : Vérifier les différentes méthodes de fermeture

**Étapes** :
1. Ouvrir la sidebar
2. **Test A** : Cliquer sur le bouton ✕ en haut à droite
3. Rouvrir la sidebar
4. **Test B** : Cliquer sur l'overlay (zone sombre à gauche)

**Résultat attendu** :
- ✅ La sidebar se ferme avec une animation fluide
- ✅ L'overlay disparaît
- ✅ Les deux méthodes fonctionnent

---

### Test 6 : Bouton Actualiser ✅

**Objectif** : Vérifier le fonctionnement du bouton d'actualisation manuelle

**Étapes** :
1. Ouvrir la sidebar
2. Dans un autre onglet, créer une nouvelle carte
3. Revenir à la sidebar
4. Cliquer sur le bouton "🔄 Actualiser"

**Résultat attendu** :
- ✅ Le bouton affiche "Actualisation..." pendant le chargement
- ✅ Le bouton est désactivé pendant le chargement
- ✅ La nouvelle activité apparaît après actualisation

---

### Test 7 : Polling automatique ✅

**Objectif** : Vérifier que la sidebar se met à jour automatiquement

**Étapes** :
1. Ouvrir la sidebar
2. Laisser la sidebar ouverte
3. Dans un autre onglet/fenêtre, effectuer des actions sur le board
4. Attendre 10 secondes

**Résultat attendu** :
- ✅ Les nouvelles activités apparaissent automatiquement
- ✅ Le scroll se fait automatiquement vers les nouvelles entrées
- ✅ Pas de re-rendu complet, juste mise à jour des données

---

### Test 8 : Format des dates ✅

**Objectif** : Vérifier que les dates sont bien formatées

**Étapes** :
1. Créer une carte immédiatement avant d'ouvrir la sidebar
2. Observer le timestamp

**Résultat attendu** :
- ✅ Moins d'1 min : "À l'instant"
- ✅ Quelques minutes : "Il y a X min"
- ✅ Quelques heures : "Il y a Xh"
- ✅ Hier : "Hier"
- ✅ Plus ancien : "25 nov à 14:30" (format localisé)

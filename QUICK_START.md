# 🚀 Guide de démarrage rapide - EpiTrello

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Commandes utiles](#commandes-utiles)
- [Troubleshooting](#troubleshooting)

## 🎯 Vue d'ensemble

EpiTrello est un clone de Trello développé avec NestJS (backend) et Next.js (frontend). L'application permet de créer des workspaces, des boards, des listes et des cartes avec un système complet de drag & drop.

**Stack technique:**
- **Backend:** NestJS + Prisma + PostgreSQL
- **Frontend:** Next.js 14 + React + TailwindCSS
- **Drag & Drop:** @dnd-kit
- **Authentification:** JWT
- **Base de données:** PostgreSQL (via Docker)

## ✨ Fonctionnalités

### Authentification
- ✅ Inscription et connexion avec email/mot de passe
- ✅ Authentification JWT avec tokens sécurisés
- ✅ Tokens valides pendant 7 jours

### Gestion des Workspaces
- ✅ Créer des workspaces
- ✅ Inviter des membres par email
- ✅ Gérer les permissions (créateur vs membre)

### Gestion des Boards
- ✅ Créer des boards dans un workspace
- ✅ Visualiser tous les boards d'un workspace
- ✅ Accès restreint aux membres du workspace

### Gestion des Listes
- ✅ Créer des listes dans un board
- ✅ **Déplacer les listes horizontalement** (drag & drop)
- ✅ Système de positionnement avec Prisma Decimal

### Gestion des Cartes
- ✅ Créer des cartes dans une liste
- ✅ **Déplacer les cartes verticalement** dans la même liste (drag & drop)
- ✅ **Déplacer les cartes entre différentes listes** (drag & drop)
- ✅ Mises à jour optimistes avec rollback automatique
- ✅ Système de positionnement décimal pour éviter la renumérotation

### Interface Utilisateur
- ✅ Design inspiré de Trello avec couleurs et animations
- ✅ Interface réactive et fluide
- ✅ Feedback visuel lors du drag & drop
- ✅ Formulaires inline pour créer listes et cartes

## 🏗️ Architecture

### Structure du projet

```
EpiTrello2025/
├── apps/
│   ├── api/                    # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/          # Authentification JWT
│   │   │   ├── workspaces/    # Gestion workspaces
│   │   │   ├── boards/        # Gestion boards
│   │   │   ├── lists/         # Gestion listes
│   │   │   ├── cards/         # Gestion cartes
│   │   │   └── prisma.service.ts
│   │   └── prisma/
│   │       └── schema.prisma  # Schéma base de données
│   └── web/                   # Frontend Next.js
│       ├── app/
│       │   ├── login/         # Page de connexion
│       │   ├── workspaces/    # Liste des workspaces
│       │   └── boards/[id]/   # Page board avec drag & drop
│       └── lib/
│           └── api.ts         # Client API
├── docker-compose.yml         # PostgreSQL + Mailhog
└── QUICK_START.md            # Ce fichier
```

### Modèle de données

```
User
├── Workspace (créateur)
│   ├── WorkspaceMember (membres invités)
│   └── Board
│       ├── BoardMember (membres du board)
│       └── List (position: Decimal)
│           └── Card (position: Decimal)
```

### Système de positionnement

Les listes et cartes utilisent un système de **positionnement décimal** pour éviter de renuméroter tous les éléments lors d'un déplacement:

- Position initiale: 1, 2, 3, 4...
- Déplacement entre 2 et 3: nouvelle position = 2.5
- Déplacement entre 2.5 et 3: nouvelle position = 2.75
- Etc.

## 🚀 Installation

### 1. Démarrer Docker

```bash
sudo docker-compose up -d
```

Cela démarre:
- PostgreSQL sur le port 5432
- Mailhog sur le port 8025 (interface web)

### 2. Configurer l'environnement API

Créez `apps/api/.env` :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/epi_trello
JWT_ACCESS_SECRET=mon-secret-super-securise-changez-ca-en-production
PORT=3001
```

### 3. Installer les dépendances et exécuter les migrations

```bash
# API
cd apps/api
npm install
npx prisma migrate dev
npx prisma generate

# Frontend
cd ../web
npm install
```

### 4. Démarrer les services

**Terminal 1 - API :**
```bash
cd apps/api
npm run start:dev
```

**Terminal 2 - Frontend :**
```bash
cd apps/web
npm run dev
```

## 📖 Utilisation

### Accès à l'application

- **Frontend** : http://localhost:3000
- **Page de login** : http://localhost:3000/login
- **API** : http://localhost:3001
- **Mailhog** : http://localhost:8025

### Premiers pas

#### 1. Créer un compte

1. Ouvrir http://localhost:3000/login
2. Cliquer sur "S'inscrire"
3. Remplir le formulaire:
   - Email : `test@example.com`
   - Mot de passe : `test123`
   - Nom : `Test User` (optionnel)
4. Cliquer sur "S'inscrire"
5. Vous serez automatiquement connecté et redirigé vers `/workspaces`

#### 2. Créer un workspace

1. Sur la page `/workspaces`, cliquer sur "Create Workspace"
2. Entrer un nom (ex: "Mon Workspace")
3. Le workspace est créé et vous êtes redirigé vers la liste des boards

#### 3. Créer un board

1. Dans votre workspace, cliquer sur "Create Board"
2. Entrer un nom (ex: "Mon Projet")
3. Le board est créé et vous êtes redirigé vers la page du board

#### 4. Créer des listes

1. Sur la page du board, cliquer sur "+ Add another list"
2. Entrer un titre (ex: "À faire")
3. Appuyer sur Entrée ou cliquer sur "Add list"
4. Répéter pour créer d'autres listes (ex: "En cours", "Terminé")

#### 5. Créer des cartes

1. Dans une liste, cliquer sur "+ Add a card"
2. Entrer un titre pour la carte
3. Appuyer sur Entrée ou cliquer sur "Add card"
4. La carte apparaît dans la liste

#### 6. Utiliser le drag & drop

**Déplacer une carte verticalement (dans la même liste):**
- Cliquer et maintenir sur une carte
- Déplacer vers le haut ou le bas
- Relâcher pour déposer

**Déplacer une carte entre listes:**
- Cliquer et maintenir sur une carte
- Déplacer horizontalement vers une autre liste
- Relâcher pour déposer dans la nouvelle liste

**Déplacer une liste:**
- Cliquer et maintenir sur le titre d'une liste
- Déplacer horizontalement
- Relâcher pour repositionner

### Inviter des membres

#### Inviter quelqu'un à un workspace

1. Créer un deuxième compte (avec un autre email)
2. Depuis le premier compte, aller sur la page du workspace
3. Utiliser la fonctionnalité d'invitation (si implémentée dans l'UI)
4. Ou utiliser l'API directement:

```bash
curl -X POST http://localhost:3001/workspaces/{workspaceId}/invite \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email": "user2@example.com"}'
```

## 🛠️ Commandes utiles

### Docker

```bash
# Voir les logs Docker
docker-compose logs -f

# Voir les logs PostgreSQL uniquement
docker-compose logs -f postgres

# Arrêter Docker
docker-compose down

# Redémarrer tout
docker-compose restart

# Supprimer les volumes (⚠️ supprime les données)
docker-compose down -v
```

### Prisma

```bash
cd apps/api

# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate

# Ouvrir Prisma Studio (interface graphique)
npx prisma studio

# Réinitialiser la base de données (⚠️ supprime les données)
npx prisma migrate reset
```

### API

```bash
cd apps/api

# Démarrer en mode développement
npm run start:dev

# Démarrer en mode debug
npm run start:debug

# Build pour production
npm run build

# Démarrer en production
npm run start:prod

# Linter
npm run lint

# Tests
npm run test
```

### Frontend

```bash
cd apps/web

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Démarrer en production
npm run start

# Linter
npm run lint
```

## 🔧 Troubleshooting

### Erreur "Cannot connect to database"

**Cause:** PostgreSQL n'est pas démarré ou mal configuré

**Solution:**
```bash
# Vérifier que Docker est démarré
docker-compose ps

# Vérifier DATABASE_URL dans apps/api/.env
cat apps/api/.env

# Redémarrer PostgreSQL
docker-compose restart postgres
```

### Erreur "Prisma Client not generated"

**Cause:** Le client Prisma n'a pas été généré après les migrations

**Solution:**
```bash
cd apps/api
npx prisma generate
```

### Erreur CORS

**Cause:** L'API rejette les requêtes du frontend

**Solution:**
- L'API est configurée pour accepter les requêtes depuis `http://localhost:3000`
- Si vous changez le port du frontend, modifiez `apps/api/src/main.ts`:

```typescript
app.enableCors({
  origin: 'http://localhost:VOTRE_PORT',
  credentials: true,
});
```

### Token expiré

**Cause:** Les tokens JWT expirent après 7 jours

**Solution:**
- Reconnectez-vous via `/login`
- Le token sera automatiquement rafraîchi

### Erreur "Port already in use"

**Cause:** Le port 3000 ou 3001 est déjà utilisé

**Solution:**
```bash
# Trouver le processus utilisant le port
lsof -i :3000
lsof -i :3001

# Tuer le processus
kill -9 PID
```

### Les cartes ne se déplacent pas

**Cause:** Problème avec le drag & drop

**Solution:**
1. Vérifier que `@dnd-kit` est installé:
```bash
cd apps/web
npm list @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

2. Rafraîchir la page (F5)

3. Vérifier la console du navigateur (F12) pour des erreurs

### Erreur "Failed to move card"

**Cause:** L'API a rejeté le déplacement de la carte

**Solution:**
1. Vérifier que vous êtes bien membre du board
2. Vérifier les logs de l'API dans le terminal
3. La carte devrait automatiquement revenir à sa position initiale (rollback)

## 📚 Ressources supplémentaires

- **Documentation NestJS:** https://docs.nestjs.com/
- **Documentation Next.js:** https://nextjs.org/docs
- **Documentation Prisma:** https://www.prisma.io/docs
- **Documentation @dnd-kit:** https://docs.dndkit.com/

## 🤝 Contribution

Pour contribuer au projet:

1. Créer une branche pour votre fonctionnalité
2. Faire vos modifications
3. Tester localement
4. Créer une pull request

## 📝 Notes

- Les mots de passe ne sont pas encore hashés (à implémenter avec bcrypt)
- L'envoi d'emails utilise Mailhog en développement
- Les tokens JWT sont stockés dans localStorage (côté client)
- Le système de positionnement décimal peut nécessiter un rééquilibrage après de nombreuses opérations

---
*
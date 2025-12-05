# 🧪 Guide de Test - EpiTrello Frontend & Backend

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js et pnpm installés
- Ports disponibles : 3001 (API), 3000 (Frontend), 5432 (PostgreSQL), 6379 (Redis), 8025 (MailHog)

---

## 🚀 Démarrage rapide

### 1️⃣ **Démarrer les services Docker**

```bash
cd /home/meuh/Documents/delivery/S9/EpiTrello2025
docker-compose up -d
```

Vérifier que les services sont en cours d'exécution :
```bash
docker-compose ps
```

Vous devriez voir :
- ✅ epi-trello-postgres (port 5432)
- ✅ epi-trello-redis (port 6379)
- ✅ epi-trello-mailhog (ports 1025, 8025)

### 2️⃣ **Configurer la base de données**

```bash
cd apps/api

# Appliquer les migrations
npx prisma migrate deploy

# Générer le client Prisma
npx prisma generate
```

### 3️⃣ **Démarrer le Backend (API NestJS)**

Dans un terminal :
```bash
cd apps/api
pnpm install  # Si pas encore fait
pnpm run start:dev
```

L'API devrait démarrer sur **http://localhost:3001**

### 4️⃣ **Démarrer le Frontend (Next.js)**

Dans un autre terminal :
```bash
cd apps/web
pnpm install  # Si pas encore fait
pnpm run dev
```

Le frontend devrait démarrer sur **http://localhost:3000**

---

## 🧪 Tests manuels

### **A. Tester les Labels (Nouvelle fonctionnalité)**

1. **Ouvrir l'application** : http://localhost:3000
2. **Se connecter** (ou créer un compte)
3. **Créer ou ouvrir un board**
4. **Cliquer sur le bouton "⚡ Labels"** dans le header
5. **Créer des labels** avec différentes couleurs
6. **Ouvrir une carte** en cliquant dessus
7. **Assigner des labels** à la carte
8. **Vérifier** que les labels apparaissent sur la carte

### **B. Tester les Membres et Filtres**

1. **Dans le header du board**, utiliser le bouton "Inviter"
2. **Inviter un membre** (l'email doit exister dans la base)
3. **Utiliser la barre de recherche** pour filtrer les cartes
4. **Cliquer sur un label** dans le header pour filtrer par label
5. **Cliquer sur un membre** dans le header pour filtrer par membre
6. **Vérifier** que le drag & drop est désactivé pendant le filtrage

### **C. Tester les APIs Labels**

#### Créer un label
```bash
curl -X POST http://localhost:3001/labels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "boardId": "BOARD_ID",
    "name": "Urgent",
    "color": "#ff0000"
  }'
```

#### Obtenir les labels d'un board
```bash
curl -X GET "http://localhost:3001/labels?boardId=BOARD_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Assigner un label à une carte
```bash
curl -X POST "http://localhost:3001/labels/LABEL_ID/assign/CARD_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Retirer un label d'une carte
```bash
curl -X DELETE "http://localhost:3001/labels/LABEL_ID/unassign/CARD_ID" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🛠️ Commandes utiles

### **Backend (API)**
```bash
# Démarrage en mode développement
cd apps/api
pnpm run start:dev

# Build de production
pnpm run build

# Lancer les tests
pnpm run test

# Linter
pnpm run lint

# Prisma Studio (Interface graphique DB)
npx prisma studio
```

### **Frontend (Web)**
```bash
# Démarrage en mode développement
cd apps/web
pnpm run dev

# Build de production
pnpm run build

# Démarrer en production
pnpm run start
```

### **Docker**
```bash
# Voir les logs
docker-compose logs -f

# Arrêter les services
docker-compose down

# Supprimer les volumes (⚠️ efface les données)
docker-compose down -v

# Redémarrer un service spécifique
docker-compose restart postgres
```

---

## 📊 Endpoints API principaux

### **Authentication**
- `POST /auth/register` - Créer un compte
- `POST /auth/login` - Se connecter

### **Workspaces**
- `GET /workspaces` - Liste des workspaces
- `POST /workspaces` - Créer un workspace
- `POST /workspaces/:id/invite` - Inviter un membre

### **Boards**
- `GET /boards/:id` - Détails d'un board (avec labels et membres)
- `POST /boards` - Créer un board

### **Labels** ⭐ (Nouveau)
- `GET /labels?boardId=:id` - Labels d'un board
- `POST /labels` - Créer un label
- `PATCH /labels/:id` - Modifier un label
- `DELETE /labels/:id` - Supprimer un label
- `POST /labels/:labelId/assign/:cardId` - Assigner un label
- `DELETE /labels/:labelId/unassign/:cardId` - Retirer un label
- `GET /labels/card/:cardId` - Labels d'une carte

### **Cards**
- `GET /cards?listId=:id` - Cartes d'une liste
- `POST /cards` - Créer une carte
- `PATCH /cards/:id` - Modifier une carte
- `DELETE /cards/:id` - Supprimer une carte

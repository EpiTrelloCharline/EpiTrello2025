# EpiTrello 2025

Application de gestion de projets de type Trello, développée avec NestJS (backend) et Next.js (frontend).

## 📚 Documentation

### Guides de Démarrage

- **[QUICK_START.md](QUICK_START.md)** - Guide de démarrage rapide du projet
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guide pour tester l'application

### Documentation Technique

- **[PERMISSIONS.md](PERMISSIONS.md)** - 🔐 **Documentation complète du système de permissions**
  - Architecture et composants
  - Rôles et matrice des permissions (OWNER, ADMIN, MEMBER, OBSERVER)
  - Exemples de code et utilisation
  - Guide de test

- **[TESTING_PERMISSIONS.md](TESTING_PERMISSIONS.md)** - 🧪 **Guide de test manuel des permissions**
  - Tests avec Postman/Thunder Client/Insomnia
  - Instructions étape par étape
  - Tableau récapitulatif des tests

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 18+
- Docker (pour PostgreSQL, Redis, Mailhog)
- pnpm ou npm

### Installation

```bash
# Cloner le projet
git clone <repository-url>
cd EpiTrello2025

# Installer les dépendances
cd apps/api && npm install
cd ../web && npm install

# Démarrer Docker
docker-compose up -d

# Migrations Prisma
cd apps/api
npx prisma migrate dev
npx prisma generate

# Démarrer l'API
npm run start:dev

# Dans un autre terminal, démarrer le frontend
cd apps/web
npm run dev
```

### Accès

- **Frontend** : http://localhost:3000
- **API** : http://localhost:3001
- **Mailhog** : http://localhost:8025
- **Prisma Studio** : `cd apps/api && npx prisma studio`

## 🧪 Tests

### Test Automatisé du Système de Permissions

```bash
# Test complet (recommandé)
node test-permissions-complete.js

# Test rapide
./quick-test-permissions.sh
```

**Résultat attendu** : 20/20 tests passés ✅

### Tests Manuels

Suivez le guide [TESTING_PERMISSIONS.md](TESTING_PERMISSIONS.md) pour tester avec Postman/Thunder Client.

## 🏗️ Architecture

```
EpiTrello2025/
├── apps/
│   ├── api/              # Backend NestJS
│   │   ├── src/
│   │   │   ├── auth/     # Authentification JWT
│   │   │   ├── boards/   # Boards + Permissions
│   │   │   ├── cards/    # Cartes
│   │   │   ├── lists/    # Listes
│   │   │   └── workspaces/
│   │   └── prisma/       # Schéma de base de données
│   └── web/              # Frontend Next.js
├── PERMISSIONS.md        # 🔐 Doc système de permissions
├── TESTING_PERMISSIONS.md # 🧪 Guide de test manuel
└── docker-compose.yml    # Services Docker
```

## 🔐 Système de Permissions

Le projet implémente un système de permissions basé sur les rôles pour contrôler l'accès aux boards.

### Rôles

| Rôle | Lecture | Écriture | Description |
|------|---------|----------|-------------|
| **OWNER** | ✅ | ✅ | Propriétaire du board |
| **ADMIN** | ✅ | ✅ | Administrateur |
| **MEMBER** | ✅ | ✅ | Membre actif |
| **OBSERVER** | ✅ | ❌ | Lecture seule |

### Composants

- **BoardPermissionsService** - Service centralisé de gestion des permissions
- **BoardReadGuard** - Guard pour les endpoints de lecture (GET)
- **BoardWriteGuard** - Guard pour les endpoints d'écriture (POST/PATCH/DELETE)

📖 **Voir [PERMISSIONS.md](PERMISSIONS.md) pour la documentation complète**

## 🛠️ Technologies

### Backend
- **NestJS** - Framework Node.js
- **Prisma** - ORM
- **PostgreSQL** - Base de données
- **JWT** - Authentification
- **Redis** - Cache (optionnel)

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styling

## 📝 Scripts Utiles

```bash
# API
cd apps/api
npm run start:dev      # Démarrer en mode développement
npm run build          # Build production
npx prisma studio      # Interface graphique DB

# Frontend
cd apps/web
npm run dev            # Démarrer en mode développement
npm run build          # Build production

# Tests de permissions
node test-permissions-complete.js  # Test automatisé complet
./quick-test-permissions.sh        # Test rapide

# Docker
docker-compose up -d    # Démarrer les services
docker-compose down     # Arrêter les services
docker-compose logs     # Voir les logs
```

## 🐛 Troubleshooting

### L'API ne démarre pas
```bash
# Vérifier que Docker est démarré
docker-compose ps

# Vérifier la connexion à la DB
cd apps/api
npx prisma migrate dev
```

### Erreurs Prisma
```bash
cd apps/api
npx prisma generate
npx prisma migrate dev
```

### Port déjà utilisé
```bash
# Changer le port dans apps/api/.env
PORT=3002

# Ou tuer le processus
lsof -ti:3001 | xargs kill
```

## 📄 License

MIT

## 👥 Contributeurs

- Charline - Développement initial

---

**Dernière mise à jour** : 30 novembre 2025

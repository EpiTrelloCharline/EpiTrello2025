# Infrastructure Docker Production - EpiTrello

## 📁 Fichiers créés

### Dockerfiles optimisés (multi-stage build)
- `apps/api/Dockerfile.prod` - Image de production pour l'API NestJS
- `apps/web/Dockerfile.prod` - Image de production pour le Frontend Next.js

### Configuration Nginx
- `nginx/nginx.conf` - Reverse proxy avec:
  - Routage `/api/*` → API NestJS
  - Routage `/` → Frontend Next.js
  - Support WebSocket pour `/socket.io/`
  - Rate limiting
  - Gzip compression
  - Headers de sécurité

### Docker Compose Production
- `docker-compose.prod.yml` - Orchestration complète

### Variables d'environnement
- `.env.prod.example` - Template des variables requises

### Health Check & Scripts
- `apps/api/src/health/` - Module de health check
- `apps/api/docker-entrypoint.sh` - Script de démarrage avec migrations

## 🚀 Démarrage rapide

### 1. Copier et configurer les variables d'environnement
```bash
cp .env.prod.example .env.prod
# Éditer .env.prod avec vos valeurs de production
```

### 2. Générer des secrets sécurisés
```bash
# Générer JWT_SECRET
openssl rand -base64 64

# Générer mots de passe
openssl rand -base64 32
```

### 3. Builder et démarrer
```bash
# Builder les images
docker compose -f docker-compose.prod.yml build

# Démarrer en mode détaché
docker compose -f docker-compose.prod.yml up -d

# Voir les logs
docker compose -f docker-compose.prod.yml logs -f
```

### 4. Vérifier le déploiement
```bash
# Health check
curl http://localhost/health

# Vérifier les services
docker compose -f docker-compose.prod.yml ps
```

## 📋 Variables d'environnement requises

| Variable | Description | Obligatoire |
|----------|-------------|-------------|
| `POSTGRES_PASSWORD` | Mot de passe PostgreSQL | ✅ |
| `REDIS_PASSWORD` | Mot de passe Redis | ✅ |
| `JWT_SECRET` | Secret JWT (min 64 chars) | ✅ |
| `CORS_ORIGIN` | Domaine autorisé | ✅ |
| `NEXT_PUBLIC_API_URL` | URL de l'API | ❌ (défaut: `/api`) |

## 🏗️ Architecture

```
                    ┌─────────────────┐
                    │     Nginx       │
                    │   (Port 80/443) │
                    └────────┬────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
            ▼                ▼                ▼
    ┌───────────┐    ┌───────────┐    ┌────────────┐
    │  Frontend │    │    API    │    │ WebSocket  │
    │  Next.js  │    │  NestJS   │    │  Socket.io │
    │  :3000    │    │  :3001    │    │   :3001    │
    └───────────┘    └─────┬─────┘    └─────┬──────┘
                           │                │
                    ┌──────┴────────────────┘
                    │
        ┌───────────┼───────────┐
        │           │           │
        ▼           ▼           ▼
┌───────────┐ ┌───────────┐ ┌───────────┐
│ PostgreSQL│ │   Redis   │ │  Uploads  │
│   :5432   │ │   :6379   │ │  Volume   │
└───────────┘ └───────────┘ └───────────┘
```

## 🔐 Sécurité

- ✅ Utilisateurs non-root dans les conteneurs
- ✅ Variables sensibles via `.env` (non commité)
- ✅ Rate limiting sur l'API et l'authentification
- ✅ Headers de sécurité (X-Frame-Options, X-XSS-Protection, etc.)
- ✅ Réseau Docker isolé
- ✅ Health checks sur tous les services

## 🔧 Commandes utiles

```bash
# Rebuilder un service spécifique
docker compose -f docker-compose.prod.yml --env-file .env.prod build api

# Démarrer tous les services
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Redémarrer un service
docker compose -f docker-compose.prod.yml --env-file .env.prod restart api

# Voir les logs d'un service
docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f api

# Exécuter les migrations manuellement
docker compose -f docker-compose.prod.yml --env-file .env.prod exec api npx prisma migrate deploy

# Accéder au shell d'un conteneur
docker compose -f docker-compose.prod.yml --env-file .env.prod exec api sh

# Arrêter tous les services
docker compose -f docker-compose.prod.yml --env-file .env.prod down

# Supprimer les volumes (⚠️ données perdues)
docker compose -f docker-compose.prod.yml --env-file .env.prod down -v
```

## ✅ Vérification du déploiement

```bash
# Vérifier que tous les services sont "healthy"
docker compose -f docker-compose.prod.yml --env-file .env.prod ps

# Tester le health check
curl http://localhost/health

# Tester la page d'accueil
curl -s http://localhost/ | grep -o "<title>.*</title>"
```

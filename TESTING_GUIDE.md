# Guide de test du frontend

## Prérequis

1. **Docker** doit être démarré pour Postgres, Redis et Mailhog
2. **Node.js** et **pnpm** installés (ou npm)
3. Variables d'environnement configurées

## Étapes pour tester

### 1. Démarrer Docker (Postgres, Redis, Mailhog)

```bash
# Depuis la racine du projet
sudo docker-compose up -d

# Vérifier que les services sont démarrés
docker-compose ps
```

### 2. Configurer les variables d'environnement

**Pour l'API (`apps/api/.env`)** :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/epi_trello
JWT_ACCESS_SECRET=your-secret-key-here-change-in-production
PORT=3001
```

**Pour le Frontend (optionnel si besoin)** :
Le frontend utilise `http://localhost:3001` par défaut dans `apps/web/lib/api.ts`

### 3. Exécuter les migrations Prisma

```bash
cd apps/api
pnpm prisma migrate dev
# ou
npx prisma migrate dev
pnpm prisma generate
# ou
npx prisma generate
```

### 4. Démarrer l'API NestJS

**Dans un premier terminal :**
```bash
cd apps/api
pnpm install  # si ce n'est pas déjà fait
pnpm start:dev
# ou
npm run start:dev
```

L'API devrait démarrer sur `http://localhost:3001`

### 5. Démarrer le frontend Next.js

**Dans un deuxième terminal :**
```bash
cd apps/web
pnpm install  # si ce n'est pas déjà fait
pnpm dev
# ou
npm run dev
```

Le frontend devrait démarrer sur `http://localhost:3000` (port par défaut Next.js)

### 6. Accéder à l'application

- **Frontend** : http://localhost:3000
- **API** : http://localhost:3001
- **Mailhog UI** : http://localhost:8025

## Tester l'application

### Étape 1 : Créer un utilisateur (nécessite un endpoint d'auth)

Si vous n'avez pas encore d'endpoint d'authentification, vous pouvez créer un utilisateur directement en base :

```bash
cd apps/api
pnpm prisma studio
# ou
npx prisma studio
```

Créer un User avec :
- email: `test@example.com`
- name: `Test User`

Puis générer un JWT token manuellement ou via un script.

### Étape 2 : Obtenir un token JWT

Pour tester, vous pouvez créer un token JWT simple. Le guard attend :
- `sub`: l'id du user
- `email`: l'email du user

### Étape 3 : Tester dans le navigateur

1. Ouvrir http://localhost:3000
2. Ouvrir la console du navigateur (F12)
3. Dans la console, définir un token de test :
```javascript
localStorage.setItem('accessToken', 'VOTRE_TOKEN_JWT_ICI');
```
4. Recharger la page
5. Naviguer vers `/workspaces`

## Commandes utiles

### Vérifier que Docker fonctionne
```bash
docker-compose ps
docker-compose logs postgres
```

### Voir les logs de l'API
Dans le terminal où l'API tourne, vous verrez les logs en temps réel.

### Redémarrer tout
```bash
# Arrêter
docker-compose down
# Redémarrer
docker-compose up -d
cd apps/api && pnpm start:dev &
cd apps/web && pnpm dev
```

## Troubleshooting

### Problème : "Cannot connect to database"
- Vérifiez que Docker est démarré : `docker-compose ps`
- Vérifiez la variable `DATABASE_URL` dans `apps/api/.env`

### Problème : "Prisma Client not generated"
```bash
cd apps/api
pnpm prisma generate
```

### Problème : "Module not found" dans Next.js
```bash
cd apps/web
pnpm install
```

### Problème : "Port already in use"
- Changez le port dans `apps/api` ou `apps/web` si nécessaire
- Ou tuez le processus utilisant le port

### Problème : CORS errors
Assurez-vous que l'API NestJS a CORS activé pour accepter les requêtes depuis `http://localhost:3000`


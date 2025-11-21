# 🚀 Guide de démarrage rapide

## 1. Démarrer Docker

```bash
sudo docker-compose up -d
```

## 2. Configurer l'environnement API

Créez `apps/api/.env` :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/epi_trello
JWT_ACCESS_SECRET=mon-secret-super-securise-changez-ca-en-production
PORT=3001
```

## 3. Installer les dépendances et exécuter les migrations

```bash
# API
cd apps/api
npm install  # ou pnpm install
npx prisma migrate dev
npx prisma generate

# Frontend
cd ../web
npm install  # ou pnpm install
```

## 4. Démarrer les services

**Terminal 1 - API :**
```bash
cd apps/api
npm run start:dev  # ou pnpm start:dev
```

**Terminal 2 - Frontend :**
```bash
cd apps/web
npm run dev  # ou pnpm dev
```

## 5. Tester l'application

### Liens de test :

- **Frontend** : http://localhost:3000
- **Page de login** : http://localhost:3000/login
- **API** : http://localhost:3001
- **Mailhog** : http://localhost:8025

### Étapes de test :

1. **Ouvrir http://localhost:3000/login**
2. **Créer un compte** :
   - Email : `test@example.com`
   - Mot de passe : `test123` (n'importe quoi, pas encore vérifié)
   - Nom : `Test User` (optionnel)
3. **Cliquer sur "S'inscrire"**
4. **Vous serez automatiquement connecté et redirigé vers `/workspaces`**
5. **Créer un workspace**, puis créer des boards, etc.

### Tester avec un autre compte :

1. Aller sur http://localhost:3000/login
2. Se connecter avec un autre email (ex: `user2@example.com`)
3. Créer un workspace
4. Inviter le premier utilisateur (`test@example.com`) comme membre

## Commandes utiles

```bash
# Voir les logs Docker
docker-compose logs -f

# Arrêter Docker
docker-compose down

# Redémarrer tout
docker-compose restart
```

## Troubleshooting

**Erreur "Cannot connect to database"** :
- Vérifiez que Docker est démarré : `docker-compose ps`
- Vérifiez `DATABASE_URL` dans `apps/api/.env`

**Erreur "Prisma Client not generated"** :
```bash
cd apps/api
npx prisma generate
```

**Erreur CORS** :
- L'API est configurée pour accepter les requêtes depuis `http://localhost:3000`
- Si vous changez le port, modifiez `apps/api/src/main.ts`

**Token expiré** :
- Les tokens JWT expirent après 7 jours
- Reconnectez-vous via `/login` si nécessaire


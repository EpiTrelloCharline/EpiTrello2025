# 🚀 Démarrage rapide - WebSocket Real-Time

## Après avoir cloné/récupéré le code

### 1. Installation des dépendances
```bash
# À la racine du projet
pnpm install
```

### 2. Configuration de la base de données

```bash
cd apps/api

# Génerer le client Prisma
npx prisma generate

# Appliquer les migrations (si nécessaire)
npx prisma migrate dev
```

### 3. Démarrer le backend (Terminal 1)
```bash
cd apps/api
pnpm run start:dev
```

Vous devriez voir:
```
🚀 API running on http://localhost:3001
```

### 4. Démarrer le frontend (Terminal 2)
```bash
cd apps/web
pnpm run dev
```

Vous devriez voir:
```
▲ Next.js 14.2.33
- Local:        http://localhost:3000
```

### 5. Tester les WebSockets

1. Ouvrez http://localhost:3000 dans votre navigateur
2. Connectez-vous
3. Ouvrez un board
4. Ouvrez la console développeur (F12)
5. Vous devriez voir: `"WebSocket connected"` et `"Joined board: [id]"`

### 6. Tester le temps réel

1. Ouvrez le même board dans un autre navigateur/onglet (mode incognito ou autre navigateur)
2. Créez une carte dans un navigateur
3. Observez-la apparaître instantanément dans l'autre! 🎉

## Troubleshooting

### "WebSocket not connected"
- Vérifiez que le backend est démarré sur le port 3001
- Vérifiez le fichier `.env.local` dans `apps/web`:
  ```
  NEXT_PUBLIC_API_URL=http://localhost:3001
  ```

### Erreurs TypeScript dans l'éditeur
```bash
cd apps/api
npx prisma generate
```
Puis redémarrez votre éditeur (VS Code, etc.)

### Erreurs de dépendances
```bash
# Nettoyer et réinstaller
rm -rf node_modules
pnpm install
```

## Prêt à tester!

Consultez `WEBSOCKET_TESTING.md` pour un guide de test complet.

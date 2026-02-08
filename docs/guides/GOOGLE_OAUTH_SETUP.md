# Authentification Google OAuth pour EpiTrello

Ce guide explique comment configurer et utiliser l'authentification Google OAuth dans EpiTrello.

## Configuration

### 1. Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" ou "Google Identity"

### 2. Configurer les identifiants OAuth 2.0

1. Dans Google Cloud Console, allez dans **APIs & Services** > **Credentials**
2. Cliquez sur **Create Credentials** > **OAuth client ID**
3. Choisissez **Web application**
4. Configurez :
   - **Name**: EpiTrello
   - **Authorized JavaScript origins**: 
     - `http://localhost:3000` (pour le dev)
     - Votre domaine de production
   - **Authorized redirect URIs**:
     - `http://localhost:3001/auth/google/callback` (pour le dev)
     - `https://votre-domaine-api.com/auth/google/callback` (pour la prod)

5. Cliquez sur **Create**
6. Copiez le **Client ID** et le **Client Secret**

### 3. Configurer les variables d'environnement

#### Backend (`apps/api/.env`)

```bash
# Google OAuth
GOOGLE_CLIENT_ID="votre-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="votre-client-secret"
GOOGLE_CALLBACK_URL="http://localhost:3001/auth/google/callback"

# Frontend URL for redirects
FRONTEND_URL="http://localhost:3000"

# Autres variables existantes
DATABASE_URL="postgresql://user:password@localhost:5432/trello?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
```

#### Frontend (`apps/web/.env.local`)

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### 4. Appliquer les migrations de base de données

```bash
cd apps/api
pnpm prisma db push
```

## Utilisation

### Flux d'authentification

1. L'utilisateur clique sur "Se connecter avec Google" sur la page de login
2. Il est redirigé vers Google pour autoriser l'application
3. Google redirige vers `http://localhost:3001/auth/google/callback`
4. Le backend :
   - Vérifie les informations Google
   - Crée ou met à jour l'utilisateur dans la base de données
   - Génère un JWT token
   - Redirige vers le frontend avec le token
5. Le frontend stocke le token et redirige vers les workspaces

### Points d'API

#### GET `/auth/google`
Initie le flux OAuth Google. Redirige automatiquement vers Google.

#### GET `/auth/google/callback`
Callback OAuth. Reçoit le code d'autorisation de Google, l'échange contre un token, et redirige vers le frontend.

**Paramètres de redirection:**
- `token`: JWT token d'accès

**Exemple de redirection:**
```
http://localhost:3000/auth/google/callback?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

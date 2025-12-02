# API Board Members - Documentation

Cette documentation décrit les endpoints pour gérer les membres d'un board (listing et invitation).

## Endpoints

### 1. Lister les membres d'un board

**Endpoint:** `GET /boards/:id/members`

**Description:** Récupère la liste de tous les membres d'un board avec leurs informations.

**Authentification:** JWT Token requis

**Permissions:** L'utilisateur doit être membre du board (tous les rôles: OWNER, ADMIN, MEMBER, OBSERVER)

**Paramètres:**
- `:id` - ID du board (dans l'URL)

**Réponse (200 OK):**
```json
[
  {
    "id": "cm123...",
    "userId": "clx456...",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "OWNER",
    "avatar": null
  },
  {
    "id": "cm789...",
    "userId": "clx012...",
    "name": "Jane Smith",
    "email": "jane.smith@example.com",
    "role": "ADMIN",
    "avatar": null
  }
]
```

**Erreurs possibles:**
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'est pas membre du board

**Exemple d'utilisation:**
```bash
curl -X GET http://localhost:3001/boards/cm4h123.../members \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

### 2. Inviter un membre au board

**Endpoint:** `POST /boards/:id/invite`

**Description:** Invite un utilisateur existant à rejoindre le board avec un rôle spécifique.

**Authentification:** JWT Token requis

**Permissions:** Seuls les membres avec le rôle OWNER ou ADMIN peuvent inviter

**Paramètres:**
- `:id` - ID du board (dans l'URL)

**Corps de la requête:**
```json
{
  "email": "user@example.com",
  "role": "MEMBER"
}
```

**Champs obligatoires:**
- `email` (string) - Email de l'utilisateur à inviter (doit être un email valide)
- `role` (enum) - Rôle à attribuer: `OWNER`, `ADMIN`, `MEMBER`, ou `OBSERVER`

**Réponse (201 Created):**
```json
{
  "id": "cm345...",
  "userId": "clx678...",
  "name": "New User",
  "email": "user@example.com",
  "role": "MEMBER",
  "avatar": null
}
```

**Erreurs possibles:**
- `400 Bad Request` - L'utilisateur est déjà membre du board OU l'utilisateur n'est pas membre du workspace
- `401 Unauthorized` - Token JWT manquant ou invalide
- `403 Forbidden` - L'utilisateur n'a pas les permissions (doit être OWNER ou ADMIN)
- `404 Not Found` - Board non trouvé OU utilisateur non trouvé avec cet email

**Exemple d'utilisation:**
```bash
curl -X POST http://localhost:3001/boards/cm4h123.../invite \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "newuser@example.com",
    "role": "MEMBER"
  }'
```

---

## Rôles disponibles

- **OWNER** - Propriétaire du board (droits complets)
- **ADMIN** - Administrateur (peut inviter et gérer les membres)
- **MEMBER** - Membre standard (peut lire et écrire)
- **OBSERVER** - Observateur (lecture seule)

## Validations

### Invitation de membre

1. L'utilisateur qui invite doit avoir le rôle OWNER ou ADMIN
2. L'utilisateur invité doit exister dans la base de données
3. L'utilisateur invité ne doit pas être déjà membre du board
4. L'utilisateur invité doit être membre du workspace parent du board

## Guards utilisés

- **JwtAuthGuard** - Vérifie que l'utilisateur est authentifié
- **BoardReadGuard** - Vérifie que l'utilisateur peut lire le board (pour GET /members)
- **BoardAdminGuard** - Vérifie que l'utilisateur est OWNER ou ADMIN (pour POST /invite)

## Structure de données

### BoardMember
```typescript
{
  id: string;
  userId: string;
  name: string | null;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'MEMBER' | 'OBSERVER';
  avatar: string | null; // Pour future implémentation
}
```

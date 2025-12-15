# 🔐 Système de Permissions de Board

Ce document explique le fonctionnement du système de permissions basé sur les rôles pour contrôler l'accès aux boards, listes et cartes dans EpiTrello.

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Rôles et Permissions](#rôles-et-permissions)
- [Architecture](#architecture)
- [Utilisation](#utilisation)
- [Exemples de Code](#exemples-de-code)
- [Tests](#tests)

---

## Vue d'ensemble

Le système de permissions garantit que seuls les utilisateurs autorisés peuvent accéder et modifier les ressources d'un board. Il utilise un système de **rôles** (OWNER, ADMIN, MEMBER, OBSERVER) pour déterminer les droits de chaque utilisateur.

### Principes de base

1. **Authentification requise** : Tous les endpoints nécessitent un JWT valide
2. **Membership requis** : L'utilisateur doit être membre du board
3. **Rôles hiérarchiques** : Chaque rôle a des permissions spécifiques
4. **Erreurs explicites** : Messages d'erreur clairs en français (403 Forbidden)

---

## Rôles et Permissions

### Matrice des Permissions

| Rôle     | Lecture (GET) | Écriture (POST/PATCH/DELETE) | Description |
|----------|---------------|------------------------------|-------------|
| **OWNER**    | ✅ Autorisé   | ✅ Autorisé                  | Créateur du board, tous les droits |
| **ADMIN**    | ✅ Autorisé   | ✅ Autorisé                  | Administrateur, peut tout modifier |
| **MEMBER**   | ✅ Autorisé   | ✅ Autorisé                  | Membre actif, peut créer et modifier |
| **OBSERVER** | ✅ Autorisé   | ❌ **BLOQUÉ**                | Lecture seule, ne peut pas modifier |
| *Non-membre* | ❌ **BLOQUÉ** | ❌ **BLOQUÉ**                | Aucun accès au board |

### Détails des Rôles

#### 🔑 OWNER (Propriétaire)
- Créateur du board
- Accès complet en lecture et écriture
- Peut gérer les membres (à implémenter)

#### 👑 ADMIN (Administrateur)
- Droits similaires à OWNER
- Peut modifier toutes les ressources du board
- Peut gérer les membres (à implémenter)

#### 👤 MEMBER (Membre)
- Peut lire toutes les ressources
- Peut créer, modifier et supprimer des cartes et listes
- Utilisateur standard du board

#### 👁️ OBSERVER (Observateur)
- **Lecture seule**
- Peut voir le board, les listes et les cartes
- **Ne peut PAS** créer, modifier ou supprimer
- Idéal pour les parties prenantes, clients, etc.

---

## Architecture

### Composants Principaux

```
apps/api/src/boards/
├── board-permissions.service.ts    # Service centralisé de permissions
├── guards/
│   ├── board-read.guard.ts        # Guard pour l'accès en lecture
│   └── board-write.guard.ts       # Guard pour l'accès en écriture
└── boards.module.ts               # Module exportant le service
```

### 1. BoardPermissionsService

**Fichier** : [`apps/api/src/boards/board-permissions.service.ts`](file:///home/charline/EpiTrello2025/apps/api/src/boards/board-permissions.service.ts)

Service centralisé qui gère toute la logique de permissions.

#### Méthodes principales

```typescript
// Récupère le rôle d'un utilisateur sur un board
async getUserBoardRole(userId: string, boardId: string): Promise<BoardRole | null>

// Vérifie si un rôle a accès en lecture (tous les rôles)
hasReadAccess(role: BoardRole): boolean

// Vérifie si un rôle a accès en écriture (OWNER, ADMIN, MEMBER uniquement)
hasWriteAccess(role: BoardRole): boolean

// Helpers pour remonter au boardId
async getBoardIdFromList(listId: string): Promise<string>
async getBoardIdFromCard(cardId: string): Promise<string>
```

#### Logique de Permissions

```typescript
// Lecture : tous les rôles
hasReadAccess(role: BoardRole): boolean {
    return ['OWNER', 'ADMIN', 'MEMBER', 'OBSERVER'].includes(role);
}

// Écriture : OBSERVER est bloqué
hasWriteAccess(role: BoardRole): boolean {
    return ['OWNER', 'ADMIN', 'MEMBER'].includes(role);
}
```

### 2. BoardReadGuard

**Fichier** : [`apps/api/src/boards/guards/board-read.guard.ts`](file:///home/charline/EpiTrello2025/apps/api/src/boards/guards/board-read.guard.ts)

Guard NestJS pour protéger les endpoints de **lecture**.

#### Fonctionnement

1. Récupère l'utilisateur depuis le JWT (`request.user.id`)
2. Résout le `boardId` depuis la requête (params, query, body, ou via listId/cardId)
3. Vérifie que l'utilisateur est membre du board
4. Vérifie que le rôle a accès en lecture
5. Lève `ForbiddenException` si accès refusé

#### Résolution du boardId

Le guard est intelligent et peut résoudre le `boardId` de plusieurs façons :

```typescript
// Cas 1: boardId directement dans les paramètres
GET /boards/:id              → params.id
GET /lists?boardId=xxx       → query.boardId
POST /lists {boardId: "xxx"} → body.boardId

// Cas 2: via listId (remonte au board)
GET /cards?listId=xxx        → list.boardId

// Cas 3: via cardId (remonte via liste → board)
PATCH /cards/:id             → card.list.boardId
```

### 3. BoardWriteGuard

**Fichier** : [`apps/api/src/boards/guards/board-write.guard.ts`](file:///home/charline/EpiTrello2025/apps/api/src/boards/guards/board-write.guard.ts)

Guard NestJS pour protéger les endpoints d'**écriture** (POST, PATCH, DELETE).

#### Différence avec BoardReadGuard

- Même logique de résolution du `boardId`
- Utilise `hasWriteAccess()` au lieu de `hasReadAccess()`
- **Bloque les OBSERVER** avec un message d'erreur explicite

---

## Utilisation

### Dans les Contrôleurs

Les guards s'appliquent avec le décorateur `@UseGuards()` de NestJS.

#### Exemple : Cards Controller

```typescript
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BoardReadGuard } from '../boards/guards/board-read.guard';
import { BoardWriteGuard } from '../boards/guards/board-write.guard';

@UseGuards(JwtAuthGuard) // Authentification JWT sur tout le contrôleur
@Controller('cards')
export class CardsController {
    
    // Lecture : tous les rôles autorisés
    @UseGuards(BoardReadGuard)
    @Get()
    list(@Query('listId') listId: string) {
        // ...
    }
    
    // Écriture : OBSERVER bloqué
    @UseGuards(BoardWriteGuard)
    @Post()
    create(@Body() dto: CreateCardDto) {
        // ...
    }
    
    @UseGuards(BoardWriteGuard)
    @Patch(':id')
    update(@Param('id') id: string, @Body() dto: UpdateCardDto) {
        // ...
    }
    
    @UseGuards(BoardWriteGuard)
    @Delete(':id')
    archive(@Param('id') id: string) {
        // ...
    }
}
```

#### Exemple : Lists Controller

```typescript
@UseGuards(JwtAuthGuard)
@Controller('lists')
export class ListsController {
    
    @UseGuards(BoardReadGuard)
    @Get()
    list(@Query('boardId') boardId: string) {
        // ...
    }
    
    @UseGuards(BoardWriteGuard)
    @Post()
    create(@Body() dto: CreateListDto) {
        // ...
    }
    
    @UseGuards(BoardWriteGuard)
    @Post('move')
    move(@Body() dto: MoveListDto) {
        // ...
    }
}
```

### Configuration des Modules

Les modules doivent importer `BoardsModule` pour accéder au service de permissions.

```typescript
// cards.module.ts ou lists.module.ts
import { Module } from '@nestjs/common';
import { BoardsModule } from '../boards/boards.module';

@Module({
    imports: [BoardsModule], // ← Important !
    controllers: [CardsController],
    providers: [CardsService, PrismaService],
})
export class CardsModule {}
```

Le `BoardsModule` exporte le service :

```typescript
// boards.module.ts
@Module({
    controllers: [BoardsController],
    providers: [BoardsService, BoardPermissionsService, PrismaService],
    exports: [BoardPermissionsService], // ← Exporté pour les autres modules
})
export class BoardsModule {}
```

---

## Exemples de Code

### Ajouter un Guard à un Nouveau Endpoint

Si vous créez un nouvel endpoint qui manipule des ressources de board :

```typescript
// Pour un endpoint de LECTURE
@UseGuards(JwtAuthGuard, BoardReadGuard)
@Get('my-endpoint')
myReadEndpoint() {
    // Tous les membres peuvent accéder
}

// Pour un endpoint d'ÉCRITURE
@UseGuards(JwtAuthGuard, BoardWriteGuard)
@Post('my-endpoint')
myWriteEndpoint() {
    // OBSERVER sera bloqué
}
```

### Utiliser le Service Directement

Si vous avez besoin de vérifier les permissions dans votre code :

```typescript
import { BoardPermissionsService } from '../boards/board-permissions.service';

@Injectable()
export class MyService {
    constructor(private permissions: BoardPermissionsService) {}
    
    async myMethod(userId: string, boardId: string) {
        // Récupérer le rôle
        const role = await this.permissions.getUserBoardRole(userId, boardId);
        
        if (!role) {
            throw new ForbiddenException('Vous n\'êtes pas membre de ce board');
        }
        
        // Vérifier l'accès en écriture
        if (!this.permissions.hasWriteAccess(role)) {
            throw new ForbiddenException('Vous n\'avez pas les droits pour cette action');
        }
        
        // Continuer...
    }
}
```

### Messages d'Erreur

Les guards renvoient des erreurs HTTP 403 avec des messages en français :

```json
// Non-membre
{
    "statusCode": 403,
    "message": "Vous n'êtes pas membre de ce board"
}

// OBSERVER essayant d'écrire
{
    "statusCode": 403,
    "message": "Vous n'avez pas les droits pour cette action"
}

// Board non trouvé
{
    "statusCode": 403,
    "message": "Board non spécifié"
}
```

---

## Tests

### Test Rapide

Un script de test rapide est disponible à la racine :

```bash
./quick-test-permissions.sh
```

Ce script teste :
- ✅ Connexion à l'API
- ✅ Création d'utilisateur
- ✅ Authentification JWT
- ✅ BoardReadGuard (lecture)
- ✅ BoardWriteGuard (écriture)

### Tests Manuels avec curl

#### 1. Créer un utilisateur

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","password":"test123"}'
```

Sauvegarder le `accessToken`.

#### 2. Créer un workspace et un board

```bash
# Workspace
curl -X POST http://localhost:3001/workspaces \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Workspace"}'

# Board
curl -X POST http://localhost:3001/boards \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"workspaceId":"<WS_ID>","title":"My Board"}'
```

#### 3. Tester les permissions

```bash
# Lire le board (devrait fonctionner)
curl -X GET http://localhost:3001/boards/<BOARD_ID> \
  -H "Authorization: Bearer <TOKEN>"

# Créer une liste (devrait fonctionner)
curl -X POST http://localhost:3001/lists \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"boardId":"<BOARD_ID>","title":"My List"}'
```

#### 4. Tester avec un OBSERVER

1. Créer un second utilisateur
2. Ouvrir Prisma Studio : `cd apps/api && npx prisma studio`
3. Ajouter une entrée dans `BoardMember` :
   - `boardId`: ID du board
   - `userId`: ID du second utilisateur
   - `role`: `OBSERVER`
4. Tester avec le token du second utilisateur :

```bash
# Lecture : devrait fonctionner ✅
curl -X GET http://localhost:3001/cards?listId=<LIST_ID> \
  -H "Authorization: Bearer <OBSERVER_TOKEN>"

# Écriture : devrait échouer ❌ (403)
curl -X POST http://localhost:3001/cards \
  -H "Authorization: Bearer <OBSERVER_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"listId":"<LIST_ID>","title":"Test"}'
```

**Résultat attendu** : 403 avec message "Vous n'avez pas les droits pour cette action"

---

## 🎯 Résumé

### Points Clés

1. **Service centralisé** : `BoardPermissionsService` gère toute la logique
2. **Deux guards** : `BoardReadGuard` (tous) et `BoardWriteGuard` (sauf OBSERVER)
3. **Résolution intelligente** : Les guards trouvent automatiquement le `boardId`
4. **Erreurs claires** : Messages en français avec HTTP 403
5. **Facile à étendre** : Appliquer les guards sur de nouveaux endpoints

### Checklist pour Nouveaux Endpoints

- [ ] Importer `JwtAuthGuard` et le guard approprié
- [ ] Appliquer `@UseGuards(JwtAuthGuard, BoardReadGuard)` pour la lecture
- [ ] Appliquer `@UseGuards(JwtAuthGuard, BoardWriteGuard)` pour l'écriture
- [ ] S'assurer que le module importe `BoardsModule`
- [ ] Tester avec différents rôles

### Prochaines Étapes

Quand les **labels** seront implémentés, appliquer le même pattern :

```typescript
@Controller('labels')
export class LabelsController {
    @UseGuards(JwtAuthGuard, BoardReadGuard)
    @Get()
    list(@Query('boardId') boardId: string) { }
    
    @UseGuards(JwtAuthGuard, BoardWriteGuard)
    @Post()
    create(@Body() dto: CreateLabelDto) { }
}
```

---

## 📚 Ressources

- [Prisma Schema](file:///home/charline/EpiTrello2025/apps/api/prisma/schema.prisma) - Modèles de données (BoardRole, BoardMember)
- [BoardPermissionsService](file:///home/charline/EpiTrello2025/apps/api/src/boards/board-permissions.service.ts) - Service de permissions
- [BoardReadGuard](file:///home/charline/EpiTrello2025/apps/api/src/boards/guards/board-read.guard.ts) - Guard de lecture
- [BoardWriteGuard](file:///home/charline/EpiTrello2025/apps/api/src/boards/guards/board-write.guard.ts) - Guard d'écriture
- [NestJS Guards Documentation](https://docs.nestjs.com/guards) - Documentation officielle

---

**Dernière mise à jour** : 30 novembre 2025

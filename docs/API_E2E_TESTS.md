# Tests API E2E - Documentation

## Vue d'ensemble

Les tests E2E (End-to-End) de l'API testent les endpoints HTTP complets avec leur logique métier, validations et guards.

## Structure des tests

```
apps/api/test/
├── jest-e2e.json          # Configuration Jest pour les tests E2E
├── cards.e2e-spec.ts      # Tests des endpoints de cartes
├── labels.e2e-spec.ts     # Tests des endpoints de labels
├── permissions.e2e-spec.ts # Tests des permissions et rôles
└── comments.e2e-spec.ts   # Tests des commentaires
```

## Configuration

### jest-e2e.json

```json
{
    "moduleFileExtensions": ["js", "json", "ts"],
    "rootDir": ".",
    "testEnvironment": "node",
    "testRegex": ".e2e-spec.ts$",
    "transform": {
        "^.+\\.(t|j)s$": "ts-jest"
    },
    "moduleNameMapper": {
        "^src/(.*)$": "<rootDir>/../src/$1"
    }
}
```

## Exécution des tests

```bash
# Tous les tests E2E
cd apps/api && pnpm test:e2e

# Un fichier spécifique
cd apps/api && pnpm test:e2e -- cards.e2e-spec.ts

# En mode watch
cd apps/api && pnpm test:e2e -- --watch

# Avec verbose
cd apps/api && pnpm test:e2e -- --verbose
```

## Structure d'un test E2E

### Template de base

```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('FeatureController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    // Mock du PrismaService
    const mockPrismaService = {
        // Définir les méthodes mockées
    };

    // Mock de l'utilisateur authentifié
    const mockUser = {
        id: 'user1',
        email: 'test@example.com',
    };

    // Mock du guard JWT
    const mockJwtGuard = {
        canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = mockUser;
            return true;
        },
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prismaService = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('GET /endpoint', () => {
        it('should return data', () => {
            // Configuration des mocks
            mockPrismaService.model.findMany.mockResolvedValue([]);

            return request(app.getHttpServer())
                .get('/endpoint')
                .expect(200)
                .expect((res) => {
                    expect(res.body).toEqual([]);
                });
        });
    });
});
```

## Tests par fonctionnalité

### 1. Tests des Cartes (cards.e2e-spec.ts)

Tests couverts :
- ✅ GET `/lists/:listId/cards` - Liste des cartes d'une liste
- ✅ POST `/lists/:listId/cards` - Création d'une carte
- ✅ GET `/cards/:id` - Récupération d'une carte
- ✅ PATCH `/cards/:id` - Mise à jour d'une carte
- ✅ DELETE `/cards/:id` - Suppression d'une carte
- ✅ PATCH `/cards/:id/move` - Déplacement d'une carte
- ✅ Validation des données (titre vide, etc.)
- ✅ Erreurs 404 pour ressources inexistantes

### 2. Tests des Labels (labels.e2e-spec.ts)

Tests couverts :
- ✅ GET `/boards/:boardId/labels` - Liste des labels d'un board
- ✅ POST `/boards/:boardId/labels` - Création d'un label
- ✅ PATCH `/labels/:id` - Mise à jour d'un label
- ✅ DELETE `/labels/:id` - Suppression d'un label
- ✅ POST `/cards/:cardId/labels/:labelId` - Attacher un label à une carte
- ✅ DELETE `/cards/:cardId/labels/:labelId` - Détacher un label d'une carte
- ✅ Validation des couleurs (format hexadécimal)
- ✅ Validation de la cohérence board/label

### 3. Tests des Permissions (permissions.e2e-spec.ts)

Tests couverts :
- ✅ Permissions **OWNER** :
  - Peut modifier le board
  - Peut supprimer le board
- ✅ Permissions **ADMIN** :
  - Peut créer des listes
  - Ne peut PAS supprimer le board
- ✅ Permissions **MEMBER** :
  - Peut créer des cartes
  - Peut modifier des cartes
  - Ne peut PAS modifier les settings du board
- ✅ Permissions **OBSERVER** (lecture seule) :
  - Peut voir le board
  - Ne peut PAS modifier le board
- ✅ Non-membres :
  - Ne peuvent PAS voir le board
  - Ne peuvent PAS créer de cartes

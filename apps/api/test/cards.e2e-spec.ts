import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';
import { BoardReadGuard } from '../src/boards/guards/board-read.guard';
import { BoardWriteGuard } from '../src/boards/guards/board-write.guard';
import { ActivitiesService } from '../src/activities/activities.service';
import { NotificationsService } from '../src/notifications/notifications.service';

describe('CardsController (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    const mockPrismaService = {
        card: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        list: {
            findUnique: jest.fn(),
        },
        cardLabel: {
            createMany: jest.fn(),
            deleteMany: jest.fn(),
        },
        activity: {
            create: jest.fn(),
        },
        boardMember: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
        },
    };

    const mockActivitiesService = {
        logActivity: jest.fn(),
    };

    const mockNotificationsService = {
        notifyBoardMembers: jest.fn(),
    };

    const mockUser = {
        id: 'user1',
        email: 'test@example.com',
    };

    const mockJwtGuard = {
        canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = mockUser;
            return true;
        },
    };

    const mockBoardGuard = {
        canActivate: () => true,
    };

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        })
            .overrideProvider(PrismaService)
            .useValue(mockPrismaService)
            .overrideProvider(ActivitiesService)
            .useValue(mockActivitiesService)
            .overrideProvider(NotificationsService)
            .useValue(mockNotificationsService)
            .overrideGuard(JwtAuthGuard)
            .useValue(mockJwtGuard)
            .overrideGuard(BoardReadGuard)
            .useValue(mockBoardGuard)
            .overrideGuard(BoardWriteGuard)
            .useValue(mockBoardGuard)
            .compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe());
        await app.init();

        prismaService = moduleFixture.get<PrismaService>(PrismaService);
    });

    afterAll(async () => {
        await app.close();
    });

    describe('/lists/:listId/cards (GET)', () => {
        it('should return all cards for a list', () => {
            const listId = 'list1';
            const mockCards = [
                { id: 'card1', title: 'Card 1', listId },
                { id: 'card2', title: 'Card 2', listId },
            ];

            const mockList = {
                id: listId,
                board: {
                    createdById: 'owner1',
                    members: [{ userId: 'user1', role: 'MEMBER' }],
                },
            };

            mockPrismaService.list.findUnique.mockResolvedValue(mockList);
            mockPrismaService.card.findMany.mockResolvedValue(mockCards);

            return request(app.getHttpServer())
                .get(`/lists/${listId}/cards`)
                .expect(200)
                .expect((res) => {
                    expect(res.body).toHaveLength(2);
                    expect(res.body[0].title).toEqual('Card 1');
                });
        });
    });

    describe('/lists/:listId/cards (POST)', () => {
        it('should create a new card', () => {
            const listId = 'list1';
            const dto = { 
                title: 'New Card',
                description: 'Card description',
                position: 0
            };

            const mockList = {
                id: listId,
                boardId: 'board1',
                board: {
                    createdById: 'owner1',
                    members: [{ userId: 'user1', role: 'MEMBER' }],
                },
            };

            const mockCard = { id: 'card1', ...dto, listId };

            mockPrismaService.list.findUnique.mockResolvedValue(mockList);
            mockPrismaService.card.create.mockResolvedValue(mockCard);

            return request(app.getHttpServer())
                .post(`/lists/${listId}/cards`)
                .send(dto)
                .expect(201)
                .expect((res) => {
                    expect(res.body.title).toEqual(dto.title);
                    expect(res.body.description).toEqual(dto.description);
                });
        });

        it('should fail with invalid data', () => {
            const listId = 'list1';
            const invalidDto = { title: '' }; // Empty title should fail validation

            return request(app.getHttpServer())
                .post(`/lists/${listId}/cards`)
                .send(invalidDto)
                .expect(400);
        });
    });

    describe('/cards/:id (GET)', () => {
        it('should return a card by id', () => {
            const cardId = 'card1';
            const mockCard = {
                id: cardId,
                title: 'Test Card',
                description: 'Test description',
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'MEMBER' }],
                    },
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);

            return request(app.getHttpServer())
                .get(`/cards/${cardId}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.id).toEqual(cardId);
                    expect(res.body.title).toEqual('Test Card');
                });
        });

        it('should return 404 for non-existent card', () => {
            const cardId = 'non-existent';
            mockPrismaService.card.findUnique.mockResolvedValue(null);

            return request(app.getHttpServer())
                .get(`/cards/${cardId}`)
                .expect(404);
        });
    });

    describe('/cards/:id (PATCH)', () => {
        it('should update a card', () => {
            const cardId = 'card1';
            const updateDto = { title: 'Updated Card' };

            const mockCard = {
                id: cardId,
                title: 'Old Title',
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'MEMBER' }],
                    },
                },
            };

            const updatedCard = { ...mockCard, ...updateDto };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
            mockPrismaService.card.update.mockResolvedValue(updatedCard);

            return request(app.getHttpServer())
                .patch(`/cards/${cardId}`)
                .send(updateDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.title).toEqual('Updated Card');
                });
        });
    });

    describe('/cards/:id (DELETE)', () => {
        it('should delete a card', () => {
            const cardId = 'card1';

            const mockCard = {
                id: cardId,
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'ADMIN' }],
                    },
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
            mockPrismaService.card.delete.mockResolvedValue(mockCard);

            return request(app.getHttpServer())
                .delete(`/cards/${cardId}`)
                .expect(200);
        });
    });

    describe('/cards/:id/move (PATCH)', () => {
        it('should move a card to a different list', () => {
            const cardId = 'card1';
            const moveDto = { 
                listId: 'list2',
                position: 0
            };

            const mockCard = {
                id: cardId,
                listId: 'list1',
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'MEMBER' }],
                    },
                },
            };

            const mockNewList = {
                id: 'list2',
                boardId: 'board1',
            };

            const movedCard = { ...mockCard, listId: 'list2' };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
            mockPrismaService.list.findUnique.mockResolvedValue(mockNewList);
            mockPrismaService.card.update.mockResolvedValue(movedCard);

            return request(app.getHttpServer())
                .patch(`/cards/${cardId}/move`)
                .send(moveDto)
                .expect(200)
                .expect((res) => {
                    expect(res.body.listId).toEqual('list2');
                });
        });
    });
});

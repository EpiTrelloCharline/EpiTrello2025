import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma.service';
import { JwtAuthGuard } from '../src/auth/jwt-auth.guard';

describe('Permissions (e2e)', () => {
    let app: INestApplication;
    let prismaService: PrismaService;

    const mockPrismaService = {
        board: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        boardMember: {
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        list: {
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        card: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };

    const mockOwnerUser = {
        id: 'owner1',
        email: 'owner@example.com',
    };

    const mockMemberUser = {
        id: 'member1',
        email: 'member@example.com',
    };

    const mockGuestUser = {
        id: 'guest1',
        email: 'guest@example.com',
    };

    let currentUser = mockOwnerUser;

    const mockJwtGuard = {
        canActivate: (context) => {
            const req = context.switchToHttp().getRequest();
            req.user = currentUser;
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
        currentUser = mockOwnerUser; // Reset to owner for each test
    });

    afterAll(async () => {
        await app.close();
    });

    describe('Board Permissions', () => {
        describe('Owner permissions', () => {
            it('should allow owner to update board', () => {
                const boardId = 'board1';
                const updateDto = { name: 'Updated Board' };

                const mockBoard = {
                    id: boardId,
                    name: 'Old Board',
                    createdById: 'owner1',
                    members: [{ userId: 'owner1', role: 'OWNER' }],
                };

                currentUser = mockOwnerUser;
                mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'owner1', 
                    role: 'OWNER' 
                });
                mockPrismaService.board.update.mockResolvedValue({ ...mockBoard, ...updateDto });

                return request(app.getHttpServer())
                    .patch(`/boards/${boardId}`)
                    .send(updateDto)
                    .expect(200);
            });

            it('should allow owner to delete board', () => {
                const boardId = 'board1';

                const mockBoard = {
                    id: boardId,
                    createdById: 'owner1',
                    members: [{ userId: 'owner1', role: 'OWNER' }],
                };

                currentUser = mockOwnerUser;
                mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'owner1', 
                    role: 'OWNER' 
                });
                mockPrismaService.board.delete.mockResolvedValue(mockBoard);

                return request(app.getHttpServer())
                    .delete(`/boards/${boardId}`)
                    .expect(200);
            });
        });

        describe('Admin permissions', () => {
            it('should allow admin to create list', () => {
                const boardId = 'board1';
                const createDto = { 
                    name: 'New List',
                    position: 0
                };

                const mockBoard = {
                    id: boardId,
                    createdById: 'owner1',
                    members: [
                        { userId: 'owner1', role: 'OWNER' },
                        { userId: 'member1', role: 'ADMIN' }
                    ],
                };

                const mockList = {
                    id: 'list1',
                    ...createDto,
                    boardId,
                };

                currentUser = mockMemberUser;
                mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'member1', 
                    role: 'ADMIN' 
                });
                mockPrismaService.list.create.mockResolvedValue(mockList);

                return request(app.getHttpServer())
                    .post(`/boards/${boardId}/lists`)
                    .send(createDto)
                    .expect(201);
            });

            it('should deny admin from deleting board', () => {
                const boardId = 'board1';

                const mockBoard = {
                    id: boardId,
                    createdById: 'owner1',
                    members: [
                        { userId: 'owner1', role: 'OWNER' },
                        { userId: 'member1', role: 'ADMIN' }
                    ],
                };

                currentUser = mockMemberUser;
                mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'member1', 
                    role: 'ADMIN' 
                });

                return request(app.getHttpServer())
                    .delete(`/boards/${boardId}`)
                    .expect(403);
            });
        });

        describe('Member permissions', () => {
            it('should allow member to create card', () => {
                const listId = 'list1';
                const createDto = {
                    title: 'New Card',
                    position: 0
                };

                const mockList = {
                    id: listId,
                    board: {
                        id: 'board1',
                        createdById: 'owner1',
                        members: [
                            { userId: 'owner1', role: 'OWNER' },
                            { userId: 'member1', role: 'MEMBER' }
                        ],
                    },
                };

                const mockCard = {
                    id: 'card1',
                    ...createDto,
                    listId,
                };

                currentUser = mockMemberUser;
                mockPrismaService.list.findUnique.mockResolvedValue(mockList);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'member1', 
                    role: 'MEMBER' 
                });
                mockPrismaService.card.create.mockResolvedValue(mockCard);

                return request(app.getHttpServer())
                    .post(`/lists/${listId}/cards`)
                    .send(createDto)
                    .expect(201);
            });

            it('should allow member to update card', () => {
                const cardId = 'card1';
                const updateDto = { title: 'Updated Card' };

                const mockCard = {
                    id: cardId,
                    title: 'Old Card',
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [
                                { userId: 'owner1', role: 'OWNER' },
                                { userId: 'member1', role: 'MEMBER' }
                            ],
                        },
                    },
                };

                currentUser = mockMemberUser;
                mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'member1', 
                    role: 'MEMBER' 
                });
                mockPrismaService.card.update.mockResolvedValue({ ...mockCard, ...updateDto });

                return request(app.getHttpServer())
                    .patch(`/cards/${cardId}`)
                    .send(updateDto)
                    .expect(200);
            });

            it('should deny member from updating board settings', () => {
                const boardId = 'board1';
                const updateDto = { name: 'New Name' };

                const mockBoard = {
                    id: boardId,
                    createdById: 'owner1',
                    members: [
                        { userId: 'owner1', role: 'OWNER' },
                        { userId: 'member1', role: 'MEMBER' }
                    ],
                };

                currentUser = mockMemberUser;
                mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                    userId: 'member1', 
                    role: 'MEMBER' 
                });

                return request(app.getHttpServer())
                    .patch(`/boards/${boardId}`)
                    .send(updateDto)
                    .expect(403);
            });
        });

        describe('Non-member permissions', () => {
            it('should deny non-member from viewing board', () => {
                const boardId = 'board1';

                const mockBoard = {
                    id: boardId,
                    createdById: 'owner1',
                    members: [{ userId: 'owner1', role: 'OWNER' }],
                };

                currentUser = mockGuestUser;
                mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
                mockPrismaService.boardMember.findFirst.mockResolvedValue(null);

                return request(app.getHttpServer())
                    .get(`/boards/${boardId}`)
                    .expect(403);
            });

            it('should deny non-member from creating card', () => {
                const listId = 'list1';
                const createDto = {
                    title: 'New Card',
                    position: 0
                };

                const mockList = {
                    id: listId,
                    board: {
                        id: 'board1',
                        createdById: 'owner1',
                        members: [{ userId: 'owner1', role: 'OWNER' }],
                    },
                };

                currentUser = mockGuestUser;
                mockPrismaService.list.findUnique.mockResolvedValue(mockList);
                mockPrismaService.boardMember.findFirst.mockResolvedValue(null);

                return request(app.getHttpServer())
                    .post(`/lists/${listId}/cards`)
                    .send(createDto)
                    .expect(403);
            });
        });
    });

    describe('Read vs Write Permissions', () => {
        it('should allow read-only permission to view board', () => {
            const boardId = 'board1';

            const mockBoard = {
                id: boardId,
                name: 'Test Board',
                createdById: 'owner1',
                members: [
                    { userId: 'owner1', role: 'OWNER' },
                    { userId: 'guest1', role: 'OBSERVER' }
                ],
            };

            currentUser = mockGuestUser;
            mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
            mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                userId: 'guest1', 
                role: 'OBSERVER' 
            });

            return request(app.getHttpServer())
                .get(`/boards/${boardId}`)
                .expect(200);
        });

        it('should deny read-only permission to modify board', () => {
            const boardId = 'board1';
            const updateDto = { name: 'New Name' };

            const mockBoard = {
                id: boardId,
                createdById: 'owner1',
                members: [
                    { userId: 'owner1', role: 'OWNER' },
                    { userId: 'guest1', role: 'OBSERVER' }
                ],
            };

            currentUser = mockGuestUser;
            mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);
            mockPrismaService.boardMember.findFirst.mockResolvedValue({ 
                userId: 'guest1', 
                role: 'OBSERVER' 
            });

            return request(app.getHttpServer())
                .patch(`/boards/${boardId}`)
                .send(updateDto)
                .expect(403);
        });
    });
});

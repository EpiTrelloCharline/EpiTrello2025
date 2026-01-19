import { Test, TestingModule } from '@nestjs/testing';
import { CommentsService } from './comments.service';
import { PrismaService } from '../prisma.service';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { NotificationsService } from '../notifications/notifications.service';
import { WebSocketsGateway } from '../websockets/websockets.gateway';

describe('CommentsService', () => {
    let service: CommentsService;
    let prisma: PrismaService;

    const mockPrismaService = {
        card: {
            findUnique: jest.fn(),
        },
        comment: {
            create: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
    };
    const mockNotificationsService = {
        extractMentions: jest.fn().mockReturnValue([]),
        notifyMentions: jest.fn(),
        notifyBoardMembers: jest.fn(),
    };
    const mockWebSocketsGateway = {
        emitCommentAdd: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommentsService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                { provide: NotificationsService, useValue: mockNotificationsService },
                { provide: WebSocketsGateway, useValue: mockWebSocketsGateway },
            ],
        }).compile();

        service = module.get<CommentsService>(CommentsService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a comment if user is a board member', async () => {
            const userId = 'user1';
            const cardId = 'card1';
            const dto = { content: 'Test comment' };

            const mockCard = {
                id: cardId,
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'MEMBER' }],
                    },
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);
            mockPrismaService.comment.create.mockResolvedValue({
                id: 'comment1',
                ...dto,
                user: { id: userId, name: 'Test User', avatar: null }
            });

            const result = await service.create(userId, cardId, dto);
            expect(result).toEqual({
                id: 'comment1',
                ...dto,
                user: { id: userId, name: 'Test User', avatar: null }
            });
        });

        it('should throw ForbiddenException if user is not a board member', async () => {
            const userId = 'user2';
            const cardId = 'card1';
            const dto = { content: 'Test comment' };

            const mockCard = {
                id: cardId,
                list: {
                    board: {
                        createdById: 'owner1',
                        members: [{ userId: 'user1', role: 'MEMBER' }],
                    },
                },
            };

            mockPrismaService.card.findUnique.mockResolvedValue(mockCard);

            await expect(service.create(userId, cardId, dto)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('update', () => {
        it('should update a comment if user is the author', async () => {
            const userId = 'user1';
            const commentId = 'comment1';
            const dto = { content: 'Updated content' };

            const mockComment = {
                id: commentId,
                userId: 'user1',
                card: {
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [{ userId: 'user1', role: 'MEMBER' }],
                        },
                    },
                },
            };

            mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
            mockPrismaService.comment.update.mockResolvedValue({ id: commentId, ...dto });

            const result = await service.update(userId, commentId, dto);
            expect(result).toEqual({ id: commentId, ...dto });
        });

        it('should update a comment if user is admin', async () => {
            const userId = 'admin1';
            const commentId = 'comment1';
            const dto = { content: 'Updated content' };

            const mockComment = {
                id: commentId,
                userId: 'user1',
                card: {
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [{ userId: 'admin1', role: 'ADMIN' }],
                        },
                    },
                },
            };

            mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
            mockPrismaService.comment.update.mockResolvedValue({ id: commentId, ...dto });

            const result = await service.update(userId, commentId, dto);
            expect(result).toEqual({ id: commentId, ...dto });
        });

        it('should throw ForbiddenException if user is not author or admin', async () => {
            const userId = 'user2';
            const commentId = 'comment1';
            const dto = { content: 'Updated content' };

            const mockComment = {
                id: commentId,
                userId: 'user1',
                card: {
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [{ userId: 'user2', role: 'MEMBER' }],
                        },
                    },
                },
            };

            mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);

            await expect(service.update(userId, commentId, dto)).rejects.toThrow(ForbiddenException);
        });
    });

    describe('remove', () => {
        it('should delete a comment if user is the author', async () => {
            const userId = 'user1';
            const commentId = 'comment1';

            const mockComment = {
                id: commentId,
                userId: 'user1',
                card: {
                    list: {
                        board: {
                            createdById: 'owner1',
                            members: [{ userId: 'user1', role: 'MEMBER' }],
                        },
                    },
                },
            };

            mockPrismaService.comment.findUnique.mockResolvedValue(mockComment);
            mockPrismaService.comment.delete.mockResolvedValue({ id: commentId });

            const result = await service.remove(userId, commentId);
            expect(result).toEqual({ id: commentId });
        });
    });
});

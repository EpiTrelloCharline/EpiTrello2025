import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { PrismaService } from '../prisma.service';
import { ActivitiesService } from '../activities/activities.service';
import { ForbiddenException } from '@nestjs/common';
import { ActivityType } from '@prisma/client';

describe('CardsService', () => {
    let service: CardsService;
    let prismaService: PrismaService;
    let activitiesService: ActivitiesService;

    const mockPrismaService = {
        card: {
            findMany: jest.fn(),
            findFirst: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        list: {
            findUnique: jest.fn(),
        },
        cardLabel: {
            createMany: jest.fn(),
        },
    };

    const mockActivitiesService = {
        logActivity: jest.fn(),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CardsService,
                { provide: PrismaService, useValue: mockPrismaService },
                { provide: ActivitiesService, useValue: mockActivitiesService },
            ],
        }).compile();

        service = module.get<CardsService>(CardsService);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _prismaService = module.get<PrismaService>(PrismaService);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _activitiesService = module.get<ActivitiesService>(ActivitiesService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a card with correct position', async () => {
            const userId = 'user-1';
            const listId = 'list-1';
            const dto = { title: 'Test Card', description: 'Description', listId };

            mockPrismaService.list.findUnique.mockResolvedValue({
                id: listId,
                boardId: 'board-1',
                title: 'Test List',
                board: { members: [{ userId }], createdById: userId },
            });

            mockPrismaService.card.findFirst.mockResolvedValue({
                position: 5,
            });

            mockPrismaService.card.create.mockResolvedValue({
                id: 'card-1',
                title: dto.title,
                description: dto.description,
                listId,
                position: 6,
                labels: [],
                members: [],
            });

            const result = await service.create(userId, dto);

            expect(result.position).toBe(6);
            expect(mockPrismaService.card.create).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.objectContaining({
                        title: dto.title,
                        position: 6,
                    }),
                })
            );
            expect(mockActivitiesService.logActivity).toHaveBeenCalled();
        });

        it('should create first card with position 1', async () => {
            const userId = 'user-1';
            const dto = { title: 'First Card', listId: 'list-1' };

            mockPrismaService.list.findUnique.mockResolvedValue({
                id: 'list-1',
                boardId: 'board-1',
                title: 'List',
                board: { members: [{ userId }], createdById: userId },
            });

            mockPrismaService.card.findFirst.mockResolvedValue(null);

            mockPrismaService.card.create.mockResolvedValue({
                id: 'card-1',
                title: dto.title,
                listId: dto.listId,
                position: 1,
                labels: [],
                members: [],
            });

            const result = await service.create(userId, dto);

            expect(result.position).toBe(1);
        });

        it('should throw ForbiddenException if user is not a board member', async () => {
            const userId = 'user-1';
            const dto = { title: 'Card', listId: 'list-1' };

            mockPrismaService.list.findUnique.mockResolvedValue({
                id: 'list-1',
                board: { members: [], createdById: 'other-user' },
            });

            await expect(service.create(userId, dto)).rejects.toThrow(
                ForbiddenException
            );
        });
    });

    describe('move', () => {
        it('should move card to different list', async () => {
            const userId = 'user-1';
            const dto = { cardId: 'card-1', listId: 'list-2', newPosition: 3 };

            mockPrismaService.card.findUnique.mockResolvedValue({
                id: 'card-1',
                title: 'Card',
                listId: 'list-1',
                list: { id: 'list-1', title: 'Source List' },
            });

            mockPrismaService.list.findUnique
                .mockResolvedValueOnce({
                    id: 'list-1',
                    boardId: 'board-1',
                    title: 'Source List',
                    board: { members: [{ userId }], createdById: userId },
                })
                .mockResolvedValueOnce({
                    id: 'list-2',
                    boardId: 'board-1',
                    title: 'Target List',
                    board: { members: [{ userId }], createdById: userId },
                });

            mockPrismaService.card.findFirst.mockResolvedValue({
                position: 5,
            });

            mockPrismaService.card.update.mockResolvedValue({
                id: 'card-1',
                title: 'Card',
                listId: 'list-2',
                position: 6,
                labels: [],
                members: [],
            });

            const result = await service.move(userId, dto);

            expect(result.listId).toBe('list-2');
            expect(mockActivitiesService.logActivity).toHaveBeenCalledWith(
                'board-1',
                userId,
                ActivityType.MOVE_CARD,
                'card-1',
                expect.any(String)
            );
        });
    });

    describe('update', () => {
        it('should update card title and description', async () => {
            const userId = 'user-1';
            const cardId = 'card-1';
            const dto = { title: 'Updated Title', description: 'Updated Desc' };

            mockPrismaService.card.findUnique.mockResolvedValue({
                id: cardId,
                title: 'Old Title',
                description: 'Old Desc',
                list: {
                    boardId: 'board-1',
                    board: { members: [{ userId }], createdById: userId },
                },
            });

            mockPrismaService.card.update.mockResolvedValue({
                id: cardId,
                ...dto,
                labels: [],
                members: [],
            });

            const result = await service.update(userId, cardId, dto);

            expect(result.title).toBe(dto.title);
            expect(result.description).toBe(dto.description);
        });

        it('should log activity when description is updated', async () => {
            const userId = 'user-1';
            const cardId = 'card-1';
            const dto = { description: 'New Description' };

            mockPrismaService.card.findUnique.mockResolvedValue({
                id: cardId,
                title: 'Card',
                description: 'Old Description',
                list: {
                    boardId: 'board-1',
                    board: { members: [{ userId }], createdById: userId },
                },
            });

            mockPrismaService.card.update.mockResolvedValue({
                id: cardId,
                title: 'Card',
                description: dto.description,
                labels: [],
                members: [],
            });

            await service.update(userId, cardId, dto);

            expect(mockActivitiesService.logActivity).toHaveBeenCalledWith(
                'board-1',
                userId,
                ActivityType.UPDATE_DESCRIPTION,
                cardId,
                expect.any(String)
            );
        });
    });

    describe('archive', () => {
        it('should archive a card', async () => {
            const userId = 'user-1';
            const cardId = 'card-1';

            mockPrismaService.card.findUnique.mockResolvedValue({
                id: cardId,
                title: 'Card to Archive',
                list: {
                    boardId: 'board-1',
                    board: { members: [{ userId }], createdById: userId },
                },
            });

            mockPrismaService.card.update.mockResolvedValue({
                id: cardId,
                title: 'Card to Archive',
                isArchived: true,
                labels: [],
                members: [],
            });

            const result = await service.archive(userId, cardId);

            expect(result.isArchived).toBe(true);
            expect(mockActivitiesService.logActivity).toHaveBeenCalledWith(
                'board-1',
                userId,
                ActivityType.DELETE_CARD,
                cardId,
                expect.any(String)
            );
        });
    });

    describe('duplicate', () => {
        it('should duplicate a card with labels', async () => {
            const userId = 'user-1';
            const cardId = 'card-1';

            mockPrismaService.card.findUnique
                .mockResolvedValueOnce({
                    id: cardId,
                    title: 'Original Card',
                    description: 'Original Description',
                    listId: 'list-1',
                    list: {
                        boardId: 'board-1',
                        board: { members: [{ userId }], createdById: userId },
                    },
                    labels: [{ labelId: 'label-1', label: { id: 'label-1' } }],
                })
                .mockResolvedValueOnce({
                    id: 'card-2',
                    title: 'Original Card',
                    description: 'Original Description',
                    listId: 'list-1',
                    position: 2,
                    labels: [{ label: { id: 'label-1' } }],
                    members: [],
                });

            mockPrismaService.card.findFirst.mockResolvedValue({
                position: 1,
            });

            mockPrismaService.card.create.mockResolvedValue({
                id: 'card-2',
                title: 'Original Card',
                description: 'Original Description',
                listId: 'list-1',
                position: 2,
            });

            const result = await service.duplicate(userId, cardId);

            expect(result.id).toBe('card-2');
            expect(result.title).toBe('Original Card');
            expect(mockPrismaService.cardLabel.createMany).toHaveBeenCalled();
            expect(mockActivitiesService.logActivity).toHaveBeenCalled();
        });
    });
});

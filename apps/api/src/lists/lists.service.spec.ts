import { Test, TestingModule } from '@nestjs/testing';
import { ListsService } from './lists.service';
import { PrismaService } from '../prisma.service';
import { ForbiddenException } from '@nestjs/common';

describe('ListsService', () => {
    let service: ListsService;
    let prismaService: PrismaService;

    const mockPrismaService = {
        boardMember: {
            findFirst: jest.fn(),
        },
        list: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ListsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<ListsService>(ListsService);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create first list with position 1', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const title = 'First List';

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            mockPrismaService.list.findMany.mockResolvedValue([]);

            mockPrismaService.list.create.mockResolvedValue({
                id: 'list-1',
                title,
                boardId,
                position: 1,
            });

            const result = await service.create(userId, boardId, title);

            expect(result.position).toBe(1);
            expect(mockPrismaService.list.create).toHaveBeenCalledWith({
                data: { boardId, title, position: 1 },
            });
        });

        it('should append list at the end when no afterId', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const title = 'New List';

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            mockPrismaService.list.findMany.mockResolvedValue([
                { id: 'list-1', position: 1 },
                { id: 'list-2', position: 2 },
            ]);

            mockPrismaService.list.create.mockResolvedValue({
                id: 'list-3',
                title,
                boardId,
                position: 3,
            });

            const result = await service.create(userId, boardId, title);

            expect(result.position).toBe(3);
        });

        it('should insert list between two lists when afterId is provided', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const title = 'Middle List';
            const afterId = 'list-1';

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            mockPrismaService.list.findMany.mockResolvedValue([
                { id: 'list-1', position: 1 },
                { id: 'list-2', position: 3 },
            ]);

            mockPrismaService.list.create.mockResolvedValue({
                id: 'list-3',
                title,
                boardId,
                position: 2,
            });

            const result = await service.create(userId, boardId, title, afterId);

            expect(result.position).toBe(2);
            expect(mockPrismaService.list.create).toHaveBeenCalledWith({
                data: { boardId, title, position: 2 },
            });
        });

        it('should throw ForbiddenException if user is not a board member', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const title = 'List';

            mockPrismaService.boardMember.findFirst.mockResolvedValue(null);

            await expect(service.create(userId, boardId, title)).rejects.toThrow(
                ForbiddenException
            );
        });
    });

    describe('list', () => {
        it('should return all non-archived lists ordered by position', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            const mockLists = [
                { id: 'list-1', title: 'Todo', position: 1, isArchived: false },
                { id: 'list-2', title: 'Doing', position: 2, isArchived: false },
            ];

            mockPrismaService.list.findMany.mockResolvedValue(mockLists);

            const result = await service.list(boardId, userId);

            expect(result).toEqual(mockLists);
            expect(mockPrismaService.list.findMany).toHaveBeenCalledWith({
                where: { boardId, isArchived: false },
                orderBy: { position: 'asc' },
            });
        });
    });

    describe('update', () => {
        it('should update list title', async () => {
            const userId = 'user-1';
            const listId = 'list-1';
            const newTitle = 'Updated Title';

            mockPrismaService.list.findUnique.mockResolvedValue({
                id: listId,
                boardId: 'board-1',
                title: 'Old Title',
            });

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId: 'board-1',
                userId,
            });

            mockPrismaService.list.update.mockResolvedValue({
                id: listId,
                title: newTitle,
            });

            const result = await service.update(userId, listId, newTitle);

            expect(result.title).toBe(newTitle);
            expect(mockPrismaService.list.update).toHaveBeenCalledWith({
                where: { id: listId },
                data: { title: newTitle },
            });
        });
    });

    describe('delete', () => {
        it('should archive list instead of deleting', async () => {
            const userId = 'user-1';
            const listId = 'list-1';

            mockPrismaService.list.findUnique.mockResolvedValue({
                id: listId,
                boardId: 'board-1',
            });

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId: 'board-1',
                userId,
            });

            mockPrismaService.list.update.mockResolvedValue({
                id: listId,
                isArchived: true,
            });

            const result = await service.delete(userId, listId);

            expect(result.isArchived).toBe(true);
            expect(mockPrismaService.list.update).toHaveBeenCalledWith({
                where: { id: listId },
                data: { isArchived: true },
            });
        });
    });

    describe('move', () => {
        it('should update list position', async () => {
            const userId = 'user-1';
            const listId = 'list-1';
            const boardId = 'board-1';
            const newPosition = 2.5;

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            mockPrismaService.list.update.mockResolvedValue({
                id: listId,
                position: newPosition,
            });

            const result = await service.move(userId, listId, boardId, newPosition);

            expect(result.position).toBe(newPosition);
            expect(mockPrismaService.list.update).toHaveBeenCalledWith({
                where: { id: listId },
                data: { position: newPosition },
            });
        });
    });
});

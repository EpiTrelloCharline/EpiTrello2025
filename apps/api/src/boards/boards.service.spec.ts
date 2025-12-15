import { Test, TestingModule } from '@nestjs/testing';
import { BoardsService } from './boards.service';
import { PrismaService } from '../prisma.service';
import {
    ForbiddenException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';

describe('BoardsService', () => {
    let service: BoardsService;

    const mockPrismaService = {
        workspaceMember: {
            findFirst: jest.fn(),
        },
        board: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
        },
        boardMember: {
            findFirst: jest.fn(),
            findMany: jest.fn(),
            create: jest.fn(),
        },
        label: {
            createMany: jest.fn(),
        },
        user: {
            findUnique: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BoardsService,
                { provide: PrismaService, useValue: mockPrismaService },
            ],
        }).compile();

        service = module.get<BoardsService>(BoardsService);
        // prismaService declared for potential future use
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const _prismaService = module.get<PrismaService>(PrismaService);

        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('create', () => {
        it('should create a board and add creator as OWNER', async () => {
            const userId = 'user-1';
            const dto = { title: 'New Board', workspaceId: 'workspace-1' };

            mockPrismaService.workspaceMember.findFirst.mockResolvedValue({
                workspaceId: dto.workspaceId,
                userId,
            });

            mockPrismaService.board.create.mockResolvedValue({
                id: 'board-1',
                title: dto.title,
                workspaceId: dto.workspaceId,
                createdById: userId,
            });

            mockPrismaService.boardMember.create.mockResolvedValue({
                boardId: 'board-1',
                userId,
                role: 'OWNER',
            });

            const result = await service.create(userId, dto);

            expect(result.id).toBe('board-1');
            expect(mockPrismaService.boardMember.create).toHaveBeenCalledWith({
                data: { boardId: 'board-1', userId, role: 'OWNER' },
            });
            expect(mockPrismaService.label.createMany).toHaveBeenCalled();
        });

        it('should create default labels for new board', async () => {
            const userId = 'user-1';
            const dto = { title: 'New Board', workspaceId: 'workspace-1' };

            mockPrismaService.workspaceMember.findFirst.mockResolvedValue({
                workspaceId: dto.workspaceId,
                userId,
            });

            mockPrismaService.board.create.mockResolvedValue({
                id: 'board-1',
                title: dto.title,
                workspaceId: dto.workspaceId,
            });

            mockPrismaService.boardMember.create.mockResolvedValue({});

            await service.create(userId, dto);

            expect(mockPrismaService.label.createMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    data: expect.arrayContaining([
                        expect.objectContaining({
                            boardId: 'board-1',
                            name: expect.any(String),
                            color: expect.any(String),
                        }),
                    ]),
                })
            );
        });

        it('should throw ForbiddenException if user is not workspace member', async () => {
            const userId = 'user-1';
            const dto = { title: 'Board', workspaceId: 'workspace-1' };

            mockPrismaService.workspaceMember.findFirst.mockResolvedValue(null);

            await expect(service.create(userId, dto)).rejects.toThrow(
                ForbiddenException
            );
        });
    });

    describe('listInWorkspace', () => {
        it('should return all non-archived boards in workspace', async () => {
            const userId = 'user-1';
            const workspaceId = 'workspace-1';

            mockPrismaService.workspaceMember.findFirst.mockResolvedValue({
                workspaceId,
                userId,
            });

            const mockBoards = [
                { id: 'board-1', title: 'Board 1', isArchived: false },
                { id: 'board-2', title: 'Board 2', isArchived: false },
            ];

            mockPrismaService.board.findMany.mockResolvedValue(mockBoards);

            const result = await service.listInWorkspace(userId, workspaceId);

            expect(result).toEqual(mockBoards);
            expect(mockPrismaService.board.findMany).toHaveBeenCalledWith({
                where: { workspaceId, isArchived: false },
            });
        });
    });

    describe('getOne', () => {
        it('should return board with members and labels', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            const mockBoard = {
                id: boardId,
                title: 'My Board',
                members: [{ userId, role: 'OWNER', user: { id: userId } }],
                labels: [{ id: 'label-1', name: 'urgent', color: '#ff0000' }],
            };

            mockPrismaService.board.findUnique.mockResolvedValue(mockBoard);

            const result = await service.getOne(userId, boardId);

            expect(result).toEqual(mockBoard);
            expect(mockPrismaService.board.findUnique).toHaveBeenCalledWith({
                where: { id: boardId },
                include: {
                    members: { include: { user: true } },
                    labels: true,
                },
            });
        });

        it('should throw ForbiddenException if user is not board member', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';

            mockPrismaService.boardMember.findFirst.mockResolvedValue(null);

            await expect(service.getOne(userId, boardId)).rejects.toThrow(
                ForbiddenException
            );
        });
    });

    describe('getMembers', () => {
        it('should return formatted list of board members', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId,
            });

            const mockMembers = [
                {
                    id: 'member-1',
                    role: 'OWNER',
                    user: { id: 'user-1', name: 'Alice', email: 'alice@test.com' },
                },
                {
                    id: 'member-2',
                    role: 'MEMBER',
                    user: { id: 'user-2', name: 'Bob', email: 'bob@test.com' },
                },
            ];

            mockPrismaService.boardMember.findMany.mockResolvedValue(mockMembers);

            const result = await service.getMembers(userId, boardId);

            expect(result).toHaveLength(2);
            expect(result[0]).toMatchObject({
                id: 'member-1',
                userId: 'user-1',
                name: 'Alice',
                email: 'alice@test.com',
                role: 'OWNER',
            });
        });
    });

    describe('inviteMember', () => {
        it('should invite user to board', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const dto = { email: 'newuser@test.com', role: 'MEMBER' as const };

            mockPrismaService.board.findUnique.mockResolvedValue({
                id: boardId,
                workspaceId: 'workspace-1',
            });

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-2',
                email: dto.email,
                name: 'New User',
            });

            mockPrismaService.boardMember.findFirst.mockResolvedValue(null);

            mockPrismaService.workspaceMember.findFirst.mockResolvedValue({
                workspaceId: 'workspace-1',
                userId: 'user-2',
            });

            mockPrismaService.boardMember.create.mockResolvedValue({
                id: 'member-2',
                boardId,
                userId: 'user-2',
                role: dto.role,
                user: { id: 'user-2', email: dto.email, name: 'New User' },
            });

            const result = await service.inviteMember(userId, boardId, dto);

            expect(result).toMatchObject({
                userId: 'user-2',
                email: dto.email,
                role: dto.role,
            });
        });

        it('should throw NotFoundException if user email not found', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const dto = { email: 'notfound@test.com', role: 'MEMBER' as const };

            mockPrismaService.board.findUnique.mockResolvedValue({
                id: boardId,
                workspaceId: 'workspace-1',
            });

            mockPrismaService.user.findUnique.mockResolvedValue(null);

            await expect(
                service.inviteMember(userId, boardId, dto)
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw BadRequestException if user already member', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const dto = { email: 'existing@test.com', role: 'MEMBER' as const };

            mockPrismaService.board.findUnique.mockResolvedValue({
                id: boardId,
                workspaceId: 'workspace-1',
            });

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-2',
                email: dto.email,
            });

            mockPrismaService.boardMember.findFirst.mockResolvedValue({
                boardId,
                userId: 'user-2',
            });

            await expect(
                service.inviteMember(userId, boardId, dto)
            ).rejects.toThrow(BadRequestException);
        });

        it('should throw BadRequestException if user not workspace member', async () => {
            const userId = 'user-1';
            const boardId = 'board-1';
            const dto = { email: 'external@test.com', role: 'MEMBER' as const };

            mockPrismaService.board.findUnique.mockResolvedValue({
                id: boardId,
                workspaceId: 'workspace-1',
            });

            mockPrismaService.user.findUnique.mockResolvedValue({
                id: 'user-2',
                email: dto.email,
            });

            mockPrismaService.boardMember.findFirst.mockResolvedValue(null);
            mockPrismaService.workspaceMember.findFirst.mockResolvedValue(null);

            await expect(
                service.inviteMember(userId, boardId, dto)
            ).rejects.toThrow(BadRequestException);
        });
    });
});

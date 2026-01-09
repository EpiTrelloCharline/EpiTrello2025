
import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { PrismaService } from '../prisma.service';

describe('SearchService', () => {
    let service: SearchService;
    let prisma: PrismaService;

    const mockPrismaService = {
        card: {
            findMany: jest.fn(),
        },
        comment: {
            findMany: jest.fn(),
        },
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SearchService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
            ],
        }).compile();

        service = module.get<SearchService>(SearchService);
        prisma = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('search', () => {
        it('should return empty results if query is empty', async () => {
            const result = await service.search('user-1', '');
            expect(result).toEqual({ cards: [], comments: [] });
        });

        it('should call prisma.card.findMany with correct global filters', async () => {
            mockPrismaService.card.findMany.mockResolvedValue([]);
            mockPrismaService.comment.findMany.mockResolvedValue([]);

            await service.search('user-1', 'test');

            expect(prisma.card.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        OR: [
                            { title: { contains: 'test', mode: 'insensitive' } },
                            { description: { contains: 'test', mode: 'insensitive' } },
                        ],
                        list: expect.objectContaining({
                            board: expect.objectContaining({
                                OR: [
                                    { members: { some: { userId: 'user-1' } } },
                                    { workspace: { members: { some: { userId: 'user-1' } } } },
                                ],
                            }),
                        }),
                    }),
                })
            );
        });

        it('should apply boardId filter when provided', async () => {
            await service.search('user-1', 'test', 'board-1');

            expect(prisma.card.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        list: expect.objectContaining({
                            board: expect.objectContaining({
                                id: 'board-1',
                            }),
                        }),
                    }),
                })
            );
        });

        it('should apply workspaceId filter when provided', async () => {
            await service.search('user-1', 'test', undefined, 'workspace-1');

            expect(prisma.card.findMany).toHaveBeenCalledWith(
                expect.objectContaining({
                    where: expect.objectContaining({
                        list: expect.objectContaining({
                            board: expect.objectContaining({
                                workspaceId: 'workspace-1',
                            }),
                        }),
                    }),
                })
            );
        });
    });
});

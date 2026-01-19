
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

export interface SearchQueryDto {
    q: string;
    boardId?: string;
    workspaceId?: string;
}

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async search(userId: string, queryDto: SearchQueryDto) {
        const { q: query, boardId, workspaceId } = queryDto;

        if (!query || query.trim().length === 0) {
            return { cards: [], comments: [], boards: [] };
        }

        const searchTerm = query.trim();

        // Access filter: User must be a member of the board, a member of the workspace, or the creator of the board.
        const boardAccessFilter = {
            OR: [
                { members: { some: { userId } } },
                { workspace: { members: { some: { userId } } } }
            ]
        };

        // 1. Search Cards
        const cards = await this.prisma.card.findMany({
            where: {
                OR: [
                    { title: { contains: searchTerm, mode: 'insensitive' as const } },
                    { description: { contains: searchTerm, mode: 'insensitive' as const } },
                ],
                isArchived: false,
                list: {
                    board: {
                        ...(boardId ? { id: boardId } : {}),
                        ...(workspaceId ? { workspaceId: workspaceId } : {}),
                        ...boardAccessFilter
                    }
                }
            },
            include: {
                list: {
                    include: {
                        board: {
                            select: {
                                id: true,
                                title: true,
                                workspaceId: true,
                                workspace: {
                                    select: {
                                        id: true,
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                labels: {
                    include: {
                        label: true
                    }
                }
            },
            orderBy: {
                updatedAt: 'desc'
            }
        });

        // 2. Search Comments
        const comments = await this.prisma.comment.findMany({
            where: {
                content: { contains: searchTerm, mode: 'insensitive' as const },
                card: {
                    isArchived: false,
                    list: {
                        board: {
                            ...(boardId ? { id: boardId } : {}),
                            ...(workspaceId ? { workspaceId: workspaceId } : {}),
                            ...boardAccessFilter
                        }
                    }
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        avatar: true
                    }
                },
                card: {
                    include: {
                        list: {
                            include: {
                                board: {
                                    select: {
                                        id: true,
                                        title: true,
                                        workspaceId: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        // 3. Search Boards (only if not filtering by boardId already)
        let boards: any[] = [];
        if (!boardId) {
            boards = await this.prisma.board.findMany({
                where: {
                    title: { contains: searchTerm, mode: 'insensitive' as const },
                    isArchived: false,
                    ...boardAccessFilter
                },
                select: {
                    id: true,
                    title: true,
                    backgroundColor: true,
                    backgroundImage: true,
                    workspace: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                orderBy: {
                    updatedAt: 'desc'
                }
            });
        }

        return {
            cards,
            comments,
            boards,
        };
    }
}

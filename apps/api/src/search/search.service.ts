
import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class SearchService {
    constructor(private prisma: PrismaService) { }

    async search(userId: string, boardId: string, query: string) {
        // 1. Check access
        const board = await this.prisma.board.findUnique({
            where: { id: boardId },
            include: { members: true },
        });

        if (!board) throw new NotFoundException('Board not found');

        const isMember = board.members.some(m => m.userId === userId);
        if (!isMember && board.createdById !== userId) {
            throw new ForbiddenException('Not a board member');
        }

        if (!query || query.trim().length === 0) {
            return { cards: [], comments: [] };
        }

        // 2. Search Cards
        const cards = await this.prisma.card.findMany({
            where: {
                list: {
                    boardId: boardId,
                },
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { description: { contains: query, mode: 'insensitive' } },
                ],
                isArchived: false,
            },
            include: {
                list: true,
            }
        });

        // 3. Search Comments
        const comments = await this.prisma.comment.findMany({
            where: {
                card: {
                    list: {
                        boardId: boardId,
                    }
                },
                content: { contains: query, mode: 'insensitive' },
            },
            include: {
                card: {
                    include: { list: true }
                },
                user: true,
            }
        });

        return {
            cards,
            comments,
        };
    }
}

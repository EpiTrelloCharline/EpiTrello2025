import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BoardPermissionsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Retrieve the role of a user on a specific board
     * @returns The user's role or null if they are not a member
     */
    async getUserBoardRole(userId: string, boardId: string): Promise<BoardRole | null> {
        const member = await this.prisma.boardMember.findFirst({
            where: { boardId, userId },
        });

        return member?.role || null;
    }

    /**
     * Checks if a role has read access
     * All roles (OWNER, ADMIN, MEMBER, OBSERVER) have read access
     */
    hasReadAccess(role: BoardRole): boolean {
        return ['OWNER', 'ADMIN', 'MEMBER', 'OBSERVER'].includes(role);
    }

    /**
     * Checks if a role has write access
     * Only OWNER, ADMIN, and MEMBER have write access
     * OBSERVER is blocked
     */
    hasWriteAccess(role: BoardRole): boolean {
        return ['OWNER', 'ADMIN', 'MEMBER'].includes(role);
    }

    /**
     * Retrieves the boardId from a listId
     */
    async getBoardIdFromList(listId: string): Promise<string> {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            select: { boardId: true },
        });

        if (!list) {
            throw new NotFoundException('Liste non trouvée');
        }

        return list.boardId;
    }

    /**
     * Retrieves the boardId from a cardId
     */
    async getBoardIdFromCard(cardId: string): Promise<string> {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: { list: { select: { boardId: true } } },
        });

        if (!card) {
            throw new NotFoundException('Carte non trouvée');
        }

        return card.list.boardId;
    }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { BoardRole } from '@prisma/client';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BoardPermissionsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Récupère le rôle d'un utilisateur sur un board
     * @returns Le rôle de l'utilisateur ou null s'il n'est pas membre
     */
    async getUserBoardRole(userId: string, boardId: string): Promise<BoardRole | null> {
        const member = await this.prisma.boardMember.findFirst({
            where: { boardId, userId },
        });

        return member?.role || null;
    }

    /**
     * Vérifie si un rôle a accès en lecture
     * Tous les rôles (OWNER, ADMIN, MEMBER, OBSERVER) ont accès en lecture
     */
    hasReadAccess(role: BoardRole): boolean {
        return ['OWNER', 'ADMIN', 'MEMBER', 'OBSERVER'].includes(role);
    }

    /**
     * Vérifie si un rôle a accès en écriture
     * Seuls OWNER, ADMIN et MEMBER ont accès en écriture
     * OBSERVER est bloqué
     */
    hasWriteAccess(role: BoardRole): boolean {
        return ['OWNER', 'ADMIN', 'MEMBER'].includes(role);
    }

    /**
     * Récupère le boardId depuis un listId
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
     * Récupère le boardId depuis un cardId
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

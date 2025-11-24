import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }

    private async assertBoardMember(userId: string, listId: string) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            include: { board: { include: { members: true } } },
        });

        if (!list) throw new ForbiddenException('List not found');

        const isMember = list.board.members.some((m) => m.userId === userId);
        if (!isMember && list.board.createdById !== userId) {
            throw new ForbiddenException('Not a board member');
        }
        return list;
    }

    async list(userId: string, listId: string) {
        await this.assertBoardMember(userId, listId);

        return this.prisma.card.findMany({
            where: { listId },
            orderBy: { position: 'asc' },
        });
    }

    async create(userId: string, dto: CreateCardDto) {
        await this.assertBoardMember(userId, dto.listId);

        const lastCard = await this.prisma.card.findFirst({
            where: { listId: dto.listId },
            orderBy: { position: 'desc' },
        });

        const position = lastCard ? Number(lastCard.position) + 1 : 1;

        return this.prisma.card.create({
            data: {
                title: dto.title,
                listId: dto.listId,
                position: position,
            },
        });
    }

    async move(userId: string, dto: MoveCardDto) {
        const card = await this.prisma.card.findUnique({ where: { id: dto.cardId } });
        if (!card) throw new ForbiddenException('Card not found');

        // Check permissions for source and target lists
        await this.assertBoardMember(userId, card.listId);
        if (dto.listId && dto.listId !== card.listId) {
            await this.assertBoardMember(userId, dto.listId);
        }

        const targetListId = dto.listId || card.listId;
        const isMovingToList = targetListId !== card.listId;

        let newPosition = dto.newPosition;

        if (isMovingToList) {
            // Strategy: Append to end of list
            const lastCard = await this.prisma.card.findFirst({
                where: { listId: targetListId },
                orderBy: { position: 'desc' },
            });
            newPosition = lastCard ? Number(lastCard.position) + 1 : 1;
        } else {
            // Strategy: Use provided position (calculated by frontend as (before + after) / 2)
            // If no position provided, keep same (or append if logic requires, but assuming frontend sends it)
            if (newPosition === undefined) {
                return card; // No change
            }
        }

        return this.prisma.card.update({
            where: { id: dto.cardId },
            data: {
                listId: targetListId,
                position: newPosition,
            },
        });
    }
}

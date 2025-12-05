import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { MoveCardDto } from './dto/move-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';


@Injectable()
export class CardsService {
    constructor(private prisma: PrismaService) { }

    private async assertBoardMember(userId: string, listId: string) {
        const list = await this.prisma.list.findUnique({
            where: { id: listId },
            include: { board: { include: { members: true } } },
        });

        if (!list) throw new NotFoundException('List not found');

        const isMember = list.board.members.some((m) => m.userId === userId);
        if (!isMember && list.board.createdById !== userId) {
            throw new ForbiddenException('Not a board member');
        }
        return list;
    }

    private async assertCardAccess(userId: string, cardId: string) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    include: {
                        board: {
                            include: { members: true },
                        },
                    },
                },
            },
        });

        if (!card) throw new NotFoundException('Card not found');

        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember && card.list.board.createdById !== userId) {
            throw new ForbiddenException('Not a board member');
        }

        return card;
    }

    async list(userId: string, listId: string) {
        await this.assertBoardMember(userId, listId);

        return this.prisma.card.findMany({
            where: {
                listId,
                isArchived: false,
            },
            orderBy: { position: 'asc' },
            include: {
                labels: true,
                members: true,
            },
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
                description: dto.description,
                listId: dto.listId,
                position: position,
            },
            include: {
                labels: true,
                members: true,
            },
        });
    }

    async move(userId: string, dto: MoveCardDto) {
        const card = await this.prisma.card.findUnique({ where: { id: dto.cardId } });
        if (!card) throw new NotFoundException('Card not found');

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
            include: {
                labels: true,
                members: true,
            },
        });
    }

    async update(userId: string, cardId: string, dto: UpdateCardDto) {
        const card = await this.assertCardAccess(userId, cardId);

        // If changing list, verify access to new list
        if (dto.listId && dto.listId !== card.listId) {
            await this.assertBoardMember(userId, dto.listId);
        }

        return this.prisma.card.update({
            where: { id: cardId },
            data: {
                title: dto.title,
                description: dto.description,
                listId: dto.listId,
                position: dto.position ? Number(dto.position) : undefined,
                isArchived: dto.isArchived,
            },
            include: {
                labels: true,
                members: true,
            },
        });
    }

    async archive(userId: string, cardId: string) {
        await this.assertCardAccess(userId, cardId);

        return this.prisma.card.update({
            where: { id: cardId },
            data: {
                isArchived: true,
            },
            include: {
                labels: true,
                members: true,
            },
        });
    }
}

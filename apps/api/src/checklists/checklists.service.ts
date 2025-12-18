import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CreateChecklistDto } from './dto/create-checklist.dto';
import { UpdateChecklistDto } from './dto/update-checklist.dto';
import { CreateChecklistItemDto } from './dto/create-checklist-item.dto';
import { UpdateChecklistItemDto } from './dto/update-checklist-item.dto';

@Injectable()
export class ChecklistsService {
    constructor(private prisma: PrismaService) { }

    /**
     * Verify user has access to the card
     */
    private async assertCardAccess(userId: string, cardId: string) {
        const card = await this.prisma.card.findUnique({
            where: { id: cardId },
            include: {
                list: {
                    include: {
                        board: {
                            include: {
                                members: true,
                            },
                        },
                    },
                },
            },
        });

        if (!card) {
            throw new NotFoundException('Card not found');
        }

        const isMember = card.list.board.members.some((m) => m.userId === userId);
        if (!isMember) {
            throw new ForbiddenException('You do not have access to this card');
        }

        return card;
    }

    /**
     * Verify user has access to the checklist
     */
    private async assertChecklistAccess(userId: string, checklistId: string) {
        const checklist = await this.prisma.checklist.findUnique({
            where: { id: checklistId },
            include: {
                card: {
                    include: {
                        list: {
                            include: {
                                board: {
                                    include: {
                                        members: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!checklist) {
            throw new NotFoundException('Checklist not found');
        }

        const isMember = checklist.card.list.board.members.some((m) => m.userId === userId);
        if (!isMember) {
            throw new ForbiddenException('You do not have access to this checklist');
        }

        return checklist;
    }

    /**
     * Verify user has access to the checklist item
     */
    private async assertChecklistItemAccess(userId: string, itemId: string) {
        const item = await this.prisma.checklistItem.findUnique({
            where: { id: itemId },
            include: {
                checklist: {
                    include: {
                        card: {
                            include: {
                                list: {
                                    include: {
                                        board: {
                                            include: {
                                                members: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!item) {
            throw new NotFoundException('Checklist item not found');
        }

        const isMember = item.checklist.card.list.board.members.some((m) => m.userId === userId);
        if (!isMember) {
            throw new ForbiddenException('You do not have access to this checklist item');
        }

        return item;
    }

    /**
     * Create a new checklist for a card
     */
    async createChecklist(userId: string, cardId: string, dto: CreateChecklistDto) {
        await this.assertCardAccess(userId, cardId);

        // Get the max position for checklists in this card
        const maxPosition = await this.prisma.checklist.aggregate({
            where: { cardId },
            _max: { position: true },
        });

        const position = maxPosition._max.position ? Number(maxPosition._max.position) + 1 : 0;

        return this.prisma.checklist.create({
            data: {
                cardId,
                title: dto.title,
                position,
            },
            include: {
                items: {
                    orderBy: { position: 'asc' },
                },
            },
        });
    }

    /**
     * Update a checklist
     */
    async updateChecklist(userId: string, checklistId: string, dto: UpdateChecklistDto) {
        await this.assertChecklistAccess(userId, checklistId);

        return this.prisma.checklist.update({
            where: { id: checklistId },
            data: dto,
            include: {
                items: {
                    orderBy: { position: 'asc' },
                },
            },
        });
    }

    /**
     * Delete a checklist
     */
    async deleteChecklist(userId: string, checklistId: string) {
        await this.assertChecklistAccess(userId, checklistId);

        return this.prisma.checklist.delete({
            where: { id: checklistId },
        });
    }

    /**
     * Create a new checklist item
     */
    async createChecklistItem(userId: string, checklistId: string, dto: CreateChecklistItemDto) {
        await this.assertChecklistAccess(userId, checklistId);

        // Get the max position for items in this checklist
        const maxPosition = await this.prisma.checklistItem.aggregate({
            where: { checklistId },
            _max: { position: true },
        });

        const position = maxPosition._max.position ? Number(maxPosition._max.position) + 1 : 0;

        return this.prisma.checklistItem.create({
            data: {
                checklistId,
                content: dto.content,
                position,
            },
        });
    }

    /**
     * Update a checklist item
     */
    async updateChecklistItem(userId: string, itemId: string, dto: UpdateChecklistItemDto) {
        await this.assertChecklistItemAccess(userId, itemId);

        return this.prisma.checklistItem.update({
            where: { id: itemId },
            data: dto,
        });
    }

    /**
     * Delete a checklist item
     */
    async deleteChecklistItem(userId: string, itemId: string) {
        await this.assertChecklistItemAccess(userId, itemId);

        return this.prisma.checklistItem.delete({
            where: { id: itemId },
        });
    }
}

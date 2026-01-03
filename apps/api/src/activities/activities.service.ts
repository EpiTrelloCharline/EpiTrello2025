import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityType } from '@prisma/client';
import { BoardsGateway } from '../boards/boards.gateway';

@Injectable()
export class ActivitiesService {
    constructor(
        private prisma: PrismaService,
        @Inject(forwardRef(() => BoardsGateway))
        private boardsGateway: BoardsGateway,
    ) { }

    async logActivity(
        boardId: string,
        userId: string,
        type: ActivityType,
        entityId: string,
        details?: string,
    ) {
        const activity = await this.prisma.activity.create({
            data: {
                boardId,
                userId,
                type,
                entityId,
                details,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        // Emit WebSocket event
        this.boardsGateway.emitActivityCreated(boardId, { activity });

        return activity;
    }

    async getBoardActivities(boardId: string) {
        return this.prisma.activity.findMany({
            where: { boardId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
    }
}

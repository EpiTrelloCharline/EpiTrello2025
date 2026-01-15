import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityType } from '@prisma/client';
import { WebSocketsGateway } from '../websockets/websockets.gateway';

@Injectable()
export class ActivitiesService {
    constructor(
        private prisma: PrismaService,
        private webSocketsGateway: WebSocketsGateway,
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
        this.webSocketsGateway.emitActivityCreated(boardId, { activity });

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

    async getCardActivities(cardId: string, limit: number = 20, offset: number = 0) {
        return this.prisma.activity.findMany({
            where: { entityId: cardId },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
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

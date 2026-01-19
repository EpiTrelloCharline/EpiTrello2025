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
                        avatar: true,
                    },
                },
            },
        });
    }

    async getCardActivityHistory(cardId: string, limit: number = 50, offset: number = 0) {
        // Fetch activities
        const activities = await this.prisma.activity.findMany({
            where: { entityId: cardId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        // Fetch comments
        const comments = await this.prisma.comment.findMany({
            where: { cardId },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatar: true,
                    },
                },
            },
        });

        // Combine and format
        const mixedHistory = [
            ...activities.map((a) => ({
                id: a.id,
                type: 'ACTIVITY' as const,
                activityType: a.type,
                details: a.details,
                user: a.user,
                createdAt: a.createdAt,
            })),
            ...comments.map((c) => ({
                id: c.id,
                type: 'COMMENT' as const,
                content: c.content,
                user: c.user,
                createdAt: c.createdAt,
            })),
        ];

        // Sort by createdAt descending
        return mixedHistory
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(offset, offset + limit);
    }
}

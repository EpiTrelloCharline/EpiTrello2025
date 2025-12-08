import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ActivityType } from '@prisma/client';

@Injectable()
export class ActivitiesService {
    constructor(private prisma: PrismaService) { }

    async logActivity(
        boardId: string,
        userId: string,
        type: ActivityType,
        entityId: string,
        details?: string,
    ) {
        return this.prisma.activity.create({
            data: {
                boardId,
                userId,
                type,
                entityId,
                details,
            },
        });
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
